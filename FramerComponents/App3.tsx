import { Data, animate, Override, Animatable, Curve, Color } from "framer"

const data = Data(
    { 
        firstCardLeft : Animatable(33),
        heartRight : Animatable(60),
        heartOpacity: Animatable(0),
        heartScale: Animatable(1),
        archiveLeft: Animatable(60),
        archiveOpacity: Animatable(0),
        archiveScale: Animatable(1),
        cardPositions: {},
        navHeartTop: Animatable(18),
        navHeartScale: Animatable(1),
        navHeartColor: "#C7CBDC",
        navArchiveTop: Animatable(18),
        navArchiveScale: Animatable(1),
        navArchiveColor: "#C7CBDC"
    }
)

const bezierCurve = [0.2, 0.8, 0.2, 1] as Curve;
const bezierCurveCardTransition = [.79,.01,.25,.99] as Curve;
const bezierDipDown = [0,.91,.25,.99] as Curve;
const bezierDipUp = [1,0,1,.27] as Curve;
const duration = 1;
const bezierOptions = { curve: bezierCurve, duration }
const springOptions = {tension: 400, friction: 30}

let state = {
    heartAnimating : false,
    archiveAnimating :  false,
    posIDMatch: {},
    cardPositions: {},
    cardMovedOnce : true
}

let prevX = 0;
let refresh = true;

export const CardAnimation: Override = (props) => {
    console.log("Card Animation");
    return {
        top: data.cardPositions[props.id].top,
        left: data.cardPositions[props.id].left,
        right: data.cardPositions[props.id].right,

        onValueChange : (pointX: number) => {
            // console.log(pointX)
            if(pointX<-20 && pointX >= -60 && prevX > pointX) {
                animateHeartOut();
                // heartScaleUp();
            }
            if(pointX > 20 && pointX <= 60 && prevX < pointX) {
                animateArchiveOut();
                // archiveScaleUp();
            }
            prevX = pointX
        },

        onDragEnd : (lastX: number) => {
            
            if(lastX > -60 && lastX < 0) {
                animateHeartIn()
            }
            else if(lastX < -60) {
                animateHeartExplode();
                heartDipAnimation();
                animateCardTransition();
            }
            else if (lastX > 0 && lastX < 60 ) {
                animateArchiveIn()
            }
            else if(lastX > 60) {
                animateArchiveExplode();
                archiveDipAnimation();
                animateCardTransition();
            }
        }
    }
}

let animateCardTransition = async () => {
    console.log("animating card transition")
    let lastElement = Object.keys(state.posIDMatch).length;
    let startIndex = 3;
    let step = 1;
    if(data.cardPositions[state.posIDMatch[lastElement]].top.value == state.cardPositions[state.posIDMatch[lastElement - 1]].top.value) {
        startIndex = 5
        step = 2
    }
    for(let i = startIndex ; i <= lastElement ; i++) {
        animate.bezier(data.cardPositions[state.posIDMatch[i]].top, state.cardPositions[state.posIDMatch[i-step]].top, {curve: bezierCurveCardTransition, duration:0.05})
    }
}

let animateHeartOut = () => {
    console.log("animating heart out")
    animate.bezier(data.heartOpacity, 1, {curve: bezierCurve, duration: 1});
    animate.bezier(data.heartRight, 16, {curve: bezierCurve, duration: 1});
    animate.bezier(data.navHeartScale, 1.1, {curve: bezierCurve, duration: 0.25})
}

let animateArchiveOut = () => {
    console.log("animating archive out")
    animate.bezier(data.archiveOpacity, 1, {curve: bezierCurve, duration: 1});
    animate.bezier(data.archiveLeft, 16, {curve: bezierCurve, duration: 1});
    animate.bezier(data.navArchiveScale, 1.1, {curve: bezierCurve, duration: 0.25})
    // animate(data.navArchiveScale, 10, {duration: 0.25})
}

let heartScaleUp = () => {
    console.log("inside heart scale up")
}

let archiveScaleUp = () => {
    console.log("inside archive scale up")
}

