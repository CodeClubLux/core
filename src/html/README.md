# Html 
This package is used to render html to the browser. 
 
Hello World 
 
```scala 
import "html" 
 
html.render html.h1 \[], "Hello World!" 
 
``` 
A Virtual Dom Node 
```scala
type VNode =
   _fields: [](string,string)
``` 
 
Native html elements. 
```scala
type HtmlElem with
   innerHtml: string
   textContent: string
   value: string

``` 
 
Atom that updates the part of global state atom, using lenses 
```scala
type PosAtom[X, T] =
   _fields: [](string,string)
``` 
 
Type of Events 
```scala
type Event =
   _fields: [](string,string)
``` 
 
```scala
type Attribute =
   _fields: [](string,string)
``` 
 
Initialize and render the application 
```scala
startApp: ||html.startApp.T, Atom[html.startApp.T]| -> html.Html, Atom[html.startApp.T]| do none
``` 
 
Render a single frame 
```scala
render: |html.Html| do html.HtmlElem
``` 
 
 
