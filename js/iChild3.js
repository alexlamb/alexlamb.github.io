window.onload = function() {
    initUI();
}

window.onmessage = (event) => {
  console.log("C3 message received from parent");
  if (event.data) {
    updateSelection(event.data.content);
  }
}

const units = 12;

var optionData;
var width;
var height;
var state;
var capacity;
var helpText;

function initUI() {
    optionData = flavorData;
    state = new Array(flavorData.length);
    state.fill(0);

    width = 500;
    height = 50;

    var svgNode = document.getElementById("svgCanvas");
    while (svgNode.firstChild) {
        svgNode.removeChild(svgNode.firstChild);
    }

    draw = SVG('svgCanvas').size(width, height);
    capacity = units;

    helpText = draw.text("");
    helpText.font({family:'Helvetica', size:25});
    updateUI();
}

function updateSelection(selectionData) {
    console.log("C3 updateSelection");

    state = selectionData;

    updateUI();
}

function updateUI() {

    capacity = units;
    for (let i = 0; i < state.length; i++) {
        capacity -= state[i];
    }

    let messge = 0;

    if (capacity == units) {
        helpText.text("");

    } else if (capacity > 0) {
            helpText.text("You have ");
            helpText.fill("#333333");
            helpText.build(true);
            helpText.tspan(""+capacity).fill('Green');
            if (capacity ==1 ) {
                helpText.tspan(" part left to add");
            } else {
                helpText.tspan(" parts left to add");
            }
            helpText.fill("#333333");
            helpText.build(false);

    } else {
        message = "Reduce flavors to change the balance"
        helpText.text(message);
        helpText.fill("#333333");
    }
}
