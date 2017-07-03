---
published: true
---
Here's a fun place to kick off a discussion about simulations. Give a room full of people a hundred bucks each in dollar bills. Then get them to hand money to random people they meet as they walk around, one dollar at a time. What do you think happens?

I discovered in researching this post that this interesting phenomenon has seen some recent interest on the internet, which delights me. You can read another post about this effect [here](http://www.decisionsciencenews.com/2017/06/19/counterintuitive-problem-everyone-room-keeps-giving-dollars-random-others-youll-never-guess-happens-next/). Or see a great Twitter conversation about that post [here](https://twitter.com/darrenglass/status/879332005078544384).

But before you follow those links, here's a model of the random-money-gifting effect that I built so you can find out for yourself. Each vertical bar represents a person and the hight of each person's bar represents how much money they've got. I've colored the bars randomly so you can see them clearly. As you can see, at the start of the game, everyone has the same amount of money. Click once the sim once to start it. Click again to freeze, and click a third time to reset. 

<canvas id="canvasWealthEntropyMinimal" width="500" height="200">
 Your browser does not support the HTML 5 Canvas.
</canvas>
<script>
function simWealthEntropyMinimal() {

  //SIM WRAPPER CONFIG =====================
  var state = 0;
  var timer;
  var canvas = document.getElementById('canvasWealthEntropyMinimal');
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
  var wealthInit = 100;
  var exchangesPerUpdate = 5000;
  var maxExchange = 1;

  function init() {
    agentList = new Array();

    //Create agents
    for (var i = 0; i < agentCount; i++) {
      var agent = {
        wealth:wealthInit,
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

      var hueVal = Math.random() * 360;
      agent.color = "hsl("+hueVal+", 100%, 50%)"
    }

    paint();
  }

  function update() {

    //Make wealth transfers
    for (var i = 0; i < exchangesPerUpdate; i++) {
      var exchangeAmount = maxExchange;

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

    paint();
  }

  function paint() {
    //Paint background
    context.fillStyle = '#999999';
    context.fillRect(0, 0, canvas.width, canvas.height);

    //Find the maximum bar height
    var maxHeight = Math.max(wealthInit*2, agentList[agentCount-1].wealth);

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
  }

  init();
  //=====================
}
simWealthEntropyMinimal();
</script>

What are we seeing here? Well, unexpectedly, some people are making out like bandits while others end up with empty pockets. Why is that?

Well, it's not really that surprising if you think about it. Consider the first gifts made by each of the five hundred agents in the simulation. It would be weird if every agent chose a partner to give to such that everyone received exactly one dollar and nobody got left out. So some people are going to end up with more money than others early on in the game. Then consider the second round of gifts. It would be just as strange if the second round of offered dollars was perfectly balanced to counteract the imbalance of the first round. So within two rounds of everyone handing out money, we already know that some people are going to get ahead. And the bigger that asymmetry gets, the less likely that the gifts that follow are going to make that imbalance magically go away. 

What I think's interesting about this distribution of wealth is how much it looks like the ones that show up in real life. Take a look at this plot of the UK's income for [instance](https://www.thenetworkforsocialchange.org.uk/resources/am-i-rich.html). 

It's a little uncanny. Unsurprisingly, economists have used this kind of game to model national economies. And why not? You can think of this model as capturing one half of what makes an economy run. Every transfer of money is an instance of someone paying for something. We're just not bothering to model the services that they're getting in return for their cash. 

But to make our model of a national economy more realistic, we should add some extra detail to make sure that the similarity isn't some kind of fluke. For starters, not everything in life costs a dollar, and not everyone starts off with the same amount of money. So let's vary the amount transferred in each transaction, and give everyone a random amount of cash within a given range to start with. 

Let's also add a metric to look at how the inequality in the model is changing over time. For this, we're going to use the GINI coefficient, a well-understood if imperfect yardstick for understanding societies and wealth. 

GINI is easy to understand. Basically, we calculate the differences from the average wealth that every agent has and find the mean of that number. Then we divide that mean by the largest possible value we could get, to give us a number between zero and one. Zero means that society is equal. One means that someone has all the money and everyone else is penniless. 

I've also measured something else here: social mobility. I look at where people start out on the social ladder and compare that to where they end up after people start handing them dollars. Finding the average distance traveled in the social order and comparing that to the maximum amount of possible change gives us a number similar to GINI that tells us whether individual wealth levels have changed. This gives us a way to model whether our toy economy is keeping people in one class, or letting them move about. I've called this measure 'start fit' because it tells us whether the amount that you start with is a good fit for how much you'll end up with. A high Start Fit value shows a static society. A low number shows an extremely liquid one. 

I've added one more feature that's worth mentioning here. Instead of just giving every agent a random color, I've ranged the colors from dark to light based on how much money they have at the beginning of the sim. That way you can see at a glance whether our agents are moving. This should help us check whether our made-up mobility index is working properly. 

So here's the question: does adding extra complexity to the model change how it behaves? Click the sim to see. 

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

Interesting. It makes you wonder: if a random process gives you something like the wealth curve that shows up in real life, why do we suppose that attributes like talent make a difference to why people get rich? It seems from this like the rich would get richer even if life was perfectly random, so why do we imagine that those at the top of the social hierarchy earn what they get?

A political Conservative might reply by saying something like this:

*"You've shown nothing. There's no variable for individual talent in the model. If you don't put talent in and look at how it affects things, how can you possibly assert that talent isn't relevant?"*

And she'd be right. So next time, we'll try that and see what happens.
