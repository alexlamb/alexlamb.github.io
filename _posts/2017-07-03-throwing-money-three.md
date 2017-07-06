---
published: false
---
Welcome back to my thrilling blog series on wealth inequality modeling! If you've been following the story so far, you know that our notional Conservative and Progressive voices, Ayn and Karl, have decided to test out their dueling ideas about what drives wealth inequality in a composite model that compensates both for the effects of cumulative wealth, and for the presence of talent. 

To make this work, we'll have to change our sim a little. How about this? Every time we pick a pair of candidate money-recipients, B and C, we first figure out the probabilities of their receiving the money under one system or the other. Then we take the average of those two probabilities. We're not going to try to weight the selection process one way or another. That would make things less simple and more subjective. 

To show what's going on, we're decorating every bar in our distribution chart with two colors this time. The top half of each bar shows the talent for that individual. The bottom half shows how much money they start out with. And now we have two measures of fit: one for talent and one for initial wealth. Let's kick the model off and see what happens.

<canvas id="canvasWealthEntropyBoth" width="500" height="200">
 Your browser does not support the HTML 5 Canvas.
</canvas>
<script>
function simWealthEntropyBoth() {

  //SIM WRAPPER CONFIG =====================
  var state = 0;
  var timer;
  var canvas = document.getElementById('canvasWealthEntropyBoth');
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
  var talentFit = 0;
  var wealthFit = 0;

  function init() {
    agentList = new Array();

    //Create agents
    for (var i = 0; i < agentCount; i++) {
      var agent = {
        wealth:(Math.random() * wealthInit * 2),
        talent:Math.random(),
        talentColor:"#000000",
        wealthColor:"#000000",
        talentRank: 0,
        wealthRank: 0
      }
      agentList.push(agent);
    }

    //Sort agents based on talent
    agentList.sort(function (a,b) {
      return a.talent - b.talent;
    });

    //Set color for agents based on talent
    for (var i = 0; i < agentCount; i++) {
      var agent = agentList[i];

      var redVal = Math.floor(agent.talent * 255.0);
      var greenVal = Math.floor(agent.talent * 255.0 * 0.9);
      agent.talentColor = "rgb("+redVal+","+greenVal+",0)"

      agent.talentRank = i;
    }

    //Sort agents based on wealth
    agentList.sort(function (a,b) {
      return a.wealth - b.wealth;
    });

    //Set color for agents based on wealth
    for (var i = 0; i < agentCount; i++) {
      var agent = agentList[i];

      var colorVal = Math.floor(((i) * 255.0) / agentCount);
      agent.wealthColor = "rgb(0,"+colorVal+",0)"

      agent.wealthRank = i;
    }

    //Calculate wealth ineuality
    gini = calculateGini();

    //Calculate predictive power of talent measure
    talentFit = calculateTalentFit();

    //Calculate predictive power of wealth measure
    wealthFit = calculateWealthFit();

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

        var talentSum = agentB.talent + agentC.talent;
        var fractionTalentB = agentB.talent/talentSum;

        var wealthSum = agentB.wealth + agentC.wealth;
        var fractionWealthB = agentB.wealth/wealthSum;

        /*
        We experimentally determine the success of B by
        finding the mean of the two probabilities.
         */
        var fractionMeanB = (fractionTalentB + fractionWealthB) / 2;

        if (Math.random() < fractionMeanB) {
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

    //Calculate predictive power of talent
    talentFit = calculateTalentFit();

    //Calculate predictive power of money
    wealthFit = calculateWealthFit();

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

  function calculateTalentFit() {

    var totalDiff = 0;
    for (var i = 0; i < agentCount; i++) {

      //Calculate distance from ideal for each agent
      var diff = Math.abs(i - agentList[i].talentRank);

      //Sum differences from ideal
      totalDiff += diff;
    }

    //Find mean difference
    var meanDiff = totalDiff / agentCount;
    var scaledMean = meanDiff / agentCount;

    var fit = 1 - (2 * scaledMean);
    return fit;
  }

  function calculateWealthFit() {

    var totalDiff = 0;
    for (var i = 0; i < agentCount; i++) {

      //Calculate distance from ideal for each agent
      var diff = Math.abs(i - agentList[i].wealthRank);

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
      context.fillStyle = agentList[i].talentColor;
      context.fillRect(x, y, width, height/2);
      context.fillStyle = agentList[i].wealthColor;
      context.fillRect(x, y+(height/2), width, height/2);
    }

    //Display GINI
    context.fillStyle = '#FFFFFF';
    context.font = '20px Arial';
    context.fillText("GINI: "+gini.toPrecision(2), 10, 30);

    //Display Talent Fit
    context.fillStyle = '#EEFF00';
    context.fillText("Talent Fit:  "+talentFit.toPrecision(2), 10, 50);

    //Display Weealth Fit
    context.fillStyle = '#00FF00';
    context.fillText("Wealth Fit: "+wealthFit.toPrecision(2), 10, 70);

  }

  init();
  //=====================
}
simWealthEntropyBoth();
</script>

At first, things are looking good for Karl, but as the simulation rolls on, Ayn starts doing better. Was this what you expected? It surprised me. 

"See?" says Ayn. "Talent will out!"

"But this isn't fair," says Karl.

"Life's not fair!" says Ayn. "Get used to it."

"For starters, the whole idea of objective talent is naive and objectionable. But worse, everyone in this model is immortal. The whole problem with the kind of society you advocate is that wealth ends up being inherited, not won. And the talent for any one individual is a poor guide for the qualities of their children. That means you end up with individuals with mediocre talent but massive advantages. If you really want to do justice to the effect I'm talking about, you'll have to replace agents with their offspring from time to time."

"Alright," says Ayn. "I'll buy that. But the model is getting more complicated, and therefore more specific. The more moving parts you put in a simulation to make it the way you want it, the less convincing the results."

"A model should be simple, but not so simple that it leaves out important parts of the phenomena you're modeling," Karl retorts.

How are we going to add Karl's extra details to our simulation? Easy. After every cash transaction, we'll give our cash donor a small chance of dying. If A dies, his wealth is immediately passed on to his offspring, A Junior. How will we determine A Junior's talent? Let's take his parent's talent and some other random talent value and take the average. That's a simple approach and it's also vaguely justifiable. A person's skills and temperament are usually some function of their two parents after all.

We'll have to add in a little more code to track our measures of fit. At the end of a round of exchanges, we'll have to figure out what each agent was born with and how much relative talent they have so we can determine what factors are playing a part in their failure or success. But that's not hard. We already have code for that built into the sim that we can repurpose.

How do we decide how long agents should live? After all, an agent's lifespan will determine how long they have for their talent to make a difference. Rather than try to math it out, let's choose something that seems notionally fair. How about a death probability that's one over the number of agents in the sim? That'll do for starters. 

Want to see how the model has changed? Click the sim to find out. 

<canvas id="canvasWealthEntropyDeath" width="500" height="200">
 Your browser does not support the HTML 5 Canvas.
</canvas>
<script>
function simWealthEntropyDeath() {

  //SIM WRAPPER CONFIG =====================
  var state = 0;
  var timer;
  var canvas = document.getElementById('canvasWealthEntropyDeath');
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
  var talentFit = 0;
  var wealthFit = 0;
  var deathProb = 1/500;


  function init() {
    agentList = new Array();

    //Create agents
    for (var i = 0; i < agentCount; i++) {
      var initWealth = (Math.random() * wealthInit * 2);
      var agent = {
        wealth:initWealth,
        talent:Math.random(),
        talentColor:"#000000",
        wealthColor:"#000000",
        talentRank: 0,
        wealthRank: 0,
        startWealth: initWealth
      }
      agentList.push(agent);
    }

    //Sort agents based on talent
    agentList.sort(function (a,b) {
      return a.talent - b.talent;
    });

    //Set color for agents based on talent
    for (var i = 0; i < agentCount; i++) {
      var agent = agentList[i];

      var redVal = Math.floor(agent.talent * 255.0);
      var greenVal = Math.floor(agent.talent * 255.0 * 0.9);
      agent.talentColor = "rgb("+redVal+","+greenVal+",0)"

      agent.talentRank = i;
    }

    //Sort agents based on starting wealth
    agentList.sort(function (a,b) {
      return a.startWealth - b.startWealth;
    });

    //Set color for agents based on wealth
    for (var i = 0; i < agentCount; i++) {
      var agent = agentList[i];

      var colorVal = Math.floor(((i) * 255.0) / agentCount);
      agent.wealthColor = "rgb(0,"+colorVal+",0)"

      agent.wealthRank = i;
    }

    //Calculate wealth ineuality
    gini = calculateGini();

    //Calculate predictive power of talent measure
    talentFit = calculateTalentFit();

    //Calculate predictive power of wealth measure
    wealthFit = calculateWealthFit();

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

        var talentSum = agentB.talent + agentC.talent;
        var fractionTalentB = agentB.talent/talentSum;

        var wealthSum = agentB.wealth + agentC.wealth;
        var fractionWealthB = agentB.wealth/wealthSum;

        /*
        We experimentally determine the success of B by
        finding the mean of the two probabilities.
         */
        var fractionMeanB = (fractionTalentB + fractionWealthB) / 2;

        if (Math.random() < fractionMeanB) {
          agentB.wealth += exchangeAmount;
        } else {
          agentC.wealth += exchangeAmount;
        }
      }

      if (Math.random() < deathProb) {
        agentA.talent = (agentA.talent + Math.random())/2;
        agentA.startWealth = agentA.wealth;
      }
    }

    /*
    Our population now contains individuals with
    New talent levels and starting wealth.
    This means that we need to re-label the population
    so that our indices still work.
     */

    //Sort agents based on talent
    agentList.sort(function (a,b) {
      return a.talent - b.talent;
    });

    //Set color for agents based on talent
    for (var i = 0; i < agentCount; i++) {
      var agent = agentList[i];

      var redVal = Math.floor(agent.talent * 255.0);
      var greenVal = Math.floor(agent.talent * 255.0 * 0.9);
      agent.talentColor = "rgb("+redVal+","+greenVal+",0)"

      agent.talentRank = i;
    }

    //Sort agents based on starting wealth
    agentList.sort(function (a,b) {
      return a.startWealth - b.startWealth;
    });

    //Set color for agents based on wealth
    for (var i = 0; i < agentCount; i++) {
      var agent = agentList[i];

      var colorVal = Math.floor(((i) * 255.0) / agentCount);
      agent.wealthColor = "rgb(0,"+colorVal+",0)"

      agent.wealthRank = i;
    }

    //Sort array by wealth
    agentList.sort(function (a,b) {
      return a.wealth - b.wealth;
    });

    //Calculate wealth inequality
    gini = calculateGini();

    //Calculate predictive power of talent
    talentFit = calculateTalentFit();

    //Calculate predictive power of money
    wealthFit = calculateWealthFit();

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

  function calculateTalentFit() {

    var totalDiff = 0;
    for (var i = 0; i < agentCount; i++) {

      //Calculate distance from ideal for each agent
      var diff = Math.abs(i - agentList[i].talentRank);

      //Sum differences from ideal
      totalDiff += diff;
    }

    //Find mean difference
    var meanDiff = totalDiff / agentCount;
    var scaledMean = meanDiff / agentCount;

    var fit = 1 - (2 * scaledMean);
    return fit;
  }

  function calculateWealthFit() {

    var totalDiff = 0;
    for (var i = 0; i < agentCount; i++) {

      //Calculate distance from ideal for each agent
      var diff = Math.abs(i - agentList[i].wealthRank);

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
      context.fillStyle = agentList[i].talentColor;
      context.fillRect(x, y, width, height/2);
      context.fillStyle = agentList[i].wealthColor;
      context.fillRect(x, y+(height/2), width, height/2);
    }

    //Display GINI
    context.fillStyle = '#FFFFFF';
    context.font = '20px Arial';
    context.fillText("GINI: "+gini.toPrecision(2), 10, 30);

    //Display Talent Fit
    context.fillStyle = '#EEFF00';
    context.fillText("Talent Fit:  "+talentFit.toPrecision(2), 10, 50);

    //Display Weealth Fit
    context.fillStyle = '#00FF00';
    context.fillText("Wealth Fit: "+wealthFit.toPrecision(2), 10, 70);

  }

  init();
  //=====================
}
simWealthEntropyDeath();
</script>

"I win!" says Ayn.

"Not so fast!" says Karl. "Look at those results. They're wobbling around all over the place. Let's run it again."

"The same thing will happen," says Ayn.

It doesn't. The results are less stable than they were before. Talent appears to have a slight edge overall, but without us running a batch of experiments, it'd be hard to say for sure. 

Needless to say, at this point, neither Ayn nor Karl is looking happy. Our model has become so neutral that it's not giving us a clear answer. We haven't found an easy win to justify either ideology. Ayn thinks we're bending the model too far to keep the effects of talent suppressed. Karl thinks the whole idea of talent without a social context is ridiculous. However, there's something that Ayn and Karl are both missing. 

Take a look at the sim running and see if you think there's something odd going on. Next time, I'll let you in on the secret of what neither of our political pundits have noticed.
