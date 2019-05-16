import React from "react";

export const Visibility = ({
    // Set the name of the hidden property and the change event for visibility
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }



    function handleVisibilityChange() {
        if (document[hidden]) {
            console.log("Someone is cheating")
            // call the handlesubmit function and set curChoice as ""
        } else {
            console.log("Everything is good, no calls")
        }
    }

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === "undefined" || hidden === undefined) {
        console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
    } else {
        // Handle page visibility change   
        document.addEventListener(visibilityChange, handleVisibilityChange, false);    

    }
})
