import * as React from 'react';
import {EventData} from './EventData.json';
import {EventCard_v1, EventCard_v2, EventCard_v3} from './canvas';
import {Draggable, ControlType, PropertyControls} from 'framer';

interface Props {
  version: number,
  width: number,
  height: number
}

export class EventCardGenerator extends React.Component<Props> {

  static defaultProps:Props = {
    version: 1,
    width: 343,
    height: 143
  }

  static propertyControls: PropertyControls<Props> = {
    version: { type: ControlType.Number, title: "Version" },
  };

  state = {
    pos : Math.floor(Math.random() * EventData.length)
  }

  truncate( n, useWordBoundary ){
    if (this.length <= n) { return this; }
    var subString = this.substr(0, n-1);
    return (useWordBoundary 
       ? subString.substr(0, subString.lastIndexOf(' ')) 
       : subString) + "&hellip;";
  };

  render() {
    let eventcard;
    let event_image = "null";
    let pos = this.state.pos;
                if (EventData[pos].event.logo) {
                    event_image = EventData[pos].event.logo.url
                }
                let date = new Date(EventData[pos].event.start.utc).toString()
                let dateArray = date.split(" ")
                date = dateArray[1] + " " + dateArray[2] + ", " + dateArray[3];
                if(this.props.version == 1) {
                  eventcard =
                        <EventCard_v1
                            Event_Name={this.truncate.apply(EventData[pos].event.name.text, [60, true])}
                            Event_Image={event_image}
                            Event_Date={date}
                            Event_Venue={EventData[pos].event.venueLocation}
                        />
                }
                else if(this.props.version == 2) {
                  eventcard =
                        <EventCard_v2
                            Event_Name={this.truncate.apply(EventData[pos].event.name.text, [60, true])}
                            Event_Image={event_image}
                            Event_Date={date}
                            Event_Venue={EventData[pos].event.venueLocation}
                        />
                }
                else if(this.props.version == 3) {
                  eventcard =
                        <EventCard_v3
                            Event_Name={this.truncate.apply(EventData[pos].event.name.text, [40, true])}
                            Event_Image={event_image}
                            Event_Date={date}
                            Event_Venue={EventData[pos].event.venueLocation}
                        />
                }
                

                
    return (
      // <Draggable
      //   style = {{width: this.props.width, height: this.props.height, background: "transparent", display: "grid", "grid-template-columns": "1fr", "justify-items": "center" }}
      // >
        eventcard
      // </Draggable>
    )
  }
}