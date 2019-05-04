import * as React from "react";
import { PropertyControls, ControlType } from "framer";
import {Popup, Secondary_button, Primary_button} from './canvas';
import {FriendCardBigGenerator} from './FriendCardBigGenerator'

type Props = { 
  name: string,
  width: number,
  height: number 
};

export class PopupGenerator extends React.Component<Props> {

  state = {
    nameOverride : "Pranav"
  }

  onchangeHandler = (e) => {
    console.log("e.target.value")
  }

  render() {
    return (
      <div style = {PopupGeneratorStyle}> <div> 
          <h1 style = {{...TextStyle, ...HeadingStyle}}>Edit Name</h1>
          <p style={{...TextStyle, ...ParaStyle}}>Provide the real name of contact that can be searched across event databases</p>
        </div>
        <div>
          <FriendCardBigGenerator style={FriendCardStyle} name = "Khan Academy" nameOverride = {this.state.nameOverride}/>
          <input type="text" name="Real name" style={InputStyle} onChange={this.onChangeHandler}/>
        </div>
        <div style = {actionButtons}>
          <Secondary_button label="CANCEL" />
          <Primary_button label="SAVE" />
        </div>
      </div>
    )
  }

  static defaultProps: Props = {
    name: "null",
    width: 375,
    height: 399
  };

  static propertyControls: PropertyControls<Props> = {
    name: { type: ControlType.String, title: "Name" }
  };
}

// Define some standard CSS for your component
const PopupGeneratorStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "8px 8px 0 0",
  width: 375,
  height: 299,
  position: "absolute",
  top: 30,
  left: 0,
  padding: "24px",
  fontFamily: " -apple-system, BlinkMacSystemFont, sans-serif",
  boxSizing: "border-box",
  MozBoxShadow: "0px -2px 2px 0px #7E8491, 0px -7px 25px 10px #7E8491",
  WebkitBoxShadow: "0px -2px 2px 0px #7E8491, 0px -7px 25px 10px #7E8491",
  boxShadow: "0px -2px 2px 0px #7E8491, 0px -7px 25px 10px #7E8491",
  overflow: "visible",
  border: "1px solid black"
};

const TextStyle: React.CSSProperties = {
  color: "#2C2F58"
}

const HeadingStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10
}

const ParaStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#737C98",
  fontWeight: "normal"
}

const FriendCardStyle: React.CSSProperties = {
  display: "block",
  border: "1px solid black",
  marginLeft: "-80px"
}

const InputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: "50px",
  boxSizing: "border-box",
  padding: "16px"
}

const actionButtons: React.CSSProperties = {
  border: "1px solid black",
  marginTop: 100,
  height: 48,
  width: "100%",
  display: "grid",
  gridTemplateRows: "167px 96px 89px",
}