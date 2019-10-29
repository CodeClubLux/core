function _time_currentDate(next) {
    var t = new Date();
    next({
        hours: t.getHours(),
        minutes: t.getMinutes(),
        seconds: t.getSeconds(),
        month: t.getMonth(),
    });
}

function _time_every(interval, a, func) {
  function diff(other) {
    if (other.type == "every" && other.interval == this.interval) {
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
    if (this.id) {
      clearInterval(this.id);
    }
    };
  }

  function call() {
    var self = this;
    _time_currentDate(function(time) {
        //_html_register(self.func, self.a);
        self.a.update(function(state) { return self.func(state, time) }, function(){});

    });
  }

  function init() {
    if (!this.id) {
      this.id = setInterval(call.bind(this), this.interval);
    }
  }

  return {type: "every", call: call, reset: reset, func: func, a: a, interval: interval, diff: diff, init: init, end: end, count: 0};
}