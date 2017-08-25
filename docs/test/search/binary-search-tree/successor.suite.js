suite('search/binary-search-tree#successor', function(suite) {
  var pkg, tsr, pkgCreateBST, tsrCreateBST;

  setup(function() {
    require([
      'pkg/search/binary-search-tree/binary-search-tree',
      'tsr/search/binary-search-tree/binary-search-tree'
    ], (p, t) => {
      pkg = p;
      tsr = t;
      
      pkgCreateBST = function createBST() {
        return pkg.createNode(
          15,
          pkg.createNode(
            6,
            pkg.createNode(3, pkg.createNode(2), pkg.createNode(4)),
            pkg.createNode(7, null, pkg.createNode(13, pkg.createNode(9)))
          ),
          pkg.createNode(18, pkg.createNode(17), pkg.createNode(20))
        );
      };
      
      tsrCreateBST = function createBST() {
        return tsr.createNode(
          15,
          tsr.createNode(
            6,
            tsr.createNode(3, tsr.createNode(2), tsr.createNode(4)),
            tsr.createNode(7, null, tsr.createNode(13, tsr.createNode(9)))
          ),
          tsr.createNode(18, tsr.createNode(17), tsr.createNode(20))
        );
      };
    });
  });

  bench('ts-runtime', function() {
    var tree = tsrCreateBST();
    tsr.successor(tree);
  });

  bench('original', function() {
    var tree = pkgCreateBST();
    pkg.successor(tree);
  });

});
