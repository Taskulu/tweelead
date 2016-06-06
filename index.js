var Twitter           = require('twitter'),
    AYLIENTextAPI     = require("aylien_textapi"),
    GoogleSpreadsheet = require("google-spreadsheet"),
    fs                = require('fs'),
    ini               = require('ini');

var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

// Confidence level is always between 0.5 and 1, therefore in the example below
// setting the positive confidence level to 0.49 instead of 0 does not make any
// difference in the results that are put in the spreadsheet.
const POLARITY_OPTIONS    = {
  // Do not show any positive tweets.
  positive: 1,
  // Show all the negative tweets.
  negative: 1,
  // Show neutral tweets with at most 65% confidence.
  neutral: 0.65
};

var gsheet = new GoogleSpreadsheet(config.GOOGLE_SPREADSHEET);

var gsheet_creds = require('./google-creds.json');

var textapi = new AYLIENTextAPI({
  application_id: config.AYLIEN_APP_ID,
  application_key: config.AYLIEN_APP_KEY
});

var client = new Twitter({
  consumer_key: config.TW_CONSUMER_KEY,
  consumer_secret: config.TW_CONSUMER_SEC,
  access_token_key: config.TW_ACCESS_TOKEN_KEY,
  access_token_secret: config.TW_ACCESS_TOKEN_SEC
});

function checkLanguage(tweet) {
  console.log(tweet.text);
  console.log("https://twitter.com/" + tweet.user.screen_name + '/status/' + tweet.id_str);

  textapi.language({"text": tweet.text}, function(error, languageResponse) {
    if (handleError(error)) return;
    if (languageResponse.lang == config.LANGUAGE) {
      measureSentiment(tweet);
    }
  });
}

function measureSentiment(tweet) {
  textapi.sentiment({"text": tweet.text}, function(error, response) {
    if (handleError(error)) return;
    for (polarity in POLARITY_OPTIONS) {
      if (POLARITY_OPTIONS[polarity] > 0.5) {
        if (response.polarity == polarity && response.polarity_confidence <= POLARITY_OPTIONS[polarity]) {
          console.log("Polarity confidence: " + Math.round(response.polarity_confidence*100)/100);
          logTweetToGoogle(tweet, response);
        }
      }
    }
  });
}

function logTweetToGoogle(tweet, response) {
  gsheet.useServiceAccountAuth(gsheet_creds, function(err){
    if (handleError(err)) return;
    gsheet.addRow(1, {
      text: tweet.text, url: "https://twitter.com/" + tweet.user.screen_name + '/status/' + tweet.id_str,
      polarity: response.polarity,
      confidence: Math.round(response.polarity_confidence*100)/100
    }, function (err) {
      handleError(err);
    });
  });
}

function handleError(err) {
  if (err) {
    console.log(err.stack);
    console.log(err);
    return true;
  }
  return false;
}

client.stream('statuses/filter', {track: config.CSV_KEYWORDS}, function(stream) {
  stream.on('data', checkLanguage);
  stream.on('error', handleError);
});
