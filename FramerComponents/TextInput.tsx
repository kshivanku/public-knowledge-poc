import * as React from "react";
import { PropertyControls, ControlType } from "framer";

type Props = { width: number, height: number, placeholderText: string, value: string };

export class TextInput extends React.Component<Props> {

  handleChange = e => {
    const {onChange} = this.props;
    onChange && onChange(e.target.value)
  }

  render() {
    return <input type="text" placeholder={this.props.placeholderText} onChange={this.handleChange} style={TextInputStyle} value={this.props.value}/>;
  }

  static defaultProps: Props = {
    width: 327,
    height: 50,
    placeholderText: "Real Name",
    value: ""
  };

  static propertyControls: PropertyControls<Props> = {
    placeholderText: { type: ControlType.String, title: "Placeholder Text" },
    value: {type: ControlType.String, title: "Input Value"}
  };
}

// Define some standard CSS for your component
const TextInputStyle: React.CSSProperties = {
  width: 327,
  height: 50,
  borderRadius: 4,
  boxShadow: "none !important",
  border: "1px solid #CBCED9",
  color: "#2C2F58",
  fontSize: 15,
  padding: 15,
  fontFamily: " -apple-system, BlinkMacSystemFont, sans-serif",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none"
};