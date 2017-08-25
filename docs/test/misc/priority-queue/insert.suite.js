suite('misc/priority-queue#insert', function(suite) {
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
    var queue = [5, 2, 4, 0, 1, 3];
    tsr.insert(queue, 6);
  });

  bench('original', function() {
    var queue = [5, 2, 4, 0, 1, 3];
    pkg.insert(queue, 6);
  });

});
