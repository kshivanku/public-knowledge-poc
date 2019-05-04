let express = require('express');
let request = require('request');
let fs = require('fs');
let Twitter = require('twitter-lite');
require('dotenv').config();

let app = express();
let server = app.listen(process.env.PORT || 8000, () => console.log('serverstarted'));
app.use(express.static("public"));

//TWITTER SETUP
const client = new Twitter({
  subdomain: "api",
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

let eventCategories = [];
let friends = [];
let interestedCategories = "&categories=101%2C102%2C111%2C112%2C113";
let interestedSubcategories = "&subcategories=5013%2C8001%2C8003%2C8004%2C8012%2C8015%2C14007%2C19006%2C20006"


/***********************************
Refresh Data Functions
************************************/
// fetchEventCategories("null");
// fetchEvents(1);
// fetchFriends(-1);
// matchEventsAndFriends();
// displayMatchedEventsInConsole();
// analyseFetchedEventCategories();
addVenueToMatchedEvents();



/***********************************
GETTING ALL EVENT CATEGORIES
************************************/

function fetchEventCategories(continuation) {
  let getOptions = {
    url: (continuation != "null") ? "https://www.eventbriteapi.com/v3/subcategories/?continuation=" + continuation : "https://www.eventbriteapi.com/v3/subcategories/",
    headers: {
      authorization: "Bearer " + process.env.EVENTBRIGHT_TOKEN
    }
  }
  request(getOptions, function(err, response, body) {
    let bodyJSON = JSON.parse(body);
    for (let subcat of bodyJSON.subcategories) {
      eventCategories.push(subcat);
    }
    fs.writeFileSync("Public/eventCategories.json", JSON.stringify(eventCategories, null, 2));
    if (bodyJSON.pagination.has_more_items) {
      fetchEventCategories(bodyJSON.pagination.continuation)
    }
  })
}

function getCategoryIDs() {
  let categoryIDs = {};
  let categoryList = JSON.parse(fs.readFileSync("Public/eventCategories.json"));
  for (item of categoryList) {
    if (!categoryIDs[item.parent_category.name]) {
      categoryIDs[item.parent_category.name] = {
        id: item.parent_category.id
      }
    }
    categoryIDs[item.parent_category.name][item.name] = item.id;
  }
  return categoryIDs;
}

/***********************************
GETTING ALL EVENTS FOR A CATEGORY
************************************/

let events = JSON.parse(fs.readFileSync("Public/events_v2.json"));

function fetchEvents(pageNumber) {
  let getOptions = {
    url: "https://www.eventbriteapi.com/v3/events/search/?page=" + pageNumber.toString() + interestedSubcategories,
    headers: {
      authorization: "Bearer " + process.env.EVENTBRIGHT_TOKEN
    }
  }
  request(getOptions, function(err, response, body) {
    let bodyJSON = JSON.parse(body);
    if (bodyJSON.events) {
      fs.writeFileSync("Public/event_response.json", body);
      for (let item of bodyJSON.events) {
        events.push(item)
      };
      fs.writeFileSync("Public/events_v2.json", JSON.stringify(events, null, 2));
      if (bodyJSON.pagination.has_more_items) {
        pageNumber += 1;
        fetchEvents(pageNumber)
      }
    } else {
      // console.log(body);
      // console.log("Page Number: " + pageNumber);
    }
  })
}

/***********************************
GETTING ALL FRIENDS FROM TWITTER
************************************/

function fetchFriends(cursor) {
  client
    .get("friends/list", {
      cursor: cursor.toString(),
      count: 200
    })
    .then(results => {
      for (user of results.users) {
        friends.push(user)
      }
      if (results.next_cursor) {
        fetchFriends(results.next_cursor);
      } else {
        fs.writeFileSync("Public/friendList.json", JSON.stringify(friends, null, 2));
      }
    })
    .catch(console.error);
}


/***********************************
MATCH FRIENDS WITH EVENTS
************************************/

function matchEventsAndFriends() {
  let friendsData = JSON.parse(fs.readFileSync("Public/friendList.json"));
  let eventsData = JSON.parse(fs.readFileSync("Public/events_v2.json"));
  let matchedEvents = [];
  for (let friend of friendsData) {
    for (let eventItem of eventsData) {
      if (eventItem.description.text) {
        let searchTerm = new RegExp('\\W' + friend.name + '\\W');
        let pos = eventItem.description.text.search(searchTerm);
        if (pos != -1) {
          console.log("matched!")
          eventItem.description.html = "";
          eventItem.description.text = "";
          matchedEvents.push({
            "event": eventItem,
            "friend": friend
          })
        }
      }
    }
  }
  fs.writeFileSync("Public/matchedEvents_v2.json", JSON.stringify(matchedEvents, null, 2));
}

function displayMatchedEventsInConsole() {
  let matchedEvents = JSON.parse(fs.readFileSync("Public/matchedEvents_v2.json"));
  let friend_prev = "null";
  let count = 0;
  let friendEvent = [];
  let overmatchedFriends = [];
  for (matchedEvent of matchedEvents) {
    let friend_next = matchedEvent.friend.name;
    if (friend_prev != friend_next) {
      // if (count < 40) {
      for (eventName of friendEvent) {
        console.log(eventName);
      }
      // }
      // else {
      //   overmatchedFriends.push(friend_prev);
      // }
      friend_prev = friend_next;
      count = 1;
      friendEvent = [matchedEvent.event.name.text];
      console.log("\n-------------\n" + friend_next);
    } else {
      count += 1;
      friendEvent.push(matchedEvent.event.name.text);
    }
    // }

  }
  // console.log(overmatchedFriends);
}


/***********************************
UNDERSTANDING THE DATA
************************************/

async function analyseFetchedEventCategories() {
  let eventTypes = {};
  let events = JSON.parse(fs.readFileSync("Public/events_v2.json"));
  for (let event of events) {
    let eventCategory = {};
    if (event.subcategory_id) {
      eventCategory = await getCategoryName(event.subcategory_id, false, true);
    } else if (event.category_id) {
      eventCategory = await getCategoryName(event.category_id, true, false);
    } else {
      eventCategory = {
        subcategory: "Subcategory not specified",
        category: "Category not specified"
      }
    }
    if (!eventCategory) {
      console.log(event)
    }
    if (eventTypes[eventCategory.category]) {
      if (eventTypes[eventCategory.category][eventCategory.subcategory]) {
        eventTypes[eventCategory.category][eventCategory.subcategory] += 1;
      } else {
        eventTypes[eventCategory.category][eventCategory.subcategory] = 1;
      }
    } else {
      eventTypes[eventCategory.category] = {};
      eventTypes[eventCategory.category][eventCategory.subcategory] = 1;
    }
  }
  console.log(eventTypes);
  fs.writeFileSync("Public/eventAnalysis_v2.json", JSON.stringify(eventTypes, null, 2));
}

function getCategoryName(category_id, isCategory, isSubcategory) {
  let categoryInfo = JSON.parse(fs.readFileSync("Public/eventCategories.json"));
  for (category of categoryInfo) {
    if (isSubcategory && category_id == category.id) {
      let category_name = {
        subcategory: category.name,
        category: category.parent_category.name
      }
      return (category_name);
    } else if (isCategory && category_id == category.parent_category.id) {
      let category_name = {
        subcategory: "Subcategory not specified",
        category: category.parent_category.name
      }
      return (category_name);
    }
  }
  category_name = {
    subcategory: "Subcategory not specified",
    category: "Category not specified"
  }
  return (category_name);
}

/***********************************
ADDING VENUE NAME TO DATA
************************************/

async function addVenueToMatchedEvents() {
  let matchedEvents = JSON.parse(fs.readFileSync("Public/matchedEvents_v2.json"));
  let matchedEventWithVenue = [];
  let allVenues = [];
  for (let matchedEvent of matchedEvents) {
    // let matchedEvent = matchedEvents[0];
    if (matchedEvent.event.venue_id) {
      let venueLocation = await getVenueObject(matchedEvent.event.venue_id);
      matchedEvent.event.venueLocation = venueLocation.address.city + ", " + venueLocation.address.region;
      allVenues.push(venueLocation);
    } else {
      matchedEvent.event.venueLocation = "Not available";
    }
    matchedEventWithVenue.push(matchedEvent);
  }
  fs.writeFileSync("Public/allVenues.json", JSON.stringify(allVenues, null, 2));
  fs.writeFileSync("Public/matchedEvents_v3.json", JSON.stringify(matchedEventWithVenue, null, 2));
}

function getVenueObject(venueID) {
  return new Promise(function(resolve, reject) {
    let getOptions = {
      url: "https://www.eventbriteapi.com/v3/venues/" + venueID,
      headers: {
        authorization: "Bearer " + process.env.EVENTBRIGHT_TOKEN,
        "Content-Type": "application/json"
      }
    }
    request(getOptions, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        let bodyJSON = JSON.parse(body);
        console.log(bodyJSON);
        resolve(bodyJSON);
      } else {
        reject(err)
      }
    })
  })
}

/***********************************
Routes
************************************/

// app.get('/getEvents', (req, resp) => {
//   console.log("getEvents called");
//   request(getOptions, function(err, response, body) {
//     fs.writeFileSync("Public/eventCategories.json", JSON.stringify(body, null, 2));
//     resp.send(body);
//   })
// })
