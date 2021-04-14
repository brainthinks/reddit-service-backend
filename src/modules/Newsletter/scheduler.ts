import cron from 'node-cron';
import axios from 'axios';

import {
  Logger,
  Config,
} from '../../interfaces';
import UserService from '../User/service';

const REDDIT_URL = 'https://reddit.com';

export default class Scheduler {
  logger: Logger;
  config: Config;
  // @todo - resolve circular dependency
  newsletterService: any;
  userService: UserService;
  jobs: any = {};

  constructor (
    logger: Logger,
    config: Config,
    // @todo - resolve circular dependency
    newsletterService: any,
    userService: UserService,
  ) {
    this.logger = logger;
    this.config = config;
    this.newsletterService = newsletterService;
    this.userService = userService;
  }

  async initialize (newsletters: any[]): Promise<any> {
    await Promise.all(newsletters.map(async (newsletter) => this.scheduleJob(newsletter)));
  }

  destroyJob (id: string): void {
    if (this.jobs[id]) {
      this.logger.debug(`Destroying existing job for newsletter ${id}`);
      this.jobs[id].stop();
      // @todo - why doesn't this documented method exist?
      // this.jobs[id].destroy();
      delete this.jobs[id];
    }
  }

  async scheduleJob (newsletter: any): Promise<void> {
    const id = newsletter._id.toString();
    this.logger.debug(`Scheduling job for newsletter ${id}`);

    this.destroyJob(id);

    if (!newsletter.isEnabled) {
      this.logger.debug(`Newsletter ${id} is not enabled - skipping job scheduling`);
      return;
    }

    const user = await this.userService.lookupById(newsletter.userId);
    const [
      hour,
      minute,
    ] = newsletter.sendAt.split(':');

    // this.jobs[id] = cron.schedule('* * * * *', async () => {
    this.jobs[id] = cron.schedule(`${Number(minute)} ${Number(hour)} * * *`, async () => {
      try {
        const payload = await this.generateEmailContent(user, newsletter);
        await this.send(payload);
      }
      catch (error) {
        this.logger.error([
          error,
          `Unable to send email for newsletter ${id}!`,
        ]);
      }
    }, {
      timezone: user.timezone,
    });
  }

  async generateEmailContent (user: any, newsletter: any): Promise<void> {
    this.logger.debug(`Generating email content for newsletter ${newsletter._id}`);

    const results: any[] = await Promise.all(newsletter.subreddits.map(async (subreddit: string) => {
      const baseUrl = `${REDDIT_URL}/r/${subreddit}`;
      const url = `${baseUrl}/top.json`;
      let response;

      try {
        response = await axios.get(url);
      }
      catch (error) {
        this.logger.error(`Fetch failed for subreddit ${subreddit}`);
      }

      return {
        subreddit,
        url: baseUrl,
        posts: response?.data?.data?.children?.slice(0, 3) || [],
      };
    }));

    const payload: any = {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
      body: [],
    };

    for (let i = 0; i < results.length; i++) {
      const {
        subreddit,
        url,
        posts,
      } = results[i];

      const subredditBody: any = {
        subreddit,
        url: `${url}/top`,
        posts: [],
      };

      for (let j = 0; j < posts.length; j++) {
        const post = posts[j].data;

        subredditBody.posts.push({
          url_overridden_by_dest: post.url_overridden_by_dest,
          thumbnail: post.thumbnail,
          permalink: `${REDDIT_URL}${post.permalink}`,
          title: post.title,
          ups: post.ups,
        });
      }

      payload.body.push(subredditBody);
    }

    return payload;
  }

  async send (payload: any) {
    try {
      const result = await axios.post(this.config.redditEmailServiceUrl, payload);
    }
    catch (error) {
      this.logger.error([
        error,
        'Error sending payload to email service',
      ]);
    }
  }
}
