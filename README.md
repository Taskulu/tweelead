# Tweelead
> Generate actionable leads from Twitter in real-time.

## Intro
There are many people out there literally asking you to introduce your product to them so they can become your customers, but the problem is that it's very difficult to find them!

Tweelead will help you find those people easily - It gets the Tweets matching the keywords that are important to you from the Twitter Stream API, sends them to AYLIEN (free account required) for sentiment analysis, and depending on your preference, puts the positive (or negative) tweets in a spreadsheet on your Google Drive.

You can read more about Tweelead here: http://blog.taskulu.com/post/how-get-actionable-leads-twitter-real-time

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

**5)** Copy <a href="https://docs.google.com/spreadsheets/d/1bZRFP5R6DvGTPkDrVhqyQCv8yUMsgLzFHud7kc8J1Zo/edit?usp=sharing">this</a> spreadsheet to your Google Drive. We'll need the spreadsheet key from the URL later.
> URL format: https://docs.google.com/spreadsheets/d/{SPREADSHEET-KEY}/edit

**6)** Add the constants to your enviroment from code you downloaded in step **1**:
```bash
export GOOGLE_EMAIL='youremail@gmail.com'
// If you use Google 2 Factor Authentication this will be the app key you generated in step 4
export GOOGLE_PASSWORD='YOUR-PASSWORD123!#'
export GOOGLE_SPREADSHEET="SPREADSHEET-KEY";
export AYLIEN_APP_ID='YOUR-AYLIEN-APPLICATION-ID'
export AYLIEN_APP_KEY='YOUR-AYLIEN-APPLICATION-KEY'
export TW_CONSUMER_KEY='TWITTER-CONSUMER-KEY'
export TW_CONSUMER_SEC='TWITTER-CONSUMER-SECRET'
export TW_ACCESS_TOKEN_KEY='TWITTER-ACCESS-TOKEN-KEY'
export TW_ACCESS_TOKEN_SEC='TWITTER-ACCESS-TOKEN-SECRET'
export CSV_KEYWORDS='comma,separated,list,of,keywords,you,want,to,monitor'
```

**7)** What kind of tweets are you looking for? Configure the POLARITY_OPTIONS in index.js

```javascript
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
```

**8)** Open up your terminal and start finding Tweeleads!
```bash
cd /path/to/tweelead
npm install
node index
```
## Acceptance conditions
I've configured the code to accept any negetavie tweet and neutral tweets with less than 65% confidence level and send those tweets to the Google Spreadsheet. This needs to be changed/tuned for your use case. To change it open index.js and find and edit this part:

```javascript
if (error === null && (response.polarity == 'negative' || (response.polarity == 'neutral' && response.polarity_confidence <= 0.65))) {
```
