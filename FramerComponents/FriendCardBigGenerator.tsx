import * as React from 'react';
import {PropertyControls, ControlType} from 'framer'
import {FriendCardBig} from './canvas';
import {FriendData} from './FriendData.json';

interface Props {
  width: number,
  height: number,
  name: string,
  nameOverride: string
}

export class FriendCardBigGenerator extends React.Component {

  static defaultProps:Props = {
    width: 263,
    height: 80,
    name: "",
    nameOverride: ""
  }

  static propertyControls: PropertyControls<Props> = {
    name: { type: ControlType.String, title: "Name" },
    nameOverride: {type: ControlType.String, title: "Name Override"}
  };

  state = {
    originalName : ""
  }

  truncate( n, useWordBoundary ){
    if (this.length <= n) { return this; }
    var subString = this.substr(0, n-1);
    return (useWordBoundary 
       ? subString.substr(0, subString.lastIndexOf(' ')) 
       : subString) + "&hellip;";
  };

  render() {
    let pos = 0;
    if(this.props.name == "") {
      pos = Math.floor(Math.random() * FriendData.length);
      this.state.originalName = FriendData[pos].name;
    }
    else {
      this.state.originalName = this.props.name;
      for(let i = 0; i < FriendData.length ; i++) {
        if(FriendData[i].name == this.props.name) {
          pos = i;
        }
      }
    }

    return(
      <FriendCardBig 
        Friend_Name = {this.props.nameOverride == "" ? this.truncate.apply(FriendData[pos].name, [25, true]) : this.truncate.apply(this.props.nameOverride, [25, true])}
        Friend_Twitter = {FriendData[pos].screen_name}
        Friend_Profilepic = {FriendData[pos].profile_image_url}  
      />
    )
  }

}

