function log(s){
    console.log(s.toString())
}

var stdout = document.getElementById("code")

function println(s) {
    stdout.innerHTML += s.toString()+"<br>"
}

function print(s) {
    stdout.innerHTML += s
}

function println_unop(s, next) {
    stdout.innerHTML += s.toString()+"<br>"
    next();
}

function print_unop(s, next) {
    stdout.innerHTML += s
    next();
}





function op_add(x,y) {return x.op_add(y)}
function op_sub(x,y) {return x.op_sub(y)}
function op_mul(x,y) {return x.op_mul(y)}
function op_div(x,y) {return x.op_div(y)}
function op_mod(x,y) {return x.op_mod(y)}
function op_eq(x,y) {return x.op_eq(y)}
function op_pow(x,y) {return Math.pow(x,y)}
function op_lt(x,y) {return x.op_lt(y)}
function op_gt(x,y) {return x.op_gt(y)}
function op_or(x,y) {return x || y}
function op_not(x) {return !x}
function op_and(x,y) { return x && y }
function op_ne(x,y) { return x.op_ne(y) }

function unary_add(x) {return x}
function unary_sub(x) {return -x}

Number.prototype.op_add = function (other) { return this + other }
Number.prototype.op_div = function (other) { return this / other }
Number.prototype.op_sub = function (other) { return this - other }
Number.prototype.op_mul = function (other) { return this * other }
Number.prototype.op_eq = function (other) { return this == other }
Number.prototype.op_mod = function (other) { return this % other }
Number.prototype.op_lt = function (other) { return this < other }
Number.prototype.op_gt = function (other) { return this > other }
Number.prototype.op_ne = function (other) { return this != other }

Number.prototype.toFloat = function () { return this }
Number.prototype.toInt = function () { return this | 0 }

String.prototype.op_eq = function (other) { return this == other }
String.prototype.op_ne = function (other) { return this != other }
String.prototype.op_add = function (other) { return this + other }
String.prototype.op_lt = function (other) { return this < other }
String.prototype.op_gt = function (other) { return this > other }
String.prototype.get = function(index) { return this[index]; }
function toString(s) {
    return s.toString()
}

function log(s){
    console.log(s.toString())
}

function string_toString(s) {return s}
function int_toString(s) { return s.toString() }
function float_toString(s) { return s.toString() }
function array_toString(s) { return s.toString() }

function float_toInt(s) { return s | 0 }
function int_toInt(s) { return s }

String.prototype.toInt = function () { return Number(this) | 0 }
String.prototype.toFloat = function () { return Number(this) }
String.prototype.op_eq = function(s) { return this == s }

function float_toFloat(s) { return s }
function int_toFloat(s) { return s }

function isOdd(number) {
    return number % 2 != 0
}

function isEven(number) {
    return number % 2 == 0
}

function min(a,b) {
    return a < b ? a : b
}

function max(a,b) {
    return a > b ? a : b
}

function log_unop(v, next) {
    console.log(v);
    return next()
}

function len(x) {
    return x.length
}

function toFloat(x) {
    return x.toFloat()
}

function assign(obj, other) {
    if (obj instanceof Array) {
        var arr = [];
        for (var i = 0; i < other.length; i++) {
            var c = other[i];
            if (c) {
                arr.push(c);
            } else {
                arr.push(obj[i]);
            }
        }
        for (var i = other.length; i < obj.length; i++) {
            arr.push(obj[i]);
        }
        return arr;
    }
    else if (typeof obj == "object") {
        return Object.assign(new obj.constructor(), obj, other);
    } else {
        return other
    }
}

function toInt(x) {
    return x.toInt()
}

function toJS(arg) {
    if (arg instanceof Vector) {
        return arg.map(toJS).toArray()
    }

    if (arg instanceof Function) {
        return funcWrapper(arg);
    }

    if (typeof arg === "object") {
        var obj = {}
        for (var key in arg) {
            obj[key] = toJS(arg[key]);
        }
        return obj
    }

    return arg
}

function fromJS(arg) {
    if (arg instanceof Array) {
        return fromArray(arg.map(fromJS));
    }

    else if (arg instanceof Function) {
        return jsFuncWrapper(arg);
    } else if (typeof arg === "object") {
        var obj = {}
        for (var key in arg) {
            obj[key] = fromJS(arg[key]);
        }
        return obj
    }

    return arg
}

function funcWrapper(func) {
    return function () {
        var x = Array.prototype.slice.call(arguments);

        var args = [];
        for (var i = 0; i < x.length; i++) {
            args.push(fromJS(x[i]));
        }

        return toJS(func.apply(null, args))
    }
}

function jsFuncWrapper(func) {
    return function () {
        var x = Array.prototype.slice.call(arguments);

        var args = [];
        for (var i = 0; i < x.length; i++) {
            args.push(toJS(x[i]));
        }

        return fromJS(func.apply(null, args));
    }
}

function toAsync(func) {
    return function () {
        var x = Array.prototype.slice.call(arguments);

        var args = [];
        for (var i = 0; i < x.length-1; i++) {
            args.push(x[i]);
        }

        var next = x[x.length-1];

        return next(func.apply(null, args));
    }
}

var _empty_func = function() {}

function toSync(func) {
    return function () {
        var x = Array.prototype.slice.call(arguments);

        var args = [];
        for (var i = 0; i < x.length; i++) {
            args.push(x[i]);
        }

        args.push(_empty_func);

        return func.apply(null, args);
    }
}


function unary_read(next) {
    next(this.arg);
}

function op_set(val, next) {
    this.arg = val;
    for (var i = 0; i < this.events.length; i++ ) {
        this.events[i](val, _empty_func);
    }
    next()
}

function atom_watch(func, next) {
    this.events.push(func)
    next();
}

function atom_update(func, next) {
  this.op_set(func(this.arg), next);
}

function newAtom(arg) {
    return {
        unary_read: unary_read,
        op_set: op_set,
        arg: arg,
        watch: atom_watch,
        events: [],
        toString: function(){return ""},
        update: atom_update,
        op_eq: function(other) { return this === other; }
    }
}

function newLens(reader, setter, string) {
    return {
        query: function(item) {
            return reader(item);
        },
        set: function(old, item) {
            return setter(old, item)
        },
        toString: function() {
            return string;
        },
        op_eq: function(other) {
            return other.toString() === string;
        }
    }
}

function defer(func) {
    return function (x) {
        return function (callback) { func(x, callback) }
    }
}

function Maybe(x) {
    this[0] = x;
}

function Some(x) {
    var s = new Maybe(0);
    s[1] = x;
    return s
}

var None = new Maybe(1);

function Maybe_withDefault(self,def){
    if (self[0] === 0) {
        return self[1];
    } else {
        return def;
    }
}


function Maybe_map(self,func){
    if (self[0] == 0) {
        return Some(func(self[1]));
    } else {
        return None;
    }
}

Maybe.prototype.withDefault = function(def){
    return Maybe_withDefault(this,def);
}

Maybe.prototype.map = function(func){
    return Maybe_map(this,func);
}

function sleep(time, callback) {
    setTimeout(callback, time);
}

function parallel(funcs, next) {
    var count = 0;

    var length = funcs.length;
    var array = funcs;

    for (var i = 0; i < funcs.length; i++) {
        var f = (function (i) {
            return function (res) {
                count++;
                array = array.set(i, res);

                if (count == funcs.length) {
                    next(array);
                }
            }
        })(i)

        funcs.get(i)(f);

    }
}

function serial(funcs, next) {
    var i = 0;
    var length = funcs.length;
    var array = EmptyVector;

    function loop() {
        if (i == funcs.length) {
            next(array);
        } else {
            funcs.get(i)(function (val) {
                array = array.append(val);
                i += 1
                loop()
            })

        }
    }
    loop()
}

function core_assign(construct, obj) {
    return Object.assign(new construct.constructor(), construct, obj);
}

