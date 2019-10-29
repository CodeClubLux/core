function _mouse_onClick(a, func) {
  function diff(other) {
    if (other.type == "mouse-click") {
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
        window.removeEventListener("click", this.bindCall, false);
        this.initialized = false;
    }
    };
  }

  function call(ev) {
    var self = this;
    self.a.unary_read(function(state){
        return self.func(state, [ev.clientX, ev.clientY], function(res) {
            self.a.op_set(res, function(){})
        });
    })
  }

  function init() {
    if (!this.initialized) {
        this.initialized = true;
        this.bindCall = call.bind(this)
        document.addEventListener("click", this.bindCall);
        console.log("binded call to click handler");
    }
  }

  return {type: "mouse-click", call: call, reset: reset, func: func, a: a, diff: diff, init: init, end: end, count: 0};
}

function _mouse_onMove(a, func) {
  function diff(other) {
    if (other.type == "mouse-move") {
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
        //window.removeEventListener("onmousemove", this.bindCall, false);
        this.initialized = false;
    }
    };
  }

  function call(ev) {
    var self = this;
    self.a.unary_read(function(state){
        return self.func(state, [ev.clientX, ev.clientY], function(res) {
            self.a.op_set(res, function(){})
        });
    })
  }

  function init() {
    if (!this.initialized) {
        this.initialized = true;
        this.bindCall = call.bind(this)
        document.onmousemove = this.bindCall;
        console.log("binded call to click handler");
    }
  }

  return {type: "mouse-move", call: call, reset: reset, func: func, a: a, diff: diff, init: init, end: end, count: 0};
}