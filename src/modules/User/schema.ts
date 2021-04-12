import {
  Schema,
} from '../../types';
import {
  CreatedAtField,
  UpdatedAtField,
} from '../../lib/schemas/fields';

const schema: Schema = {
  name: 'user',
  title: 'User',
  pluralName: 'users',
  pluralTitle: 'Users',
  description: 'users of the system',
  collectionName: 'user',
  fields: {
    firstName: {
      name: 'firstName',
      title: 'First Name',
      description: 'first name of the user',
      type: 'string',
      required: true,
    },
    lastName: {
      name: 'lastName',
      title: 'Last Name',
      description: 'last name of the user',
      type: 'string',
      required: true,
    },
    username: {
      name: 'username',
      title: 'Username',
      description: 'username of the user',
      type: 'string',
      required: true,
      unique: true,
    },
    email: {
      name: 'email',
      title: 'Email',
      description: 'email address of the user',
      type: 'email',
      required: true,
      unique: true,
    },
    timezone: {
      name: 'timezone',
      title: 'Timezone',
      description: 'preferred timezone for scheduled communication',
      type: 'timezone',
      required: true,
    },
    createdAt: CreatedAtField,
    updatedAt: UpdatedAtField,
  },
};

export default schema;
