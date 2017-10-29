function _sub_batch(subs) {
  function diff(other) {
    if (other.type == "sub") {
      var new_subs = this.subs.map(function(i, index){
        return i.diff(other.subs[index]);
      });
      return {type: "sub", subs: new_subs, init: init, diff: diff, reset: reset, end: end, count: this.count + 1};
    } else {
      other.count += 1;
      return other;
    }
  }

  function reset() {
    this.count = 0;
    this.subs.forEach(function(i) {
      i.reset();
    });
  }

  function end() {
    if (this.count == 0) {
      this.subs.forEach(function(i) {
        i.end();
      })
    }
  }

  function init() {
    this.subs.forEach(function (i) {
      i.init();
    });
  }

  return {type: "sub", reset: reset, diff: diff, subs: subs.toArray(), init: init, end: end, count: 0};
}

var _sub_none = (function() {
    function reset() {}
    function diff() { return this }
    function init() {}
    function end() {}

    return {type: "none", reset: reset, diff: diff, init: init, end: end, count: 0}
})()

function _sub_register(func, a, next) {
    a.unary_read(function(i) {
    var subs = func(i, a);
    subs.init();


    function changed(model, next) {
      var new_subs = func(model, a);
      subs.reset();
      nsubs = subs.diff(new_subs);
      subs.end();
      subs = nsubs;
      nsubs.init();

      return next();
    };

    a.watch(changed, function(){});
    next();
  });
}
