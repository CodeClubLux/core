var main_fs = require("fs");
var http = require("http");

function server_readFile(f,next) {
    main_fs.readFile(f,function(e,res){
        if(e){
            next([1])
        } else {
            next([0,res])
        }
    })
}

function _http_get(url, next) {
    http.get({path: url}, next);
}

function server_createServer(func) {
    var server = http.createServer(function (req, res) {
        req.url = decodeURI(req.url);
        func(req, function (_res) {
            res.writeHead(_res.status, {'Content-Type': _res.contentType});
            res.end(_res.body, _res.encoding);
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
            arr = arr.append(coll.decoder(i[c]));
            //coll.decoder(i[c]));
        }
        next(arr);
    })
}

function _monk_search(coll, query, search, next) {
    var q = {$text: {$search: search}}
    query = Object.assign({}, query, q);
    coll.find(query).catch(function() { console.log("can not connect to database"); })
    .then(function(i) {
        next(fromArray(i.map(coll.decoder).reverse()));
    });
}

function _monk_insert(coll, obj, next) {
    coll.insert(obj);
    next()
}

function server_handleQuery(req, func, decoder, next) {
        req.on("data", function(body) {
            body = String(body);
            try {
                req = decoder(JSON.parse(body));
            } catch(Exception) {
                console.log("exception occured")
                next({status: 404})
                return
            }
            var length = Object.keys(req).length

            req[length] = function something(res) {
                return {
                    body: JSON.stringify(res),
                    status: 200,
                    contentType: "text",
                }
            };

            func(req, next);
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
                status: res.status,
                contentType: res.contentType
            })
        })
    })
}