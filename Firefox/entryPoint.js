function updateCheckbox ( state ) {
    document.getElementById( "js-change-state" ).checked = state;

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

function init () {
    document.getElementById( "js-change-state" ).addEventListener( "change", function ( event ) {
        let state = !!event.target.checked;
        browser.storage.local.set( { "block" : state } ).then( function () {
            updateCheckbox( state );
        } );
    } );

    browser.storage.local.get( { "block" : true } ).then( function( result ) {
        updateCheckbox( result[ "block" ] )
    } );
}

init();