---
published: true
---
Here's something interesting. 

<canvas id="canvasWealthEntropyBasic" width="500" height="200">
 Your browser does not support the HTML 5 Canvas.
</canvas>
<script>
function simWealthEntropyBasic() {

	//SIM WRAPPER CONFIG =====================
	var state = 0;
	var timer;
	var canvas = document.getElementById('canvasWealthEntropyBasic');
	var context = canvas.getContext('2d');
	canvas.addEventListener('click', updateState, false);

	function updateState() {
		state = (state+1)%3;
		if (state == 0) {
			//Reset sim
			init();
		} else if (state == 1) {
			//Run sim
			timer = setInterval(update, 33);
		} else {
			//Stop sim
			clearInterval(timer);
		}
	}
	//=====================
	//SIM CODE =====================

	var agentList;
	var agentCount = 500;
	var wealthInit = 1000;
	var exchangesPerUpdate = 100;
	var maxExchange = 100;
	var gini = 0;
	var fit = 0;

	function init() {
		agentList = new Array();

		//Create agents
		for (var i = 0; i < agentCount; i++) {
			var agent = {
				wealth:(Math.random() * wealthInit * 2),
				color:"#000000",
				rank:0
			}
			agentList.push(agent);
		}

		//Sort agents
		agentList.sort(function (a,b) {
			return a.wealth - b.wealth;
		});

		//Set color for agents based on wealth
		for (var i = 0; i < agentCount; i++) {
			var agent = agentList[i];
			// var colorVal = Math.floor(((i) * 255.0) / agentCount);
			// agent.color = "rgb("+colorVal+",0,0)"

			// var colorVal = Math.random() * 360;
			// agent.color = "hsl("+colorVal+", 100%, 50%)"

			var hueVal = Math.random() * 360;
			var brightVal = 10+Math.floor(i*70/agentCount);
			agent.color = "hsl("+hueVal+", 100%, "+brightVal+"%)"

			agent.rank = i;
		}

		//Calculate wealth ineuality
		gini = calculateGini();

		//Calculate predictive power of measure
		fit = calculateFit();

		paint();
	}

	function update() {

		//Make wealth transfers
		for (var i = 0; i < exchangesPerUpdate; i++) {
			var exchangeAmount = Math.random() * maxExchange;

			var indexA = Math.floor(Math.random() * agentCount);
			var indexB = Math.floor(Math.random() * agentCount);
			var agentA = agentList[indexA];
			var agentB = agentList[indexB];

			if (agentA.wealth >= exchangeAmount) {
				agentB.wealth += exchangeAmount;
				agentA.wealth -= exchangeAmount;
			}
		}

		//Sort array by wealth
		agentList.sort(function (a,b) {
			return a.wealth - b.wealth;
		});

		//Calculate wealth inequality
		gini = calculateGini();

		//Calculate predictive power of measure
		fit = calculateFit();

		paint();
	}

	function calculateGini() {

		//Find total wealth
		var totalWealth = 0;
		for (var i = 0; i < agentCount; i++) {
			totalWealth += agentList[i].wealth;
		}

		//Find average wealth
		var meanWealth = totalWealth / agentCount;

		//Calculate mean difference from the average
		var totalDiff = 0;
		for (var i = 0; i < agentCount; i++) {
			totalDiff += Math.abs(meanWealth - agentList[i].wealth);
		}

		//Calculate GINI
		var inequality = totalDiff / (2 * totalWealth);

		return inequality;
	}

	function calculateFit() {

		var totalDiff = 0;
		for (var i = 0; i < agentCount; i++) {

			//Calculate distance from ideal for each agent
			var diff = Math.abs(i - agentList[i].rank);

			//Sum differences from ideal
			totalDiff += diff;
		}

		//Find mean difference
		var meanDiff = totalDiff / agentCount;
		var scaledMean = meanDiff / agentCount;

		var fit = 1 - (2 * scaledMean);
		return fit;
	}


	function paint() {
		//Paint background
		context.fillStyle = '#999999';
		context.fillRect(0, 0, canvas.width, canvas.height);

		//Find the maximum bar height
		var maxHeight = agentList[agentCount-1].wealth;

		//Determine scaling for bars
		var scaleHeight = canvas.height/maxHeight;
		var barWidth = canvas.width/agentCount;

		//Iterate over agents
		for (var i = 0; i < agentCount; i++) {
			var width = Math.floor(barWidth);
			// var height = Math.floor(agentList[i].wealth*scaleHeight);
			var height = Math.floor(agentList[i].wealth*scaleHeight);
			var x = Math.floor(i * barWidth);
			var y = canvas.height - height;

			//Display bar for each agent
			context.fillStyle = agentList[i].color;
			context.fillRect(x, y, width, height);
		}

		//Display GINI
		context.fillStyle = '#FFFFFF';
		context.font = '20px Arial';
		context.fillText("GINI: "+gini.toPrecision(2), 10, 30);

		//Display fit
		context.fillStyle = '#000000';
		context.fillText("Start Fit: "+fit.toPrecision(2), 10, 50);

	}

	init();
	//=====================
}
simWealthEntropyBasic();
</script>

And here's some text to follow.
