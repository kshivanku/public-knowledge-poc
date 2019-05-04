import { Data, animate, Override, Animatable } from "framer"

let data = Data({
    toggleInstances: {}
})

let state = {
    properties: {
        selectedBlue: "#FFFFFF",
        deselectedBlue: "#FFFFFF",
        deselectedRailBlue: "#F1F2F3",
        selectedRailBlue: "#165DED",
        onLeftValue: 23,
        offLeftValue: 7
    },
    parentChildMapping: {}
}

let rippleHandler = async (props) => {
    data.toggleInstances[props.id].touchRippleOpacity.set(1);
    animate.easeOut(data.toggleInstances[props.id].touchRippleOpacity, 0, {duration: 1.0});
    await animate.easeOut(data.toggleInstances[props.id].touchRippleSize, 20, {duration: 0.5}).finished;
    data.toggleInstances[props.id].touchRippleSize.set(0);
    // console.log(data);
}

export const Toggle: Override = (props) => {
    //Store all instances of Toggle in data with their respective states (ball and rail both are stored as separate entries so I don't have to find their ids later during animation)
    if(!data.toggleInstances[props.id]) {
        data.toggleInstances[props.id] = {
            "ballLeft": Animatable(state.properties.onLeftValue),
            "ballBGColor": Animatable(state.properties.selectedBlue),
            "railBorderColor": Animatable(state.properties.selectedRailBlue),
            "currentToggleState" : 1,
            touchRippleSize: Animatable(0),
            touchRippleOpacity: Animatable(1)
        }
    }
    for(let elm of props.children) {
        if(!state.parentChildMapping[elm.props.id]) {
            state.parentChildMapping[elm.props.id] = props.id
        }
    }

    return {
        onTap() {
            if(data.toggleInstances[props.id].currentToggleState) {
                animate.easeOut(data.toggleInstances[props.id].railBorderColor, state.properties.deselectedRailBlue, {duration: 0.1});
                animate.easeOut(data.toggleInstances[props.id].ballBGColor, state.properties.deselectedBlue, {duration: 0.1});
                animate.easeOut(data.toggleInstances[props.id].ballLeft, state.properties.offLeftValue, {duration: 0.25});
                data.toggleInstances[props.id].currentToggleState = 0;                                
            }
            else {
                animate.easeOut(data.toggleInstances[props.id].railBorderColor, state.properties.selectedRailBlue, {duration: 0.1});
                animate.easeOut(data.toggleInstances[props.id].ballBGColor, state.properties.selectedBlue, {duration: 0.1});
                animate.easeOut(data.toggleInstances[props.id].ballLeft, state.properties.onLeftValue, {duration: 0.25});
                data.toggleInstances[props.id].currentToggleState = 1;
            }
             //Ripple
            rippleHandler(props);
        }
    }
}

export const toggleRailAnimation: Override = (props) => {
    return {
        background: data.toggleInstances[state.parentChildMapping[props.id]].railBorderColor
    }
}

export const toggleBallAnimation: Override = (props) => {
    return {
        left: data.toggleInstances[state.parentChildMapping[props.id]].ballLeft,
        background: data.toggleInstances[state.parentChildMapping[props.id]].ballBGColor
    }
}

export const touchRippleEffect: Override = (props) => {
    return {
        scale: data.toggleInstances[state.parentChildMapping[props.id]].touchRippleSize,
        opacity: data.toggleInstances[state.parentChildMapping[props.id]].touchRippleOpacity
    }
}


