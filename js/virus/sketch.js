const side = 800;
const controlWidth = 500;
const familyCount = 1000;
const maxFamily = 8;
const maxFamRadius = 20;
const dot = 5;
const nearDist = 30;
const farProb = 0.00001;

const DEAD = -1;
const IMMUNE = -2;

const transProb = 0.01;
const virusLife = 100;
const colorInc = Math.floor(255 / virusLife);
const criticalProb = 0.005;
const deathProb = 0.005;

const noneDist = 800;
const cautionDist = 300;
const lockDist = 30;
const radii = [noneDist, cautionDist, lockDist];
var radius = noneDist;

const agentList = [];
var wave = [];
const capacity = familyCount / 2;

const controlsHeight = 160;
const textGapX = 90;
const textGapY = 20;
const textX = side + textGapX;
const textY = controlsHeight + textGapY;
const barOffset = 4;

const plotHeight = 200;
const plotOffsetX = 20;
const plotY = controlsHeight + (textGapY * 6);
var momentList = [];

const buttonOffset = 10;
const buttonWidth = 140;
const buttonHeight = 40;
const cornerRadius = 0;
const noneString = "No intervention";
const cautionString = "With caution";
const lockString = "With lockdown";
var noneButton;
var cautionButton;
var lockButton;
var optionButtons = [];

const resetString = "Reset";
const pauseString = "Pause";
const playString = "Play";
var playState = playString;
// var playState = pauseString;

const buttonList = [];
var currentState = 0;

/* How are buttons going to work?
Each button is:
* A set of coords: x, y, w, h
* Some text
* A background color
* A function to be fired when the coord is touched
*/


// function setupOptionButton(button) {
//     formatButton(button);
//     button.onPress = function() {
//         processClick(button.text);
//     }
//     optionButtons.push(button);
// }

// function formatButton(button) {
//     button.resize(buttonWidth, buttonHeight);    
//     button.cornerRadius = cornerRadius;
//     button.strokeWeight = 1;
// }


// function processClick(msgString) {
//     for (const [i, button] of optionButtons.entries()) {
//         if (msgString == button.text) {
//             button.color = 'lightgray';
//             radius = radii[i];         
//         } else {
//             button.color = 'white';
//         }
//     }
// }

// function toggleGo() {
//     if (goButton.text == playString) {
//         playState = pauseString;
//     } else {        
//         playState = playString;
//     }
//     goButton.text = playState;
// }

function pickButton(value) {
    radius = radii[value];         
    for (const [i, button] of buttonList.entries()) {
        if (i == value) {
            button.color = 'lightgray';
        } else {
            button.color = 'white';            
        }
    }
}

function toggleGo() {
    if (playState == playString) {
        playState = pauseString;
    } else {
        playState = playString;        
    }
    buttonList[4].text = playState;
}


function getDist(a, b) {
    xDist = a.x - b.x;
    yDist = a.y - b.y;
    let distance = Math.sqrt(xDist*xDist + yDist*yDist);
    return distance;
}

function initSim() {
    for (let agent of agentList) {
        agent.state = 0;
        agent.critical = false;
        agent.wasted = false;
    }

    wave = [];
    let seed = Math.floor(Math.random() * agentList.length);
    let seedAgent = agentList[seed];
    seedAgent.state = 1;
    wave.push(seedAgent);

    momentList = [];
    moment = {
        infected: 1,
        critical: 0,
        dead: 0,
        wasted: 0,
        immune: 0,
    };
    momentList.push(moment);

    noStroke();
    fill(255);
    rect(side,0,controlWidth,side);
    stroke(1);   

    textAlign(RIGHT);
    noStroke();
    fill(0);
    // noFill();
    // stroke(0);
    text('Infected:',textX,textY+(textGapY*0));
    text('Critical:',textX,textY+(textGapY*1));
    text('Immune:',textX,textY+(textGapY*2));
    text('Lives lost:',textX,textY+(textGapY*3));
    fill('darkred');
    text('Lives wasted:',textX,textY+(textGapY*4));
}

