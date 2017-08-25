suite('search/binary-search#binarySearch', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/search/binary-search/binary-search',
      'tsr/search/binary-search/binary-search'
    ], (p, t) => {
      pkg = p;
      tsr = t;
    });
  });

  bench('ts-runtime', function() {
    var input = [1, 2, 3, 4, 5, 6];
    tsr.binarySearch(input, 5, 0, input.length - 1);
  });

  bench('original', function() {
    var input = [1, 2, 3, 4, 5, 6];
    pkg.binarySearch(input, 5, 0, input.length - 1);
  });

});
