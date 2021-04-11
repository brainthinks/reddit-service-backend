export interface SchemaFieldItem {
  type: string,
}

export interface SchemaFieldRules {
  [key: string]: unknown,
}

export interface SchemaField {
  name: string,
  title: string,
  description: string,
  type: string,
  default?: unknown,
  unique?: boolean,
  required?: boolean,
  reference?: string,
  items?: SchemaFieldItem,
  rules?: SchemaFieldRules,
  fields?: SchemaFields,
}

export interface SchemaFields {
  [name: string]: SchemaField,
}

export interface Schema {
  name: string,
  title: string,
  pluralName: string,
  pluralTitle: string,
  description: string,
  collectionName: string,
  fields: SchemaFields,
}
