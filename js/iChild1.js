window.onload = function() {
  window.onmessage = (event) => {
    console.log("message received from parent");
    if (event.data) {
      console.log(JSON.stringify(event));
      console.log(JSON.stringify(event.data));

      if (event.data.action === "Init") {
          initUI(event.data.content);
      } else if (event.data.action === "Freeze") {
          frozen = true;
          toggleFrozen();
      } else if (event.data.action === "Unfreeze") {
          frozen = false;
          toggleFrozen();
      } else if (event.data.action === "Remove") {
          removeIngredient(event.data.content);
      }
    }
  }
}

const assets = "assets/"
const width = 800;
const height = 130;
const optionsWidth = width - 100;
const optionOffset = 50;
const itemsPerPage = 7;
const itemWidth = 100;

var optionButtons = [];
var optionBorders = [];
var optionRects = [];
var buttons;
var state;
var buttonData;
var frozen = false;
var shift = 0;
var pages = 1;
var page = 0;

var leftChevron;
var rightChevron;

function initUI(data) {
    buttonData = data;
    state = new Array(data.length);
    state.fill(0);

    pages = Math.floor((data.length * itemWidth) / optionsWidth);
    console.log("pages:"+pages);

    frozen = false;

    var buttonBox = itemWidth;
    var buttonSide = buttonBox * 3 / 4;
    var buttonRim = (buttonBox - buttonSide) / 2;
    var borderSide = buttonBox * 5 / 6;
    var borderRim = (buttonBox - borderSide) / 2;

    draw = SVG('svgCanvas').size(width, height);
    buttons = draw.group();
    edges = draw.group();

    for (let i = 0; i < data.length; i++) {
        var item = data[i];

        let optionRect = buttons.rect(borderSide,borderSide).fill('none').opacity(0.2);
        optionRect.move(borderRim+(optionOffset+i*itemWidth),borderRim);
        optionRects.push(optionRect);

        let optionButton = buttons.image(assets+data[i].image,buttonSide,buttonSide);
        optionButtons.push(optionButton);
        optionButton.move(buttonRim+(optionOffset+i*itemWidth),buttonRim);

        optionButton.style('cursor', 'pointer');
        optionButton.click(function() {selectOption(i)});
        optionButton.mouseover(function() {highlightOption(i)});
        optionButton.mouseout(function() {fadeOption(i)});

        let optionBorder = buttons.rect(borderSide,borderSide);
        optionBorders.push(optionBorder);
        optionBorder.fill('none').stroke({color: 'Silver', width: 2});
        optionBorder.move(borderRim+(optionOffset+i*itemWidth),borderRim);
        optionBorder.radius(5);

        let optionText = buttons.text(data[i].name);
        let length = optionText.length();
        let adjust = (borderSide - length)/2;
        optionText.move(borderRim+(optionOffset+i*itemWidth)+adjust,borderRim+borderSide+10);
        optionText.fill('Black');
    }

    leftEdge = edges.rect(optionOffset, height);
    leftEdge.fill('Silver');
    leftEdge.click(function() {pageLeft()});

    rightEdge = edges.rect(optionOffset, height).move(width-(optionOffset+5),0);
    rightEdge.fill('Silver');
    rightEdge.click(function() {pageRight()});

    rimX = edges.rect(width,height);
    rimX.fill('none').stroke('Silver');

    const chevronL = optionOffset/2 - 15;
    const chevronR = optionOffset/2 + 15;
    const chevronT = height/2 - 25;
    const chevronB = height/2 + 25;

    let leftPathString = "M "+chevronR+" "+chevronT+" ";
    leftPathString += "L "+chevronL+" "+(height/2)+" ";
    leftPathString += "L "+chevronR+" "+chevronB+" ";
    leftChevron = edges.path(leftPathString);
    leftChevron.fill('none').stroke({width:3, color:'Gray'});

    let rightPathString = "M "+chevronL+" "+chevronT+" ";
    rightPathString += "L "+chevronR+" "+(height/2)+" ";
    rightPathString += "L "+chevronL+" "+chevronB+" ";
    rightChevron = edges.path(rightPathString);
    rightChevron.fill('none').stroke({width:3, color:'Gray'});
    rightChevron.dmove(width-(optionOffset+5),0);

    // updateChevrons();
}

function highlightOption(i) {
    console.log("highlight:"+i);
    if (!frozen) {
        optionRects[i].animate(5).fill(buttonData[i].color);
    }
}

function fadeOption(i) {
    if (!frozen) {
        optionRects[i].animate(5).fill('none');
    }
}

function pageLeft() {
    if (page > 0) {
        page--;
        buttons.animate(250).dmove(itemWidth*itemsPerPage,0);
        // updateChevrons();
    } else {
        page = pages - 1;
        buttons.dmove(-itemWidth*itemsPerPage*pages,0);
        buttons.animate(250).dmove(itemWidth*itemsPerPage,0);
    }
    console.log("page:"+page+" shift:"+buttons.x());
}

function pageRight() {
    if (page < pages-1) {
        page++;
        buttons.animate(250).dmove(-itemWidth*itemsPerPage,0);
        // updateChevrons();
    } else {
        page = 0;
        buttons.dmove(itemWidth*itemsPerPage*pages,0);
        buttons.animate(250).dmove(-itemWidth*itemsPerPage,0);
    }
    console.log("page:"+page+" shift:"+buttons.x());
}

// function updateChevrons() {
//     console.log("page:"+page+" pages:"+pages);
//     if (page == 0) {
//         leftChevron.stroke('none');
//     } else {
//         leftChevron.stroke('Gray');
//     }
//     if (page == pages - 1) {
//         rightChevron.stroke('none');
//     } else {
//         rightChevron.stroke('Gray');
//     }
// }

function toggleFrozen() {
    console.log("toggleFrozen");

    for (let i = 0; i < state.length; i++) {
        if (state[i] == 0) {
            if (frozen) {
                // optionBorders[i].stroke('DimGray');
                optionRects[i].fill('DimGray');
            } else {
                // optionBorders[i].stroke('Silver');
                optionRects[i].fill('none');
            }
        }
    }
}

function selectOption(i) {

    let sendMessage = false;

    console.log("selectOption:"+i);
    if (state[i] == 0 && !frozen) {
        optionBorders[i].stroke(buttonData[i].color);
        state[i] = 1;
        sendMessage = true;

    } else if (state[i] > 0) {
        optionBorders[i].stroke('Silver');
        console.log("Unfreezing");
        state[i] = 0;
        frozen = false;
        toggleFrozen();
        sendMessage = true;
    }

    if (sendMessage) {
        var message = {
            action: "UpdateSelection",
            selection: state
        };
        window.parent.postMessage(message,"*");
    }
}

function removeIngredient(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i] == 0 && state[i] > 0) {

            optionBorders[i].stroke('none');
            console.log("Unfreezing");
            state[i] = 0;
            frozen = false;
            toggleFrozen();
        }
    }
}
