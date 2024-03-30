window.skipAd = true;
window.lastAdSkippedTime = null;

let getTimestamp = () => (new Date()).getTime();

function skipVideo(event) {
    if (!window.skipAd) {
        return;
    }
    
    let advertisement = event.currentTarget == null ? event.target : event.currentTarget;

    if (advertisement == null || advertisement.paused || advertisement.ended) {
        return;
    }

    if (window.lastAdSkippedTime != null) {
        if (getTimestamp() - window.lastAdSkippedTime < 1000) {
            console.log("[CDA-AntyReklama.js] Skipping is throttled");
            return;
        }
    }

    window.lastAdSkippedTime = getTimestamp();

    advertisement.currentTime = isFinite(advertisement.duration) ? Math.ceil(advertisement.duration) : 600;
    console.log("[CDA-AntyReklama.js] Skipping the advertisement");
}

function detectVideoAndAttachHook() {
    let container = document.querySelector(".pb-video-ad-container");

    if (container == null) {
        return;
    }

    let videos = [...container.querySelectorAll("video")];

    if (videos.length == 0) {
        return;
    }

    videos.forEach((video) => {
        video.addEventListener("play", skipVideo);
        video.addEventListener("timeupdate", skipVideo);
        console.log("[CDA-AntyReklama.js] Hooking up the blocker to video object");
    });
}

window.onload = () => {
    console.log("[CDA-AntyReklama.js] Injected"); 

    chrome.storage.local.get({"block" : true}, (result) => {
        window.skipAd = result["block"];
    });

    let container = document.querySelector(".pb-video-ad-container");

    if (container == null) {
        return;
    }

    let observer = new MutationObserver(detectVideoAndAttachHook);

    observer.observe(container, {
        "childList": true,
        "subtree": true,
        "attributes": true
    });

    detectVideoAndAttachHook();
}

chrome.storage.onChanged.addListener((changes, area) => {
    if (area == "local" && changes.hasOwnProperty("block")) {
        console.log("[CDA-AntyReklama.js] Received new blocking state");
        window.skipAd = !!changes["block"].newValue;
    }
});