suite('search/binary-search-tree#insert', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/search/binary-search-tree/binary-search-tree',
      'tsr/search/binary-search-tree/binary-search-tree'
    ], (p, t) => {
      pkg = p;
      tsr = t;
    });
  });

  bench('ts-runtime', function() {
    var tree = { root: tsr.createNode(3) };
    var leaf = tsr.createNode(2);
    tsr.insert(tree, leaf);
  });

  bench('original', function() {
    var tree = { root: pkg.createNode(3) };
    var leaf = pkg.createNode(2);
    pkg.insert(tree, leaf);
  });

});
