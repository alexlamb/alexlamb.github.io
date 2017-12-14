var divEl = document.getElementById('testdiv');
divEl.innerHTML = "Onload not required";
divEl.style.color = 'red';

window.onmessage = (event) => {
  divEl = document.getElementById('testdiv');
  divEl.innerHTML = "messages arriving";
  divEl.style.color = 'green';
};

window.onload = function() {
  
  var divEl = document.getElementById('testdiv');
  divEl.innerHTML = "Onload happened";
  divEl.style.color = 'blue';
  
  window.onmessage = (event) => {
    console.log("C1 message received from parent");
    if (event.data) {
      // console.log(JSON.stringify(event));
      // console.log(JSON.stringify(event.data));

      if (event.data.action === "Init") {
          initUI(event.data.content);
      } else if (event.data.action === "Freeze") {
          console.log("C1 Freeze request");
          setFrozen(true);
      } else if (event.data.action === "Unfreeze") {
          console.log("C1 Unfreeze request");
          setFrozen(false);
      } else if (event.data.action === "Remove") {
          removeIngredient(event.data.content);
      }
    }
  }
}

const assets = "https://alexlamb.github.io/js/assets/"
// const assets = "assets/"
const leftChev = "chevron-left.png";
const rightChev = "chevron-right.png";
const width = 1000;
const height = 130;
const optionsWidth = width - 100;
const optionOffset = 45;
const itemsPerPage = 6;
const itemWidth = 150;
const itemHeight = 100;

var optionButtons = [];
var optionBorders = [];
var optionRects = [];
var optionShades = [];
var buttons;
var state;
var buttonData;
var frozen = false;
var shift = 0;
var pages = 1;
var page = 0;
// var selected = 0;

var leftChevron;
var rightChevron;

function initUI(data) {
    buttonData = data;
    state = new Array(data.length);
    state.fill(0);

    pages = Math.floor((data.length * itemWidth) / optionsWidth);
    console.log("C1 pages:"+pages);

    frozen = false;

    var buttonSideW = itemWidth * 3 / 4;
    var buttonSideH = itemHeight * 3 / 4;
    var buttonRimW = (itemWidth - buttonSideW) / 2;
    var buttonRimH = (itemHeight - buttonSideH) / 2;
    var borderSideW = itemWidth * 5 / 6;
    var borderSideH = itemHeight * 5 / 6;
    var borderRimW = (itemWidth - borderSideW) / 2;
    var borderRimH = (itemHeight - borderSideH) / 2;

    var svgNode = document.getElementById("svgCanvas");
    while (svgNode.firstChild) {
        svgNode.removeChild(svgNode.firstChild);
    }

    draw = SVG('svgCanvas').size(width, height);
    draw.rect(width, height).fill("#F0F0F0");
    buttons = draw.group();
    edges = draw.group();

    for (let i = 0; i < data.length; i++) {
        var item = data[i];

        let optionRect = buttons.rect(borderSideW,borderSideH).fill('none');
        optionRect.move(borderRimW+(optionOffset+i*itemWidth),borderRimH);
        optionRect.radius(15);
        optionRects.push(optionRect);

        let optionShade = buttons.rect(borderSideW,borderSideH).fill('none');
        optionShade.move(borderRimW+(optionOffset+i*itemWidth),borderRimH);
        optionShade.radius(15);
        optionShades.push(optionShade);

        let optionButton = buttons.image(assets+data[i].image,buttonSideW,buttonSideH);
        optionButtons.push(optionButton);
        optionButton.move(buttonRimW+(optionOffset+i*itemWidth),buttonRimH);

        optionButton.style('cursor', 'pointer');
        optionButton.click(function() {selectOption(i)});
        optionButton.mouseover(function() {highlightOption(i)});
        optionButton.mouseout(function() {fadeOption(i)});

        let optionBorder = buttons.rect(borderSideW,borderSideH);
        optionBorders.push(optionBorder);
        optionBorder.fill('none').stroke({color: 'Silver', width: 1});
        optionBorder.move(borderRimW+(optionOffset+i*itemWidth),borderRimH);
        optionBorder.radius(15);

        let optionText = buttons.text(data[i].name);
        let length = optionText.length();
        let adjust = (borderSideW - length)/2;
        optionText.move(borderRimW+(optionOffset+i*itemWidth)+adjust,borderRimH+borderSideH+10);
        optionText.fill('Black');
    }

    leftEdge = edges.rect(optionOffset, height);
    leftEdge.fill('#F0F0F0');
    leftEdge.click(function() {pageLeft()});
    // leftIm = edges.image(assets+leftChev,optionOffset, height);
    // leftIm.click(function() {pageLeft()});

    rightEdge = edges.rect(optionOffset, height).move(width-(optionOffset),0);
    rightEdge.fill('#F0F0F0');
    rightEdge.click(function() {pageRight()});

    // rimX = edges.rect(width,height);
    // rimX.fill('none').stroke('Silver');

    const chevronL = optionOffset/2 - 10;
    const chevronR = optionOffset/2 + 10;
    const chevronT = height/2 - 18;
    const chevronB = height/2 + 18;

    let leftPathString = "M "+chevronR+" "+chevronT+" ";
    leftPathString += "L "+chevronL+" "+(height/2)+" ";
    leftPathString += "L "+chevronR+" "+chevronB+" ";
    leftChevron = edges.path(leftPathString);
    let chevStroke = {
        width:4,
        color:'Gray',
        linecap:'round'
    };

    leftChevron.fill('none').stroke(chevStroke);

    let rightPathString = "M "+chevronL+" "+chevronT+" ";
    rightPathString += "L "+chevronR+" "+(height/2)+" ";
    rightPathString += "L "+chevronL+" "+chevronB+" ";
    rightChevron = edges.path(rightPathString);
    rightChevron.fill('none').stroke(chevStroke);
    rightChevron.dmove(width-(optionOffset+5),0);

    // updateChevrons();
}

