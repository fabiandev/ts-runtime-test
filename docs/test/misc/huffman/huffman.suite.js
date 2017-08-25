suite('misc/huffman#huffman', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/misc/huffman/huffman',
      'tsr/misc/huffman/huffman'
    ], (p, t) => {
      pkg = p;
      tsr = t;
    });
  });

  bench('ts-runtime', function() {
    tsr.huffman([
      { char: 'a', frequency: 45 },
      { char: 'b', frequency: 13 },
      { char: 'c', frequency: 12 },
      { char: 'd', frequency: 16 },
      { char: 'e', frequency: 9 },
      { char: 'f', frequency: 5 },
    ]);
  });

  bench('original', function() {
    pkg.huffman([
      { char: 'a', frequency: 45 },
      { char: 'b', frequency: 13 },
      { char: 'c', frequency: 12 },
      { char: 'd', frequency: 16 },
      { char: 'e', frequency: 9 },
      { char: 'f', frequency: 5 },
    ]);
  });

});
