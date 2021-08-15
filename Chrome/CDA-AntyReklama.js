window.skipAd = true;

function skipVideo ( event ) {
    if ( !window.skipAd ) {
        return;
    }
    
    let advertisement = event.currentTarget == null ? event.target : event.currentTarget;

    if ( advertisement == null || advertisement.paused || advertisement.ended ) {
        return;
    }

    advertisement.currentTime = isFinite( advertisement.duration ) ? advertisement.duration : 600;
    console.log( "[CDA-AntyReklama.js] Skipping the advertisement" );
}

function detectVideoAndAttachHook () {
    let container = document.querySelector( ".pb-video-ad-container" );

    if ( container == null ) {
        return;
    }

    let videos = [ ...container.querySelectorAll( "video" ) ];

    if ( videos.length == 0 ) {
        return;
    }

    videos.forEach( function ( video ) {
        video.addEventListener( "play", skipVideo );
        video.addEventListener( "timeupdate", skipVideo );
        console.log( "[CDA-AntyReklama.js] Hooking up the blocker to video object" );
    } );
}

window.onload = function () {
    console.log( "[CDA-AntyReklama.js] Injected" ); 

    chrome.storage.local.get( { "block" : true }, function ( result ) {
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

chrome.storage.onChanged.addListener( function ( changes, area ) {
    if ( area == "local" && changes.hasOwnProperty( "block" ) ) {
        console.log( "[CDA-AntyReklama.js] Received new blocking state" );
        window.skipAd = !!changes[ "block" ].newValue;
    }
} );