suite('misc/longest-common-subsequence#findLCS', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/misc/longest-common-subsequence/longest-common-subsequence',
      'tsr/misc/longest-common-subsequence/longest-common-subsequence'
    ], (p, t) => {
      pkg = p;
      tsr = t;
    });
  });
  
  bench('ts-runtime', function() {
    tsr.findLCS('ABCBDAB', 'BDCABA');
  });
  
  bench('original', function() {
    pkg.findLCS('ABCBDAB', 'BDCABA');
  });

});
