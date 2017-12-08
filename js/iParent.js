/* TODO
What do I want to have happen in here?

Each child is initialized with the data.
Each child sends messages to the parent when events occur.
Each child tags its identity in messages that it sends.
The parent forwards messages to those children where the event did not originate.

*/

var data = [
    {
        name:"Bacon",
        color:"Firebrick",
        image:"bacon.png"
    },
    {
        name:"Blackberry",
        color:"Indigo",
        image:"black.png"
    },
    {
        name:"Chocolate",
        color:"#663501",
        image:"choc.png"
    },
    {
        name:"Cinnamon",
        color:"Saddlebrown",
        image:"cinn.png"
    },
    {
        name:"Coconut",
        color:"Peru",
        image:"cocon.png"
    },
    {
        name:"Coffee",
        color:"#926A2B",
        image:"coffee.png"
    },
    {
        name:"Garlic",
        color:"Lightsalmon",
        image:"garl.png"
    },
    {
        name:"Honey",
        color:"Gold",
        image:"honey.png"
    },
    {
        name:"Jalapeno",
        color:"Green",
        image:"jala.png"
    },
    {
        name:"Lime",
        color:"Lime",
        image:"lime.png"
    },
    {
        name:"Mandarin",
        color:"Orange",
        image:"mand.png"
    },
    {
        name:"Mint",
        color:"GreenYellow",
        image:"mint.png"
    },
    {
        name:"Pomegranate",
        color:"Crimson",
        image:"pom.png"
    },
    {
        name:"Siracha",
        color:"Darkred",
        image:"sirach.png"
    },
    {
        name:"Apple",
        color:"Darkred",
        image:"apple.png"
    },
    {
        name:"Blueberry",
        color:"Darkred",
        image:"blueb.png"
    },
    {
        name:"Caramel",
        color:"Darkred",
        image:"caramel.png"
    },
    {
        name:"Popcorn",
        color:"Darkred",
        image:"popcorn.png"
    },
];
var child1 = document.getElementById("child1").contentWindow;
var child2 = document.getElementById("child2").contentWindow;

window.onload = function() {

    window.onmessage = (event) => {
        console.log("message received from parent");
        if (event.data) {
            // document.getElementById("content").innerHTML = event.data;
            console.log(JSON.stringify(event));
            console.log(JSON.stringify(event.data));

            /* TODO
            What do incoming messages actually need?
            > An action identifier.
            > State data.

            What do outgoing messages need?
            The same thing.
            */

            if (event.data.action === "UpdateSelection") {
                console.log("Updating selection");
                sendMessage(child2, "Update", event.data.selection);

            } else if (event.data.action === "RemoveIngredient") {
                sendMessage(child1, "Remove", event.data.selection);
                reflectMessage(event.data.selection);

            } else if (event.data.action === "FreezeOptions") {
                sendMessage(child1, "Freeze", event.data.selection);
                reflectMessage(event.data.selection);

            } else if (event.data.action === "UpdateRecipe") {
                sendMessage(child1, "Unfreeze", event.data.selection);
                reflectMessage(event.data.selection);
            }
        }
    }

    var initMessage = {
        action:"Init",
        content:data
    }
    child1.postMessage(initMessage,"*");
    child2.postMessage(initMessage,"*");
}

function sendMessage(child, action, data) {
    let message = {
        action:action,
        content:data
    }
    child.postMessage(message,"*")

}

function reflectMessage(data) {
    //TODO
}
