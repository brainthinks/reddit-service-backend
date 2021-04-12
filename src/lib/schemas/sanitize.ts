import { ObjectID } from 'mongodb';

export default async function sanitize (
  service: any,
  record: any,
  options: any = {},
): Promise<any> {
  if (typeof record !== 'object' || record === null) {
    throw new Error('Record not an object');
  }

  const sanitizedRecord: any = {};
  const keys = Object.keys(service.schema.fields);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    let value = record[key];
    const field = service.schema.fields[key];

    if (options.skipFields && options.skipFields.includes(key)) {
      continue;
    }

    if (value === undefined && options.skipMissingFields) {
      continue;
    }

    if (value === undefined && Object.prototype.hasOwnProperty.call(field, 'default')) {
      value = field.default;
    }

    switch (field.type) {
      case 'string':
      case 'email':
      case 'timezone':
      case 'timeOfDay': {
        if (typeof value !== 'string') {
          throw new Error(`Sanitization failed - Field "${key}" with value "${value}" is not a string`);
        }
        break;
      }
      case 'boolean': {
        if (typeof value !== 'boolean') {
          throw new Error(`Sanitization failed - Field "${key}" with value "${value}" is not a boolean`);
        }
        break;
      }
      case 'timestamp': {
        if (Number.isNaN(value)) {
          throw new Error(`Sanitization failed - Field "${key}" with value "${value}" is not a valid timestamp`);
        }
        break;
      }
      case 'collection': {
        throw new Error('Not implemented');
        // if (!Array.isArray(value)) {
        //   throw new Error(`Sanitization failed - Field "${key}" with value "${value}" is not a collection`);
        // }
        break;
      }
      case 'fields': {
        if (typeof value !== 'object') {
          throw new Error(`Sanitization failed - Field "${key}" with value "${value}" is not an object`);
        }

        const mockService = {
          schema: {
            fields: field.fields,
          },
        };

        value = await sanitize(mockService, value);

        break;
      }
      case 'reference': {
        console.log('reference', key, value);
        if (typeof value !== 'string' && typeof value !== 'object') {
          throw new Error(`Sanitization failed - Field "${key}" with value "${value}" is not a valid Mongo ID`);
        }

        try {
          value = ObjectID.createFromHexString(value.toString());
        }
        catch (error) {
          throw new Error(`Sanitization failed - Field "${key}" with value "${value}" is not a valid Mongo ID`);
        }
        break;
      }
      default: {
        throw new Error(`Sanitization failed - Unsupported schema type: ${field.type}`);
      }
    }

    sanitizedRecord[key] = value;
  }

  return sanitizedRecord;
}
