const width = 600;
const height = 600;

// const radius = 10;
// const sense = 30;
// const jump = 20;
// const ripple = 30;

// const radius = 5;
// const sense = 20;
// const jump = 15;
// const ripple = 20;

const radius = 5;
const sense = 15;
const jump = 50;
const ripple = 15;

const hashCols = width / sense;
const hashRows = height / sense;
const clock = 250;
const anim = 150;

var timer = setInterval(add, clock);
var agentList = [];
var step = 0;
// var moved = 0;
var moved = [];

var draw = SVG('svgCanvas').size(width, height);

function add() {

    if (moved.length == 0) {
        let x = Math.floor(Math.random() * width);
        let y = Math.floor(Math.random() * height);

        let agent = draw.circle(radius*2, radius*2);
        agent.fill('Black');
        agent.cx(x).cy(y);
        agent.id = step;
        agentList.push(agent);

        let ring = draw.circle(1).fill('none').stroke({color:'Black',width:2});
        ring.cx(x).cy(y);
        ring.animate(anim*3).radius(ripple).after(()=>{ring.remove()});

        moved.push(agent);
    }

    checkAgents();
    // console.log("x:"+agent.x()+" y:"+agent.y()+" id:"+agent.id);

    step++;
}

function checkAgents() {
    keepList = [];

    for (agent of agentList) {
        // console.log("x:"+agent.x()+" y:"+agent.y()+" id:"+agent.id);

        agent.deltaX = 0;
        agent.deltaY = 0;
        agent.fill('Black');

        if (agent.cx() < 0 ||
        agent.cx() > width ||
        agent.cy() < 0 ||
        agent.cy() > height) {

            //Item needs to be removed.
            agent.remove();

        } else {

            /* TODO
            How do I make this loop a lot faster?
            */

            for (other of moved) {
                if (agent != other && prox(agent, other)) {
                    // console.log("Found one");
                    let dx = agent.x() - other.x();
                    let dy = agent.y() - other.y();
                    agent.deltaX += dx;
                    agent.deltaY += dy;
                    agent.fill('Red');
                }
            }
            keepList.push(agent);
        }
    }
    agentList = keepList;

    moved = [];
    for (agent of agentList) {
        let dist = Math.sqrt(Math.pow(agent.deltaX,2) + Math.pow(agent.deltaY,2));
        if (dist > 0) {
            let ux = agent.deltaX/dist;
            let uy = agent.deltaY/dist;
            moved.push(agent);

            let ring = draw.circle(1).fill('none').stroke({color:'Red',width:2});
            ring.cx(agent.cx()).cy(agent.cy());
            ring.animate(anim*3).radius(ripple).after(()=>{ring.remove()});

            ux *= jump;
            uy *= jump;
            agent.animate(anim).dmove(ux, uy);
        }
        // console.log('ux:'+ux+' uy:'+uy+' dist:'+dist+" dX:"+agent.deltaX+" dY:"+agent.deltaY);
    }
}

function prox(agent, other) {
    // console.log("ax:"+agent.x()+" ay:"+agent.y()+" ox:"+other.x()+" oy:"+other.y());

    let xDist = agent.x() - other.x();
    let yDist = agent.y() - other.y();
    let dist = Math.sqrt(xDist*xDist + yDist*yDist);
    // console.log("dist:"+dist);
    let result = false;
    // if (dist < sense && dist > 0) result = true;
    if (dist < sense) result = true;
    return result;
}
