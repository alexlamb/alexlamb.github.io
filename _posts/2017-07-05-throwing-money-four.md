---
published: false
---
In the last post, I left you with a mystery. We had built a small model of money moving around in a society, and were trying to figure out which had a bigger impact: individual talent or inherited wealth. I told you we were missing something significant. 

For those who didn't read that post and would like to try to figure it out for themselves before reading on, here's another copy of that sim, and a hint. Look at the two indicators that tell you how well talent and prior wealth are predicting an agent's success. Now look at the colors of the bars themselves. Do the scores reflect what you think you see?

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

I think it looks wrong. I think I see fewer talented rich people than ones with inherited wealth, despite what my prediction measures are telling me. Can that be right? (Bear in mind, this simulation is a little different every time it runs. If you don't see the same thing, run it again and decide for yourself.)

Let's test the idea that there's a discrepancy. How would we do that? I'd propose by specifically applying our measure functions for that part of the population where something fishy seems to be going on. So, below, you'll find another version of the sim in which we look at both our measures of fit as before, and then at the same functions exclusively applied to the top twenty-five percent of the population.

<canvas id="canvasWealthEntropyTop" width="500" height="200">
 Your browser does not support the HTML 5 Canvas.
</canvas>
<script>
function simWealthEntropyTop() {

  //SIM WRAPPER CONFIG =====================
  var state = 0;
  var timer;
  var canvas = document.getElementById('canvasWealthEntropyTop');
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
  var talentFitTop = 0;
  var wealthFitTop = 0;
  var deathProb = 1/500;

  var sampleFraction = 1/4;
  var sampleSize = agentCount * sampleFraction;

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
    talentFit = calculateTalentFit(agentCount);
    talentFitTop = calculateTalentFit(sampleSize);

    //Calculate predictive power of wealth measure
    wealthFit = calculateWealthFit(agentCount);
    wealthFitTop = calculateWealthFit(sampleSize);

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

    //Calculate predictive power of talent measure
    talentFit = calculateTalentFit(agentCount);
    talentFitTop = calculateTalentFit(sampleSize);

    //Calculate predictive power of wealth measure
    wealthFit = calculateWealthFit(agentCount);
    wealthFitTop = calculateWealthFit(sampleSize);

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

  function calculateTalentFit(sampleSize) {

    var startAt = agentCount - sampleSize;
    var totalDiff = 0;
    for (var i = startAt; i < agentCount; i++) {

      //Calculate distance from ideal for each agent
      var diff = Math.abs(i - agentList[i].talentRank);

      //Sum differences from ideal
      totalDiff += diff;
    }

    //Find mean difference
    var meanDiff = totalDiff / sampleSize;
    var scaledMean = meanDiff / agentCount;

    var fit = 1 - (2 * scaledMean);
    return fit;
  }

  function calculateWealthFit(sampleSize) {

    var startAt = agentCount - sampleSize;
    var totalDiff = 0;
    for (var i = startAt; i < agentCount; i++) {

      //Calculate distance from ideal for each agent
      var diff = Math.abs(i - agentList[i].wealthRank);

      //Sum differences from ideal
      totalDiff += diff;
    }

    //Find mean difference
    var meanDiff = totalDiff / sampleSize;
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
    context.fillText("Talent Fit:  "+talentFit.toPrecision(2)
    +" ("+talentFitTop.toPrecision(2)+")", 10, 50);

    //Display Weealth Fit
    context.fillStyle = '#00FF00';
    context.fillText("Wealth Fit: "+wealthFit.toPrecision(2)
    +" ("+wealthFitTop.toPrecision(2)+")", 10, 70);

  }

  init();
  //=====================
}
simWealthEntropyTop();
</script>

The numbers are different! Our functions weight every member of society equally, but when we look at the output plot, we're focusing on what makes people rich. But before we start to feel to smug about having spotted something important, we should ask why we were focusing on the rich in the first place. 

There are probably several reasons. The bars for rich people are taller and therefore easier to see. But also because we're socially programmed to attend to that part of the distribution that corresponds to the wealthy. I think that's intersting. At some level, this entire simulation has become more about what makes someone rich than about what makes someone poor. And this is much like life, I think. It's easy to see the impacts of extreme wealth, because it tends to be obvious in our environment. It's often much harder to see and understand the effects of poverty.

This bias is even there in the way we plot our data. More wealth means a taller bar or a point higher up. Our value system and our attention is tacitly focused around an ideal of having *more*.

This is one of the reasons I like using simulation as a tool to stretch my understanding of the world. Because it makes me think about my assumptions and the mistakes of perception I'm making. It's not just about the code – it's about how building out an idea forces me to think harder about what's really going on.

The way I see it is that when we simply ingest news that's thrust at us by the world, we tend to  filter it so as to bolster a model of reality we carry around inside our heads. We can't help it: it's how our brains are wired. But writing a single page of code can give us a chance to test our model, figure out what we're missing, and start thinking about the world like rational people again.

So what have we learned so far? We've learned that while talent and class have an approximately equal effect in our simulation the way we've set it up, the effects *aren't equal* across the entire population. We can't just take a measure that looks at the whole population and expect it to give us answers about the behavior or traits of a few. Another way to say this is that average values bury information. 

What the sim also suggests is that in an environment where both talent and prior wealth matter, all things being equal, inherited wealth is likely to matter more than talent for the top tiers of society. In other words, the richer someone is, the less likely it is to exclusively a product of their abilities. 

Another way to say it is that, if we believe our models, being smart helps get you out of the gutter but coming from money is what gives you a chance at being president. Ayn – our Conservative voice – was right about what it takes to not be dirt poor, while Karl – our Progressive – had a better model of how the top ten percent operates. This strikes me as a little ironic. 

Have we proved all this definitively? Not at all. A crude simulation like this is nothing more than a thought experiment. To turn this result into publishable science, you'd need to justify the model, test variants of it, compare it to the existing literature, compare it to data for the world if such data exists, and maybe throw in a proof or two. But this blog isn't about doing professional-level science. It's about massively boosting our intuition with a relatively modest effort investment and having fun while we do it.

And in terms of intuition boosting, we've only scratched the surface. The sheer fact that the random models we've been looking at behave the way that they do reveals something deep and powerful about how economic systems work that most pundits don't seem to notice. In the next post, I'll explain what I mean.
