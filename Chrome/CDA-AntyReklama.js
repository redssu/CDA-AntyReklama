window.skipAd = true;
window.isCDAFrame = false;

function skipVideo () {
    if ( window.skipAd == false || window.isCDAFrame == false ) {
        return;
    }
    
    let advertisement = document.querySelector( "video.pb-ad-video-player" );
    if ( advertisement == null || advertisement.paused || advertisement.ended ) {
        return;
    }

    advertisement.currentTime = advertisement.duration;
    console.log( "[CDA-AntyReklama.js] Skipping the advertisement" );
}

function detectVideoAndAttachHook () {
    if ( window.isCDAFrame == false ) {
        return;
    }

    let video = document.querySelector( "video.pb-ad-video-player" );

    if ( video == null ) {
        return;
    }

    video.addEventListener( "play", skipVideo );
    video.addEventListener( "timeupdate", skipVideo );
    console.log( "[CDA-AntyReklama.js] Hooking up the blocker" );
}

window.onload = function () {
    if ( !window.location.host.includes( "cda" ) ) {
        return;
    }

    console.log( "[CDA-AntyReklama.js] Injected" ); 
    window.isCDAFrame = true;

    chrome.storage.local.get( [ "block" ], function( result ) {
        if ( result[ "block" ] === undefined 
        || typeof result[ "block" ] == "undefined" ) {
            result[ "block" ] = true;
        }
        
        window.skipAd = result[ "block" ];
    } );

    let container = document.querySelector( ".pb-video-ad-container" );
    let observer = new MutationObserver( detectVideoAndAttachHook );

    observer.observe( container, {
        "childList": true,
        "subtree": true,
        "attributes": true
    } );

    detectVideoAndAttachHook();
}

chrome.runtime.onMessage.addListener( function ( message ) {
    if ( window.isCDAFrame == false ) {
        return;
    }

    console.log( "[CDA-AntyReklama.js] Received new blocking state: " + message.state );
    if ( message.hasOwnProperty( "state" ) ) {
        window.skipAd = message.state;
    }
} );