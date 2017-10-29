function _router_onUrlChange(a, func) {
  function diff(other) {
    if (other.type == "urlchange") {
      this.count += 1;
      return this;
    } else {
      other.count += 1;
      return other;
    }
  }

  function reset() {
    this.count = 0;
  }

  function end() {
    if (this.count == 0) {
    if (this.initialized) {
        console.log("removing event listener");
        window.removeEventListener("hashchange", call, false);
        this.initialized = false;
    }
    };
  }

  function call() {
    console.log("url changed to "+window.location.hash);
    var self = this;
    self.a.unary_read(function(state){
        return self.func(window.location.hash, function(res) {
            self.a.op_set(res, function(){})
        });
    })
  }

  function init() {
    if (!this.initialized) {
        this.initialized = true;
        window.addEventListener("hashchange", call.bind(this));
        console.log("adding event listener");
    }
  }

  return {type: "urlchange", call: call, reset: reset, func: func, a: a, diff: diff, init: init, end: end, count: 0};
}

function _router_getHash(next) {
    next(window.location.hash);
}

function _router_changeHash(str, next) {
    window.location.hash = str;
    next();
}