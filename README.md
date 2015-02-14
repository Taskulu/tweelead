# Tweelead
> Generate actionable leads from Twitter in real-time.

## Intro
There are many people out there literally asking you to introduce your product to them so they can become your client, but the problem is that it's very difficult to find them!

Tweelead will help you find those people easily - It gets the Tweets matching the keywords that are important to you from the Twitter Stream API, sends them to AYLIEN (free account required) for sentiment analysis, and depending on your preference, puts the positive (or negative) tweets in a spreadsheet on your Google Drive.

## How to set it up
Setting Tweelead up is very easy and can be done in a few minutes:

**1)** Download the code from Github:
```bash
wget https://github.com/Taskulu/tweelead/archive/master.zip -O tweelead-master.zip
unzip tweelead-master.zip
```

or

```bash
git clone https://github.com/Taskulu/tweelead.git
```

**2)** Create a <a href="https://apps.twitter.com/">Twitter Application</a>. Go to the “Keys and Access Tokens” tab, and generate a new access token (there will be a button towards the bottom).

**3)** Register an account with <a href="http://aylien.com/">AYLIEN</a> and generate the free application ID and Key.

**4)** If you're using 2 Factor Authentication with your Google account, create an app specific password for Tweelead <a href="https://security.google.com/settings/security/apppasswords">here</a>.

**5)** Copy <a href="https://docs.google.com/spreadsheets/d/1bZRFP5R6DvGTPkDrVhqyQCv8yUMsgLzFHud7kc8J1Zo/pubhtml">this</a> spreadsheet to your Google Drive. We'll need the spreadsheet key from the URL later.
> URL format: https://docs.google.com/spreadsheets/d/{SPREADSHEET-KEY}/edit

**6)** Update the constants in index.js from code you downloaded in step **1**:
```javascript
const GOOGLE_EMAIL        = 'youremail@gmail.com';
// If  you use Google 2 Factor Authentication this will be the app key you generated in step 4
const GOOGLE_PASSWORD     = 'YOUR-PASSWORD123!#';
const AYLIEN_APP_ID       = 'YOUR-AYLIEN-APPLICATION-ID';
const AYLIEN_APP_KEY      = 'YOUR-AYLIEN-APPLICATION-KEY';
const TW_CONSUMER_KEY     = 'TWITTER-CONSUMER-KEY';
const TW_CONSUMER_SEC     = 'TWITTER-CONSUMER-SECRET';
const TW_ACCESS_TOKEN_KEY = 'TWITTER-ACCESS-TOKEN-KEY';
const TW_ACCESS_TOKEN_SEC = 'TWITTER-ACCESS-TOKEN-SECRET';
```

**7)** Add the keywords you want to track on twitter in index.js, AYLIEN offers 1000 free API calls per day, so don't add too many keywords so you don't go over the API limit.

```javascript
client.stream('statuses/filter', {track: 'comma,separated,list,of,keywords,you,want,to,monitor'}, function(stream) {
```

**8)** Open up your terminal and start finding Tweeleads!
```bash
cd /path/to/tweelead
npm install
node index
```
