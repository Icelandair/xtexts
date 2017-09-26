const tape = require( 'tape' );
const { parsePickup, parseFile } = require( '../' );


tape( 'simple extraction', t => {
  const pickup = 'trans';
  const input = `
    trans('string1');
    trans("string1", 10, "string2", gap, "string3");
    trans("string1", variable / 5, "string2", gap, "string3");
  `;
  const expected = [
    { text: 'string1', file: '???', line: 2 },
    { text: 'string1', file: '???', line: 3 },
    { text: 'string1', file: '???', line: 4 }
  ];
  t.deepEqual( parseFile( input, [ parsePickup( pickup ) ] ), expected, `pickup: ${ pickup }` );
  t.end();
});


tape( 'second arg extraction', t => {
  const pickup = 'trans:2';
  const input = `
    trans('string1');
    trans("string1", "string2", gap, "string3");
    trans("string1", 'string2');
    trans("string1", variable / 5);
    trans('e' + foo * bar, "string2");
  `;
  const expected = [
    { text: '', file: '???', line: 2 },
    { text: 'string2', file: '???', line: 3 },
    { text: 'string2', file: '???', line: 4 },
    { text: '', file: '???', line: 5 },
    { text: 'string2', file: '???', line: 6 }
  ];
  t.deepEqual( parseFile( input, [ parsePickup( pickup ) ] ), expected, `pickup: ${ pickup }` );
  t.end();
});


tape( 'plural extraction', t => {
  const pickup = 'ntrans:1,2';
  const input = `
    ntrans('string1');
    ntrans("string1", "string2", n, "string3");
    ntrans("string1", 'string2');
    ntrans("string1", variable / 5, "string3");
    ntrans('e' + foo * bar, "string2", 'string3');
  `;
  const expected = [
    { text: 'string1', file: '???', line: 2 },
    { text: '', file: '???', line: 2 },
    { text: 'string1', file: '???', line: 3 },
    { text: 'string2', file: '???', line: 3 },
    { text: 'string1', file: '???', line: 4 },
    { text: 'string2', file: '???', line: 4 },
    { text: 'string1', file: '???', line: 5 },
    { text: '', file: '???', line: 5 },
    { text: '', file: '???', line: 6 },
    { text: 'string2', file: '???', line: 6 }
  ];
  t.deepEqual( parseFile( input, [ parsePickup( pickup ) ] ), expected, `pickup: ${ pickup }` );
  t.end();
});


tape( 'plural extraction', t => {
  const pickup = 'ctrans:3c,2';
  const input = `
    ctrans(n, 'string1', 'context1');
    ctrans(n, 'string1', 'context2');
    ctrans(n, "string1", 10, "string2", gap, "string3");
    ctrans(n, "string1", variable / 5, "string2", gap, "string3");
  `;
  const expected = [
    { text: 'string1', file: '???', line: 2 },
    { text: 'string1', file: '???', line: 3 },
    { text: 'string1', file: '???', line: 4 },
    { text: 'string1', file: '???', line: 5 }
  ];
  t.deepEqual( parseFile( input, [ parsePickup( pickup ) ] ), expected, `pickup: ${ pickup }` );
  t.end();
});