function core_json_int(obj) {
    return obj | 0;
}

function core_json_float(obj) {
    return obj;
}

function core_json_bool(obj) {
    return !!obj;
}

function core_json_string(obj) {
    return ""+obj;
}

function core_json_struct(constr, array) {
    return function(realObj) {
        var len = array.length;
        var obj = new constr();
        for (var i = 0; i < len; i++) {
            var arr = array[i];
            obj[arr[0]] = arr[1](realObj[arr[0]]);
        }
        return obj;
    }
}

function core_json_interface(array) {
    return function (realObj) {
        var obj = {};
        var len = array.length;
        for (var i = 0; i < len; i++) {
            var arr = array[i];
            obj[arr[0]] = arr[1](realObj[arr[0]]);
        }
        return obj;
    }
}

function core_json_enum(typ, array) {
    return function(realObj) {
        var iter = realObj[0]
        var _enum = new typ(iter);
        for (var i = 1; i < array[iter].length; i++) {
            _enum[i] = array[iter][i - 1](realObj[i]);
        }
        return _enum;
    }
}

//root, len, depth, start

function core_json_vector(decoder) {
    return function (realObj) {
        if (realObj.root) {
            var vector = new Vector(realObj.root, realObj.length, realObj.depth, realObj.start);
            return vector;
        }
        return fromArray(realObj.map(decoder));
    }
}

function core_json_tuple(decoder) {
    return function (arr) {
        var a = [];
        for (var i = 0; i < arr.length; i++) {
            a.push(decoder[i](arr[i]));
        }
        return a;
    }
}

function parseJson(decoder, str) {
    var obj = JSON.parse(str);
    return decoder(obj);
}

function jsonStringify(i) {
    return JSON.stringify(i);
}
function Vector(root, len, depth, start) {
    this.shift = (depth - 1) * this.bits;
    this.root = root;
    this.length = len;
    this.depth = depth;
    this.start= start || 0;
}

Vector.prototype.bits = 5;
Vector.prototype.width = 1 << Vector.prototype.bits;
Vector.prototype.mask = Vector.prototype.width - 1;

var EmptyVector = new Vector(Array(Vector.prototype.width), 0, 1)

Vector.prototype.get = function (key) {
    var o_key = key;
    key = getProperIndex(this, key);
    if (key >= this.length+this.start || key < 0) {
        console.log(o_key);
        console.log(key);
        console.log(this.length);
        throw new Error("out of bounds: "+key.toString())
    }

    var node = this.root;

    var bits = this.bits;
    var mask = this.mask;

    for (var level = this.shift; level > 0; level -= bits) {
          node = node[(key >> level) & mask]
    }
    return node[key & mask]
}

Vector.prototype.remove = function(index) {
    return this.slice(0, index).op_add(this.slice(index+1, this.length));
}

Vector.prototype.serial = function (func, next) {
    serial(this.map(defer(func)), next);
}

Vector.prototype.parallel = function (func, next) {
    parallel(this.map(defer(func)), next);
}

Vector.prototype.toJSON = function() {
    return this.toArray();
}

Vector.prototype.indexOf = function(find) {
    var index = -1;
    for (var i = 0; i < this.length; i++) {
        if (this.get(i).op_eq(find)) {
            index += 1;
            return index;
        }
    }
    return -1;
}

Vector.prototype.append_m = function (value) {
    var width = Vector.prototype.width;

    if (Math.pow(width, this.depth) === this.length || this.length == 0) {
        return this.append(value);
    }

    var key = this.length;
    var node = this.root;

    var bits = this.bits;
    var mask = this.mask;

    for (var level = this.shift; level > 0; level -= bits) {
        var res = (key >> level) & mask
        var tmp = node[res]

        if (tmp === undefined) {
            tmp = [];
            node[res] = tmp;
        }
        node = tmp;
    }


    node[key & mask] = value;

    this.length++;
    return this;
}

Vector.prototype.set_m = function (key, value) {
    key = getProperIndex(this, key);
    if (key >= this.length || key < 0) {
        throw new Error("out of bounds: "+key.toString())
    }

    var node = this.root;

    var bits = this.bits;
    var mask = this.mask;

    for (var level = this.shift; level > 0; level -= bits) {
        node = node[(key >> level) & mask]
    }

    node[key & mask] = value;
    return this;
}

Vector.prototype.append = function (value) {
    var bits = this.bits;
    var mask = this.mask;

    function update(node, level, key) {
        if (level > 0) {
            var pos = key >> level & mask;

            if (!node) {
                var newNode = [];
            } else {
                var newNode = node.slice();
            }

            newNode[pos] = update(newNode[pos], level - bits, key);
            return newNode;
        } else {
            var pos = key & mask;

            if (node == null) {
                var newNode = [];
            } else {
                var newNode = node.slice();
            }
            newNode[pos] = value;
            return newNode
        }
    }

    var width = Vector.prototype.width;

    if (Math.pow(width, this.depth) === this.length) {
        var n = [];
        n[0] = this.root;
        n[1] = [];

        var u = update(n, this.depth * this.bits, this.length);
        return new Vector(u, this.length+1, this.depth+1)
    } else {
        var u = update(this.root, this.shift, this.length);
        return new Vector(u, this.length+1, this.depth)
    }
}

Vector.prototype.set = function (key, value) {
    key = getProperIndex(this, key);
    if (key >= this.length+this.start || key < 0) {
        throw new Error("out of bounds: "+key.toString())
    }

    var bits = this.bits;
    var mask = this.mask;

    function update(node, level, key) {
        if (level > 0) {
            var pos = key >> level & mask;

            var newNode = node.slice();

            newNode[pos] = update(newNode[pos], level - bits, key);
            return newNode;
        } else {
            var pos = key & mask;

            var newNode = node.slice();
            newNode[pos] = value;
            return newNode
        }
    }

    var width = Vector.prototype.width;

    var u = update(this.root, this.shift, key);
    return new Vector(u, this.length, this.depth);
}

Vector.prototype.insert = function (key, val) {
    key = getProperIndex(this, key);
    if (key >= this.length+this.start || key < 0) {
        throw new Error("out of bounds: "+key.toString())
    }

    var bits = this.bits;
    var mask = this.mask;

    var self = this;

    function insert(node, level, key, value) {
        if (level > 0) {
            var pos = key >> level & mask;

            if (node) {
                var newNode = [];
            } else {
                var newNode = node.slice();
            }

            var u = insert(newNode[pos], level - bits, key, value);
            newNode[pos] = u[0];
            var next = null;
            if (u[1]) {
                next = u[1];
                for (var i = pos+1; i < width; i++) {
                    var u = insert(newNode[i], level - bits, (i << level), next);
                    newNode[i] = u[0];
                    next = u[1];
                }
            }
            return [newNode, next];
        } else {
            var pos = key & mask;
            return arrayInsert(node, pos, value)
        }
    }

    function arrayInsert(arr, index, val) {
        var narr = [];
        for (var i = 0; i < width-1; i++) {
            if (index === i) {
                narr.push(val);
            }
            narr.push(arr[i]);
        }

        if (index === i) {
            narr.push(val);
        }

        return [narr, arr[width-1]]
    }

    var width = Vector.prototype.width;

    var u = insert(this.root, this.shift, key, val);
    if (u[1]) {
        return new Vector(u[0], this.length+1, this.depth).append(u[1])
    } else {
        return new Vector(u[0], this.length+1, this.depth)
    }
}

Vector.prototype.toArray = function () {
    var v = [];
    for (var i = 0; i < this.length; i++) {
        v[i] = this.get(i);
    }
    return v;
}

Vector.prototype.toString = function () {
    return "["+this.join(",")+"]"
}

