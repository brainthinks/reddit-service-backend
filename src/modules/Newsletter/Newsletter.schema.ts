import {
  Schema,
} from '../../schemas/types';
import {
  CreatedAtField,
  UpdatedAtField,
} from '../../schemas/utils';

const NewsletterSchema: Schema = {
  name: 'newsletter',
  title: 'Newsletter',
  pluralName: 'newsletters',
  pluralTitle: 'Newsletters',
  description: 'newsletters that may be sent out at configured times',
  fields: {
    title: {
      name: 'title',
      title: 'Title',
      description: 'friendly title of the newsletter',
      type: 'string',
      required: true,
    },
    userId: {
      name: 'userId',
      title: 'User ID',
      description: 'user to whom this newsletter belongs',
      type: 'reference',
      reference: 'User',
      required: true,
    },
    subreddits: {
      name: 'subreddits',
      title: 'Subreddits',
      description: 'the user\'s favorite subreddits, which will be used to generate the newsletter',
      type: 'collection',
      items: {
        type: 'string',
      },
      rules: {
        max: 3,
        min: 0,
      },
      default: [],
    },
    isEnabled: {
      name: 'isEnabled',
      title: 'Is Enabled?',
      description: 'if enabled, the newsletter will be emailed to the user at the configured time',
      type: 'boolean',
      default: false,
    },
    sendAt: {
      name: 'sendAt',
      title: 'Send At',
      description: 'time of day to send the newsletter, based on the user\'s configured timezone',
      type: 'timeOfDay',
      default: '08:00',
    },
    createdAt: CreatedAtField,
    updatedAt: UpdatedAtField,
  },
};

export default NewsletterSchema;
