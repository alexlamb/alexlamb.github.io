window.onload = function() {
    console.log("Started up");
  window.onmessage = (event) => {
    console.log("message received from parent");
    if (event.data) {
      console.log(JSON.stringify(event));
      console.log(JSON.stringify(event.data));

      if (event.data.action === "Init") {
          initUI(event.data.content);
      } else {
          updateSelection(event.data.content);
      }
    }
  }
}

const assets = "assets/"
const arrowsFile = "arrows.png";
const units = 16;

const textWidth = 100;
const rowHeight = 80;
const dotGap = 20;
const diameter = 16;
const textRight = 160;
const dotRight = 260;
const dotTop = 20;
const textTop = 60;
const iconSide = 60;
const borderLeft = 150;
const borderExtra = 120;

const levelInc = 16;
const bottleBottom = (units*levelInc) + 140;
const bottleLeft = 20;
const bottleWidth = 100;
const bottleRight = bottleLeft + bottleWidth;

const rimWidth = 5;
const rimHeight = 5;
const neckWidth = 20;
const neckHeight = 30;
const shoulderHeight = 30;


var optionData;
var width;
var height;
var state;
var buttons;
var controls;
var capacity;


function initUI(data) {
    optionData = data;
    state = new Array(data.length);
    state.fill(0);

    width = 700;
    height = 1100;

    draw = SVG('svgCanvas').size(width, height);
    controls = draw.group();
    capacity = units;

    updateUI();
}

function updateSelection(selectionData) {
    console.log("C2 updateSelection");

    for (let i = 0; i < selectionData.length; i++) {
        // console.log("i:"+i+" selection:"+selectionData[i]+" state:"+state[i]);

        if (selectionData[i] > 0 && state[i] == 0) {
            state[i] = 1;
        } else if (selectionData[i] == 0 && state[i] > 0) {
            state[i] = 0;
        }
    }
    updateUI();

    let action = "UpdateRecipe";
    if (capacity == 0) {
        action = "FreezeOptions";
    }

    var message = {
        action: action,
        selection: state
    };
    window.parent.postMessage(message,"*");

}

