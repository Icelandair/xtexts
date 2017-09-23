module.exports = s => String( s || '' ).replace( /"/g, '\\"' ).replace( /\n/g, '\\n' );
