let express = require('express');
let request = require('request');
let fs = require('fs');
let Twitter = require('twitter-lite');

let app = express();
let server = app.listen(process.env.PORT || 8000, ()=>console.log('serverstarted'));
app.use(express.static("public"));

var getEventsOptions = {
  url: "https://www.eventbriteapi.com/v3/events/search/?categories=101",
  headers: {
    authorization: "Bearer 32JKW7CMNBHN7FWRSQ6B"
  }
}

app.get('/getEvents', (req, resp) => {
  console.log("getEvents called");
  request(getEventsOptions, function(err, response, body) {
    resp.send(body);
  })
})

const client = new Twitter({
  subdomain: "api",
  consumer_key: "", // from Twitter.
  consumer_secret: "", // from Twitter.
  access_token_key: "", // from your User (oauth_token)
  access_token_secret: "" // from your User (oauth_token_secret)
});

client
  .get("account/verify_credentials")
  .then(results => {
    console.log("results", results);
  })
  .catch(console.error);