function updateUI() {

    controls.remove();
    controls = draw.group();

    capacity = units;
    for (let i = 0; i < state.length; i++) {
        capacity -= state[i];
    }

    var yPos = 0;
    for (let i = 0; i < state.length; i++) {
        if (state[i] > 0) {

            let icon = controls.image(assets+optionData[i].image,iconSide,iconSide);
            icon.move(textRight,yPos*rowHeight);

            let text = controls.text(optionData[i].name).move(textRight,textTop + yPos*rowHeight);
            text.fill('Black');

            for (let j = 0; j < units; j++) {
                // rect = controls.rect(rowHeight, rowHeight);
                rect = controls.circle(diameter);
                rect.move(dotRight+j*dotGap,dotTop + yPos*rowHeight);
                rect.stroke({color: 'Black', width: 2})

                if (j < state[i]) {
                    rect.fill(optionData[i].color);
                    rect.click(function() {updateState(i,j+1)});
                } else if (j < state[i]+capacity){
                    rect.fill('White');
                    rect.click(function() {updateState(i,j+1)});
                } else {
                    rect.fill('LightGray');
                }
            }

            // let border = controls.rect((units*dotGap) + borderExtra, rowHeight);
            // border.fill('none');
            // border.stroke('Gray');
            // border.radius(5);
            // border.move(borderLeft,yPos*rowHeight+1);

            let separator = controls.line(borderLeft,(yPos+1)*rowHeight,borderLeft+ (units*dotGap) + borderExtra,(yPos+1)*rowHeight);
            separator.stroke({color:'Silver', width:1});

            const delRLeft = (units*dotGap) + 200;
            const delTLeft = (units*dotGap) + 206;
            const delRDown = 50;
            const delTDown = 51;
            const delWidth = 60;
            const delHeight = 20;

            // let delRect = controls.rect(delWidth, delHeight);
            // delRect.fill('Gray');
            // delRect.radius(5);
            // delRect.move(delRLeft,(yPos*rowHeight)+delRDown);
            let delText = controls.text("Remove");
            delText.fill('Gray');
            delText.font({'size':14});
            delText.move(delTLeft,(yPos*rowHeight)+delTDown);

            delText.click(function() {updateState(i,0)});

            yPos++;
        }

    }
    var level = 0;
    var element = yPos-1;
    // for (let i = 0; i < state.length; i++) {
    for (let i = state.length-1; i >= 0; i--) {

        if (state[i] > 0) {
            let rectHeight = state[i]*levelInc;
            rect = controls.rect(bottleWidth,rectHeight);
            rect.fill(optionData[i].color);
            rect.move(bottleLeft,bottleBottom-(rectHeight+level));

            // let lineLeft = bottleBottom-(rectHeight+level) + rectHeight/2;
            // let lineRight = element*rowHeight + rowHeight/2;
            // let line = controls.line(bottleRight, lineLeft, borderLeft, lineRight);
            // line.stroke({width:1, color:"Gray"});

            level += rectHeight;
            element--;
        }
    }

    let bottleMid = bottleLeft + (bottleWidth/2);

    let rimLeft = bottleMid - (rimWidth + (neckWidth/2));
    let neckLeft = bottleMid - (neckWidth/2);
    let rimRight = bottleMid + (rimWidth + (neckWidth/2));
    let neckRight = bottleMid + (neckWidth/2);

    let straightTop = bottleBottom-(units*levelInc);
    let shoulderTop = straightTop - shoulderHeight;
    let shoulderMid = straightTop - (shoulderHeight/2);
    let neckTop = shoulderTop - neckHeight;
    let rimTop = neckTop - rimHeight;

    let pathString = "";
    pathString += "M "+rimLeft+" "+rimTop+" ";
    pathString += "Q "+neckLeft+" "+rimTop+" "+neckLeft+" "+neckTop+" ";
    pathString += "L "+neckLeft+" "+shoulderTop+" ";
    pathString += "C "+neckLeft+" "+shoulderMid+" "+bottleLeft+" "+shoulderMid+" "+bottleLeft+" "+straightTop+" ";
    pathString += "L "+bottleLeft+" "+bottleBottom+" ";
    pathString += "L "+bottleRight+" "+bottleBottom+" ";
    pathString += "L "+bottleRight+" "+straightTop+" ";
    pathString += "C "+bottleRight+" "+shoulderMid+" "+neckRight+" "+shoulderMid+" "+neckRight+" "+shoulderTop+" ";
    pathString += "L "+neckRight+" "+neckTop+" ";
    pathString += "Q "+neckRight+" "+rimTop+" "+rimRight+" "+rimTop+" ";
    controls.path(pathString).fill('none').stroke({width:3, color:"Black"});

    controls.circle(10).move(rimLeft,rimTop - 20).fill('none').stroke({width:3, color:"Black"});
    controls.circle(15).move(neckRight-5,rimTop - 35).fill('none').stroke({width:3, color:"Black"});
    controls.circle(20).move(rimLeft,rimTop - 60).fill('none').stroke({width:3, color:"Black"});

    if (capacity == units) {
        const mixD = 40;
        const mixTX = 300;
        const mixTY = 100;
        const mixCX = mixTX+80;
        const mixCY = mixTY-12;
        const mixT2X = mixTX+85;
        const arrowSide = 60;
        const arrowsX = mixTX+28;
        const arrowsY = mixTY+32;

        let makeText = controls.text("Make your");
        makeText.move(mixTX, mixTY);
        let mixC = controls.circle(mixD).move(mixCX,mixCY);
        let mixText = controls.text("MIX").fill("White");
        mixText.move(mixT2X, mixTY);

        let arrows = controls.image(assets+arrowsFile,arrowSide, arrowSide);
        arrows.move(arrowsX, arrowsY);
    }

}

function updateState(i, j) {
    console.log("updateState i:"+i+" j:"+j);
    state[i] = j;
    updateUI();

    let action = "UpdateRecipe";
    if (capacity == 0) {
        action = "FreezeOptions";
    } else if (j == 0) {
        action = "RemoveIngredient";
    }

    var message = {
        action: action,
        selection: state
    };
    window.parent.postMessage(message,"*");
}
