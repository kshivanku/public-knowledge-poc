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
  consumer_key: "oa1CTe73lubwJIyxKtnlr2z5S", // from Twitter.
  consumer_secret: "QIWain3eusInSbrFVIcxUs9KJ7WM90Fzeo5yXqJo9hzkgDx1PW", // from Twitter.
  access_token_key: "84747657-nV3fCEs9ajIzrQDOPK7Gpo1OtIn47sCNDLwFQyiGF", // from your User (oauth_token)
  access_token_secret: "XoLCt9VqaAbhaabVnv3rnneMGnd3b0UlU6h2ITJrHkLs6" // from your User (oauth_token_secret)
});

client
  .get("account/verify_credentials")
  .then(results => {
    console.log("results", results);
  })
  .catch(console.error);