
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
