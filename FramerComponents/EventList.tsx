import * as React from "react"
import { Stack, PropertyControls, ControlType, Draggable } from "framer"
import { EventData } from "./EventData.json"
import { EventCard, FriendCard } from "./canvas"
// import {DraggableCard} from './DraggableCard'

interface Props {
    width: number
    height: number
}

export class EventList extends React.Component {
    static defaultProps: Props = {
        width: 375,
        height: 249,
    }

    truncate( n, useWordBoundary ){
        if (this.length <= n) { return this; }
        var subString = this.substr(0, n-1);
        return (useWordBoundary 
           ? subString.substr(0, subString.lastIndexOf(' ')) 
           : subString) + "&hellip;";
    };

    render() {
        let eventcard = [];
        let friend_prev = "";
        let friend_next = "";
        for (let i = 360; i < 440; i++) {
            friend_next = EventData[i].friend.name;
            if(friend_next != friend_prev) {
                friend_prev = friend_next
                eventcard.push(
                        <FriendCard 
                            Profile_Image = {EventData[i].friend.profile_image_url_https}
                            Profile_Name = {EventData[i].friend.name}
                        />
                )
            }
            let event_image = "null"
                if (EventData[i].event.logo) {
                    event_image = EventData[i].event.logo.url
                }
                let date = new Date(EventData[i].event.start.utc).toString()
                let dateArray = date.split(" ")
                date = dateArray[1] + " " + dateArray[2] + ", " + dateArray[3]
                eventcard.push(

                        <EventCard
                            style={EventCardStyle}
                            Event_Name={this.truncate.apply(EventData[i].event.name.text, [60, true])}
                            Event_Image={event_image}
                            Event_Date={date}
                            Event_Venue={EventData[i].event.venueLocation}
                        />

                )
        }
        return (
            <Stack
                direction="vertical"
                gap={8}
                distribution="start"
                alignment="start"
            >
                {eventcard}
            </Stack>
        )
    }
}

const EventCardStyle: React.CSSProperties = {
    marginLeft: 16,
}
