import * as React from 'react';
import {Draggable, animate, Animatable, Curve, ControlType, PropertyControls} from 'framer';

interface Props {
  width: number,
  height: number,
  position: number,
  onValueChange: (value: number) => void
  onDragEnd: (value: number) => void
  onDragStart: () => void
}

const bezierCurve = [0.2, 0.8, 0.2, 1] as Curve;
const duration = 1;
const bezierOptions = { curve: bezierCurve, duration }

export class DraggableCard extends React.Component<Props> {

  static defaultProps: Props = {
    width : 343,
    height : 143,
    position: 1
  }

  static propertyControls: PropertyControls<Props> = {
    position: { type: ControlType.Number, title: "Positions" }
  };
  state = {
    left: Animatable(0)
  }

  lastLeft = 0;
  dragReturnAnimation = null;
  
  moveHandler = (point) => {
    const { onValueChange } = this.props;
    onValueChange && onValueChange(point.x)
    this.lastLeft = point.x;
  }

  dragEndHandler = () => {
    const { onDragEnd } = this.props;
    onDragEnd && onDragEnd(this.lastLeft)
    if(this.lastLeft < -60) {
      console.log("too left");
      this.killBuiltInAnimation()
      animate.bezier(this.state.left, -500, bezierOptions);
    }
    else if(this.lastLeft > 60) {
      this.killBuiltInAnimation();
      animate.bezier(this.state.left, 500, bezierOptions);
      console.log("too right");
    }
  }

  dragStartHandler = () => {
    const { onDragStart } = this.props;
    onDragStart && onDragStart()
  }

  dragAnimationStartHandler = (animation) => {
    this.dragReturnAnimation = animation;
  }

  killBuiltInAnimation = () => {
    this.dragReturnAnimation.x.cancel();
    this.dragReturnAnimation.y.cancel();
  }

  render() {
    return(
      <Draggable
        width = {this.props.width}
        height = {this.props.height}
        style = {{background: "transparent"}}
        onMove = {this.moveHandler}
        onDragEnd = {this.dragEndHandler}
        onDragStart = {this.dragStartHandler}
        left = {this.state.left}
        directionLock = {true}
        mometum = "true"
        onDragAnimationStart = {this.dragAnimationStartHandler}
      >{this.props.children}</Draggable>
    )
  }
}