Vector.prototype.op_eq = function (other) {
    if (this.length !== other.length) return false;
    if (this === other) return true;

    for (var i = 0; i < this.length; i++) {
        if (!(this.get(i).op_eq(other.get(i)))) {
            return false;
        }
    }
    return true;
}

Vector.prototype.map = function (func) {
    var newArr = EmptyVector;
    var len = this.length;
    for (var i = 0; i < len; i++) {
        newArr = newArr.append_m(func(this.get(i), i));
    }
    return newArr;
}

Vector.prototype.filter = function (func) {
    var newArr = EmptyVector;
    var len = this.length;
    for (var i = 0; i < len; i++) {
        var el = this.get(i)
        if (func(el)) {
            newArr = newArr.append_m(el);
        }
    }
    return newArr;
}

Vector.prototype.reduce = function (func) {
    if (this.length == 1) {
        return this.get(0)
    } else if (this.length === 0) {
        throw Error("Cannot reduce empty vector")
    }

    var len = this.length;
    var curr = this.get(0)
    for (var i = 1; i < len; i++) {
        curr = func(curr, this.get(i));
    }
    return curr;
}

Vector.prototype.join = function (s) {
    if (this.length == 0) { return "" }
    var string = this.get(0);
    var len = this.length;
    for (var i = 1; i < len; i++) {
        string += s + this.get(i);
    }
    return string
}

Vector.prototype.slice = function (start,end) {
    start = getProperIndex(this, start);

    if (end === 0) {
        return EmptyVector;
    }

    if (!end) {
        end = this.length;
    } else {
        end = getProperIndex(this, end);
    }

    return new Vector(this.root, end-start, this.depth, start);
}

function getProperIndex(self, index) {
    index += self.start;
    if (index < 0) {
        return (self.length + index);
    }
    return index;
}

Vector.prototype.has = function (s) {
    for (var i = 0; i < this.length; i++) {
        if (this.get(i).op_eq(s)) {
            return true;
        }
    }
    return false;
}

Vector.prototype.op_add = function (s) {
    var newArr = this;
    for (var i = 0; i < s.length; i++) {
        newArr = newArr.append(s.get(i));
    }
    return newArr;
}

Vector.prototype.shorten = function (number) {
    return new Vector(this.root, this.length-number, this.depth);
}

function newVector() {
    return fromArray(Array.prototype.slice.call(arguments))
}

function fromArray(arr) {
    var v = EmptyVector;
    for (var i = 0; i < arr.length; i++) {
        v = v.append_m(arr[i]);
    }
    return v;
}

function newVectorRange(start, end) {
    var arr = EmptyVector;
    for (var i = start; i < end; i++) {
        arr = arr.append_m(i);
    }
    return arr;
}

function newVectorInit(repeat, elem) {
    var arr = EmptyVector;
    for (var i = 0; i < repeat; i++) {
        arr = arr.append_m(elem);
    }
    return arr;
}
'use strict';

var Map;
var nil;

(function() {
    var create_if_new, new_node, with_lev, with_lo_hi, with_lo, with_hi, go_lo,
        has, get, put, rm, skew, split, keys, values, to_object, to_pair_array, print, map;

    Map = function(node, lt) {
        this.length = node ? node.length : 0;
        this.contains = function(key) {
            return has(node, key, lt);
        };
        this.get = function(key, fail) {
            return get(node, key, fail, lt);
        };
        this.set = function(key, val) {
            return create_if_new(this, node, put(node, key, val, lt), lt);
        };
        this.remove = function(key) {
            return create_if_new(this, node, rm(node, key, lt), lt);
        };
        this.keys = function(into) {
            return keys(node, into || []);
        };
        this.values = function(into) {
            return values(node, into || []);
        };
        this.toObject = function(into) {
            return to_object(node, into || {});
        };
        this.toString = function() {
            return node ? '{ ' + print(node) + ' }' : '{}';
        };

        this.map = function(func, into) {
          console.log(node);
          return map(func, node, into||new Map(nil,nil));
        }
    }

    create_if_new = function(map, node, new_node, lt) {
        return node === new_node ? map : new Map(new_node, lt);
    };

    new_node = function(key, val, lev, lo, hi) {
        var length = 1 + (lo ? lo.length : 0) + (hi ? hi.length : 0);
        return {
            key: key,
            val: val,
            lev: lev,
            lo: lo,
            hi: hi,
            length: length
        };
    };

    with_lev = function(node, lev) {
        return new_node(node.key, node.val, lev, node.lo, node.hi);
    };
    with_lo_hi = function(node, lo, hi) {
        return new_node(node.key, node.val, node.lev, lo, hi);
    };
    with_lo = function(node, lo) {
        return lo && lo.op_eq(node.lo) ? node : with_lo_hi(node, lo, node.hi);
    };
    with_hi = function(node, hi) {
        return hi === node.hi ? node : with_lo_hi(node, node.lo, hi);
    };
    go_lo = function(node, key, lt) {
        return (lt && lt(key, node.key)) || (!lt && key.op_lt( node.key));
    };


    has = function(node, key, lt) {
        while (node) {
            if (key.op_eq(node.key)) {
                return true;
            }
            node = go_lo(node, key, lt) ? node.lo : node.hi;
        }
        return false;
    };

    map = function(func, node, a) {
          if (node) {
              a = map(func, node.lo, a);
              a = a.set(node.key, func(node.val));
              a = map(func, node.hi, a);
          }
          return a;
    };

    get = function(node, key, fail, lt) {
        while (node) {
            if (key.op_eq(node.key)) {
                return node.val;
            }
            node = go_lo(node, key, lt) ? node.lo : node.hi;
        }
        return fail;
    };

    put = function(node, key, val, lt) {
        if (!node) {
            return new_node(key, val, 0);
        }
        if (key.op_eq(node.key)) {
            return val.op_eq(node.val) ? node : new_node(key, val, node.lev, node.lo, node.hi);
        }
        node = go_lo(node, key, lt) ? skew(node, put(node.lo, key, val, lt)) :
            skew(with_hi(node, put(node.hi, key, val, lt)));
        return split(node);
    };

    rm = function(node, key, lt) {
        if (node) {
            var lo = node.lo,
                hi = node.hi,
                hi_lo, lev = node.lev;
            if (key.op_eq(node.key)) {
                if (!lo || !hi) {
                    return lo || hi;
                }
                hi_lo = hi;
                while (hi_lo.lo) { // find replacement
                    hi_lo = hi_lo.lo;
                }
                hi = rm(hi, hi_lo.key, lt);
                node = new_node(hi_lo.key, hi_lo.val, lev, lo, hi);
            } else if (go_lo(node, key, lt)) {
                lo = rm(lo, key, lt);
                node = with_lo(node, lo);
            } else {
                hi = rm(hi, key, lt);
                node = with_hi(node, hi);
            }
            if ((lo && lo.lev < lev - 1) || (hi && hi.lev < lev - 1)) {
                node = new_node(node.key, node.val, lev - 1, lo, hi && hi.lev .op_gt( lev) ? with_lev(hi, lev - 1) : hi);
                node = skew(node);
                if (node.hi) {
                    node = with_hi(node, skew(node.hi));
                }
                if (node.hi && node.hi.hi) {
                    node = with_hi(node, with_hi(node.hi, skew(node.hi.hi)));
                }
                node = split(node);
                if (node.hi) {
                    node = with_hi(node, split(node.hi));
                }
            }
        }
        return node;
    };

    skew = function(node, lo) {
        lo = lo || node.lo;
        return !lo || node.lev > lo.lev ? with_lo(node, lo) : with_hi(lo, with_lo(node, lo.hi));
    };

    split = function(node) {
        var hi = node.hi;
        return !hi || !hi.hi || node.lev > hi.hi.lev ? node : new_node(hi.key, hi.val, hi.lev + 1, with_hi(node, hi.lo), hi.hi);
    };

    keys = function(node, a) {
        if (node) {
            keys(node.lo, a);
            a.push(node.key);
            keys(node.hi, a);
        }
        return a;
    };

    values = function(node, a) {
        if (node) {
            values(node.lo, a);
            a.push(node.val);
            values(node.hi, a);
        }
        return a;
    };

    to_object = function(node, o) {
        if (node) {
            to_object(node.lo, o);
            o[node.key] = node.val;
            to_object(node.hi, o);
        }
        return o;
    };

    to_pair_array = function(node, a) {
        if (node) {
            to_pair_array(node.lo, a);
            a.push(node.key + ': ' + node.val);
            to_pair_array(node.hi, a);
        }
        return a;
    };

    print = function(node) {
        return to_pair_array(node, []).join(', ');
    };

})();

