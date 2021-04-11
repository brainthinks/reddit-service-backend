import { Logger } from '../../logger';
import { Schema } from '../../schemas/types';
import schema from './schema';

export default function getUserService (logger: Logger, db: any) {
  return class UserService {
    schema: Schema;

    static factory (): UserService {
      return new UserService();
    }

    private constructor () {
      this.schema = schema;
    }

    async getOne (user: any, id: string, options: any = {}) {

    }

    async getMany (user: any, options: any = {}) {

    }

    async createOne (user: any, record: string, options: any = {}) {

    }

    async updateOne (user: any, updates: string, options: any = {}) {

    }

    async deleteOne (user: any, id: string, options: any = {}) {

    }

    async signUp (record: string, options: any = {}) {

    }
  };
}
