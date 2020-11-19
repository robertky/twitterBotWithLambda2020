# twitterbotforlambda
This is a twitter bot for Lambda.

This bot tweets out the Index performance for the SP500 and DJIA at the end of the day when the market is opened. It states the market is closed when the market is not opened on the day the bot tweets.

Please note that you will need to include your own config file and apikey file to have this twitter bot work. This has been excluded from the files for privacy purposes/security purposes.

config.js should be structured like this:

module.exports = {
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  ''
}

apikey.js will need to contain a valid APIkey.

Utilized Serverless, for more information on serverless see this video (https://www.youtube.com/watch?v=71cd5XerKss).
