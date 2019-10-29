# Http 
 
```scala
type Server =
   _fields: [](string,string)
``` 
 
```scala
type Response =
   _fields: [](string,string)
``` 
 
```scala
type Request =
   _fields: [](string,string)
``` 
 
The port the server is expected to start on 
```scala
port: int
``` 
 
Create a new server 
```scala
server: ||http.Request| do http.Response| -> http.Server
``` 
 
```scala
handleQuery: |http.Request, |http._.T| do http.Response, Decoder[http._.T]| do http.Response
``` 
 
When parsing the request add 
```scala 
def query(q: Routes) Response do 
    match q with 
        Hello end -> 
            end "Hello World!" 
 
def parse(req: Request) Response do 
    match req.url with 
        "/query" -> 
            handleQuery req, query 
``` 
 
 
Send a typed request to the server 
```scala
query: |Decoder[http.query.T], ||http.query.T| -> http.Response| -> http.query.U| do Result[http.query.T,string]
``` 
 
```scala 
type Routes either 
    Hello(|string| -> Response) 
 
query decoder string, Hello 
``` 
 
