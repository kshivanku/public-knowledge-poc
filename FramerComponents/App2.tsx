import { Data, animate, Override, Animatable, Curve } from "framer"

const data = Data(
    { 
        leftPos: Animatable(0),
        selectedtabID: "0",
        colorMatch: {},
        tapOpacity: {},
        tapScale: {},
        headingOpacity: Animatable(1),
        descriptionOpacity: Animatable(0),
        descriptionHeading: ""  
    }
)

const bezierCurve = [0.2, 0.8, 0.2, 1] as Curve;
const duration = 0.5;
const bezierOptions = { curve: bezierCurve, duration }


let state = {
    tabIDs : {},
    colors: {
        "selected": "#165DED",
        "deselected": "#C7CBDC"
    },
    headingNames: {
        "1": "Saved events",
        "2": "New events",
        "3": "Archived events",
        "4": "People you follow"
    }
}

export const moveNavContent: Override = () => {
    animate.bezier(data.leftPos, (Number(state.tabIDs[data.selectedtabID]) - 1) * 375 * (-1), bezierOptions)
    return {
        left: data.leftPos
    }
}

export const animateHeading: Override = (props) => {
    console.log(props)
    return {
        Heading : state.headingNames[state.tabIDs[data.selectedtabID]],
        opacity: data.headingOpacity
    }
}

export const animateDescription: Override = (props) => {
    return {
        opacity: data.descriptionOpacity
    }
}

export const changeActiveTab: Override = (props) => {
    return {
        onTap() {
            // console.log(props)
            data.selectedtabID = props.id;
            changeColors(props.children[1].props.id);
            data.tapOpacity[props.children[0].props.id].set(1);
            animate.bezier(data.tapOpacity[props.children[0].props.id], 0, bezierOptions);
            data.tapScale[props.children[0].props.id].set(0);
            animate.bezier(data.tapScale[props.children[0].props.id], 1, bezierOptions);
            data.headingOpacity.set(0);
            animate.bezier(data.headingOpacity, 1, bezierOptions);
            if(state.tabIDs[data.selectedtabID] && state.tabIDs[data.selectedtabID] == 3) {
                data.descriptionOpacity.set(0);
                animate.bezier(data.descriptionOpacity, 1, bezierOptions);
            }
            else {
                data.descriptionOpacity.set(0);
            }
            console.log(data.descriptionOpacity)
        }
    }
}

let changeColors = (id) => {
    for (let elm of Object.keys(data.colorMatch)) {
        if (elm == id) {
            data.colorMatch[elm] = state.colors.selected
        }
        else {
            data.colorMatch[elm] = state.colors.deselected
        }
    }
}

export const changeActiveTabColor: Override = (props) => {
    return {
        color: data.colorMatch[props.id]
    }
}

export const tapEffect : Override = (props) => {
    return {
        opacity: data.tapOpacity[props.id],
        scale: data.tapScale[props.id]
    }
}

export const recordTabIDs: Override = (props) => {
    // console.log(props);
    if(Object.keys(state.tabIDs).length == 0) {
        for (let i = 1; i < props.children.length ; i++ ) {
            state.tabIDs[props.children[i].props.id] = i.toString();
            data.colorMatch[props.children[i].props.children[1].props.id] = i == 2 ? state.colors.selected : state.colors.deselected
            data.tapOpacity[props.children[i].props.children[0].props.id] = Animatable(0);
            data.tapScale[props.children[i].props.children[0].props.id] = Animatable(0);
        }
        data.selectedtabID = props.children[2].props.id;
        // console.log(state.tabIDs);
        // console.log(data.colorMatch)
    }
}