/* TODO:
 * What do we want next?
 * 
 * Different species?
 * Temperature options?
 *
 *
 */


const radius = 5;
const sense = 25;
const ripple = 25;

const clock = 80;//150;50;
const anim = 150;
const initCount = 2000;//2000;

const fireProbL = 0.02;//Natural case
const fireProbR = 0.001;//Suppression case
// const fireProb = fireProbL;

const growthStep = 1000;
const radInc = 2;
const burnRate = 0.9;

const treeColors = [
    "#ABEBC6",
    "#82E0AA",
    "#58D68D",
    "#2ECC71",
    "#28B463",
    "#239B56",
    "#1D8348"
];

var treeList = [];
var fireList = [];
var step = 0;
var showAnim = false;
var treeGrid = [];

const w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    width = -10 + w.innerWidth || e.clientWidth || g.clientWidth,
    height = -20 + w.innerHeight|| e.clientHeight|| g.clientHeight,
    split = width/2;

var draw = SVG('svgCanvas').size(width, height);
document.body.style.backgroundColor = "black";

var textL = draw.text("Natural Forest")
textL.move(50, height - 120);
// textL.fill('mediumorchid');
textL.fill('white');
textL.opacity(0.9);
textL.font({size:60});

var textR = draw.text("Fire Suppression")
textR.move(split+50, height - 120);
// textR.fill('mediumorchid');
textR.fill('white');
// textR.opacity(0.9);
textR.opacity(0.95);
textR.font({size:60});

// var divider = draw.line(split, 0, split, height).stroke({width:6})
// divider.stroke('lightgray');
// divider.opacity(0.8);


/* Upon click, add a new agent to the canvas
 */
var clickHandler = function(e) {
    drop(e.x - radius, e.y - radius, 1);
    checkAgents();
}
draw.on('click', clickHandler);

/* Function to be run at every clock step
 */
function add() {

    if (fireList.length == 0) {
        let x = Math.floor(Math.random() * width);
        let y = Math.floor(Math.random() * height);
        state = 0;
        
        if (Math.random() < fireProb(x)) {
            state = 1;
        }
        drop(x, y, state);
    }
    checkAgents();

    textL.front();
    textR.front();
//     divider.front();
    step++;
}
var timer = setInterval(add, clock);

function init() {
    showAnim = false;
    for (let i = 0; i < initCount; i++) {
        add();
    }
    showAnim = true;
}
init();


/* When adding a node, animate a circle, add the node to the appropriate list.
 */
function drop(x, y, state) {

    let agent = draw.circle(radius*2, radius*2);
    agent.cx(x).cy(y);
    agent.id = step;
    agent.age = 0;

    color = treeColors[0];
    if (state == 0) {
        color = treeColors[0];
        treeList.push(agent);

        if (showAnim) {
            let ring = draw.circle(ripple).fill('none').stroke({color:color,width:2});
            ring.cx(x).cy(y);
            ring.animate(anim*3).radius(1).after(()=>{ring.remove()});
        }

    } else {
        color = 'white';
        fireList.push(agent);
        agent.age = 10;

        if (showAnim) {
            let ring = draw.circle(1).fill('white').stroke({color:color,width:2});
            ring.cx(x).cy(y);
            ring.animate(anim*1).radius(ripple*2).after(()=>{ring.remove()});    
        }
    }
    agent.fill(color);
}

/* Check the state of the agent list and update where necessary.
 */
function checkAgents() {
    newTreeList = [];
    newFireList = [];

    for (tree of treeList) {
        /* Iterate over the elements in the tree list
        * Iterate over the elements in the fire list
        * If a tree is near a fire, add it to the fire list
        * Otherwise, add it to the new tree list
        */

        caught = false;
        for (fire of fireList) {

            // burnProb = burnRate * Math.pow(burnFactor,(tree.age/fire.age))
            burnProb = Math.pow(burnRate,(tree.age/fire.age))
            if (prox(tree, fire) && Math.random() < (burnProb)) {
                tree.fill('orangered');

                if (showAnim) {
                    let ring1 = draw.circle(1).fill('none').stroke({color:'orangered',width:2});
                    ring1.cx(tree.cx()).cy(tree.cy());
                    ring1.animate(anim*3).radius(ripple).after(()=>{ring1.remove()});
    
                    let ring2 = draw.circle(1).fill('none').stroke({color:'orange',width:2});
                    ring2.cx(tree.cx()).cy(tree.cy());
                    ring2.animate(anim*3).radius(ripple-5).after(()=>{ring2.remove()});
    
                    let ring3 = draw.circle(1).fill('none').stroke({color:'yellow',width:2});
                    ring3.cx(tree.cx()).cy(tree.cy());
                    ring3.animate(anim*3).radius(ripple-10).after(()=>{ring3.remove()});    
                }

                newFireList.push(tree);
                caught = true;
                break
            }
        }
        if (!caught) {
            tree.age = Math.floor((step - tree.id)/growthStep)
            colorIndex = Math.min(treeColors.length, tree.age)
            newRad = radius + (radInc * colorIndex)
            tree.radius(newRad)
            tree.fill(treeColors[colorIndex])
            newTreeList.push(tree);
        }
    }

    for (fire of fireList) {
        fire.remove();
    }
    treeList = newTreeList;
    fireList = newFireList;
}

/* Does agent fall within sensing radius of another
*/
function prox(agent, other) {

    let xDist = agent.x() - other.x();
    let yDist = agent.y() - other.y();
    let dist = Math.sqrt(xDist*xDist + yDist*yDist);

    let result = false;
    if (dist < sense && isLeft(agent) == isLeft(other)) result = true;
    return result;
}

function isLeft(agent) {
    return agent.cx() < split;
}

function fireProb(x) {
    result = fireProbR;
    if (x < split) {
        result = fireProbL;
    }
    return result;
}
