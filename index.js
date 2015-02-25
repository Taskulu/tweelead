var Twitter = require('twitter');
var AYLIENTextAPI = require("aylien_textapi");
var GoogleSpreadsheet = require("google-spreadsheet");

const GOOGLE_EMAIL        = process.env.GOOGLE_EMAIL;
const GOOGLE_PASSWORD     = process.env.GOOGLE_PASSWORD;
const GOOGLE_SPREADSHEET  = process.env.GOOGLE_SPREADSHEET;
const AYLIEN_APP_ID       = process.env.AYLIEN_APP_ID;   
const AYLIEN_APP_KEY      = process.env.AYLIEN_APP_KEY;
const TW_CONSUMER_KEY     = process.env.TW_CONSUMER_KEY;
const TW_CONSUMER_SEC     = process.env.TW_CONSUMER_SEC;
const TW_ACCESS_TOKEN_KEY = process.env.TW_ACCESS_TOKEN_KEY;
const TW_ACCESS_TOKEN_SEC = process.env.TW_ACCESS_TOKEN_SEC;
const CSV_KEYWORDS        = process.env.CSV_KEYWORDS;
const LANGUAGE            = process.env.LANGUAGE;

// Confidence level is always between 0.5 and 1, therefore in the example below
// setting the positive confidence level to 0.49 instead of 0 does not make any
// difference in the results that are put in the spreadsheet.
const POLARITY_OPTIONS    = {
  // Do not show any positive tweets.
  positive: 0,
  // Show all the negative tweets.
  negative: 1,
  // Show neutral tweets with at most 65% confidence.
  neutral: 0.65
};
      

var gsheet = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET);

var textapi = new AYLIENTextAPI({
  application_id: AYLIEN_APP_ID,
  application_key: AYLIEN_APP_KEY
});

var client = new Twitter({
  consumer_key: TW_CONSUMER_KEY,
  consumer_secret: TW_CONSUMER_SEC,
  access_token_key: TW_ACCESS_TOKEN_KEY,
  access_token_secret: TW_ACCESS_TOKEN_SEC
});

function checkLanguage(tweet) {
  console.log(tweet.text);
  console.log("https://twitter.com/" + tweet.user.screen_name + '/status/' + tweet.id_str);

  textapi.language({"text": tweet.text}, function(error, languageResponse) {
    if (handleError(error)) return;

    if (languageResponse.lang == LANGUAGE) {
      measureSentiment(tweet);
    }
  });
}

function measureSentiment(tweet) {
  textapi.sentiment({"text": tweet.text}, function(error, response) {
    if (handleError) return;

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
  gsheet.setAuth(GOOGLE_EMAIL, GOOGLE_PASSWORD, function(err){
    if (handleError) return;

    gsheet.addRow(1, {
      text: tweet.text, url: "https://twitter.com/" + tweet.user.screen_name + '/status/' + tweet.id_str,
      polarity: response.polarity,
      confidence: Math.round(response.polarity_confidence*100)/100
    }, handleError);
  });
}

function handleError(err) {
  if (err) {
    console.log(err);
    return true;
  }
  return false;
}

client.stream('statuses/filter', {track: CSV_KEYWORDS}, function(stream) {
  stream.on('data', checkLanguage);
  stream.on('error', handleError);
});