let animateHeartIn = () => {
    console.log("animating heart in")
    animate.bezier(data.heartRight, 60, {curve: bezierCurve, duration: 1});
    animate.bezier(data.heartOpacity, 0, {curve: bezierCurve, duration: 1});
    animate.bezier(data.navHeartScale, 1, {curve: bezierCurve, duration: 0.25})
}

let animateArchiveIn = () => {
    console.log("animating archive in")
    animate.bezier(data.archiveLeft, 60, {curve: bezierCurve, duration: 1});
    animate.bezier(data.archiveOpacity, 0, {curve: bezierCurve, duration: 1});
    animate.bezier(data.navArchiveScale, 1, {curve: bezierCurve, duration: 0.25})
}

let animateHeartExplode = async () => {

    

    console.log("animating heart explode")
    animate.bezier(data.heartOpacity, 0, {curve: bezierCurve, duration: 1});
    await animate.bezier(data.heartScale, 1.3, {curve: bezierCurve, duration: 1}).finished;
 
    data.navHeartTop.set(18);
    data.heartOpacity.set(0);
    data.heartScale.set(1);
    data.heartRight.set(60);
}

let animateArchiveExplode = async () => {
    console.log("animating archive explode")
    animate.bezier(data.archiveOpacity, 0, {curve: bezierCurve, duration: 1});
    await animate.bezier(data.archiveScale, 1.3, {curve: bezierCurve, duration: 1}).finished;
    data.archiveOpacity.set(0);
    data.archiveScale.set(1);
    data.archiveLeft.set(60);
    
}

let heartDipAnimation = async () => {
    // console.log("animating nav heart")
    // data.navHeartColor = "#ff0000"
    await animate.bezier(data.navHeartTop, 25, {curve: bezierDipDown, duration: 0.25}).finished;
    await animate.bezier(data.navHeartTop, 18, {curve: bezierDipUp, duration: 0.25}).finished;
    animate.bezier(data.navHeartScale, 1, {curve: bezierDipUp, duration: 0.25})
    // data.navHeartColor = "#00ff00"
}

let archiveDipAnimation = async () => {
    // console.log("animating nav heart")
    // data.navHeartColor = "#ff0000"
    await animate.bezier(data.navArchiveTop, 25, {curve: bezierDipDown, duration: 0.25}).finished;
    await animate.bezier(data.navArchiveTop, 18, {curve: bezierDipUp, duration: 0.25}).finished;
    animate.bezier(data.navArchiveScale, 1, {curve: bezierDipUp, duration: 0.25})
    // data.navHeartColor = "#00ff00"
}

export const HeartAnimation: Override = (props) => {
    console.log("inside heart animation")
    return {
        opacity: data.heartOpacity,
        right: data.heartRight,
        scale: data.heartScale
    }
}

export const ArchiveAnimation: Override = (props) => {
    console.log("inside archive animation")
    return {
        opacity: data.archiveOpacity,
        left: data.archiveLeft,
        scale: data.archiveScale
    }
}

export const NavHeartDip: Override = (props) => {
    console.log(props)
    return {
        top: data.navHeartTop,
        scale: data.navHeartScale,
        color: data.navHeartColor
    }
}

export const NavHeartScale: Override = (props) => {
    console.log(props)
    return {
        scale: data.navHeartScale
    }
}

export const NavArchiveDip: Override = (props) => {
    return {
        top: data.navArchiveTop,
        scale: data.navArchiveScale,
        color: data.navArchiveColor
    }
}

export const NavArchiveScale: Override = (props) => {
    console.log(props)
    return {
        scale: data.navArchiveScale
    }
}

export const ParentFrame: Override = (props) => {
    console.log("inside parent frame")
    if(refresh) {
        for(let elm of props.children) {
            data.cardPositions[elm.props.id] = {
                "top": Animatable(elm.props.top),
                "left": Animatable(elm.props.left),
                "right": Animatable(elm.props.right),
            }
            state.cardPositions[elm.props.id] = {
                "top": Animatable(elm.props.top),
                "left": Animatable(elm.props.left),
                "right": Animatable(elm.props.right),
            }
            state.posIDMatch[elm.props.children[0].props.position] = elm.props.id
        }
        console.log(data.cardPositions)
        refresh = false;
    }
}
