const tape = require( 'tape' );
const xtext = require( '../' );

tape( 'parseFile funtionality', t => {
  t.equal( typeof xtext.parseFile, 'function', 'xtext.parseFile is a function' );

  t.deepEqual(
    xtext.parseFile( `
      function testFn () {
        return _("translatable")
      }
    ` ),
    [ { text: 'translatable', file: '???', line: 3 } ],
    'basic parsing'
  );

  t.deepEqual(
    xtext.parseFile( `
      function _ ( messageId ) {
        return "This is my translation function!"
      }
    ` ),
    [],
    'must not pick up function declarations'
  );

  t.deepEqual(
    xtext.parseFile( `
      function getText ( messageId ) {
        return 'A translation';
      }
    ` ),
    [],
    'must not pick up function declarations'
  );

  t.deepEqual(
    xtext.parseFile( `
      class German extends Language {
        getText (messageId) {
          return 'A translation'
        }
      }
    ` ),
    [],
    'must not pick up class methods declarations'
  );

  t.deepEqual(
    xtext.parseFile( `
      import defaultMember from "module-name";
      import * as name from "module-name";
      import { member } from "module-name";
      import { member as alias } from "module-name";
      import { member1 , member2 } from "module-name";
      import defaultMember, * as name from "module-name";
      import "module-name";
    ` ),
    [],
    'supports import syntax'
  );

  t.deepEqual(
    xtext.parseFile( `
      export { name1, name2 };
      export { variable1 as name3, variable2 as name4 };
      export let name5;
      export default function () {}
    ` ),
    [],
    'supports exports syntax'
  );

  t.deepEqual(
    xtext.parseFile( `
      async function name(param1, param2) {
        const [a, b] = [10, 20];
        const [c, d, ...rest] = [10, 20, 30, 40, 50];
        let objClone = { ...param2 };
      }
    ` ),
    [],
    'supports async function and spread syntax'
  );

  t.deepEqual(
    xtext.parseFile( `
      import React from 'react';
      export default function SomeComponent (props) {
        return (<div>{props.children}</div>);
      }
    ` ),
    [],
    'supports JSX syntax'
  );

  t.deepEqual(
    xtext.parseFile( `
      import React from 'react';
      export default function SomeComponent (props) {
        return (<div>{_('translatable')}</div>);
      }
    ` ),
    [ { text: 'translatable', file: '???', line: 4 } ],
    'picks up terms embedded in JSX syntax'
  );

  t.deepEqual(
    xtext.parseFile( `
      import React from 'react';
      interface Props { text:string}
      export default function SomeComponent (props) {
        return (<div>{_('translatable')}</div>);
      }
    ` ),
    [ { text: 'translatable', file: '???', line: 5 } ],
    'picks up terms embedded in SX syntax'
  );

  t.deepEqual(
    xtext.parseFile( `
      foo.hasOwnProperty('bar')
    ` ),
    [ ],
    'must not crash dealing with prototype functions'
  );

  t.end();
});


tape( 'parsePickup funtionality', t => {
  t.equal( typeof xtext.parsePickup, 'function', 'xtext.parsePickup a function' );

  function parse ( raw ) {
    const pickup = xtext.parsePickup( raw );
    return [ pickup.id, pickup.maxArgs ].concat( Array.from( pickup.useArgs ) );
  }

  t.deepEqual( parse( '_' ), [ '_', 1, 0 ], 'pickup: _' );
  t.deepEqual( parse( 'foo' ), [ 'foo', 1, 0 ], 'pickup: foo' );
  t.deepEqual( parse( 'foo:2' ), [ 'foo', 2, 1 ], 'pickup: foo:2' );
  t.deepEqual( parse( 'dcnpgettext:2c,3,4' ), [ 'dcnpgettext', 4, 2, 3 ], 'pickup: dcnpgettext:2c,3,4' );

  t.end();
});


