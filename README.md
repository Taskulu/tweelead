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

**4)** Setup your google account:
Setup Instructions

Go to the  <a href="https://console.developers.google.com/project/">Google Developer Console</a>
  1. Select your project or create a new one (and then select it)
  2. Enable the Drive API for your project
  3. In the sidebar on the left, expand APIs & auth > APIs
  4. Search for "drive"
  5. Click on "Drive API"
  6. Click the blue "Enable API" button
  7. Create a service account for your project
  8. In the sidebar on the left, expand APIs & auth > Credentials
  9. Click "Create new Client ID" button
  10. Select the "Service account" option
  11. Click "Create Client ID" button to continue
  12. When the dialog appears click "Okay, got it"
  13. Your JSON key file is generated and downloaded to your machine (__it is the only copy!__)
  14. Copy the JSON file to the folder that contains the Tweelead code and rename it to google-creds.json.
  15. Share the spreadsheet with your service account using the email noted above

**5)** Copy <a href="https://docs.google.com/spreadsheets/d/1bZRFP5R6DvGTPkDrVhqyQCv8yUMsgLzFHud7kc8J1Zo/edit?usp=sharing">this</a> spreadsheet to your Google Drive. We'll need the spreadsheet key from the URL later. 
Also, don't forget to share the spreadsheet with the Google service account (found in the JSON file you downloaded in step #14 above).

> URL format: https://docs.google.com/spreadsheets/d/{SPREADSHEET-KEY}/edit

**6)** Rename config.ini.example to config.ini and set the values:
```ini
# Configs for app
CSV_KEYWORDS        = comma,separated,list,of,your,keywords
LANGUAGE            = en

# Aylien
AYLIEN_APP_ID       = YOUR-AYLIEN-APPLICATION-ID
AYLIEN_APP_KEY      = YOUR-AYLIEN-APPLICATION-KEY

# Twitter
TW_CONSUMER_KEY     = TWITTER-CONSUMER-KEY
TW_CONSUMER_SEC     = TWITTER-CONSUMER-SECRET
TW_ACCESS_TOKEN_KEY = TWITTER-ACCESS-TOKEN-KEY
TW_ACCESS_TOKEN_SEC = TWITTER-ACCESS-TOKEN-SECRET

# Google
GOOGLE_CREDENTIALS  = google-creds.json
GOOGLE_SPREADSHEET  = GOOGLE-SPREADSHEET-KEY

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
node index.js
```

