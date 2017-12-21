window.onload = function() {
    initUI();
}

window.onmessage = (event) => {
  console.log("C4 message received from parent");
  if (event.data) {
    updateSelection(event.data.content);
  }
}

const assets = "assets/"
const units = 12;

var optionData;
var width;
var height;
var state;
var controls;
var capacity;
var selected;

function initUI() {
    optionData = flavorData;
    state = new Array(flavorData.length);
    state.fill(0);

    width = 300;
    height = 800;

    var svgNode = document.getElementById("svgCanvas");
    while (svgNode.firstChild) {
        svgNode.removeChild(svgNode.firstChild);
    }

    draw = SVG('svgCanvas').size(width, height);
    controls = draw.group();
    capacity = units;

    updateUI();
}

function updateSelection(selectionData) {
    console.log("C4 updateSelection");

    state = selectionData;

    updateUI();
}

function updateUI() {

    controls.remove();
    controls = draw.group();

    capacity = units;
    selected = 0;
    for (let i = 0; i < state.length; i++) {
        capacity -= state[i];
        if (state[i] > 0) selected++;
    }

    const rowTop = 0;//60;
    const bottleSide = 600;
    const bottleImLeft = -125;//0;//580;
    const bottleImTop = -45+60;
    const levelInc = 32;
    const bottleBottom = (units*levelInc) + 98+60;
    const bottleRectLeft = 766-580-125;
    const bottleWidth = 178;
    const iconMax = 160;
    // const bottleRight = bottleRectLeft + bottleWidth;

    bottleBack = controls.rect(450,550);
    bottleBack.fill('#F7F7F7');
    bottleBack.move(bottleImLeft+100,bottleImTop);

    var level = 0;
    // var element = selected;
    // for (let i = 0; i < state.lengh; i++) {
    for (let i = state.length-1; i >= 0; i--) {

        if (state[i] > 0) {
            let rectHeight = state[i]*levelInc;
            let rectTop = bottleBottom-(rectHeight+level);

            rect = controls.rect(bottleWidth,rectHeight-2);
            // rect.fill('#ECF2F9');
            rect.fill('#DCE2F9');
            rect.move(bottleRectLeft,rectTop);

            level += rectHeight;
            // element--;
        }
    }

    let bottle = controls.image(assets+"border-bottle.png",550,550);
    bottle.move(bottleImLeft,bottleImTop);

    var level = 0;
    // var element = selected;
    for (let i = state.length-1; i >= 0; i--) {

        if (state[i] > 0) {
            let rectHeight = state[i]*levelInc;
            let rectTop = bottleBottom-(rectHeight+level);

            let imSide = Math.min(iconMax, rectHeight);
            let imLeft = bottleRectLeft + (bottleWidth-imSide)/2;
            let imTop = rectTop + (rectHeight - imSide)/2;
            let im = controls.image(assets+optionData[i].image,imSide,imSide);
            im.move(imLeft, imTop);

            let labelText = controls.text(optionData[i].name);
            let length = labelText.length();
            let adjust = (imSide - length)/2;
            labelText.font({family:'Helvetica',size:20})
            labelText.fill("Gray");
            labelText.move(imLeft+adjust+1,1+imTop+(imSide/2)-10);

            let labelText2 = controls.text(optionData[i].name);
            labelText2.font({family:'Helvetica',size:20})
            labelText2.fill("White");
            labelText2.move(imLeft+adjust,imTop+(imSide/2)-10);

            level += rectHeight;
            // element--;
        }
    }
    // controls.move(0,rowTop);

}
