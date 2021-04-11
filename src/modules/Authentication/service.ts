import { Logger } from '../../logger';

export default function getAuthenticationService (
  logger: Logger,
  db: any,
  userService: any,
) {
  return class AuthenticationService {
    static factory (): AuthenticationService {
      return new AuthenticationService();
    }

    private constructor () {
    }

    async login (user: any, options: any = {}) {
      try {
        const validUser = await userService.getOne(user, user._id);

        // @todo - do some passport stuff
      }
      catch (error) {
        logger.error([
          `Unable to login as user with id: ${user._id}`,
          error,
        ]);
      }
    }

    async logout (user: any, options: any = {}) {

    }
  };
}
