// -----CRX CODE-----
// @input SceneObject[] obj

var count = 0;

// Enable the first object and disable the rest
script.obj[0].enabled = true;
for (var i = 1; i < script.obj.length; i++) {
    script.obj[i].enabled = false;
}

function onTapped(eventData) {
    count++;

    // Enable the current object and disable the rest
    for (var i = 0; i < script.obj.length; i++) {
        script.obj[i].enabled = (count === i);
    }

    // Reset count if it exceeds the number of objects
    if (count === script.obj.length) {
        count = 0;
        script.obj[0].enabled = true;
    }
}

// Bind the onTapped function to a tap event
var event = script.createEvent("TapEvent");
event.bind(onTapped);
