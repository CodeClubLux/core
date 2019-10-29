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
        window.removeEventListener("popstate", call, false);
        window.removeEventListener("pushState", call, false);
        this.initialized = false;
    }
    };
  }

  function call() {
    console.log("url changed to "+window.location.pathname);
    var self = this;
    var pathname = document.location.pathname;
    if (pathname == self.lastUrl) { return }
    self.a.unary_read(function(state){
        return self.func(document.location.pathname, function(res) {
            self.a.op_set(res, function(){})
        });
    })
    self.lastUrl = pathname;
  }

  function init() {
    if (!this.initialized) {
        this.initialized = true;
        window.addEventListener("popstate", call.bind(this));
        window.addEventListener("pushState", call.bind(this));
        console.log("adding event listener");
    }
  }

  return {type: "urlchange", lastUrl: "", call: call, reset: reset, func: func, a: a, diff: diff, init: init, end: end, count: 0};
}

function _router_getHash(next) {
    next(document.location.pathname);
}

function _router_changeHash(str, next) {
    history.pushState(null, null, str);
    next();
}