function dict(obj,lt) {
  var map = new Map(nil,lt);
  for (var i = 0; i < obj.length; i++) {
    var res = obj.get(i);
    map = map.set(res[0], res[1]);
  }
  return map;
}function _router_onUrlChange(a, func) {
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
};function _sub_batch(subs) {
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
;function _time_currentDate(next) {
    var t = new Date();
    next({
        hours: t.getHours(),
        minutes: t.getMinutes(),
        seconds: t.getSeconds()
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
};(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
virtualDom = require("virtual-dom");
//require("./three_wrapper");

toEventHandler = function toEventHandler(value) {
    var a = value.a;
    var x = value.x;

    if (!a.unary_read) {
        throw Exception("expecting atom");
    }

    function clicked(e, next) {

        a.unary_read(function(res) {
            x(res, e, function(model) {
                _html_register(x, a, _empty_func);
                a.op_set(model, _empty_func);
            });

        });
        if (next) { next(); }
    }

    return clicked
}

getPrototype = function getPrototype(value) {
  if (typeof value == "object") {
    return value;
  }
  else if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

toChanEventHandler = function toChanEventHandler(value) {
    var ch = concurrency_chan(1);
    var func = value.func;

    function handle(ev) {
        ch.op_set(ev, _empty_func);
    }

    var domF = toEventHandler(value.attribute);
    func(ch,domF,_empty_func);

    return handle;
}

toDomValue = function toDomValue(propValue) {
    if (typeof propValue == "object") {
        if (propValue.func) {
            return toChanEventHandler(propValue);
        } else if (propValue.a) {
            return toEventHandler(propValue);
        } else {
            return propValue
        }
    }
    return propValue
}

clearElement = function(elem) {
    elem.innerHTML = "";
}

_main_markdown = function markup(text) {
    return virtualDom.h("div", { innerHTML: text });
}

html_hyper = function (type, attrib, children) {
    var at = {}
    for (var i = 0; i < attrib.length; i++) {
        var a  = attrib.get(i);
        if (a.name == "multiple") {
            var attribs = a.value;
            attrib = attrib.op_add(attribs);
        }
    }

    for (var i = 0; i < attrib.length; i++) {
        var a = attrib.get(i);
        if (typeof a.value === "function") {
            at[a.name] = toSync(a.value);
            //toSync(attrib[i].value);
        } else if (a.name != "multiple") {
            at[a.name] = a.value;
        }
    }

    if (at.href && at.href[0] == "#" && type == "a") { //hack to make sure window location change is triggered
        var onclick = at.onclick;

        at.onclick = function(e) {
            if (onclick) {
                onclick(e)
            }

            console.log("link was clicked, navigating to "+at.href);

            window.location.hash = at.href.slice(1);
        }
    }

    if (children instanceof Vector) {
        children = children.toArray();
    }

    var res = virtualDom.h(type, at, children);


    if (at.onUnMount) {
        res.onUnMount = at.onUnMount
    }
    return res;
}

_html_register = function _html_register(func, a, next) {
    if (typeof calledBy != "undefined") {
        calledBy.push(func.name + " " + a.toString() + " -> ");
    }
    next();
}

_html_stringToH = function(s) {
    if (typeof s == "string") {
        return virtualDom.h("div",{},s);
    } else {
        return s
    }
}

_html_setLocalStorage = function _html_setLocalStorage(item, next) {
    var obj = JSON.stringify(item);
    localStorage.setItem("data", obj);
    next();
}

_html_readLocalStorage = function _html_setLocalStorage(decoder, next) {
    var d = localStorage.getItem("data");
    if (!d) {
        next([1]);
    } else {
        next([0, parseJson(decoder, d)]);
    }
}

_html_setUrl = function _html_setUrl(url, next) {
    window.location.hash = url;
    next();
}

_nextTick = function(func, next) {
    requestAnimationFrame(function(){
        func(function(){});
    });
    next();
}

var _svg_h = require('virtual-hyperscript-svg');

svg_h = function (type, attrib, children) {
    var at = {}
    for (var i = 0; i < attrib.length; i++) {
        var a  = attrib.get(i);
        if (a.name == "multiple") {
            var attribs = a.value;
            attrib = attrib.op_add(attribs);
        }
    }
    for (var i = 0; i < attrib.length; i++) {
        var a = attrib.get(i);
        if (typeof a.value === "function") {
            at[a.name] = toSync(a.value);
            //toSync(attrib[i].value);
        } else {
            at[a.name] = a.value;
        }
    }

    if (children instanceof Vector) {
        children = children.toArray();
    }

    var res = _svg_h(type, at, children);
    return res;
}

_http_get = function _http_get(url, next) {
    console.log("sending http_request");
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            next({
                body: xmlHttp.responseText,
                status: xmlHttp.status,
                contentType: xmlHttp.contentType,
            })
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

_http_post = function _http_post(url, data, next) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            next({
                body: xmlHttp.responseText,
                status: xmlHttp.status,
                contentType: xmlHttp.contentType,
            })
        }
    }

    xmlHttp.open("POST", url, true); // true for asynchronous
    xmlHttp.send(data);
}

core_watcher = function (a, b) {
    a.watch(b);
}

function Thunk(fn, arg, key) {
    this.fn = fn
    this.arg = arg
    this.key = key
}

Thunk.prototype.type = 'Thunk';
Thunk.prototype.render = render;

function render(previous) {
    if (!previous || previous.arg !== this.arg || previous.key !== this.key) {
        return this.fn(this.arg, this.key);
    } else {
        return previous.vnode;
    }
}

/*newThunk = function (fn, arg, key) {
    return new Thunk(fn, arg, key)
}
*/

http_get = function (theUrl, callback)
{
    console.log("sending http request");
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

json_prettify = function (obj, indent) {
    return JSON.stringify(JSON.parse(obj), null, indent);
}

html_appendChild = function (a,b) {
    a.appendChild(b);
}

core_fps = function core_fps(update, maxFPS) {
    var timestep = 1000 / maxFPS;
    var delta = 0;
    var lastFrameTimeMs = 0;

    var stats;

    function _fps(timestamp) {
        if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
            requestAnimationFrame(_fps);
            return
        }

        // Track the accumulated time that hasn't been simulated yet
        delta = timestamp - lastFrameTimeMs; // note += here
        lastFrameTimeMs = timestamp;

        // Simulate the total elapsed time in fixed-size chunks
        update(delta, function() { if (stats) { stats.update()}; requestAnimationFrame(_fps); });
    }
    requestAnimationFrame(_fps);
}

function isElementInViewport (el) {
    if (!el) {
        return false;
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.bottom - 100 < (window.innerHeight || document.documentElement.clientHeight)
    )

    /*or $(window).height() */
        //rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    //);
}

function onVisibilityChange(el, callback) {
    var old_visible = false;
    return function () {
        if (!old_visible) {
            if (isElementInViewport(el)) {
                old_visible = true;
                callback();
            }
        }
    }
}

var handlers = [];

var handler = function () {
    var l = handlers.length;
    for (var i = 0; i < l; i++) {
        handlers[i]();
    }
}

html_handle = handler;

html_addClassOnVisible = function html_addClassOnVisible(className) {
    function onMount(el) {
        handlers.push(onVisibilityChange(el, function() {
            el.className += " "+className;
        }))
    }

    return {
        name: "onMount",
        value: onMount
    }
};

if (window.addEventListener) {
    addEventListener('DOMContentLoaded', handler, false);
    addEventListener('load', handler, false);
    addEventListener('scroll', handler, false);
    addEventListener('resize', handler, false);
} else if (window.attachEvent)  {
    attachEvent('onDOMContentLoaded', handler); // IE9+ :(
    attachEvent('onload', handler);
    attachEvent('onscroll', handler);
    attachEvent('onresize', handler);
}
},{"virtual-dom":5,"virtual-hyperscript-svg":39}],2:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":15}],3:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":38}],4:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":23}],5:[function(require,module,exports){
var diff = require("./diff.js")
var patch = require("./patch.js")
var h = require("./h.js")
var create = require("./create-element.js")
var VNode = require('./vnode/vnode.js')
var VText = require('./vnode/vtext.js')

