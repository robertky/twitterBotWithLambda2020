/***********************************************************************************
*Name: Kyle Roberts
*AWS Lambda Adaptation made with this code
*Program Description: This is a twitter bot that tweets out the tracker data to 
*a twitter account via twitter API. It pulls the data from another API called
*Alpha Vantage api. Tweets are scheduled to run at 4:05pm every day. If it is the 
*weekends, the twitter bot states it is weekend.
************************************************************************************/


//Prints to verify bot running
console.log("The bot is running");
//set the api settings
var Twit = require('twit');
//Get Keys from these files
var config = require('./configure');
var apikey = require('./apikey');
//set up Twit from config file
var T = new Twit(config);
//Set the date to todays date.
var date = new Date();
//set date to current dates
var year=date.getFullYear();
var month=monthFormat(date.getMonth()+1);
var day=date.getDate();
var request = require('request');

console.log(year+"-"+month+"-"+day);
//API links. Nasdaq LINK is currently down and has been reported to API.
var VTI=`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=VTI&outputsize=compact&apikey=${apikey}&datatype=json`;
var VOO=`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=VOO&outputsize=compact&apikey=${apikey}&datatype=json`;

//The LAMBDA main function that returns when it is called with a response.
module.exports.favourite = async(event, context, callback) => {

  //VTI quote
  requestFunction(VTI, "The Vanguard Total Stock Market ETF (VTI) information for ");
  //VOO quote
  requestFunction(VOO, "The Vanguard S&P 500 ETF (VOO) information for ");
  console.log("Tweeted exited");
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "The Bot Tweeted, see console/log if no tweet is sent out."
    }),
  };
  callback(null, response);
}

//Function takes in the API website and the name of tracker that API is related to. It then 
//tweets out the Opening, closing, high, and low via T.post().
function requestFunction(website, trackerName)
{
  request(website , function(error, response, body) {
    if(error){
      console.log("SOMETHING WENT WRONG!");
      console.log(error);
    }else{
      if(response.statusCode==200){
        //Parse the JSON from a string to actual JSON and set it to parsed data
        console.log(body);
        parsedData = JSON.parse(body);
        //Set the variables for the tracker data
        if(parsedData["Time Series (Daily)"].hasOwnProperty(""+year+"-"+month+"-"+day+""))
        {
          var IndexOpening=(parsedData["Time Series (Daily)"][year+"-"+month+"-"+day]["1. open"]);
          var IndexClosing=(parsedData["Time Series (Daily)"][year+"-"+month+"-"+day]["4. close"]);
          var IndexHigh=(parsedData["Time Series (Daily)"][year+"-"+month+"-"+day]["2. high"]);
          var IndexLow=(parsedData["Time Series (Daily)"][year+"-"+month+"-"+day]["3. low"]);
        
          //set returnString to actually what will be tweeted
          var returnString=trackerName + year+"-"+month+"-"+day +":\nOpening: " + IndexOpening 
          + "\nClosing: " + IndexClosing+ "\nHigh: " + IndexHigh +"\nLow: " + IndexLow + "";
        }
        else
        {
          var returnString="The "+ trackerName +"is closed today."
        }
        var tweet= { status: returnString}
        //Tweet out. Use tweetCheck to verify tweet went out to console or to print error.
        T.post("statuses/update", tweet, tweetCheck)
      }
    }});
}
//Checks if there was an error and prints error. Otherwise, informs console that the print worked.
function tweetCheck(err, data, response){
  if(err){
    console.log("Something went wrong and the tweet did not go out!");
    console.log(err);
  }else{
    console.log("The twitter bot Tweeted!");
  }
}

//Adds a zero to the front because of the API requirement for this.
function monthFormat(monthNum){
  if(monthNum<10){
    monthNum="0"+ monthNum;
    return monthNum;
  }else{
    return monthNum;
  }
}