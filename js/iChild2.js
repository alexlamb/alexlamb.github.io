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
const units = 10;

var optionData;
var width;
var height;
var state;
var buttons;
var controls;
var capacity;
var helpText;


function initUI(data) {
    optionData = data;
    state = new Array(data.length);
    state.fill(0);

    width = 700;
    height = 1100;

    draw = SVG('svgCanvas').size(width, height);
    controls = draw.group();
    capacity = units;

    helpText = draw.text("Select flavors from the options above to make your mix");
    updateUI();
}

function updateSelection(selectionData) {
    console.log("C2 updateSelection");

    for (let i = 0; i < selectionData.length; i++) {
        // console.log("i:"+i+" selection:"+selectionData[i]+" state:"+state[i]);

        if (selectionData[i] > 0 && state[i] == 0) {
            state[i] = 2;
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

    const rowTop = 40;
    const textWidth = 100;
    const rowHeight = 80;
    const dotGap = 30;
    const diameter = 20;
    const sliderHeight = 14;
    const textLeft = 0;
    const dotLeft = 80;
    const dotTop = 28;
    const textTop = 60;
    const iconSide = 60;
    const borderLeft = 0;
    const borderExtra = 80;

    // const rimWidth = 5;
    // const rimHeight = 5;
    // const neckWidth = 20;
    // const neckHeight = 30;
    // const shoulderHeight = 30;

    controls.remove();
    controls = draw.group();

    capacity = units;
    for (let i = 0; i < state.length; i++) {
        capacity -= state[i];
    }

    let messge = 0;
    if (capacity > 0) {
        message = "You have "+capacity+" parts left to play with."
    } else {
        message = "Your bottle is full. You're ready to go!"
    }
    helpText.text(message);

    const bottleSide = 600;
    const bottleImLeft = 300;
    const bottleImTop = -45;
    const levelInc = 30;
    const bottleBottom = (units*levelInc) + 140;
    const bottleRectLeft = 470;
    const bottleWidth = 160;
    const iconMax = 120;
    // const bottleRight = bottleRectLeft + bottleWidth;

    var level = 0;
    var element = yPos-1;
    // for (let i = 0; i < state.lengh; i++) {
    for (let i = state.length-1; i >= 0; i--) {

        if (state[i] > 0) {
            let rectHeight = state[i]*levelInc;
            let rectTop = bottleBottom-(rectHeight+level);

            rect = controls.rect(bottleWidth,rectHeight);
            rect.fill(optionData[i].color);
            rect.move(bottleRectLeft,rectTop);

            level += rectHeight;
            element--;
        }
    }

    let bottle = controls.image(assets+"blank-bottle.png",500,500);
    bottle.move(bottleImLeft,bottleImTop);

    var level = 0;
    var element = yPos-1;
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
            labelText.fill("White");
            labelText.move(imLeft+adjust,imTop+(imSide/2)-10);

            level += rectHeight;
            element--;
        }
    }

    var yPos = 0;
    for (let i = 0; i < state.length; i++) {
        if (state[i] > 0) {

            let icon = controls.image(assets+optionData[i].image,iconSide,iconSide);
            icon.move(textLeft,yPos*rowHeight);

            let text = controls.text(optionData[i].name).move(textLeft, textTop + yPos*rowHeight);
            text.fill('Black');

            for (let j = 0; j < units; j++) {

                let rect;
                if (j == state[i] - 1) {
                    // rect = controls.rect(rowHeight, rowHeight);
                    rect = controls.circle(diameter);
                    // rect.stroke({color: 'Black', width: 2})

                    let rectLeft = dotLeft+j*dotGap;
                    let rectTop = dotTop + yPos*rowHeight;
                    let dotXAdjust = (dotGap - diameter)/2;
                    let dotYAdjust = -(diameter - sliderHeight)/2;

                    rect.move(rectLeft + dotXAdjust,rectTop + dotYAdjust);
                } else {
                    rect = controls.rect(dotGap,sliderHeight);
                    rect.move(dotLeft+j*dotGap,dotTop + yPos*rowHeight);
                }

                if (j < state[i]) {
                    rect.fill(optionData[i].color);
                    rect.click(function() {updateState(i,j+1)});
                    rect.style('cursor', 'pointer');
                } else if (j < state[i]+capacity){
                    rect.fill('LightGray');
                    rect.click(function() {updateState(i,j+1)});
                    rect.style('cursor', 'pointer');
                } else {
                    rect.fill('DimGray');
                }
            }

            // let border = controls.rect((units*dotGap) + borderExtra, rowHeight);
            // border.fill('none');
            // border.stroke('Gray');
            // border.radius(5);
            // border.move(borderLeft,yPos*rowHeight+1);

            let separator = controls.line(
                borderLeft,
                (yPos+1)*rowHeight,
                borderLeft + (units*dotGap) + borderExtra,
                (yPos+1)*rowHeight);
            separator.stroke({color:'Silver', width:1});

            const delRLeft = (units*dotGap) + 24;
            const delTLeft = (units*dotGap) + 30;
            const delRDown = 50;
            const delTDown = 51;
            const delWidth = 60;
            const delHeight = 20;
            const partsTLeft = (units*dotGap) + 28;
            const partsTDown = 4;

            // let delRect = controls.rect(delWidth, delHeight);
            // delRect.fill('Gray');
            // delRect.radius(5);
            // delRect.move(delRLeft,(yPos*rowHeight)+delRDown);
            let delText = controls.text("Remove");
            delText.fill('Gray');
            delText.font({'size':14});
            delText.move(delTLeft,(yPos*rowHeight)+delTDown);

            delText.click(function() {updateState(i,0)});
            delText.style('cursor', 'pointer');

            let partString = " part";
            if (state[i]>1) partString += "s";
            let partsText = controls.text(state[i]+partString);
            partsText.fill('DimGray');
            partsText.font({'size':16});
            partsText.move(partsTLeft,(yPos*rowHeight)+partsTDown);

            yPos++;
        }
    }



    // let bottleMid = bottleLeft + (bottleWidth/2);
    //
    // let rimLeft = bottleMid - (rimWidth + (neckWidth/2));
    // let neckLeft = bottleMid - (neckWidth/2);
    // let rimRight = bottleMid + (rimWidth + (neckWidth/2));
    // let neckRight = bottleMid + (neckWidth/2);
    //
    // let straightTop = bottleBottom-(units*levelInc);
    // let shoulderTop = straightTop - shoulderHeight;
    // let shoulderMid = straightTop - (shoulderHeight/2);
    // let neckTop = shoulderTop - neckHeight;
    // let rimTop = neckTop - rimHeight;
    //
    // let pathString = "";
    // pathString += "M "+rimLeft+" "+rimTop+" ";
    // pathString += "Q "+neckLeft+" "+rimTop+" "+neckLeft+" "+neckTop+" ";
    // pathString += "L "+neckLeft+" "+shoulderTop+" ";
    // pathString += "C "+neckLeft+" "+shoulderMid+" "+bottleLeft+" "+shoulderMid+" "+bottleLeft+" "+straightTop+" ";
    // pathString += "L "+bottleLeft+" "+bottleBottom+" ";
    // pathString += "L "+bottleRight+" "+bottleBottom+" ";
    // pathString += "L "+bottleRight+" "+straightTop+" ";
    // pathString += "C "+bottleRight+" "+shoulderMid+" "+neckRight+" "+shoulderMid+" "+neckRight+" "+shoulderTop+" ";
    // pathString += "L "+neckRight+" "+neckTop+" ";
    // pathString += "Q "+neckRight+" "+rimTop+" "+rimRight+" "+rimTop+" ";
    // controls.path(pathString).fill('none').stroke({width:3, color:"Black"});
    //
    // controls.circle(10).move(rimLeft,rimTop - 20).fill('none').stroke({width:3, color:"Black"});
    // controls.circle(15).move(neckRight-5,rimTop - 35).fill('none').stroke({width:3, color:"Black"});
    // controls.circle(20).move(rimLeft,rimTop - 60).fill('none').stroke({width:3, color:"Black"});

    // if (capacity == units) {
    //     const mixD = 40;
    //     const mixTX = 300;
    //     const mixTY = 100;
    //     const mixCX = mixTX+80;
    //     const mixCY = mixTY-12;
    //     const mixT2X = mixTX+85;
    //     const arrowSide = 60;
    //     const arrowsX = mixTX+28;
    //     const arrowsY = mixTY+32;
    //
    //     let makeText = controls.text("Make your");
    //     makeText.move(mixTX, mixTY);
    //     let mixC = controls.circle(mixD).move(mixCX,mixCY);
    //     let mixText = controls.text("MIX").fill("White");
    //     mixText.move(mixT2X, mixTY);
    //
    //     let arrows = controls.image(assets+arrowsFile,arrowSide, arrowSide);
    //     arrows.move(arrowsX, arrowsY);
    // }
    controls.move(0,rowTop);
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
