suite('misc/priority-queue#increasePriority', function(suite) {
  var pkg , tsr;

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
    tsr.increasePriority(queue, 2, 2);
  });

  bench('original', function() {
    var queue = [5, 2, 4, 0, 1, 3];
    pkg.increasePriority(queue, 2, 2);
  });

});
