window.skipAd = true;
window.isCDAFrame = false;

function skipVideo () {
    if ( !window.skipAd ) {
        return;
    }
    
    let advertisement = document.querySelector( "video.pb-ad-video-player" );

    if ( advertisement == null || advertisement.paused || advertisement.ended ) {
        return;
    }

    advertisement.currentTime = isFinite( advertisement.duration ) ? advertisement.duration : 600;
    console.log( "[CDA-AntyReklama.js] Skipping the advertisement" );
}

function detectVideoAndAttachHook () {
    let video = document.querySelector( "video.pb-ad-video-player" );

    if ( video == null ) {
        return;
    }

    video.addEventListener( "play", skipVideo );
    video.addEventListener( "timeupdate", skipVideo );
    console.log( "[CDA-AntyReklama.js] Hooking up the blocker to video object" );
}

window.onload = function () {
    console.log( "[CDA-AntyReklama.js] Injected" ); 
    
    browser.storage.local.get( { "block" : true } ).then( function ( result ) {
        window.skipAd = result[ "block" ];
    } );

    let container = document.querySelector( ".pb-video-ad-container" );

    if ( container == null ) {
        return;
    }

    let observer = new MutationObserver( detectVideoAndAttachHook );

    observer.observe( container, {
        "childList": true,
        "subtree": true,
        "attributes": true
    } );

    detectVideoAndAttachHook();
}

browser.storage.onChanged.addListener( function ( changes, area ) {
    if ( area == "local" && changes.hasOwnProperty( "block" ) ) {
        console.log( "[CDA-AntyReklama.js] Received new blocking state" );
        window.skipAd = !!changes[ "block" ].newValue;
    }
} );