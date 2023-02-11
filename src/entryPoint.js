function updateCheckbox (state) {
    document.getElementById( "js-change-state" ).checked = state;

    if (state) {
        document.getElementById("js-status").classList.toggle("green", false);
        document.getElementById("js-status").classList.toggle("red", true);
        document.getElementById("js-status").innerText = "😭 CDA nie dostaje hajsu za reklamy 😭";
    }
    else {
        document.getElementById("js-status").classList.toggle("green", true);
        document.getElementById("js-status").classList.toggle("red", false);
        document.getElementById("js-status").innerText = "💲 obecnie dajesz zarobić CDA! Oby tak dalej 💲";
    }
}

function init () {
    document.getElementById("js-change-state").addEventListener("change", (event) => {
        let state = !!event.target.checked;
        chrome.storage.local.set({"block" : state}, () => {
            updateCheckbox(state);
        });
    });

    chrome.storage.local.get({"block" : true}, (result) => {
        updateCheckbox(result["block"])
    });
}

init();