function highlightOption(i) {
    console.log("C1 highlight:"+i);
    if (!frozen || state[i] > 0) {
        optionShades[i].animate(5).fill('White');
    }
}

function fadeOption(i) {
    console.log("C1 fade:"+i+" frozen:"+frozen+" state:"+state[i]+" func:"+(!frozen || state[i] > 1));
    if (!frozen || state[i] > 0) {
        console.log("C1 fading");
        optionShades[i].animate(5).fill('none');
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
    console.log("C1 page:"+page+" shift:"+buttons.x());
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
    console.log("C1 page:"+page+" shift:"+buttons.x());
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

function setFrozen(value) {
    console.log("C1 setFrozen");
    frozen = value;

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

    console.log("C1 selectOption:"+i);
    // if (state[i] == 0 && !frozen && selected < 5) {
    if (state[i] == 0 && !frozen) {
        optionBorders[i].stroke({color:'#52009A', width:2});
        optionRects[i].fill('#BAB6CA');
        state[i] = 1;
        sendMessage = true;
        // selected++;
        // if (selected >= 5) {
        //     setFrozen(true);
        // }

    // } else if (state[i] > 0 && selected < 5) {
    } else if (state[i] > 0) {
        optionBorders[i].stroke({color:'Silver', width:1});
        console.log("C1 Unfreezing");
        state[i] = 0;
        setFrozen(false);
        sendMessage = true;
        // selected--;
    }

    if (sendMessage) {
        var message = {
            action: "UpdateSelection",
            selection: state
        };
        window.parent.postMessage(message,"*");
    }
    // console.log("Selected:"+selected);
}

function removeIngredient(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i] == 0 && state[i] > 0) {

            optionBorders[i].stroke('none');
            console.log("C1 Unfreezing");
            state[i] = 0;
            setFrozen(false);
        }
    }
}
