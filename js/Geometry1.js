const width = 600;
const height = 600;

const radius = 5;
const nodeCount = 1000;

const anim = 50;

var draw = SVG('svgCanvas').size(width, height);

var nodeList = [];
var slider1 = document.getElementById("range1");
var slider2 = document.getElementById("range2");
var slider3 = document.getElementById("range3");
var slider4 = document.getElementById("range4");
var slider5 = document.getElementById("range5");
var v1 = slider1.value;
var v2 = slider2.value;
var v3 = slider3.value;
var v4 = slider4.value;
var v5 = slider5.value;
initNodeList();

slider1.oninput = function() {
    v1 = this.value;
    updateNodeList();
}

slider2.oninput = function() {
    v2 = this.value;
    updateNodeList();
}

slider3.oninput = function() {
    v3 = this.value;
    updateNodeList();
}

slider4.oninput = function() {
    v4 = this.value;
    updateNodeList();
}

slider5.oninput = function() {
    v5 = this.value;
    updateNodeList();
}

function initNodeList() {
    for (var i = 0; i < nodeCount; i++) {

        let agent = draw.circle(radius*2, radius*2);
        agent.fill('Black');

        nodeList.push(agent);
    }
    updateNodeList();
}

function updateNodeList() {
    for (var i = 0; i < nodeCount; i++) {

        let agent = nodeList[i];

        let angle = v1 * i * Math.PI / 360;
        let dist = i * 1;
        let x = (width / 2) + (Math.cos(angle) * dist);
        let y = (height / 2) + (Math.sin(angle) * dist);

        let blockStrength = v3/100;

        //Distance from center
        let dx = x - width/2; 
        let dy = y - height/2;
        let ax = Math.abs(dx); 
        let ay = Math.abs(dy); 
        //Sign of distance from center
        let sx = 1;
        let sy = 1;
        if (ax != 0) sx = dx/ax;
        if (ay != 0) sy = dy/ay;

        //Distance from the modulo point
        mx = ax % v2;
        my = ay % v2;
        //Offset distance from modulo point
        ox = mx - (v2/2);
        oy = my - (v2/2);
        //Offset multiplied by blocking strength
        bx = -ox * blockStrength * sx;
        by = -oy * blockStrength * sy;

        x += bx;
        y += by;

        agent.cx(x);
        agent.cy(y);

        let h = Math.floor(v4 * i * 360 / 500);
        agent.fill('hsl('+h+',100%,50%)');

        let rad = 8 + 8 * Math.sin(v5 * i * Math.PI/ 500);
        agent.radius(rad);

    }
}


