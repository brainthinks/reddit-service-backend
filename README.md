# Reddit Service - Backend <!-- omit in toc -->

A service to manage users who want the top posts of their favorite subreddits sent to their inbox.

## Table of Contents <!-- omit in toc -->

- [Quick Start](#quick-start)
- [Development](#development)
- [Future Improvements](#future-improvements)

## Quick Start

1. `docker build -t reddit-service-backend:latest .`
1. `cp .env.example .env`
1. Configure `.env`
1. `docker-compose down && docker-compose up`

The server is now running.  The API is simple, consisting of basic auth routes and CRUD for users and newsletters, but I have not yet created the OpenAPI docs for it (noted below in [Future Improvements](#future-improvements)).  To prevent you from having to read the code to get started, I provided a script to load a small amount of test data.  In another terminal (where the PWD is still this project's root directory), run the following:

```bash
docker-compose exec reddit-service-backend ./scripts/load-test-data.js
```

You can now login and update the "sendAt" time on the test newsletter.  Grab the ID of the newsletter that was printed to the terminal to update it.

You will need to use a tool that will allow you to retain cookies across requests.  I personally use [insomnia](https://insomnia.rest/).

Log in:

`POST http://localhost/auth/login { "username": "briana" }`

Update scheduled newsletter email time (format is HH:MM, where hours are 0 - 23):

`PATCH http://localhost/newsletters/<id> { "sendAt": "09:00" }`

Note the `briana` user's timezone is US East, specifically `America/New_York`.  Feel free to change it.  The supported timezones (defined by `moment-timezone`) can be fetched:

`GET http://localhost/users/utils/supportedTimeZones`

`PATCH http://localhost/users/briana { "timezone": <timezone> }`

That's it!  Once you have the test data loaded and "sendAt" set to your desired time, you can sit back and watch the terminal for the json output from the stub email service.


## Development

1. `docker-compose build`
1. `cp docker-compose.dev.yml docker-compose.override.yml`
1. 1. `cp .env.example .env`
1. Configure `.env`
1. `docker-compose down && docker-compose up`
1. navigate to [https://localhost](http://localhost) for the application
1. navigate to [https://localhost:8081](http://localhost:8081) for mongo admin
1. navigate to [https://localhost:8082](http://localhost:8082) for redis admin

## Future Improvements

* The requirements indicate that we are to use reddit's "top" posts - we should discuss using "hot" instead, because the top posts don't change often...
* OpenAPI docs
* The newsletter model service could be split from the scheduling service
* When a user's timezone is updated, that change is not reflected in the currently scheduled newsletter jobs
* When a user is deleted, that user's newsletters are not deleted, and scheduled jobs still run
* Errors are not currently handled in a way that is safe or useful to the caller
* Fields of type "ref" and "collection" are not properly validated
* API tests
* Permissions / roles
* Authentication (API Gateway, OIDC, keycloak)
* SSL Termination (ability to serve over https)
* Improved Auditing.  Right now, only the last modification to a record is saved.
* Support for socket connections for real-time updates
* Improve schema validation with something like Validator or ForgJs
* Add types for record instances
* implement filter, sort, paginate, project, etc. (also consider graphql)
* Consolidate shared CRUD logic among the controllers and services
* Use the real Reddit API
* Implement subreddit name validation
