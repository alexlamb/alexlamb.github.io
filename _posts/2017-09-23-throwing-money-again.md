---
published: true
---
It's been a while since I last posted in this blog. In the last post, months ago, I promised you a new model, and here I am writing about throwing money again. What happened?

Two things. First, I built that new model. It's about building teams, cooperation, and organizational effectiveness. And in the next few posts, I'm going to walk you through it. But also, I received some questions about the last posts in my Throwing Money series. People wanted to know what was going on, and why the results panned out the way they did. So I decided that one more post on the topic was in order to make things clear. After that, it's game theory time.

As you may recall, this series was about what building a very simple model of an economy in which agents hand money around almost at random. We saw that it had a lot in common with the notion of entropy in physics. We also saw that interesting things happened when you started adding in factors like individual talent and the advantages of family wealth. Our conclusion was that prior wealth mattered a hell of a lot more if you were rich, and that all things being equal, we should expect the top members of society to be there more out of luck than skill. This _despite_ the fact that overall, skill seemed to make more of a difference to success than money.  

"How does that work?" was the question I received. So I decided to make a fresh version of the sim to explain. In the sim below, I calculate at the overall talent and prior wealth of each tranche of twenty agents and plot the relative values. That way, you can see the distributions of family advantage and talent over the distribution of wealth. I invite you to click on it to see what happens. 

<canvas id="canvasWealthEntropyOver" width="500" height="200">
 Your browser does not support the HTML 5 Canvas.
</canvas>
<script>
function simWealthEntropyOver() {

  //SIM WRAPPER CONFIG =====================
  var state = 0;
  var timer;
  var canvas = document.getElementById('canvasWealthEntropyOver');
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

  var sample = 20;
  var richList = new Array(agentCount/sample);
  var talentList = new Array(agentCount/sample);

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

    createOverlays();

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

    createOverlays();

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

  function createOverlays() {
    richList.fill(0);
    talentList.fill(0);
    for (var i = 0; i < agentCount; i++) {
      var agent = agentList[i];
      var bucket = Math.floor(i/sample);

      richList[bucket] += (agent.wealthRank / agentCount);
      talentList[bucket] += (agent.talentRank / agentCount);
    }
    for (var i = 0; i < agentCount/sample; i++) {
      richList[i] /= sample;
      talentList[i] /= sample;
    }
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

    //Draw Overlays
    var chunkWidth = Math.floor(barWidth * sample);
    for (var i = 1; i < agentCount/sample; i++) {

      var p = i - 1;
      var pTalentHeight = Math.floor(talentList[p]*height);
      var pRichHeight = Math.floor(richList[p]*height);

      var talentHeight = Math.floor(talentList[i]*height);
      var richHeight = Math.floor(richList[i]*height);

      console.log("scaleHeight:"+scaleHeight);
      console.log("talentList[p]:"+talentList[p]);
      console.log("pTalentHeight:"+pTalentHeight);

      var px = Math.floor(p * chunkWidth) + (sample/2);
      var ix = Math.floor(i * chunkWidth) + (sample/2);

      var pTy = canvas.height - pTalentHeight;
      var iTy = canvas.height - talentHeight;
      context.strokeStyle = '#EEFF00';
      context.beginPath();
      context.moveTo(px, pTy);
      context.lineTo(ix, iTy);
      context.lineWidth = 2;
      context.stroke();

      var pRy = canvas.height - pRichHeight;
      var iRy = canvas.height - richHeight;
      context.strokeStyle = '#00FF00';
      context.beginPath();
      context.moveTo(px, pRy);
      context.lineTo(ix, iRy);
      // context.moveTo(px, 50);
      // context.lineTo(ix, 50);
      context.lineWidth = 2;
      context.stroke();
    }
  }

  init();
  //=====================
}
simWealthEntropyOver();
</script>

As you'll see if you let the sim run for long enough, we end up with an upward curve for both prior wealth and talent across the population. However, those two curves are not the same shape. Talent forms a gentle wobbling slope. Prior wealth effects stay mostly level until you reach about the top twenty-five percent of the population, at which point they kick into a high gear. By the time you get to the top ten percent of society, they are dominating. 

This doesn't happen all at once. For a while, as the simulation runs, talent is making more of a difference. It's only after the consequences of wealth inequality kick in that we see the effects reverse themselves. At that point, you're not dealing with the same kind of society that you started with.

Are there lessons here? Certainly. The first is that wealth inequality increases, different sociological effects kick in. Secondly, if you believe in an Ayn Rand style model of society, in which excellence should be given room to play itself out, the best thing you can do to facilitate that is to tax the top ten percent of society and spread that money out among the poor. That way, you maintain the conditions under which excellence stands a chance of beating out historical accident. 

If there's one thing I love about models, it's the way that they explode our assumptions about how the world works with so little investment of effort. Personally, I'd like everyone running for political office to have to complete a course on complex systems before they can stand. Who's with me?
