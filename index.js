var Twitter = require('twitter');
var AYLIENTextAPI = require("aylien_textapi");
var GoogleSpreadsheet = require("google-spreadsheet");

const GOOGLE_EMAIL        = 'youremail@gmail.com';
const GOOGLE_PASSWORD     = 'YOUR-PASSWORD123!#';
const AYLIEN_APP_ID       = 'YOUR-AYLIEN-APPLICATION-ID';
const AYLIEN_APP_KEY      = 'YOUR-AYLIEN-APPLICATION-KEY';
const TW_CONSUMER_KEY     = 'TWITTER-CONSUMER-KEY';
const TW_CONSUMER_SEC     = 'TWITTER-CONSUMER-SECRET';
const TW_ACCESS_TOKEN_KEY = 'TWITTER-ACCESS-TOKEN-KEY';
const TW_ACCESS_TOKEN_SEC = 'TWITTER-ACCESS-TOKEN-SECRET';

var gsheet = new GoogleSpreadsheet('SPREADSHEET-KEY');

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


client.stream('statuses/filter', {track: 'comma,separated,list,of,keywords,you,want,to,monitor'}, function(stream) {
  stream.on('data', function(tweet) {
    textapi.sentiment({"text": tweet.text}, function(error, response) {
      if (error === null && (response.polarity == 'negative' || (response.polarity == 'neutral' && response.polarity_confidence <= 0.65))) {
        console.log(tweet.text);
        console.log("https://twitter.com/" + tweet.user.screen_name + '/status/' + tweet.id_str);
        console.log("Polarity confidence: " + Math.round(response.polarity_confidence*100)/100);
        gsheet.setAuth(GOOGLE_EMAIL, GOOGLE_PASSWORD, function(err){
          if (err) {
            console.log(err);
            return;
          }
          gsheet.addRow(1, { text: tweet.text, url: "https://twitter.com/" + tweet.user.screen_name + '/status/' + tweet.id_str, polarity: response.polarity, confidence: Math.round(response.polarity_confidence*100)/100}, function(err) {console.log(err);} );
        });
      }
    });
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});

