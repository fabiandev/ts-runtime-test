suite('misc/activity-selection#activitySelector', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/misc/activity-selection/activity-selection',
      'tsr/misc/activity-selection/activity-selection'
    ], (p, t) => {
      pkg = p;
      tsr = t;
    });
  });
  
  bench('ts-runtime', function() {
    tsr.activitySelector([
      { start: 1, finish: 4 },
      { start: 3, finish: 5 },
      { start: 0, finish: 6 },
      { start: 5, finish: 7 },
      { start: 3, finish: 9 },
      { start: 5, finish: 9 },
      { start: 6, finish: 10 },
      { start: 8, finish: 11 },
      { start: 8, finish: 12 },
      { start: 2, finish: 14 },
      { start: 12, finish: 16 },
    ]);
  });

  bench('original', function() {
    pkg.activitySelector([
      { start: 1, finish: 4 },
      { start: 3, finish: 5 },
      { start: 0, finish: 6 },
      { start: 5, finish: 7 },
      { start: 3, finish: 9 },
      { start: 5, finish: 9 },
      { start: 6, finish: 10 },
      { start: 8, finish: 11 },
      { start: 8, finish: 12 },
      { start: 2, finish: 14 },
      { start: 12, finish: 16 },
    ]);
  });

});
