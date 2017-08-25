suite('misc/priority-queue#extractMax', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/misc/priority-queue/priority-queue',
      'tsr/misc/priority-queue/priority-queue'
    ], (p, t) => {
      pkg = p;
      tsr = t;
    });
  });

  bench('ts-runtime', function() {
    tsr.extractMax([5, 2, 4, 0, 1, 3]);
  });

  bench('original', function() {
    pkg.extractMax([5, 2, 4, 0, 1, 3]);
  });

});