function updateSim() {
    // Infect agents
    newWave = [];
    for (let agent of wave) {
        if (agent.state > 0) {
            for (let near of agent.join) {
                if (Math.random() < transProb && near.state == 0) {
                    if (getDist(agent, near) < radius) {
                        near.state = 1;
                        newWave.push(near);                        
                    }
                }
            }
        }
    }

    // Progress disease
    let critCount = 0;
    for (let agent of agentList) {

        //If the agent is infected
        if (agent.state > 0) {

            //If the virus is still active
            if (agent.state < virusLife) {

                //If the agent isn't yet critical
                if (!agent.critical) {

                    //If the disease gets bad
                    if (Math.random() < criticalProb) {

                        // If there's healthcare capacity
                        if (critCount < capacity) {
                            agent.critical = true;
                            critCount++;

                        } else {
                            agent.state = DEAD;
                            agent.wasted = true;
                        }
                    }

                } else {

                    //Agents in a critical state may die
                    if (Math.random() < deathProb) {
                        agent.state = DEAD;

                    // If there's healthcare capacity
                    } else if (critCount < capacity) {
                        critCount++;

                    } else {
                        agent.state = DEAD;
                        agent.wasted = true;
                    }
                }

                // If this round of disease progress didn't kill the agent
                // Then they can transmit infection
                if (agent.state > DEAD) {
                    agent.state++;
                    newWave.push(agent);
                }

            } else {
                agent.state = IMMUNE;
            }
        }
    }

    // Count victims
    let infected = 0;
    let critical = 0;
    let dead = 0;
    let wasted = 0;
    let immune = 0;
    for (let agent of agentList) {
        if (agent.state > 0) {
            if (agent.critical) {
                critical++;
            } else {
                infected++;
            }
        } else if (agent.state == DEAD) {
            if (agent.wasted) {
                wasted++;
            } else {
                dead++;
            }
        } else if (agent.state == IMMUNE) {
            immune++;
        }
    }  
    let moment = {
        infected: infected,
        critical: critical,
        dead: dead,
        wasted: wasted,
        immune: immune,
    };
    momentList.push(moment);

    wave = newWave;
}

function drawBar(value, barCol, offset) {

    noStroke();
    fill(255);
    rect(textX + barOffset, textY+(textGapY*offset), 100, textGapY);

    fill(0);
    noStroke();
    textAlign(RIGHT);
    text(`${value}`,textX + barOffset + 12 + 20, textY+(textGapY*offset)+14);

    let plotScale = 2 * plotHeight / agentList.length;
    fill('white');
    noStroke();
    rect(textX + barOffset + 40, textY+(textGapY*offset), 400, textGapY);
    infectLen = value * plotScale;
    fill(barCol);
    rect(textX + barOffset + 40, textY+(textGapY*offset), infectLen, textGapY);


}

function drawSim() {
    // Draw network
    stroke(0);
    for (let agent of agentList) {
        if (agent.state > 0) {
            let shade = agent.state * colorInc;
            if (agent.critical) {
                fill(255,255-shade,255-shade);
            } else {
                fill(255,255,255-shade);
            }
        } else if (agent.state == DEAD) {
            fill(0);
        } else if (agent.state == IMMUNE) {
            fill('forestgreen');
        } else {
            fill(255);            
        }
        ellipse(agent.x,agent.y,dot,dot);
    }

    moment = momentList[momentList.length-1];

    drawBar(moment.infected, 'gold', -.7);
    drawBar(moment.critical, 'crimson', .3);
    drawBar(moment.immune, 'forestgreen', 1.3);
    drawBar(moment.dead, 'black', 2.3);
    drawBar(moment.wasted, 'gray', 3.3);

    // Draw plot
    plotScale = 1 * plotHeight / agentList.length;
    for (const [i, moment] of momentList.entries()) {
        x = side + plotOffsetX + i;

        y = plotY;
        deadLen = plotY + (moment.dead * plotScale);
        stroke(0);
        line(x,y,x,deadLen);

        y = deadLen;
        wastedLen = deadLen + (moment.wasted * plotScale);
        stroke('gray');
        line(x,y,x,wastedLen);

        y = wastedLen;
        immuneLen = wastedLen + (moment.immune * plotScale);
        stroke('forestgreen');
        line(x,y,x,immuneLen);

        if (moment.infected > 0) {
            y = plotY + plotHeight;
            infectLen = moment.infected * plotScale;
            stroke('gold');
            line(x,y,x,y - infectLen);            
        }
        if (moment.critical > 0) {
            y = plotY + plotHeight - infectLen;
            criticalLen = moment.critical * plotScale;
            stroke('crimson');
            line(x,y,x,y - criticalLen);            
        }
    }
}

