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
const POLARITY_CONFIDENCE = 0.65;
      

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
  textapi.language({"text": tweet.text}, function(error, languageResponse) {
    console.log(languageResponse.lang);
    if (error === null && languageResponse.lang == LANGUAGE) {
      measureSentiment(tweet);
    } else {
      console.log("Logging: False, wrong language");
      console.log("*****");
    }
  });
}

function measureSentiment(tweet) {
  textapi.sentiment({"text": tweet.text}, function(error, response) {
    if (error === null && (response.polarity == 'negative' || (response.polarity == 'neutral' && response.polarity_confidence <= POLARITY_CONFIDENCE))) {
      console.log("Polarity confidence: " + Math.round(response.polarity_confidence*100)/100);
      logTweetToGoogle(tweet, response);
    } else {
      console.log("Logging: False, positive sentiment");
      console.log("*****");
    }
  });
}

function logTweetToGoogle(tweet, response) {
  gsheet.setAuth(GOOGLE_EMAIL, GOOGLE_PASSWORD, function(err){
    if (err) {
      console.log(err);
      return;
    }
    gsheet.addRow(1, { text: tweet.text, url: "https://twitter.com/" + tweet.user.screen_name + '/status/' + tweet.id_str, polarity: response.polarity, confidence: Math.round(response.polarity_confidence*100)/100}, function(err) {console.log(err);} );
    console.log("Logging: True");
    console.log("*****");
  });
}

client.stream('statuses/filter', {track: CSV_KEYWORDS}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
    console.log("https://twitter.com/" + tweet.user.screen_name + '/status/' + tweet.id_str);

    checkLanguage(tweet);
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});

