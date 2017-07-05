---
published: true
---
In the last post, I showed you a very simple simulation that seems to reproduce, at least to first approximation, the kind of wealth distribution that show up in real economies. To do this, all we had to do was give a bunch of agents some money and let them hand it around at random. Magic! 

And we raised the following question: *if this model reflects the real world so well, why should be believe that rich people are anything but plain lucky?* But we left on a cliffhanger. We didn't even try to look at what would happen if some of the agents were somehow more deserving of wealth than others. So let's try to fix that and see what happens. 

Let's tweak the simulation we used last time. First, let's give all our agents a special attribute we'll call *talent*. We'll color them brighter shades of gold based on how much talent they have. It's crude, I know, but we're trying to keep the simulation as simple as possible. 

Then we'll extend our model so that for each transaction, instead of one agent just handing money to another, there's a choice. Each donor agent (let's call him A) picks two partners at random: B and C. He then chooses at random based on how talented B is compared to C, and gives his money to the winner. This doesn't mean that the most talented agent will always be selected. But if B has a talent of 4/10 and C has talent of 6/10, then B is going to receive money over C 40% of the time. 

Let's also change our fit metric to reflect our new experiment. Last time, we looked to see whether agents had moved from their initial position on the social ladder. This time, let's look at each agent's distance from the ideal position they'd have if everyone were ordered perfectly by talent. 

What happens? Click the sim to find out.

<canvas id="canvasWealthEntropyTalent" width="500" height="200">
 Your browser does not support the HTML 5 Canvas.
</canvas>
<script>
function simWealthEntropyTalent() {

  //SIM WRAPPER CONFIG =====================
  var state = 0;
  var timer;
  var canvas = document.getElementById('canvasWealthEntropyTalent');
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
        talent:Math.random(),
        color:"#000000",
        rank: 0
      }
      agentList.push(agent);
    }

    //Sort agents by talent
    agentList.sort(function (a,b) {
      return a.talent - b.talent;
    });

    //Set color for agents based on talent
    for (var i = 0; i < agentCount; i++) {
      var agent = agentList[i];
      var redVal = Math.floor(agent.talent * 255.0);
      var greenVal = Math.floor(agent.talent * 255.0 * 0.9);
      agent.color = "rgb("+redVal+","+greenVal+",0)"
      agent.rank = i;
    }

    //Sort agents by wealth
    agentList.sort(function (a,b) {
      return a.wealth - b.wealth;
    });

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
      var indexC = Math.floor(Math.random() * agentCount);
      var agentA = agentList[indexA];
      var agentB = agentList[indexB];
      var agentC = agentList[indexC];

      //If A can pay
      if (agentA.wealth >= exchangeAmount) {
        agentA.wealth -= exchangeAmount;

        //We pay the supplier with the most talent
        var talentSum = agentB.talent + agentC.talent;
        var fractionTalentB = agentB.talent/talentSum;

        if (Math.random() < fractionTalentB) {
          agentB.wealth += exchangeAmount;
        } else {
          agentC.wealth += exchangeAmount;
        }
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

    //Display Fit
    context.fillStyle = '#FFEE00';
    context.fillText("Talent Fit: "+fit.toPrecision(2), 10, 50);

  }

  init();
  //=====================
}
simWealthEntropyTalent();
</script>

At this point, our imaginary Conservative speaks up. Let's call her Ayn. 

"Look, see?" she says. "Talent rises to the top, just like you'd expect. The distribution is not that different to what it was before, but now those who work harder or who have more innate excellence are being appropriately rewarded. This is what you'd hope to see in the data from a modern market-driven economy."

At this point, it's probably appropriate to introduce a Progressive voice. Let's call him Karl.

"The first thing to note," says Karl, "is that this society is less equal than the random one we started out with. Just look at the GINI coefficient." 

"What's wrong with that?" says Ayn.

"For starters, many of your population with at least some talent are doing less well than they were before we changed the model."

"So what?" says Ayn. "At least society is reflecting the value that's put into it. That's a better outcome."

"Only for those at the top," Karl points out. "Besides, this *isn't* what happens in real life. In life, the money you can make is largely determined by how much you started out with. If we wanted to build an accurate model of society, we'd do that."

So lets try Karl's idea. This time, instead of A deciding who receives cash based on their talent, let's have him decide based on how much money B and C already have. We can imagine that an agent's money pile reflects the size of their marketing budget, perhaps, or their reputation for success. 

This time, we'll color the agents green for wealth. This means that at first, you can't see the individual agents, because they're all arranged in order of their bank balance. However, that won't last long once money starts changing hands. 

We'll reset our fit metric back to the way it was initially so that it measures the change in an agent's wealth from their initial position. If where you start off in life is a good measure of where you end up, that number should stay high. 

<canvas id="canvasWealthEntropyMoney" width="500" height="200">
 Your browser does not support the HTML 5 Canvas.
</canvas>
<script>
function simWealthEntropyMoney() {

  //SIM WRAPPER CONFIG =====================
  var state = 0;
  var timer;
  var canvas = document.getElementById('canvasWealthEntropyMoney');
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
        rank: 0
      }
      agentList.push(agent);
    }

    //Sort agents
    agentList.sort(function (a,b) {
      return a.wealth - b.wealth;
    });

    //Set color for agents based on talent
    for (var i = 0; i < agentCount; i++) {
      var agent = agentList[i];
      var colorVal = Math.floor(((i) * 255.0) / agentCount);
      agent.color = "rgb(0,"+colorVal+",0)"
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
      var indexC = Math.floor(Math.random() * agentCount);
      var agentA = agentList[indexA];
      var agentB = agentList[indexB];
      var agentC = agentList[indexC];

      //If A can pay
      if (agentA.wealth >= exchangeAmount) {
        agentA.wealth -= exchangeAmount;

        //We pay the supplier with the most money
        var wealthSum = agentB.wealth + agentC.wealth;
        var fractionWealthB = agentB.wealth/wealthSum;

        if (Math.random() < fractionWealthB) {
          agentB.wealth += exchangeAmount;
        } else {
          agentC.wealth += exchangeAmount;
        }
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

    //Sort Array
    agentList.sort(function (a,b) {
      return a.wealth - b.wealth;
    });

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

    //Display Fit
    context.fillStyle = '#00FF00';
    context.fillText("Wealth Fit: "+fit.toPrecision(2), 10, 50);
  }

  init();
  //=====================
}
simWealthEntropyMoney();
</script>

"This is more like reality," said Karl. "Just look! Those who start rich stay rich."

"Except, once again, you're leaving out talent," says Ayn. "The only way to decide which model wins is via competition. Let's put both behaviors into the model and see which one dominates."

"Fair enough," said Karl. "You're on."

Which approach will have the greatest effect? Any guesses. Tune in next time for another installment of Wealth Distribution Adventures!
