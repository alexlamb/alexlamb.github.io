function simEmpDilemma2() {
    //SIM WRAPPER CONFIG =====================
    //Wrapper constants----------------
    const scaleFactor = 2; //To compensate for retina screens
    const width = 400;
    const height = 520;
    const bigWidth = width * scaleFactor;
    const bigHeight = height * scaleFactor;
    const groupCount = 1; //Must match number of defined groups
    //Wrapper setup----------------
    
    var container = document.getElementById('TuckmanSim');
    console.log("got container:"+container.id;
    const canvas0 = document.createElement("canvas");
    canvas0.setAttribute("id", "canvasIDEmpDilemma2.0");
    container.appendChild(canvas0);
    
    canvas0.width = bigWidth;
    canvas0.height = bigHeight;
    canvas0.style.width = "" + width + "px";
    canvas0.style.height = "" + height + "px";
    canvas0.addEventListener('click', updateState, false);
    const context0 = canvas0.getContext('2d');
    context0.scale(scaleFactor, scaleFactor);
    let plotCanvases = [];
    let plotContexts = [];
    for (let i = 0; i < groupCount; i++) {
        let plotCanvas = document.createElement("canvas");
        let canvasIndex = i + 1;
        plotCanvas.setAttribute("id", "canvasIDEmpDilemma2." + canvasIndex);
        document.body.appendChild(plotCanvas);
        plotCanvas.width = bigWidth;
        plotCanvas.height = bigHeight;
        plotCanvas.style.width = "" + (width) + "px";
        plotCanvas.style.height = "" + (height) + "px";
        plotCanvas.addEventListener('click', updateState, false);
        let plotContext = plotCanvas.getContext('2d');
        plotContext.scale(scaleFactor, scaleFactor);
        plotCanvases.push(plotCanvas);
        plotContexts.push(plotContext);
    }
    // let defCanvas = document.createElement("canvas");
    // let canvasIndex = groupCount+1;
    // defCanvas.setAttribute("id","canvasIDEmpDilemma2."+canvasIndex);
    // document.body.appendChild(defCanvas);
    // defCanvas.width = bigWidth;
    // defCanvas.height = bigHeight;
    // defCanvas.style.width = ""+(width)+"px";
    // defCanvas.style.height = ""+(height)+"px";
    // defCanvas.addEventListener('click', updateState, false);
    // let defContext = defCanvas.getContext('2d');
    // defContext.scale(scaleFactor,scaleFactor);
    let state = 0;
    let timer;
    //Wrapper functions----------------
    function updateState() {
        state = (state + 1) % 3;
        if (state == 0) {
            //Reset sim
            init();
        }
        else if (state == 1) {
            //Run sim
            timer = setInterval(update, 33);
        }
        else {
            //Stop sim
            clearInterval(timer);
        }
    }
    //=====================
    //SIM CODE =====================
    //Constants----------------
    const agentCount = 256;
    const behaviors = 4;
    const interactionsPerUpdate = 10000;
    const moodHistSize = 10;
    const agentRadius = 10;
    const border = 2;
    const remember = 0.9; //0.865;//0.85;
    const labelX = 10;
    const labelY = 20;
    const agentsY = 30;
    const cowerProb = 0.6; //One is dysfunctional
    const forgetProb = 0.6; //One is dysfunctional
    // const angerMult:number = 0;//Zero is no irrationality
    //Variables----------------
    let agentList = [];
    let groupList = [];
    //Classes----------------
    class Agent {
    }
    class Group {
    }
    class Counter {
        clear() {
            this.events = 0;
            this.chances = 0;
        }
        fraction() {
            return this.events / this.chances;
        }
    }
    //Sim functions----------------
    //Set up sim
    function init() {
        //Initialize datastructures
        agentList = [];
        groupList = [];
        console.log("Creating agents");
        //Create agents
        for (let i = 0; i < agentCount; i++) {
            let agent = new Agent();
            agent.index = i;
            //TODO: Could tweak this to generate differentiated agents.
            agent.likes = new Array(behaviors).fill(1);
            agent.moodHist = new Array(moodHistSize).fill(0);
            agent.currentSlot = 0;
            agent.memory = new Array(agentCount).fill(-1);
            agent.angry = false;
            agentList.push(agent);
        }
        //Create groups
        //(This is the simple case)
        console.log("Creating groups");
        //Single group scenario
        buildGroup(0, "Everyone", 0, agentCount, 0, 0, width, height);
        //Leader/worker scenario
        // buildGroup(0, "Leaders", 0, 1*agentCount/8, 0, 0, width, 1*height/8 + 45);
        // buildGroup(1, "Workers", 1, 7*agentCount/8, 0, 1*height/8 + 45, width, 7*height/8 - 45);
        //Oppressed minority scenario
        // buildGroup(0, "Majority", 0, 7*agentCount/8, 0, 0, width, 7*height/8-45);
        // buildGroup(1, "Minority", 1, 1*agentCount/8, 0, 7*height/8-45, width, 1*height/8 + 45);
        //Three tier scenario
        // buildGroup(0, "Execs", 0, 1*agentCount/16, 0, 0, width, 1*height/16 + 32);
        // buildGroup(1, "Managers", 1, 3*agentCount/16, 0, 1*height/16 + 32, width, 3*height/16 + 20);
        // buildGroup(2, "Workers", 2, 3*agentCount/4, 0, 1*height/4+52, width, 3*height/4 - 52);
        //Siloed teams scenario
        // buildGroup(0, "Leaders", 0, 2*agentCount/16, 0, 0, width, 1*height/8 + 45);
        // buildGroup(1, "Team A", 1, 7*agentCount/16, 0, 1*height/8 + 45, width/2, 7*height/8 - 45);
        // buildGroup(2, "Team B", 1, 7*agentCount/16, width/2, 1*height/8 + 45, width/2, 7*height/8 - 45);
        //Assign agents to groups
        let currentAgent = 0;
        for (let i = 0; i < groupCount; i++) {
            let group = groupList[i];
            let interval = ((agentRadius + border) * 2);
            let row = Math.floor(group.width / interval);
            let offset = Math.floor((group.width - (row * interval)) / 2) + agentRadius;
            for (let j = 0; j < group.size; j++) {
                let agent = agentList[currentAgent];
                agent.x = group.x + (j % row) * interval + offset;
                agent.y = group.y + agentsY + Math.floor(j / row) * interval + offset;
                agent.group = i;
                agent.rank = group.rank;
                group.agents.push(agent);
                currentAgent++;
            }
        }
        /* Determine partners for agents
        Trivial case for testing
        */
        // for (let i = 0; i < groupCount; i++) {
        //   for (let j = 0; j < groupList[i].agents.length; j++) {
        //     let agent = groupList[i].agents[j];
        //     agent.partnerBias = [].concat(groupList[i].agents);
        //   }
        // }
        /* Determine partners for agents
        Universal case for basic tiered org dysfunction (everyone talks to everyone)
        */
        for (let i = 0; i < groupCount; i++) {
            for (let j = 0; j < groupList[i].agents.length; j++) {
                let agent = groupList[i].agents[j];
                agent.partnerBias = [].concat(agentList);
            }
        }
        /* Determine partners for agents
        Tribal case for basic tiered org dysfunction
        (People are more likely to talk to their own group)
        */
        // for (let i = 0; i < groupCount; i++) {
        //   for (let j = 0; j < groupList[i].agents.length; j++) {
        //     let agent = groupList[i].agents[j];
        //     agent.partnerBias = [].concat(agentList);
        //   }
        // }
        /* Determine partners for agents
        Partitioned case for siloed teams
        */
        // let teamALeaders:Agent[] = groupList[0].agents.slice(0,groupList[0].agents.length/2);
        // let teamBLeaders:Agent[] = groupList[0].agents.slice(groupList[0].agents.length/2);
        //
        // for (let i = 0; i < groupCount; i++) {
        //   for (let j = 0; j < groupList[i].agents.length; j++) {
        //
        //     let agent = groupList[i].agents[j];
        //     agent.partnerBias = [].concat(groupList[i].agents);
        //
        //     if (i == 0) {
        //       //Leaders are twice as likely to want to talk to other leaders.
        //       agent.partnerBias = agent.partnerBias.concat(groupList[0].agents);
        //
        //       if (j < groupList[0].agents.length/2) {
        //         agent.partnerBias = agent.partnerBias.concat(groupList[1].agents);
        //       } else {
        //         agent.partnerBias = agent.partnerBias.concat(groupList[2].agents);
        //       }
        //
        //     } else if (i == 1) {
        //       agent.partnerBias = agent.partnerBias.concat(teamALeaders);
        //
        //       //Workers are twice as likely to want to talk to their bosses.
        //       agent.partnerBias = agent.partnerBias.concat(teamALeaders);
        //
        //     } else if (i == 2) {
        //       agent.partnerBias = agent.partnerBias.concat(teamBLeaders);
        //
        //       //Workers are twice as likely to want to talk to their bosses.
        //       agent.partnerBias = agent.partnerBias.concat(teamBLeaders);
        //     }
        //   }
        // }
        paint();
    }
    function buildGroup(index, name, rank, size, x, y, width, height) {
        let group = new Group();
        group.label = name;
        group.rank = rank;
        group.size = size;
        group.x = x;
        group.y = y;
        group.width = width;
        group.height = height;
        let hue = (index * 360) / groupCount;
        group.color = "hsl(" + hue + ", 100%, 20%)";
        group.agents = [];
        group.actionList = new Array(behaviors);
        group.interactions = 0;
        group.defectList = new Array(groupCount).fill(0).map(() => new Counter());
        group.happyRecord = [];
        // group.actionRecord = new Array(behaviors);
        // for (let i = 0; i < behaviors; i++) {
        //   group.actionRecord[i] = [];
        // }
        group.actionRecord = new Array(behaviors).fill(0).map(() => []);
        group.eventRecord = [];
        group.eventState = -1;
        group.maxDefect = 0;
        group.defectRecord = new Array(groupCount).fill(0).map(() => []);
        groupList.push(group);
    }
    //Update sim by one round
    function update() {
        //Zero data collection variables for each group
        for (let i = 0; i < groupCount; i++) {
            let group = groupList[i];
            group.totalHappy = 0;
            group.interactions = 0;
            group.actionList.fill(0);
            group.defectList.forEach((counter) => { counter.clear(); });
        }
        //Perform interactions
        for (let i = 0; i < interactionsPerUpdate; i++) {
            let indexA = Math.floor(Math.random() * agentCount);
            let agentA = agentList[indexA];
            let indexB = Math.floor(Math.random() * agentA.partnerBias.length);
            let agentB = agentA.partnerBias[indexB];
            let actionA = pickAction(agentA, agentB);
            let actionB = pickAction(agentB, agentA);
            let groupA = groupList[agentA.group];
            let groupB = groupList[agentB.group];
            groupA.actionList[actionA]++;
            groupB.actionList[actionB]++;
            groupA.interactions++;
            groupB.interactions++;
            if (actionA == 0)
                groupA.defectList[agentB.group].events++;
            groupA.defectList[agentB.group].chances++;
            if (actionB == 0)
                groupB.defectList[agentA.group].events++;
            groupB.defectList[agentA.group].chances++;
            applyAction(agentA, actionA, agentB, actionB);
            applyAction(agentB, actionB, agentA, actionA);
        }
        //Capture state at end of round
        for (let i = 0; i < agentCount; i++) {
            let agent = agentList[i];
            for (let j = 0; j < moodHistSize; j++) {
                if (agent.moodHist[j] > 0) {
                    groupList[agent.group].totalHappy++;
                }
            }
        }
        //Transfer data for each group to record
        for (let i = 0; i < groupCount; i++) {
            let group = groupList[i];
            group.happyRecord.push(group.totalHappy);
            for (let j = 0; j < behaviors; j++) {
                group.actionRecord[j].push(group.actionList[j] / group.interactions);
            }
            for (let j = 0; j < groupCount; j++) {
                group.defectRecord[j].push(group.defectList[j].fraction());
            }
            group.maxDefect = Math.max(group.actionList[0], group.maxDefect);
            let cooperateList = group.actionList.slice(1);
            cooperateList.sort();
            let loCooperate = cooperateList[0];
            let hiCooperate = cooperateList[behaviors - 2];
            if (group.eventState === -1 && group.happyRecord.length > 0) {
                group.eventState = 0;
            }
            else if (group.eventState === 0 && group.actionList[0] < group.maxDefect * 0.95) {
                group.eventState = 1;
            }
            else if (group.eventState === 1 && hiCooperate > group.actionList[0]) {
                group.eventState = 2;
            }
            else if (group.eventState === 2 && loCooperate < hiCooperate * 0.01) {
                group.eventState = 3;
            }
            group.eventRecord.push(group.eventState);
        }
        paint();
    }
    function pickAction(agent, other) {
        let result = 0;
        if (agent.angry && Math.random() < (1 - remember)) {
            agent.angry = false;
        }
        //With some probability, an angry agent forgets their grievances
        if (agent.memory[other.index] >= 0 && (Math.random() < (1 - remember))) {
            agent.memory[other.index] = -1;
        }
        // if (irrational(agent, other)) {
        //   result = 0;
        if (agent.angry && agent.rank <= other.rank) {
            result = 0;
            agent.angry = false;
            // } else if (agent.memory[other.index] >= 0 && (Math.random() < remember)) {
        }
        else if (agent.memory[other.index] >= 0) {
            result = agent.memory[other.index];
        }
        else {
            let totalLikes = 0;
            //Find the size of the roulette wheel
            for (let i = 0; i < behaviors; i++) {
                totalLikes += agent.likes[i];
            }
            //Make a selection
            let selection = Math.floor(Math.random() * totalLikes);
            //Figure out which action was selected
            totalLikes = 0;
            for (let i = 0; i < behaviors; i++) {
                totalLikes += agent.likes[i];
                if (selection < totalLikes) {
                    result = i;
                    break;
                }
            }
        }
        return result;
    }
    // function irrational(agent:Agent, other:Agent):boolean {
    //   /*
    //   If an agent is feeling bad, they behave badly with some probability.
    //   That probability is a reflection of their most recent happiness score.
    //   I apply the happiness ranged from zero to one, multiplied by some factor.
    //   */
    //   let result = false;
    //
    //   let mood:number = 0;
    //   for (let i = 0; i < moodHistSize; i++) {
    //     mood += agent.moodHist[i];
    //   }
    //   let happy = mood/moodHistSize;
    //   let angry = 1 - happy;
    //   let angryThresh = angry * angerMult;
    //
    //   if (Math.random() < angryThresh && agent.rank <= other.rank) {
    //     result = true;
    //   }
    //
    //   return result;
    // }
    function applyAction(agent, ownChoice, other, otherChoice) {
        if (ownChoice == 0) {
            //Agent defected
            if (otherChoice == 0) {
                //Partner defected
                agent.likes[0]--;
                agent.moodHist[agent.currentSlot] = 0;
                agent.memory[other.index] = -1;
            }
            else {
                agent.likes[0]++;
                agent.moodHist[agent.currentSlot] = 1;
                agent.memory[other.index] = -1; //TODO: Could tweak this
            }
        }
        else {
            //Agent attempted cooperation
            if (otherChoice == 0) {
                //Partner defected
                agent.likes[ownChoice]--;
                agent.moodHist[agent.currentSlot] = 0;
                // if (other.rank >= agent.rank)//WON'T SPEAK UP
                //If I am a 1 and he is a 1 or a 2, I remember to retaliate
                if (retaliate(agent, other)) {
                    agent.memory[other.index] = 0;
                }
                else {
                    agent.angry = true;
                }
            }
            else if (ownChoice == otherChoice) {
                //Partner matched
                agent.likes[ownChoice]++;
                agent.moodHist[agent.currentSlot] = 1;
                // if (other.rank <= agent.rank)//DON'T REMEMBER
                //If I am a 2 and he is a 1 or a 2, I remember to match
                if (recall(agent, other)) {
                    agent.memory[other.index] = ownChoice;
                }
                //TODO: Is there a reciprocal state to anger in this sim?
                //What happens when someone can't remember how to be nice?
            }
            else {
                //Partner differed
                agent.likes[ownChoice]--;
                agent.moodHist[agent.currentSlot] = 0;
                agent.memory[other.index] = -1;
            }
        }
        agent.likes[ownChoice] = Math.max(agent.likes[ownChoice], 1);
        agent.currentSlot = (agent.currentSlot + 1) % moodHistSize;
    }
    function retaliate(agent, other) {
        let result = true;
        /*
        If an agent feels a status conflict, they retaliate conditionally.
        If they're higher or equal ranking than their partner, they'll always retaliate.
        If they're lower ranking, then they'll retaliate based on culture.
    
        So we check the rank.
        If we're in the rank bounds where suppression counts, we act with some proability.
        */
        if (agent.rank > other.rank) {
            if (Math.random() < cowerProb) {
                result = false; //Then with probability p, fail to retaliate
            }
        }
        return result;
    }
    function recall(agent, other) {
        let result = true;
        if (agent.rank < other.rank) {
            if (Math.random() < forgetProb) {
                result = false; //Then with probability p, fail to recall specifics
            }
        }
        return result;
    }
    function paint() {
        // console.log("Painting");
        paintAgents();
        for (let i = 0; i < groupCount; i++) {
            paintPlot(i);
        }
        // paintDefection();
    }
    function paintAgents() {
        //Paint background
        context0.clearRect(0, 0, width, height);
        for (let i = 0; i < agentCount; i++) {
            let agent = agentList[i];
            //Determine the total number of opinions this agent has
            let totalLikes = 0;
            for (let j = 0; j < behaviors; j++) {
                totalLikes += agent.likes[j];
            }
            //Draw the circle segments
            let likesSoFar = 0;
            let angleSoFar = 0;
            for (let j = 0; j < behaviors; j++) {
                let newLikes = likesSoFar + agent.likes[j];
                let newAngle = (newLikes * Math.PI * 2) / totalLikes;
                let color = "black";
                if (j > 0) {
                    let hue = ((j - 1) * 360 / (behaviors - 1));
                    color = "hsl(" + hue + ", 100%, 50%)";
                }
                context0.beginPath();
                context0.fillStyle = color;
                // context.moveTo(agent.x, agent.y);
                context0.arc(agent.x, agent.y, agentRadius, angleSoFar, newAngle);
                context0.lineTo(agent.x, agent.y);
                context0.fill();
                likesSoFar = newLikes;
                angleSoFar = newAngle;
            }
        }
        for (let i = 0; i < groupCount; i++) {
            let group = groupList[i];
            context0.strokeStyle = group.color;
            context0.lineWidth = 4;
            context0.fillStyle = group.color;
            context0.font = '16px Arial';
            context0.strokeRect(group.x, group.y, group.width - 1, group.height - 1);
            context0.fillText(group.label, group.x + labelX, group.y + labelY);
        }
    }
    function paintPlot(index) {
        let context = plotContexts[index];
        let group = groupList[index];
        //Paint background
        context.clearRect(0, 0, width, height);
        //Determine graph X scaling
        let start = Math.max(0, group.happyRecord.length - width);
        let end = group.happyRecord.length;
        let cols = end - start;
        let maxHappy = group.size * moodHistSize;
        // let maxActions = interactionsPerUpdate * 2;
        let maxActions = 1;
        for (let i = 1; i < cols; i++) {
            let xStep = width / cols;
            let c = i + start;
            let p = c - 1;
            let px = (p - start) * xStep;
            let cx = (c - start) * xStep;
            if (group.eventRecord[p] === 0) {
                context.fillStyle = "#FFBBBB";
            }
            else if (group.eventRecord[p] === 1) {
                context.fillStyle = "#FFFFBB";
            }
            else if (group.eventRecord[p] === 2) {
                context.fillStyle = "#BBFFBB";
            }
            else if (group.eventRecord[p] === 3) {
                context.fillStyle = "#BBFFFF";
            }
            context.fillRect(px, 0, Math.ceil(xStep), height);
        }
        //Draw lines
        for (let i = 1; i < cols; i++) {
            drawSegment(context, group.happyRecord, i + start, 'Gold', start, cols, maxHappy);
            for (let j = 0; j < behaviors; j++) {
                let color = "black";
                if (j > 0) {
                    let hue = ((j - 1) * 360 / (behaviors - 1));
                    color = "hsl(" + hue + ", 100%, 50%)";
                }
                drawSegment(context, group.actionRecord[j], i + start, color, start, cols, maxActions);
            }
        }
        context.strokeStyle = 'Black';
        context.strokeStyle = group.color;
        context.lineWidth = 4;
        context.fillStyle = group.color;
        context.font = '16px Arial';
        context.strokeRect(0, 0, width - 1, height - 1);
        context.fillText(group.label, labelX, labelY);
        for (let i = 1; i < cols; i++) {
            let xStep = width / cols;
            let c = i + start;
            let p = c - 1;
            let px = (p - start) * xStep;
            if (group.eventRecord[c] === 0) {
                context.fillStyle = "#DD0000";
            }
            else if (group.eventRecord[c] === 1) {
                context.fillStyle = "#AAAA00";
            }
            else if (group.eventRecord[c] === 2) {
                context.fillStyle = "#00DD00";
            }
            else if (group.eventRecord[c] === 3) {
                context.fillStyle = "#00AAAA";
            }
            let phaseLabel = "";
            if (group.eventRecord[p] != group.eventRecord[c]) {
                phaseLabel = "" + c;
            }
            context.fillText(phaseLabel, px, labelY * (group.eventRecord[p] + 2));
        }
    }
    // function paintDefection():void {
    //
    //   //Paint background
    //   defContext.clearRect(0, 0, width, height);
    //
    //   let group0 = groupList[0];
    //
    //   //Determine graph X scaling
    //   let start = Math.max(0, group0.happyRecord.length - width);
    //   let end = group0.happyRecord.length;
    //   let cols = end - start;
    //
    //   //Draw lines
    //   for (let i = 1; i < cols; i++) {
    //
    //     for (let j = 0; j < groupCount; j++) {
    //       let fromGroup:Group = groupList[j];
    //       for (let k = 0; k < groupCount; k++) {
    //         let toGroup:Group = groupList[k];
    //
    //         let lineColor = fromGroup.color;
    //         let beadColor = toGroup.color;
    //
    //         drawDefSegment(defContext, fromGroup.defectRecord[k], i+start, lineColor, beadColor, start, cols);
    //       }
    //     }
    //   }
    //
    //   defContext.strokeStyle = 'Black';
    //   defContext.lineWidth = 4;
    //   defContext.font = '16px Arial';
    //   defContext.strokeRect(0, 0, width-1, height-1);
    //   defContext.fillStyle = 'Black';
    //   defContext.fillText("Defection Rates", labelX, labelY);
    // }
    function drawSegment(context, record, c, color, start, cols, max) {
        let xStep = width / cols;
        let yStep = height / max;
        let p = c - 1;
        let px = (p - start) * xStep;
        let cx = (c - start) * xStep;
        let py = height - (record[p] * yStep);
        let cy = height - (record[c] * yStep);
        context.beginPath();
        context.strokeStyle = color;
        context.moveTo(px, py);
        context.lineTo(cx, cy);
        context.lineWidth = 2;
        context.stroke();
    }
    function drawDefSegment(context, record, c, lineColor, beadColor, start, cols) {
        let xStep = width / cols;
        let yStep = height;
        let p = c - 1;
        let h = 0;
        if (p >= 0)
            h = p - 1;
        let px = (p - start) * xStep;
        let cx = (c - start) * xStep;
        let py = height - ((record[p] + record[h]) / 2 * yStep);
        let cy = height - ((record[c] + record[p]) / 2 * yStep);
        context.beginPath();
        context.strokeStyle = lineColor;
        context.moveTo(px, py);
        context.lineTo(cx, cy);
        context.lineWidth = 2;
        context.stroke();
        let step = 1;
        if (cols < width / 4) {
            step = 5;
        }
        else if (cols < width / 2) {
            step = 10;
        }
        else if (cols < 3 * width / 4) {
            step = 15;
        }
        else {
            step = 20;
        }
        if (c % step == 0) {
            context.fillStyle = beadColor;
            context.beginPath();
            context.arc(cx, cy, 4, 0, 2 * Math.PI);
            context.fill();
        }
    }
    init();
    //=====================
}
simEmpDilemma2();
