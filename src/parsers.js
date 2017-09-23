const babylon = require( 'babylon' ); // https://github.com/babel/babylon
const defaultPickups = require( './default-pickups' );

function grabStrings ( tokens, baseIndex ) {
  // the basic idea here is that until we find the end of the function
  // we concatinate strings as we find them. When we hit something that
  // isn't a string or allowed operator (paren, comma, plus) we stop adding
  // texts.
  //
  // _( "" )
  // _( "", "", lang )
  // _( ("") + "", lang )
  // _( "" + "", (lang + lang) )
  let nesting = 0;
  const strings = [ '' ];
  // is this a plural function?
  let index = baseIndex + 1;
  while ( index < tokens.length ) {
    const token = tokens[index];
    const type = token.type;
    const tokenIsString = type.label === 'string';
    // console.log( token.value, token.type.label )
    if ( tokenIsString ) {
      strings[strings.length - 1] += token.value;
    }
    else if ( type.label === '+' ) {
      // can ignore this token
    }
    else if ( type.label === ',' ) {
      // create a new string in the chain
      strings.push( '' );
    }
    else if ( type.label === '(' ) {
      nesting += 1;
    }
    else if ( type.label === ')' ) {
      nesting -= 1;
      if ( nesting < 1 ) {
        // found the end
        break;
      }
    }
    else {
      // it's something else, like a variable or some other operator
      // create a new string in the chain? throw error?
      strings.push( '' );
    }
    index++;
  }

  const numAllowedStrings = ( tokens[baseIndex].value === 'ngetText' ) ? 2 : 1;
  return [ index, strings.slice( 0, numAllowedStrings ) ];
}


function parseFile ( raw, functionNames = defaultPickups, fn = '???' ) {
  const messages = [];
  const ast = babylon.parse( raw, {
    sourceFilename: fn,
    sourceType: 'module',
    plugins: [
      'jsx',
      'doExpressions',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      'exportExtensions',
      'asyncGenerators'
    ]
  });
  // index all tokens
  ast.tokens.forEach( ( token, i ) => {
    token.index = i;
  });
  // seek function names that exist in our whitelist
  let index = 0;
  while ( index < ast.tokens.length ) {
    const token = ast.tokens[index];
    const type = token.type;
    // found the function
    if ( type.label === 'name' && type.startsExpr && functionNames.indexOf( token.value ) !== -1 ) {
      // is it being called
      if ( ast.tokens[index + 1].type.label === '(' ) {
        const [ idx, strings ] = grabStrings( ast.tokens, index );
        const pos = ast.tokens[index].loc.start;
        // console.log( idx, strings, pos );
        // emit gettext fmt
        messages.push({
          text: strings[0],
          file: fn,
          line: pos.line
        });
        index = idx;
      }
    }
    index++;
  }
  return messages;
}


function parsePickup ( src ) {
  const [ id, args ] = src.split( ':', 2 );
  let useArgs = new Set();
  let maxArgs = 0;
  let contextArg = null;

  ( args || '1' ).split( ',' ).forEach( s => {
    // glib syntax ‘"msgctxt|msgid"’ is passed right through, sorry
    if ( /^\d+g?$/.test( s ) ) {
      const n = parseInt( s, 10 ) - 1;
      useArgs.add( n );
      maxArgs = Math.max( maxArgs, n + 1 );
    }
    else if ( /^\d+c$/.test( s ) ) {
      const n = parseInt( s, 10 ) - 1;
      contextArg = n;
      useArgs.delete( n ); // in case ARGst has already run
      maxArgs = Math.max( maxArgs, n + 1 );
    }
    else if ( /^\d+st$/.test( s ) ) {
      let n = parseInt( s, 10 );
      maxArgs = n;
      useArgs = new Set();
      while ( n-- ) {
        if ( n !== contextArg ) {
          useArgs.add( n );
        }
      }
    }
  });
  return { id, src, useArgs, maxArgs, contextArg };
}


exports.grabStrings = grabStrings;
exports.parseFile = parseFile;
exports.parsePickup = parsePickup;