function setup() {
    createCanvas(side + controlWidth, side);

    //Generate population
    for (let i = 0; i < familyCount; i++) {
        let x = Math.random() * side;
        let y = Math.random() * side;

        let familySize = Math.ceil(Math.random() * maxFamily) ;
        for (let j = 0; j < familySize; j++) {
            let angle = Math.random() * 2 * Math.PI;
            let dist = Math.random() * maxFamRadius;

            let dx = Math.cos(angle) * dist;
            let dy = Math.sin(angle) * dist;

            agent = {
                x:x+dx,
                y:y+dy,
                join:[],
                state:0,
                critical: false,
                wasted: false,
            };
            agentList.push(agent);
        }
    }

    //Connect network
    stroke('rgba(100,100,100,0.2)')
    for (let a of agentList) {
        for (let b of agentList) {
            let farLink = Math.random() < farProb;
            if ((getDist(a,b) < nearDist) || farLink) {
                if (!a.join.includes(b) && !b.join.includes(a)) {
                    a.join.push(b);
                    b.join.push(a);
                    line(a.x,a.y,b.x,b.y);                    
                }
            }
        }
    }

    //Set up controls
    // noneY = buttonOffset;
    // noneButton = new Clickable(side + buttonOffset, noneY);
    // noneButton.text = noneString;
    // setupOptionButton(noneButton);
    // noneButton.color = 'lightgray';

    // cautionY = noneY + buttonOffset + buttonHeight;
    // cautionButton = new Clickable(side + buttonOffset, cautionY);
    // cautionButton.text = cautionString;
    // setupOptionButton(cautionButton);

    // lockY = cautionY + buttonOffset + buttonHeight;
    // lockButton = new Clickable(side + buttonOffset, lockY);
    // lockButton.text = lockString;
    // setupOptionButton(lockButton);

    // resetButton = new Clickable(side + buttonWidth + buttonOffset* 2, noneY);
    // resetButton.text = "Reset";
    // formatButton(resetButton);
    // resetButton.onPress = function() {
    //     initSim();
    //     drawSim();
    // }

    // goButton = new Clickable(side + buttonWidth + buttonOffset* 2, cautionY);
    // goButton.text = playState;
    // formatButton(goButton);
    // goButton.onPress = function() {
    //     toggleGo();
    // }

    noneY = buttonOffset;
    cautionY = noneY + buttonOffset + buttonHeight;
    lockY = cautionY + buttonOffset + buttonHeight;

    noneButton = {
        text: noneString,
        x: side + buttonOffset,
        y: noneY,
        f: function(){pickButton(0);}
    }
    buttonList.push(noneButton);

    cautionButton = {
        text: cautionString,
        x: side + buttonOffset,
        y: cautionY,
        f: function(){pickButton(1);}
    }
    buttonList.push(cautionButton);

    lockButton = {
        text: lockString,
        x: side + buttonOffset,
        y: lockY,
        f: function(){pickButton(2);}
    }
    buttonList.push(lockButton);

    resetButton = {
        text: resetString,
        x: side + buttonWidth + buttonOffset* 2,
        y: noneY,
        f: function(){initSim();drawSim();}
    }
    buttonList.push(resetButton);

    goButton = {
        text: playString,
        x: side + buttonWidth + buttonOffset* 2,
        y: cautionY,
        f: function(){toggleGo()}
    }
    buttonList.push(goButton);

    pickButton(0);
    initSim();
    drawSim();
}

function drawButtons() {
    for (let b of buttonList) {
        fill(b.color);
        stroke(0);
        rect(b.x, b.y, buttonWidth, buttonHeight);
        fill(0);
        noStroke();
        textAlign(CENTER);
        text(b.text, b.x + buttonWidth/2, b.y + buttonHeight/2 + 4);
    }
}

function draw() {
    if (wave.length > 0) {
        if (playState == pauseString) {
            drawSim();
            updateSim();
        }
    }
    drawButtons();    
}

function mouseClicked() {
    console.log('event');
    for (let b of buttonList) {
        if (mouseX > b.x && 
            mouseX < b.x+buttonWidth &&
            mouseY > b.y &&
            mouseY < b.y+buttonHeight) {
            b.f.call();
        }
    }
}
