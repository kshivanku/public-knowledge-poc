import { Data, Override, Animatable, animate, Curve } from "framer"

let data = Data({
    trimOpacity : Animatable(0),
    trimTop: Animatable(820),
    popUpY: Animatable(820),
    keyboardY: Animatable(863),
    keyboardOpacity: Animatable(0),
    editIcons: {},
    parentChildMatch : {},
    tapEffectScaleOnetime: Animatable(0),
    tapEffectOpacityOnetime: Animatable(0),
    nameOverride: {},
    tappedInstanceProps: {},
    textFieldValue: ""
});

let state = {
    originalName : {},
    parentChildMapping: {}
}

const bezierCurve = [0.2, 0.8, 0.2, 1] as Curve;
const duration = 0.5;
const bezierOptions = { curve: bezierCurve, duration }
const springOptions = {tension: 400, friction: 30}

let tapEffectHandler = async (props) => {
    data.editIcons[props.id].tapEffectOpacity.set(1);
    animate.bezier(data.editIcons[props.id].tapEffectOpacity, 0, {curve: bezierCurve, duration: 0.5})
    await animate.bezier(data.editIcons[props.id].tapEffectScale, 1, {curve: bezierCurve, duration: 0.5}).finished;
    data.editIcons[props.id].tapEffectScale.set(0);
}

let tapEffectHandlerPost = async (props) => {
    data.editIcons[props.id].tapEffectOpacity.set(1);
    animate.bezier(data.editIcons[props.id].tapEffectOpacity, 0, {curve: bezierCurve, duration: 1.5})
    await animate.bezier(data.editIcons[props.id].tapEffectScale, 20, {curve: bezierCurve, duration: 1.5}).finished;
    data.editIcons[props.id].tapEffectScale.set(0);
}

let onetimeTapEffectHander = async () => {
    data.tapEffectOpacityOnetime.set(1);
    animate.bezier(data.tapEffectOpacityOnetime, 0, {curve: bezierCurve, duration: 0.5})
    await animate.bezier(data.tapEffectScaleOnetime, 1, {curve: bezierCurve, duration: 0.5}).finished;
    data.tapEffectScaleOnetime.set(0);
}

export const EditName : Override= (props) => {

    if(!data.editIcons[props.id]) {
        data.editIcons[props.id] = {
            "tapEffectScale": Animatable(0),
            "tapEffectOpacity": Animatable(0)
        }
    }
    for(let elm of props.children) {
        data.parentChildMatch[elm.props.id] = props.id
    }
    return {
        onTap() {
            data.tappedInstanceProps = props
            console.log("tapped");
            animate.bezier(data.trimOpacity, 1, {curve: bezierCurve, duration: 0.5});
            animate.bezier(data.trimTop, 0, {curve: bezierCurve, duration: 0.005});
            animate.spring(data.popUpY, 298, springOptions)
            animate.bezier(data.keyboardY, 597, {curve: bezierCurve, duration: 0.10});
            animate.bezier(data.keyboardOpacity, 1, {curve: bezierCurve, duration: 0.25});
            tapEffectHandler(props);
        }
    }
}

export const SaveAnimation : Override = (props) => {
    return {
        onTap() {
            animate.bezier(data.trimOpacity, 0, {curve: bezierCurve, duration: 0.5});
            animate.bezier(data.trimTop, 820, {curve: bezierCurve, duration: 0.005});
            animate.bezier(data.popUpY, 820, {curve: bezierCurve, duration: 0.5});
            tapEffectHandlerPost(data.tappedInstanceProps);
            animate.bezier(data.keyboardY, 843, {curve: bezierCurve, duration: 0.25});
            animate.bezier(data.keyboardOpacity, 0, {curve: bezierCurve, duration: 0.25});
            onetimeTapEffectHander();
            data.tappedInstanceProps = {};
            data.textFieldValue = ""
        }
    }
}

export const OverlayTrim: Override = (props) => {
    return {
        opacity: data.trimOpacity,
        top: data.trimTop
    }
}

export const PopupAnimation: Override = (props) => {
    return {
        top: data.popUpY
    }
}

export const KeyboardAnimation: Override = (props) => {
    return {
        top: data.keyboardY,
        opacity: data.keyboardOpacity
    }
}

export const TapEffect: Override = (props) => {
    return {
        scale: data.editIcons[data.parentChildMatch[props.id]].tapEffectScale,
        opacity: data.editIcons[data.parentChildMatch[props.id]].tapEffectOpacity,
        left: -200
    }
}

export const SaveTapEffect: Override = (props) => {
    return {
        scale : data.tapEffectScaleOnetime,
        opacity: data.tapEffectOpacityOnetime
    }
}

export const TextChange : Override = (props) => {
    console.log(props)
    return {
        placeholderText: state.originalName[state.parentChildMapping[data.tappedInstanceProps.id]],
        value: data.textFieldValue,
        onChange(text) {
            data.nameOverride[state.parentChildMapping[data.tappedInstanceProps.id]] = text;
            data.textFieldValue = text
        }
    }
}

export const GetText: Override = (props) => {
    console.log("in GetText");

    if(Object.keys(data.tappedInstanceProps).length == 0) {
        if(!data.nameOverride[props.id]) {
            data.nameOverride[props.id] = ""
        }
        state.originalName[props.id] = props.children[0].props.name;
        return{
            nameOverride: data.nameOverride[props.id]
        }
    }
    
}

export const GetTextPopup: Override = (props) => {
    if(Object.keys(data.tappedInstanceProps).length) {
        return {
            name: state.originalName[state.parentChildMapping[data.tappedInstanceProps.id]],
            nameOverride: data.nameOverride[state.parentChildMapping[data.tappedInstanceProps.id]]
        }
    }
}

export const ParentChildMapping: Override = (props) => {
    let parentID = props.children[0].props.id;
    let childID = props.children[1].props.id;
    if(!state.parentChildMapping[childID]) {
        state.parentChildMapping[childID] = parentID;
    }
}
