import validator from 'validator';
import moment from 'moment-timezone';

const timeOfDayRegExp = new RegExp(/^\d{2}:\d{2}:\d{2}$/);
const supportedTimezones = moment.tz.names();

export default async function validate (
  service: any,
  record: any,
  options: any = {},
): Promise<void> {
  if (typeof record !== 'object' || record === null) {
    throw new Error('Record not an object');
  }

  const keys = Object.keys(service.schema.fields);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = record[key];
    const field = service.schema.fields[key];

    if (options.skipFields && options.skipFields.includes(key)) {
      continue;
    }

    if (value === undefined && !field.required) {
      continue;
    }

    switch (field.type) {
      case 'string': {
        if (typeof value !== 'string') {
          throw new Error(`Field "${key}" with value "${value}" is not a string`);
        }
        break;
      }
      case 'boolean': {
        if (typeof value !== 'boolean') {
          throw new Error(`Field "${key}" with value "${value}" is not a boolean`);
        }
        break;
      }
      case 'email': {
        if (!validator.isEmail(value)) {
          throw new Error(`Field "${key}" with value "${value}" is not a valid email address`);
        }
        break;
      }
      case 'timezone': {
        if (!supportedTimezones.includes(value)) {
          throw new Error(`Field "${key}" with value "${value}" is not a valid timezone`);
        }
        break;
      }
      case 'timeOfDay': {
        if (typeof value !== 'string') {
          throw new Error(`Field "${key}" with value "${value}" is not a string`);
        }

        const result = value.match(timeOfDayRegExp);

        if (result === null) {
          throw new Error(`Field "${key}" with value "${value}" is not a valid time of day`);
        }

        break;
      }
      case 'timestamp': {
        if (Number.isNaN(value)) {
          throw new Error(`Field "${key}" with value "${value}" is not a valid timestamp`);
        }
        break;
      }
      case 'collection': {
        throw new Error('Not implemented');
        // if (!Array.isArray(value)) {
        //   throw new Error(`Field "${key}" with value "${value}" is not a collection`);
        // }
        break;
      }
      case 'fields': {
        if (typeof value !== 'object') {
          throw new Error(`Field "${key}" with value "${value}" is not an object`);
        }

        const mockService = {
          schema: {
            fields: field.fields,
          },
        };

        await validate(mockService, value);

        break;
      }
      case 'reference': {
        break;
      }
      default: {
        throw new Error(`Unsupported schema type: ${field.type}`);
      }
    }

    if (field.unique) {
      const query = {
        [key]: value,
      };

      if (record._id) {
        query._id = {
          '$ne': record._id,
        };
      }

      const count = await service.collection.count(query);

      if (count > 0) {
        throw new Error(`Field "${key}" with value "${value}" must be unique.`);
      }
    }
  }
}
