import * as React from 'react'
import {FriendData} from './FriendData.json'
import {FriendCard} from './canvas'
import {ControlType, PropertyControls} from 'framer'

interface Props {
  width: number,
  height: number,
  position: number
}

export class FriendCardGenerator extends React.Component<Props> {

  static defaultProps: Props = {
    width : 375,
    height : 80,
    position: 1
  }

  static propertyControls: PropertyControls<Props> = {
    position: { type: ControlType.Number, title: "Position" }
  }; 

  state = {
    pos : Math.floor(Math.random() * FriendData.length)
  }

  render() {
    return(
      <FriendCard 
          Profile_Image = {FriendData[this.state.pos].profile_image_url_https}
          Profile_Name = {FriendData[this.state.pos].name}
      />
    )
  }

}