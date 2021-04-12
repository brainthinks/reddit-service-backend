import {
  SchemaField,
  SchemaFields,
} from '../../types';

export const RecordAuditFields: SchemaFields = {
  userId: {
    name: 'userId',
    title: 'User ID',
    description: 'user who took the action',
    type: 'reference',
    reference: 'User',
    required: true,
  },
  at: {
    name: 'at',
    title: 'At',
    description: 'time at which the action was taken',
    type: 'timestamp',
    required: true,
  },
  message: {
    name: 'message',
    title: 'Audit Message',
    description: 'plain text field with a message regarding the action',
    type: 'string',
    required: true,
  },
};

export const CreatedAtField: SchemaField = {
  name: 'createdAt',
  title: 'Created At',
  description: 'when the record was created and by whom',
  type: 'fields',
  fields: RecordAuditFields,
  required: true,
};

export const UpdatedAtField: SchemaField = {
  name: 'updatedAt',
  title: 'Updated At',
  description: 'when the record was last updated and by whom',
  type: 'fields',
  fields: RecordAuditFields,
  required: true,
};