module.exports = {
    diff: diff,
    patch: patch,
    h: h,
    create: create,
    VNode: VNode,
    VText: VText
}

},{"./create-element.js":2,"./diff.js":3,"./h.js":4,"./patch.js":13,"./vnode/vnode.js":34,"./vnode/vtext.js":36}],6:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();


},{}],7:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":9}],8:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":8}],10:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":45}],11:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],12:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],13:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":18}],14:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties;

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (propName == "onMount") {
            setTimeout((function(propName, propValue) {
                return function() {
                    propValue(node);
                }
            })(propName, propValue), 0);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            propValue = toDomValue(propValue);
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                if(propName === "style") {
                    node.setAttribute("style", propValue);
                } else {
                    node[propName] = propValue
                }
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":29,"is-object":11}],15:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    if (node.onMount) {
        vnode.onMount(node)
    }

    return node
}

},{"../vnode/handle-thunk.js":27,"../vnode/is-vnode.js":30,"../vnode/is-vtext.js":31,"../vnode/is-widget.js":32,"./apply-properties":14,"global/document":10}],16:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],17:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
        if (vNode.onUnMount) {
            vNode.onUnMount(parentNode)
        }
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        if (vNode.onMount) {
            vNode.onMount(newNode)
        }
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":32,"../vnode/vpatch.js":35,"./apply-properties":14,"./update-widget":19}],18:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":15,"./dom-index":16,"./patch-op":17,"global/document":10,"x-is-array":12}],19:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":32}],20:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],21:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":7}],22:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],23:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":28,"../vnode/is-vhook":29,"../vnode/is-vnode":30,"../vnode/is-vtext":31,"../vnode/is-widget":32,"../vnode/vnode.js":34,"../vnode/vtext.js":36,"./hooks/ev-hook.js":21,"./hooks/soft-set-hook.js":22,"./parse-tag.js":24,"x-is-array":12}],24:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":6}],25:[function(require,module,exports){
'use strict';

var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}

},{}],26:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');
var attributeHook = require('./hooks/attribute-hook');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}

},{"./hooks/attribute-hook":20,"./index.js":23,"./svg-attribute-namespace":25,"x-is-array":12}],27:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":28,"./is-vnode":30,"./is-vtext":31,"./is-widget":32}],28:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],29:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],30:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":33}],31:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":33}],32:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],33:[function(require,module,exports){
module.exports = "2"

},{}],34:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":28,"./is-vhook":29,"./is-vnode":30,"./is-widget":32,"./version":33}],35:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":33}],36:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":33}],37:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function equalsChan(a,b) {
    return getPrototype(a) == getPrototype(a) && a.func == b.func && equalsEvent(a.attribute, b.attribute);
}

function equalsEvent(a,b) {
    return getPrototype(a) == getPrototype(a) && a.a.op_eq(b.a) && a.x === b.x;
}

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue || aKey == "onMount") {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else if (bValue.func) {
                diff = diff || {}
                if (equalsChan(aValue, bValue)) {
                    diff[aKey] = bValue
                }
            } else if (bValue.a) {
                diff = diff || {};

                if (equalsChan(aValue, bValue)) {
                    diff[aKey] = bValue
                }
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

},{"../vnode/is-vhook":29,"is-object":11}],38:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":27,"../vnode/is-thunk":28,"../vnode/is-vnode":30,"../vnode/is-vtext":31,"../vnode/is-widget":32,"../vnode/vpatch":35,"./diff-props":37,"x-is-array":12}],39:[function(require,module,exports){
var ns = 'http://www.w3.org/2000/svg';
var hsvg = require('virtual-dom/virtual-hyperscript/svg');
var has = require('has');
var isarray = require('isarray');
var xtend = require('xtend');

module.exports = function (name, props, children) {
    if (name.toUpperCase() === 'SVG' && !has(props, 'xmlns')) {
        if (typeof props === 'string') {
            children = [ props ];
            props = {};
        }
        else if (isarray(props)) {
            children = props;
            props = {};
        }
        return hsvg(name, xtend({ xmlns: ns }, props), children);
    }
    else return hsvg(name, props, children);
};

},{"has":42,"isarray":43,"virtual-dom/virtual-hyperscript/svg":26,"xtend":44}],40:[function(require,module,exports){
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],41:[function(require,module,exports){
var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":40}],42:[function(require,module,exports){
var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":41}],43:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],44:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],45:[function(require,module,exports){

},{}]},{},[1]);

var types = {};

