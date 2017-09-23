const tape = require( 'tape' );
const xtext = require( '../' );
const { formatJSON, formatCSV, formatPo } = require( '../' );

const termlist = [
  { text: 'foo', file: 'path/somefile.js', line: 3 },
  { text: 'bar', file: 'path/somefile.js', line: 54 },
  { text: 'baz', file: 'path/to/otherfile.js', line: 15 }
];

tape( 'parseFile funtionality', t => {
  t.equal( typeof xtext.parseFile, 'function', 'xtext.parseFile is a function' );

  t.equal( formatJSON( termlist ),
    JSON.stringify( [
      {
        'term': 'foo',
        'definition': '',
        'reference': 'path/somefile.js:3'
      },
      {
        'term': 'bar',
        'definition': '',
        'reference': 'path/somefile.js:54'
      },
      {
        'term': 'baz',
        'definition': '',
        'reference': 'path/to/otherfile.js:15'
      }
    ], null, 2 ),
    'JSON format' );

  t.equal( formatCSV( termlist ), `
"msgid","msgstr","context","reference","comment"
"foo","","","path/somefile.js:3",""
"bar","","","path/somefile.js:54",""
"baz","","","path/to/otherfile.js:15",""
`.trim(), 'CSV format' );

  t.equal( formatPo( termlist ), `
# SOME DESCRIPTIVE TITLE.
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

#: path/somefile.js:3
msgid "foo"
msgstr ""

#: path/somefile.js:54
msgid "bar"
msgstr ""

#: path/to/otherfile.js:15
msgid "baz"
msgstr ""
`.trim(), 'Po format' );

  t.end();
});


tape( 'parsePickup funtionality', t => {
  t.equal( typeof xtext.parsePickup, 'function', 'xtext.parsePickup a function' );

  t.end();
});


