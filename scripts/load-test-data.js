#!/usr/bin/env node

const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

const BASE_URL = 'http://localhost:3000';

async function main () {
  axiosCookieJarSupport(axios);

  const cookieJar = new tough.CookieJar();

  console.log('Creating user...');
  const userResult = await axios.post(
    `${BASE_URL}/users/signUp`,
    {
      firstName: 'Brian',
      lastName: 'Andress',
      username: 'briana',
      email: 'test@example.com',
      timezone: 'America/New_York',
    },
    {
      jar: cookieJar,
      withCredentials: true,
    },
  );

  const userId = userResult.data._id;

  console.log('Logging in...');
  await axios.post(
    `${BASE_URL}/auth/login`,
    {
      username: 'briana',
    },
    {
      jar: cookieJar,
      withCredentials: true,
    },
  );

  console.log('Creating newsletter...');
  const newsletterResult = await axios.post(
    `${BASE_URL}/newsletters`,
    {
      title: 'test',
      userId,
      subreddits: [
        'funny',
        'worldnews',
        'technology',
        'totallyafakesubredditthatdefinitelydoesntexist',
      ],
      isEnabled: true,
    },
    {
      jar: cookieJar,
      withCredentials: true,
    },
  );

  const newsletterId = newsletterResult.data._id;

  console.log(`Test data loaded.  Update the 'sendAt' time on newsletter ${newsletterId} if needed`);
}

main().catch((error) => {
  console.error(error, 'Fatal error');
});
