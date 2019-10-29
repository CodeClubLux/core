window.virtualDom = require("virtual-dom");
//require("./three_wrapper");

window.clearElement = function(elem) {
    elem.innerHTML = "";
}

window._main_markdown = function markup(text) {
    return virtualDom.h("div", { innerHTML: text });
}

window.html_hyper = function (type, attrib, children) {
    var at = {}
    for (var i = 0; i < attrib.length; i++) {
        var a = attrib.get(i);
        if (typeof a.value === "function") {
            at[a.name] = toSync(a.value);
            //toSync(attrib[i].value);
        } else {
            at[a.name] = a.value;
        }
    }

    if (at.href && at.href[0] == "#" && type == "a") { //hack to make sure window location change is triggered
        var onclick = at.onclick;

        at.onclick = function(e) {
            if (onclick) {
                onclick(e)
            }
            window.location.hash = at.href;
        }
    }

    if (children instanceof Vector) {
        children = children.toArray();
    }

    var res = virtualDom.h(type, at, children);

    if (at.onMount) {
        res.onMount = at.onMount;

    }
    if (at.onUnMount) {
        res.onUnMount = at.onUnMount
    }
    return res;
}

window._html_register = function _html_register(func, a, next) {
    if (typeof calledBy != "undefined") {
        console.log(a);
        calledBy.push(func.name + " " + a.toString() + " -> ");
    }
    next();
}

window._html_stringToH = function(s) {
    if (typeof s == "string") {
        return virtualDom.h("div",{},s);
    } else {
        return s
    }
}

window._html_setLocalStorage = function _html_setLocalStorage(item, next) {
    var obj = JSON.stringify(item);
    localStorage.setItem("data", obj);
    next();
}

window._html_readLocalStorage = function _html_setLocalStorage(decoder, next) {
    var d = localStorage.getItem("data");
    if (!d) {
        next([1]);
    } else {
        next([0, parseJson(decoder, d)]);
    }
}

window._html_setUrl = function _html_setUrl(url, next) {
    window.location.hash = url;
    next();
}

window._nextTick = function(func, next) {
    requestAnimationFrame(function(){
        func(function(){});
    });
    next();
}

var _svg_h = require('virtual-hyperscript-svg');

window.svg_h = function (type, attrib, children) {
    var at = {}
    for (var i = 0; i < attrib.length; i++) {
        if (typeof attrib[i].value === "function") {
            at[attrib[i].name] = toSync(attrib[i].value);
            //toSync(attrib[i].value);
        } else {
            at[attrib[i].name] = attrib[i].value;
        }
    }

    var res = _svg_h(type, at, children);
    return res;
}

window._http_get = function _http_get(url, next) {
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

window._http_post = function _http_post(url, data, next) {
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

window.core_watcher = function (a, b) {
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

window.newThunk = function (fn, arg, key) {
    return new Thunk(fn, arg, key)
}

window.http_get = function (theUrl, callback)
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

window.json_prettify = function (obj, indent) {
    return JSON.stringify(JSON.parse(obj), null, indent);
}

window.html_appendChild = function (a,b) {
    a.appendChild(b);
}

window.core_fps = function core_fps(update, maxFPS) {
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

window.html_handle = handler;

window.html_addClassOnVisible = function html_addClassOnVisible(className) {
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