function updateCheckbox ( state ) {
    if ( state ) {
        document.getElementById( "js-status" ).classList.toggle( "green", false );
        document.getElementById( "js-status" ).classList.toggle( "red", true );
        document.getElementById( "js-status" ).innerText ="😭 CDA nie dostaje hajsu za reklamy 😭";
    }
    else {
        document.getElementById( "js-status" ).classList.toggle( "green", true );
        document.getElementById( "js-status" ).classList.toggle( "red", false );
        document.getElementById( "js-status" ).innerText = "💲 obecnie dajesz zarobić CDA! Oby tak dalej 💲";
    }
}

function propagateChange ( state ) {
    chrome.tabs.query( { "url" : chrome.runtime.getManifest().content_scripts[ 0 ].matches }, function ( tabs ) {
        let obj = { "state": state };
        for ( let i = 0; i < tabs.length; i++ ) {
            chrome.tabs.sendMessage( tabs[ i ].id, obj );
        }
    } );
}

function init () {
    document.getElementById( "js-change-state" ).addEventListener( "change", function ( event ) {
        let state = !!event.target.checked;
        chrome.storage.local.set( { "block" : state } );
        updateCheckbox( state );
        propagateChange( state );
    } );

    chrome.storage.local.get( [ "block" ], function( result ) {
        if ( result[ "block" ] === undefined 
        || typeof result[ "block" ] == "undefined" ) {
            chrome.storage.local.set( { "block" : false } );
            result[ "block" ] = false;
        }

        document.getElementById( "js-change-state" ).checked = result[ "block" ];
        updateCheckbox( result[ "block" ] )
    } );
}

init();