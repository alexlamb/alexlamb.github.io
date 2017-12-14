
window.onload = function() {
    console.log("onload");
	let div = document.getElementById('check');
	div.innerHTML += " Onload triggered.";
    div.innerHTML += dullData;

    console.log("drawing");
    draw = SVG('svgCanvas').size(50,50);
    draw.rect(50,50).fill("#987654");
};

window.onmessage = (event) => {
    console.log("onmessage");
	let div = document.getElementById('check');
	div.innerHTML += " Onmessage triggered.";
    console.log("redrawing");
    draw.rect(50,50).fill("#456789");
};

function button_click() {
    window.parent.postMessage("So dull", "*");
}
