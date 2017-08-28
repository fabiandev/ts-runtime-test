suite('Interface', function(suite) {
  var t;

  setup(function() {
    require([
      'ts-runtime/lib'
    ], (tsr) => {
      t = tsr.lib;
    });
  });
  
  bench('ts-runtime', function() {
    var Foo = t.type(
      'Foo',
      t.object(
        t.property('prop1', t.string()),
        t.property('prop2', t.number()),
        t.property('prop3', t.string('bar'))
      )
    );
    
    Foo.assert({
      prop1: 'foo',
      prop2: 1,
      prop3: 'bar'
    });
  });

  bench('original', function() {
    var input = {
      prop1: 'foo',
      prop2: 1,
      prop3: 'bar'
    };
    
    if (
      !input.hasOwnProperty('prop1') || typeof input.prop1 !== 'string' ||
      !input.hasOwnProperty('prop2') || typeof input.prop2 !== 'number' ||
      !input.hasOwnProperty('prop3') || input.prop3 !== 'bar'
    ) {
      throw new TypeError('type is not assignable');
    }
  });

});
