window.onload = function() {
	let div = document.getElementById('check');
	div.innerHTML += " Onload triggered.";
    div.innerHTML += dullData;

    draw = SVG('svgCanvas').size(50,50);
    draw.rect(50,50).fill("#987654");
};

window.onmessage = (event) => {
	let div = document.getElementById('check');
	div.innerHTML += " Onmessage triggered.";
};

function button_click() {
    window.parent.postMessage("So dull", "*");
}