types['html'] = {};
function html_clientInit(){var d=0;return function c(b){while(1){switch (d){case 0:html_cmpAtom = function(a,b) { return getPrototype(a) == getPrototype(b) && a.op_eq(b); };html_cmpLens = function(a,b) { return getPrototype(a) == getPrototype(b) && a.op_eq(b); };html_registerEvent = _html_register;html_logAny = console.log;html_nextTick = _nextTick;html_style = html_newAttrib.bind(null,"style");html_placeHolder = html_newAttrib.bind(null,"placeholder");html_position = html_newAttrib.bind(null,"position");html__type = html_newAttrib.bind(null,"type");html_height = html_newAttrib.bind(null,"height");html_width = html_newAttrib.bind(null,"width");html_key = html_newAttrib.bind(null,"key");html_addClassOnVisible = html_addClassOnVisible;html_innerHtml = html_newAttrib.bind(null,"innerHTML");html_id = html_newAttrib.bind(null,"id");html_min = html_newAttrib.bind(null,"min");html_max = html_newAttrib.bind(null,"max");html_step = html_newAttrib.bind(null,"step");html_value = html_newAttrib.bind(null,"value");html_href = html_newAttrib.bind(null,"href");html_src = html_newAttrib.bind(null,"src");html_disabled = html_newAttrib.bind(null,"disabled");html_multiple = html_newAttrib.bind(null,"multiple");html_transition = html_newAttrib.bind(null,"transition");html__kind = html_newAttrib.bind(null,"type");html__float = html_newAttrib.bind(null,"float");html_class = html_newAttrib.bind(null,"className");html_frameborder = html_newAttrib.bind(null,"frameborder");html_scrolling = html_newAttrib.bind(null,"scrolling");html__async = html_newAttrib.bind(null,"async");html_charset = html_newAttrib.bind(null,"charset");html_onClick = html_onEvent.bind(null,"onclick");html_onInput = html_onEvent.bind(null,"oninput");html_onChange = html_onEvent.bind(null,"onchange");html__defer = html_newAttrib.bind(null,"_defer");html_h = html_hyper;html_createElement = virtualDom.create;html_diff = virtualDom.diff;html_patch = toAsync(virtualDom.patch);html_clear = toAsync(clearElement);html_cssSelector = document.querySelector.bind(document);html_h1 = html_h.bind(null,"h1");html_h2 = html_h.bind(null,"h2");html_h3 = html_h.bind(null,"h3");html_h4 = html_h.bind(null,"h4");html_h5 = html_h.bind(null,"h5");html_h6 = html_h.bind(null,"h6");html_br = html_h.bind(null,"br");html_blockquote = html_h.bind(null,"blockquote");html_script = html_h.bind(null,"script");html_iframe = html_h.bind(null,"iframe");html_hr = html_h.bind(null,"hr");html_button = html_h.bind(null,"button");html_input = html_h.bind(null,"input");html_noAttrib = EmptyVector;html_div = html_h.bind(null,"div");html_p = html_h.bind(null,"p");html_ul = html_h.bind(null,"ul");html_li = html_h.bind(null,"li");html_link = html_h.bind(null,"a");html_image = html_h.bind(null,"img");html_span = html_h.bind(null,"span");html_textArea = html_h.bind(null,"textarea");html__appendChild = toAsync(html_appendChild);html_stringToH = _html_stringToH;;return;}}}()}function html_PosAtom(c,d){this.a=c;this.pos=d;}html_PosAtom._fields=[[ "a" , "Atom[html.PosAtom.X]" ],[ "pos" , "Lens[html.PosAtom.X,html.PosAtom.T]" ]];types['html']['PosAtom']=html_PosAtom._fields;html_PosAtom.prototype.unary_read=(function(c){return html_PosAtom_unary_read(this,c)});function html_PosAtom_unary_read(html_self,d){var h=0;return function g(f){while(1){switch(h){case 0:h=1;return (html_self).a.unary_read(g);case 1:;;return d(((html_self).pos).query(f));}}}()}html_PosAtom.prototype.toString=(function(){return html_PosAtom_toString(this)});function html_PosAtom_toString(html_self){var html_a;html_a = toString((html_self).a);var html_pos;html_pos = toString((html_self).pos);;return (html_a+html_pos);}html_PosAtom.prototype.op_eq=(function(c){return html_PosAtom_op_eq(this,c)});function html_PosAtom_op_eq(html_self, html_other){;return ((html_cmpAtom((html_self).a,(html_other).a))&&(html_cmpLens((html_self).pos,(html_other).pos)));}html_PosAtom.prototype.update=(function(c,d){return html_PosAtom_update(this,c,d)});function html_PosAtom_update(html_self, html_func,f){var html_current;var j=0;return function h(g){while(1){switch(j){case 0:j=2;return (html_self).a.unary_read(h);case 2:;html_current = g;j=3;return ((html_self).a).op_set(((html_self).pos).set(html_current,html_func(((html_self).pos).query(html_current))),h);case 3:;;return f();}}}()}html_PosAtom.prototype.op_set=(function(c,d){return html_PosAtom_op_set(this,c,d)});function html_PosAtom_op_set(html_self, html_new,f){var j=0;return function h(g){while(1){switch(j){case 0:j=4;return (html_self).a.unary_read(h);case 4:;j=5;return ((html_self).a).op_set(((html_self).pos).set(g,html_new),h);case 5:;;return f();}}}()}html_PosAtom.prototype.watch=(function(c,d){return html_PosAtom_watch(this,c,d)});function html_PosAtom_watch(html_self, html_f,f){var j=0;return function h(g){while(1){switch(j){case 0:function html_func(html_x,k){var n=0;return function m(l){while(1){switch(n){case 0:n=6;return (html_self).a.unary_read(m);case 6:;n=7;return html_f(((html_self).pos).query(l),m);case 7:;;return k();}}}()}j=8;return ((html_self).a).watch(html_func,h);case 8:;;return f();}}}()}function html_pipeAtom(html_funcs, html_a,c){var g=0;return function f(d){while(1){switch(g){case 0:g=9;return (html_funcs).serial((function(html_i,h){var l=0;return function k(j){while(1){switch(l){case 0:l=10;return html_i((html_a),k);case 10:;;return h();}}}()}),f);case 9:;return c(html_a);}}}()}function html_Event(c){this.target=c;}html_Event._fields=[[ "target" , "html.HtmlElem" ]];types['html']['Event']=html_Event._fields;function html_Attribute(c,d){this.name=c;this.value=d;}html_Attribute._fields=[[ "name" , "string" ],[ "value" , "html.Nothing" ]];types['html']['Attribute']=html_Attribute._fields;function html_newAttrib(html_name, html_value){;return new html_Attribute(html_name,html_value,html_value);}function html_onEvent(html_name, html_x, html_a){;return new html_Attribute(html_name,{a:html_a,x:html_x},{a:html_a,x:html_x});}function html_ignoreAct(html_f){function html_func(html_x, html_y,c){var g=0;return function f(d){while(1){switch(g){case 0:g=11;return html_f(html_x,f);case 11:;return c(d);}}}()};return html_func;}function html_withId(html_f){function html_func(html_id, html_m, html_e,c){var html_res;var g=0;return function f(d){while(1){switch(g){case 0:g=12;return html_f(html_m.get(html_id),html_e,f);case 12:html_res = (d);;return c((html_m).set(html_id,html_res));}}}()};return html_func;}function html_mapWithId(html_v, html_arr, html_a){function html_func(html_id){;return html_v(html_arr.get(html_id),html_id,html_a);};return (newVectorRange(0,(html_arr).length)).map(html_func);}function html_toEffect(html_f){function html_func(html_x, html_ev,c){var g=0;return function f(d){while(1){switch(g){case 0:;return c(html_f(html_x,html_ev));}}}()};return html_func;}function html_pure(html_f){function html_func(html_x, html_ev,c){var g=0;return function f(d){while(1){switch(g){case 0:;return c(html_f(html_x));}}}()};return html_func;}function html_mapView(html_v, html_model, html_a){function html_mapper(html_idx){var html_result;html_result = html_model.get(html_idx);var html_pos;html_pos = (newLens(function(c){return c.get(html_idx)}, function(d,c){return d.set(html_idx,c)},''+"["+html_idx+"]"));var html_newA;html_newA = new html_PosAtom(html_a,html_pos,html_pos);;return html_v(html_result,html_newA);};return (newVectorRange(0,(html_model).length)).map(html_mapper);}function html_fromLens(html_v, html_model, html_a, html_pos){;return html_v(((html_pos).query(html_model)),new html_PosAtom(html_a,html_pos,html_pos));}function html_newEmbed(html_model, html_a){;return (function(d,f){return function(c,g){return html_fromLens(c,d,f,g);}})(html_model,html_a);}function html_Transition(c,d,f){this.duration=c;this.enterClass=d;this.leaveClass=f;}html_Transition._fields=[[ "duration" , "int" ],[ "enterClass" , "string" ],[ "leaveClass" , "string" ]];types['html']['Transition']=html_Transition._fields;function html_attribute(html_name, html_v){;return new html_Attribute(html_name,html_v,html_v);}function html_render(html_newTree,c){var html_rootNode;var html_root;var g=0;return function f(d){while(1){switch(g){case 0:html_rootNode = html_createElement(html_stringToH(html_newTree));html_root = html_cssSelector("#code");g=13;return html__appendChild(html_root,html_rootNode,f);case 13:;;return c(html_rootNode);}}}()}function html_startApp(html_r, html_appstate,c){var html_oldV;var html_root;var g=0;return function f(d){while(1){switch(g){case 0:g=14;return html_appstate.unary_read(f);case 14:;html_oldV = html_stringToH(html_r((d),html_appstate));g=15;return html_render(html_oldV,f);case 15:html_root = d;function html_rerender(html_i,h){var html_newV;var html_patches;var l=0;return function k(j){while(1){switch(l){case 0:html_newV = html_stringToH(html_r(html_i,html_appstate));html_patches = html_diff(html_oldV,html_newV);l=16;return html_patch(html_root,html_patches,k);case 16:html_root=j;html_oldV=html_newV;;return h();}}}()}g=17;return (html_appstate).watch(html_rerender,f);case 17:;;return c();}}}()}
types['http'] = {};
function http_clientInit(){var d=0;return function c(b){while(1){switch (d){case 0:http_response = new http_Response(200,"text/plain","","");http_encodeURI = encodeURI;http_encodeURIComponent = encodeURIComponent;http_get = _http_get;http_post = _http_post;;return;}}}()}function http_Server(c){this.listen=c;}http_Server._fields=[[ "listen" , "|int| do none" ]];types['http']['Server']=http_Server._fields;function http_NodeHTTP(c){this.createServer=c;}http_NodeHTTP._fields=[[ "createServer" , "||http.Request, http.Response| -> none| -> http.Server" ]];types['http']['NodeHTTP']=http_NodeHTTP._fields;function http_Request(c,d){this.url=c;this.body=d;}http_Request._fields=[[ "url" , "string" ],[ "body" , "string" ]];types['http']['Request']=http_Request._fields;function http_Response(c,d,f){this.status=c;this.contentType=d;this.body=f;}http_Response._fields=[[ "status" , "int" ],[ "contentType" , "string" ],[ "body" , "string" ]];types['http']['Response']=http_Response._fields;http_Response.prototype.toString=(function(){return http_Response_toString(this)});function http_Response_toString(http_self){;return (((((((("Response(")+(((http_self).status)).toString()))+(", "))+(((http_self).contentType)))+(", "))+(((http_self).body)))+(")"));}function http_endResponse(http_x){;return core_assign(http_response,{body:jsonStringify(http_x)});}function http_query(http_fromJSON, http_expects,c){var http_body;var g=0;return function f(d){while(1){switch(g){case 0:g=1;return http_post("query",jsonStringify(http_expects(http_endResponse)),f);case 1:http_body = ((d)).body;;return c(parseJson(http_fromJSON,http_body));}}}()}
types['math'] = {};
function math_clientInit(){var d=0;return function c(b){while(1){switch (d){case 0:;return;}}}()}function math_lcm(math_x, math_y){var math_i;math_i = (math_commonMultiple(math_x,math_y));var math_res;math_res = math_i.get(0);;return math_res;}function math_commonMultiple(math_x, math_y){var math_arr0;math_arr0 = math_multiples(math_x,math_y);var math_arr1;math_arr1 = math_multiples(math_y,math_x);var math_res;math_res = (math_arr0).filter(Vector.prototype.has.bind(math_arr1));;return math_res;}function math_commonFactor(math_x, math_y){var math_arr0;math_arr0 = math_factors(math_x);var math_arr1;math_arr1 = math_factors(math_y);var math_res;math_res = (math_arr0).filter(Vector.prototype.has.bind(math_arr1));;return math_res;}function math_slice(math_x, math_sx, math_yx){var math_s;math_s = (function(){if((math_sx<0)){return ((((math_x).length+math_sx)|0));}
else{return math_sx;}})();var math_y;math_y = (function(){if((math_yx<0)){return ((((math_x).length+math_yx)|0));}
else{return math_yx;}})();function math_add(math_elem){;return math_x.get(math_elem);};return (newVectorRange(math_s,math_y)).map(math_add);}function math_multiples(math_x, math_number){;return (newVectorRange(1,((math_number+1)|0))).map((op_mul.bind(null,math_x)));}function math_factors(math_number){;return (newVectorRange(1,((math_number+1)|0))).filter(math_isFactor.bind(null,math_number));}function math_factorsEx(math_number){;return math_slice((math_factors(math_number)),1,((-1)|0));}function math_hcf(math_x, math_y){var math_i;math_i = (math_commonFactor(math_x,math_y));;return math_i.get(((-1)|0));}function math_isMultiple(math_number, math_multiple){;return (((math_multiple%math_number)|0)===0);}function math_isFactor(math_number, math_factor){;return (((math_number%math_factor)|0)===0);}function math_isPrime(math_x){;return (((math_factors(math_x))).length===2);}function math_findPerfect(math_x){var math_perfect;math_perfect = (newVectorRange(1,30)).map(((function(d){return function(c){return op_pow(c,d);}})(2)));function math_find(math_index){var math_i;math_i = math_perfect.get(math_index);var math_b;math_b = math_perfect.get(((math_index-1)|0));;return ((math_i-math_b)|0);}var math_diff;math_diff = ((newVectorRange(1,(math_perfect).length))).map(math_find);;return (function(){if((!(isEven(math_x)))){return (function(){if((math_x>2)){return ((((((("(")+(((((((math_x/2)|0))+1)|0))).toString()))+(" ^ 2) - ("))+((((math_x/2)|0))).toString()))+(" ^ 2)"));}else if((math_x===1)){return "(1 ^ 1) - (0 ^ 1)";}
else{return (((("cannot find for ")+((math_x)).toString()))+(""));}})();}
else{return (((("cannot find for ")+((math_x)).toString()))+(""));}})();}function math_Fraction(c,d){this.numerator=c;this.denominator=d;}math_Fraction._fields=[[ "numerator" , "int" ],[ "denominator" , "int" ]];types['math']['Fraction']=math_Fraction._fields;math_Fraction.prototype.toString=(function(){return math_Fraction_toString(this)});function math_Fraction_toString(math_self){;return (function(){if(((math_self).denominator===1)){return (((("")+(((math_self).numerator)).toString()))+(""));}
else{return ((((((("")+(((math_self).numerator)).toString()))+("/"))+(((math_self).denominator)).toString()))+(""));}})();}math_Fraction.prototype.op_add=(function(c){return math_Fraction_op_add(this,c)});function math_Fraction_op_add(math_self, math_other){var math_common;math_common = math_lcm((math_self).denominator,(math_other).denominator);var math_x;math_x = math_Fraction_scale(math_self,math_common);var math_y;math_y = math_Fraction_scale(math_other,math_common);;return math_Fraction_simplify(new math_Fraction((((math_x).numerator+(math_y).numerator)|0),math_common,math_common));}math_Fraction.prototype.scale=(function(c){return math_Fraction_scale(this,c)});function math_Fraction_scale(math_self, math_den){var math_by;math_by = ((toFloat(math_den))/(toFloat((math_self).denominator)));;return new math_Fraction(toInt(((toFloat((math_self).numerator))*math_by)),math_den,math_den);}math_Fraction.prototype.op_sub=(function(c){return math_Fraction_op_sub(this,c)});function math_Fraction_op_sub(math_self, math_other){var math_common;math_common = math_lcm((math_self).denominator,(math_other).denominator);var math_x;math_x = math_Fraction_scale(math_self,math_common);var math_y;math_y = math_Fraction_scale(math_other,math_common);;return math_Fraction_simplify(new math_Fraction((((math_x).numerator-(math_y).numerator)|0),math_common,math_common));}math_Fraction.prototype.op_mul=(function(c){return math_Fraction_op_mul(this,c)});function math_Fraction_op_mul(math_x, math_y){;return math_Fraction_simplify(new math_Fraction((((math_x).numerator*(math_y).numerator)|0),(((math_x).denominator*(math_y).denominator)|0),(((math_x).denominator*(math_y).denominator)|0)));}math_Fraction.prototype.invert=(function(){return math_Fraction_invert(this)});function math_Fraction_invert(math_x){;return math_Fraction_simplify(new math_Fraction((math_x).denominator,(math_x).numerator,(math_x).numerator));}math_Fraction.prototype.simplify=(function(){return math_Fraction_simplify(this)});function math_Fraction_simplify(math_x){var math_common;math_common = (((math_x).denominator/math_hcf((math_x).numerator,(math_x).denominator))|0);;return math_Fraction_scale(math_x,math_common);}math_Fraction.prototype.op_div=(function(c){return math_Fraction_op_div(this,c)});function math_Fraction_op_div(math_x, math_y){;return math_Fraction_simplify((math_Fraction_op_mul(math_Fraction_invert(math_x),math_y)));}math_Fraction.prototype.op_gt=(function(c){return math_Fraction_op_gt(this,c)});function math_Fraction_op_gt(math_self, math_other){var math_common;math_common = math_lcm((math_self).denominator,(math_other).denominator);var math_x;math_x = math_Fraction_scale(math_self,math_common);var math_y;math_y = math_Fraction_scale(math_other,math_common);;return ((math_x).numerator>(math_y).numerator);}math_Fraction.prototype.op_lt=(function(c){return math_Fraction_op_lt(this,c)});function math_Fraction_op_lt(math_self, math_other){;return math_Fraction_op_gt(math_other,math_self);}math_Fraction.prototype.toInt=(function(){return math_Fraction_toInt(this)});function math_Fraction_toInt(math_self){;return (((math_self).numerator/(math_self).denominator)|0);}math_Fraction.prototype.toFloat=(function(){return math_Fraction_toFloat(this)});function math_Fraction_toFloat(math_self){;return ((toFloat((math_self).numerator))/toFloat((math_self).denominator));}
types['navigation'] = {};
function navigation_clientInit(){var d=0;return function c(b){while(1){switch (d){case 0:sub_clientInit();navigation_Sub= typeof sub_Sub=='undefined'||sub_Sub;navigation_onHashChange = _router_onUrlChange;navigation_getHash = _router_getHash;navigation_changeHash = _router_changeHash;;return;}}}()}function navigation_Router(c,d){this.init=c;this.sub=d;}navigation_Router._fields=[[ "init" , "navigation.Router.T" ],[ "sub" , "|Atom[navigation.Router.T]| -> sub.Sub" ]];types['navigation']['Router']=navigation_Router._fields;function navigation_newRouter(navigation_route,c){var g=0;return function f(d){while(1){switch(g){case 0:g=1;return navigation_getHash(f);case 1:g=2;return navigation_route(d,f);case 2:;return c(new navigation_Router(d,(function(j){return function(h){return navigation_onHashChange(h,j);}})(navigation_route),(function(l){return function(k){return navigation_onHashChange(k,l);}})(navigation_route)));}}}()}
types['sub'] = {};
function sub_clientInit(){var d=0;return function c(b){while(1){switch (d){case 0:sub_register = _sub_register;sub_batch = _sub_batch;sub_nil = _sub_none;;return;}}}()}function sub_Sub(){}sub_Sub._fields=[];types['sub']['Sub']=sub_Sub._fields;
types['svg'] = {};
function svg_clientInit(){var d=0;return function c(b){while(1){switch (d){case 0:svg_h = svg_h;svg__svg = svg_h.bind(null,"svg");svg_rect = svg_h.bind(null,"rect");svg_circle = svg_h.bind(null,"circle");svg_image = svg_h.bind(null,"image");svg_width = html_newAttrib.bind(null,"width");svg_height = html_newAttrib.bind(null,"height");svg_fill = html_newAttrib.bind(null,"fill");svg_x = html_newAttrib.bind(null,"x");svg_y = html_newAttrib.bind(null,"y");svg_href = html_newAttrib.bind(null,"xlink:href");svg_transform = html_newAttrib.bind(null,"transform");svg_stroke = html_newAttrib.bind(null,"stroke");svg_cy = html_newAttrib.bind(null,"cy");svg_cx = html_newAttrib.bind(null,"cx");svg_r = html_newAttrib.bind(null,"r");svg_gameLoop = core_fps;;return;}}}()}function svg_fps(svg_f, svg_a, svg__fps,c){var g=0;return function f(d){while(1){switch(g){case 0:function svg_nextFrame(svg_delta,h){var l=0;return function k(j){while(1){switch(l){case 0:l=1;return svg_a.unary_read(k);case 1:;l=2;return svg_f(j,svg_delta,k);case 2:l=3;return (svg_a).op_set(j,k);case 3:;l=4;return sleep(0.0,k);case 4:;;return h();}}}()}svg_gameLoop(svg_nextFrame,svg__fps);;return c();}}}()}
types['fs'] = {};
function fs_clientInit(){var d=0;return function c(b){while(1){switch (d){case 0:;return;}}}()}function fs_Either(c){this[0]=c}function fs_Ok(d){var c = new fs_Either(0);c[1]=d;return c}function fs_Error(f){var c = new fs_Either(1);c[1]=f;return c}fs_Either.prototype.toString=(function(){return fs_Either_toString(this)});function fs_Either_toString(fs_self){;return (function(){var c=fs_self;if(c[0]==0){var fs_value=c[1];return fs_value;}if(c[0]==1){var fs_exception=c[1];return toString(fs_exception);}})();}function fs_toError(fs_err){;return (function(){if(fs_err){return fs_Error(fs_err);}
else{return fs_Ok("");}})();}
types['time'] = {};
function time_clientInit(){var d=0;return function c(b){while(1){switch (d){case 0:time_Sub= typeof sub_Sub=='undefined'||sub_Sub;time_millisecond = 1;time_second = (1000.0*time_millisecond);time_minute = (60.0*time_second);time_hour = (60.0*time_minute);time_now = toAsync(Date.now);time_currentDate = _time_currentDate;time_setInterval = function(a,b){return setInterval(function(){a(function(){});}, b);};time_clearInterval = toAsync(clearInterval);time_every = _time_every;;return;}}}()}function time_inMilliseconds(time_t){;return time_t;}function time_inSeconds(time_t){;return (time_t/time_second);}function time_inMinutes(time_t){;return (time_t/time_minute);}function time_inHours(time_t){;return (time_t/time_hour);}
types['concurrency'] = {};
function concurrency_clientInit(){var d=0;return function c(b){while(1){switch (d){case 0:concurrency_chan = 
    function(buffer) {
        return {
            buffer: buffer,
            listeners: [],
            senders: [],
            op_set: function(value, next) {
                if (this.senders.length < this.buffer.length) {
                    this.senders.push([value, _empty_func]);
                    next(); //non blocking
                } else if (this.senders.length >= buffer || this.listeners.length == 0) {
                    this.senders.push([value, next]); //blocking
                } else {
                    var listener = this.listeners.shift(0);
                    listener(value);
                    next();
                }
            },
            unary_read: function(next) {
                if (this.senders.length == 0) {
                     this.listeners.push(next);
                } else {
                    var result = this.senders.shift(0);
                    next(result[0]);
                    result[1]();
                }
            }
        }
    }
;concurrency_spawn = 
    function(func, next) {
        let future =
            {
                resolved: false,
                value: undefined,
                listeners: [],
                resolve: function(value) {
                    for (var i = 0; i < this.listeners; i++) {
                        this.listeners[i](value);
                    }

                    this.value = value;
                    this.resolved = true;
                },
                unary_read: function(next) {
                    if (!this.resolved) {
                         this.listeners.push(next);
                    } else {
                        return this.value;
                    }
                }
            }

        func(function(value) {
            future.resolve(value);
        })
        next(future);
    }
;concurrency_Event= typeof html_Event=='undefined'||html_Event;concurrency_Attribute= typeof html_Attribute=='undefined'||html_Attribute;;return;}}}()}function concurrency_toEventHandler(concurrency_func, concurrency_domEvent, concurrency_f, concurrency_a){var concurrency_attr;concurrency_attr = concurrency_domEvent(concurrency_f,concurrency_a);;return new html_Attribute((concurrency_attr).name,{attribute:(concurrency_attr).value,func:concurrency_func},{attribute:(concurrency_attr).value,func:concurrency_func});}
types['main'] = {};
function main_clientInit(){var d=0;return function c(b){while(1){switch (d){case 0:html_clientInit();http_clientInit();math_clientInit();navigation_clientInit();svg_clientInit();fs_clientInit();time_clientInit();concurrency_clientInit();;return;}}}()}main_clientInit();