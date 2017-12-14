window.onload = function() {
	let div = document.getElementById('svgCanvas');
	div.innerHTML += " Onload triggered.";
    div.innerHTML += dullData;
};

window.onmessage = (event) => {
	let div = document.getElementById('svgCanvas');
	div.innerHTML += " Onmessage triggered.";
};

function button_click() {
    window.parent.postMessage("So dull", "*");
}
