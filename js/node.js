var main_fs = require("fs");
var http = require("http");
var https = require("https");

function server_readFile(f,next) {
    main_fs.readFile(f,function(e,res){
        if(e){
            next([1])
        } else {
            next([0,res])
        }
    })
}

function html_addClassOnVisible(className) {
    return {
        name: "onMount",
        value: html_addClassOnVisible
    }
};

html_hyper = (function() {
    function VNode(html) {
        this.html = html
    }

    function html_hyper(name, attrib, children) {
        if (name == "link") { name = "a" }
        var s = "<"+name;

        for (var i = 0; i < attrib.length; i++) {
            var at = attrib.get(i);
            if (at.value === true) {
                s += " "+at.name
            }
            else if (at.name == "multiple") {
                var attribs = at.value;
                attrib = attrib.op_add(attribs);
            }
            else if (at.value !== false && !(at.name.startsWith("on")) && at.value !== "") {
                if (at.name == "className") {
                    s += ' class="'+at.value+'"'
                } else {
                    s += " "+at.name+'= "'+at.value+'"'
                }
            }
        }

        if (children.length == 0) {
            s += "></" + name + ">"
            return new VNode(s);
        }

        s += ">"

        function childrenToString(ch) {
            if (ch instanceof VNode) {
                s += ch.html;
            } else if (typeof ch === "string") {
                s += ch;
            } else {
                var length = ch.length;
                for (var i = 0; i < length; i++) {
                    childrenToString(ch.get(i))
                }
            }
        }

        childrenToString(children);

        s += "</" + name + ">"

        return new VNode(s);
    }

    return html_hyper;
})()

function html__renderToString(vnode) {
    return vnode.html
}

function _http_get(url, next) {
    var client;

    if (url.indexOf("https") === 0){
        client = https;
    }  else {
        client = http;
    }

    client.get(url, function(res) {
        var body = "";
        res.setEncoding('utf-8')
        res.on('data', function (chunk) {
            body += chunk;
        })

        res.on("end", function () {
            next({
                body: body,
                status: res.statusCode,
                contentType: res.contentType
            })
        })
    });
}

var http = require('http')
var fs = require('fs')
var compress = require("compression")

/*
http.createServer(function(request, response) {
  var noop = function(){}, useDefaultOptions = {}
  compress(useDefaultOptions)(request,response,noop) // mutates the response object

  response.writeHead(200)
  fs.createReadStream('index.html').pipe(response)
}).listen(1337)
*/

function server_createServer(func) {
    var server = http.createServer(function (req, res) {
        req.url = decodeURI(req.url)

        func(req, function (_res) {
            compress({})(req, res, function() {
                res.writeHead(_res.status, {'Content-Type': _res.contentType});
                //_res.encoding
                res.end(_res.body, "utf8");
            })
        })
    })

    server.listen = toAsync(server.listen.bind(server))
    return server
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

var _monk_connect = require("monk");

function _monk_get(db, name, decoder) {
    var tmp = db.get(name);
    tmp.decoder = decoder;
    return tmp;
}

function _monk_find(coll, query, next) {
    coll.find(query).catch(function() { console.log("can not connect to database"); })
    .then(function(i) {
        var arr = EmptyVector;
        for (var c = 0; c < i.length; c++) {
            var newValue = coll.decoder(i[c]);
            if (newValue[0] == 0) {
                arr = arr.append(newValue[1]);
            } else {
                return Error("Index "+c+" of find results : "+newValue[1]);
            }
            //coll.decoder(i[c]));
        }
        next(Ok(arr));
    }).catch(function(err) {
        next(Error(toString(err)))
    })
}

function _monk_search(coll, query, search, next) {
    var q = {$text: {$search: search}}
    query = Object.assign({}, query, q);
    coll.find(query)
    .catch(function() { next(Error("can not connect to database")); })
    .then(function(i) {
        next(Ok(fromArray(i.map(coll.decoder).reverse())));
    });
}

function _monk_insert(coll, obj, next) {
    coll.insert(obj);
    next();
}

function server_handleQuery(req, func, decoder, next) {
        req.on("data", function(body) {
            body = String(body);
            var req = decoder(JSON.parse(body));
            if (req[0] == 0) {
                console.log("===")
                console.log(req);
                req = req[1];
            } else {
                return next({status: 400, body: "Malformed query : "+req[1], contentType: "text"})
            }

            console.log(req);

            var length = Object.keys(req).length

            req[length - 1] = function something(res) {
                return {
                    body: JSON.stringify(res),
                    status: 200,
                    contentType: "text",
                    encoding: res.encoding,
                }
            };

            func(req, next);
        })
}

function read_maybe_pos_atom(atom, next) {
    atom.a.unary_read(function(res) {
        var throughLens = atom.pos.query(res);
        if (throughLens[0] == 0) {
            next(throughLens[1]);
        }
    })
}

function server_isQuery(url) {
    return url === "/query"
}

function __http_post(options, data, fn) {
	if (typeof(fn) != 'function') {
		fn = function() {};
	}

	if (typeof(options) == 'string') {
		var options = require('url').parse(options);
	}

	var endl = "\r\n";
	var length = 0;
	var contentType = '';

	if (typeof data == "string") {
	    length = data.length;
	} else {
		data = require('querystring').stringify(data);
		length = data.length;
		contentType = 'application/x-www-form-urlencoded';
	}

	options.method = 'POST';
	options.headers = {
		'Content-Type': contentType,
		'Content-Length': length
	};

	var req = require('http').request(options, function(responce) {
		fn(responce);
	});

	req.write(data);
	req.end();

	return req;
}

function _http_post(url, data, next) {
    var body = "";
    __http_post(url, data, function (res) {
        res.setEncoding('utf-8')
        res.on('data', function (chunk) {
            body += chunk;
        })

        res.on("end", function () {
            next({
                body: body,
                status: res.statusCode,
                contentType: res.contentType
            })
        })
    })
}