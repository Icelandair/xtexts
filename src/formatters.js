const esc = require( './string-escape' );

/*
  https://poeditor.com/localization/files/po

  - #: (reference)
  - # or #@ or #. (comment)
  - #, fuzzy (fuzzy flag)
  - msgctxt
  - msgid
  - msgid_plural
  - msgstr
*/

function getTextHeader () {
  return `# SOME DESCRIPTIVE TITLE.
# Copyright (C) YEAR THE PACKAGE'S COPYRIGHT HOLDER
# This file is distributed under the same license as the PACKAGE package.
# FIRST AUTHOR <EMAIL@EXAMPLE.COM>, YEAR.
#
#, fuzzy
msgid ""
msgstr ""
"Project-Id-Version: PACKAGE VERSION"
"Report-Msgid-Bugs-To: "
"POT-Creation-Date: 2011-12-22 22:15+0000"
"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE"
"Last-Translator: FULL NAME <EMAIL@EXAMPLE.COM>"
"Language-Team: LANGUAGE <TEAM@EXAMPLE.COM>"
"Language: "
"MIME-Version: 1.0"
"Content-Type: text/plain; charset=CHARSET"
"Content-Transfer-Encoding: 8bit"
`;
}

function getTextFormat ( item ) {
  const message = [
    `#: ${ item.file }:${ item.line }`
  ];
  const e = esc( item.text );
  if ( e.length < 75 ) {
    message.push( `msgid "${ e }"` );
  }
  else {
    // chunk string into 75 char lines
    message.push( 'msgid ""' );
    let s = '';
    e.split( /(\s)/ ).forEach( b => {
      if ( s.length + b.length < 74 ) {
        s = s + b;
      }
      else {
        message.push( `"${ s }"` );
        s = b;
      }
    });
    if ( s ) {
      message.push( `"${ s }"` );
    }
  }
  message.push( 'msgstr ""', '' );
  return message.join( '\n' );
}

exports.po = function ( messages ) {
  return ( getTextHeader() + '\n' + messages.map( getTextFormat ).join( '\n' ) ).trim();
};


/*
  https://poeditor.com/localization/files/csv

  - To work with POEditor, .csv files need to be encoded in UTF-8,
    like all our supported formats.
  - POEditor parses 5 columns, beginning with the first row.
    The order is term, translation (optional), context (optional),
    reference (optional), comment (optional).
  - Since POEditor accepts only one translation for each term, work
    with plurals is not possible in the case of CSV files.
*/
exports.CSV = function ( messages ) {
  return '"msgid","msgstr","context","reference","comment"\n' + messages.map( d => {
    return `"${ esc( d.text ) }","","","${ esc( d.file ) }:${ d.line }",""`;
  }).join( '\n' );
};


/*
  https://poeditor.com/localization/files/csv

  - To work with POEditor, .csv files need to be encoded in UTF-8,
    like all our supported formats.
  - POEditor parses 5 columns, beginning with the first row.
    The order is term, translation (optional), context (optional),
    reference (optional), comment (optional).
  - Since POEditor accepts only one translation for each term, work
    with plurals is not possible in the case of CSV files.
*/
exports.JSON = function ( messages ) {
  const collection = messages.map( d => {
    return {
      term: d.text,
      definition: '',
      reference: `${ d.file }:${ d.line }`
    };
  });
  return JSON.stringify( collection, null, 2 );
};


/*
  This will emit a JSON dict intended to help analysing where each string is used
*/
exports.JSONobj = function ( messages ) {
  const collection = {};
  messages.forEach( d => {
    if ( !collection.hasOwnProperty( d.text ) ) {
      collection[d.text] = [];
    }
    collection[d.text].push( `${ d.file }:${ d.line }` );
  });
  return JSON.stringify( collection, null, 2 );
};

