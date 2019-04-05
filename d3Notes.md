# REMEMBER: d3 is a DOM manipulation library!

## Commandments

I. the outer `<svg>` must have a H x W defined somewhere

II. circles should always be scaled by area, not by radius value

III. select an element in the DOM, then append an svg to it

### 3 forms of DataVis
1. exploring data - discover something new
2. analyzing data - testing a theory about the state of the world
3. presenting data - communicating something to others

## Quick Start
### index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://unpkg.com/d3@^5.9"></script>
  <script src="https://unpkg.com/topojson@^3.0"></script>
  <title>CHANGE ME</title>
</head>
<body>
  <div id="container">
	<div id="svg-area"> </div>    
  </div>
</body>
</html>
```


### d3.csv 
takes .csv file and parses/returns 1 obj per row, so d === array of objects

```
csvUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/345524/cities.csv";

d3.csv(csvUrl, function(d) {
  return {
    label: d.label,
    population: +d.population,
    country: d.country,
    x: +d.x,
    y: +d.y
  };
}).then(function(myData) {
  console.log(data);
});
```

```
"label","population","country","x","y"
"San Francisco", 750000,"USA",122,-37
"Fresno", 500000,"USA",119,-36
"Lahore",12500000,"Pakistan",74,31
"Karachi",13000000,"Pakistan",67,24
"Rome",2500000,"Italy",12,41
"Naples",1000000,"Italy",14,40
"Rio",12300000,"Brazil",-43,-22
"Sao Paolo",12300000,"Brazil",-46,-23
```
### csv with forEach
```
d3.csv('fruit.csv').then(function(data){
    data.forEach(function(d){
      d.quantity = +d.quantity,
      d.cost_per_unit = +d.cost_per_unit;
    })
  }(function(error){
    console.log(error);
  });  
```

## Scales
> translate numbers from dataSpace to pixelSpace

### d3.scaleLinear()
#### colors for heat charts
REMEMBER TO REVERSE OUTPUT (top,bottom) so the scale goes 0 at bottom and up the scale

```
scaleY = d3.scaleLinear()
  .domain([0, 220])
  .range([rgb(0,0,255),rgb(255,0,0])
  
  console.log(scaleY(100));
  console.log(scaleY.invert(100));
```
min blue . rgb(0,0,255)
max red rgb(255,0,0)

### d3.scaleOrdinal
Ordinal scale domains and ranges are always made up of array values

almost always, string value x to color value y

```
let nationToColor = d3.scaleOrdinal()
  .domain(["AF", "EAP", "SCA", "WHA", "EUR", "NEA" ])
  .range(["RED", "GREEN", "BLUE", "GOLD", "ORANGE", "PURPLE" ])
```  
  // OR
```
  .range(d3.schemeCategory10);
```

```
  console.log((nationToColor("AF")) // "RED"
```

### d3.scaleBand
```
let dataBand = d3.scaleBand()
  .domain(["AF", "EAP", "SCA", "WHA", "EUR", "NEA" ])
  .range([0, 400])
  .paddingInner(0.3)
  .paddingOutter(0.2)
```  

## Date/Time
[d3 API Time Format](https://github.com/d3/d3-time-format/blob/master/README.md#d3-time-format)

### Parse and Format Date/Time

To format a date, create a formatter from a specifier (a string with the desired format directives, indicated by %); then pass a date to the formatter, which returns a string.

To convert the current date to a human-readable string:

```
var formatTime = d3.timeFormat("%B %d, %Y");
formatTime(new Date); // "June 30, 2015"
```

Likewise, to convert a string back to a date, create a parser:

```
var parseTime = d3.timeParse("%B %d, %Y");
parseTime("June 30, 2015"); // Tue Jun 30 2015 00:00:00 GMT-0700 (PDT)
```

### Scale Date/Time

```
xScale = d3.scaleTime()
.domain(
[
  d3.min(dataset, function(d) { return d.Date; }),
  d3.max(dataset, function(d) { return d.Date; })
])
.range([padding, w - padding]);


var dateFormat = d3.time.format("%Y-%m-%d");
var timeScale = d3.time.scale()
        .domain([d3.min(taskArray, function(d) {return dateFormat.parse(d.startTime);}),
                 d3.max(taskArray, function(d) {return dateFormat.parse(d.endTime);})])
        .range([0,w-150]);


var rowConverter = function(d) {
  return {
    prior_election: parseTime(d.prior_election),
    country: d.country
  };
}

```

### d3.scaleTime()
```
timeScale = d3.scaleTime()
  .domain([new Date(2016, 0, 1), new Date(2017, 0, 1)])
  .range([0, 700]);

timeScale(new Date(2016, 0, 1));   // returns 0
timeScale(new Date(2016, 6, 1));   // returns 348.00...
timeScale(new Date(2017, 0, 1));   // returns 700
```

### scaleSqrt()
scaleSqrt is useful for sizing circles by area (rather than radius)

## Axes
d3 axes are functions whose parameters you define. Scales return values but don't append to the screen.
An axis function is called but doesn’t return a value like scales, but generates the visual elements of the axis, including lines, labels, and ticks.

Axes are svg specific. They append an svg element to the DOM. Default placed at the svg canvas origin 0,0.

Each axis must be told on what scale to operate. Here we pass in the xScale: 

```
xAxis.scale(xScale);
```

or

```
var xAxis = d3.axisBottom().scale(xScale);
```
or

```
var xAxis = d3.axisBottom(xScale);
```

Finally, to generate the axis and insert ticks and labels to our SVG, we call the xAxis function. D3’s call() function takes the incoming selection here the selection is our new g group element. call(xAxis) hands off g to the xAxis function, so our axis is generated within g. g groups can be transformed as needed.

This code goes at the end of our script, so the axis is generated and rendered on top the other svg elems.

```svg.append("g").call(xAxis);```

### Axes Pseudo Code
1. declare Axis Generators: axisCall in preparation to genarate
  - pass relevent scalename d3.scaleBottom(xScale) as argument
  - add .tickSize() and inner/outer to the scaleBottom(but NOT the text or pos or rotate of the lable itself)
2. append an svg g elem on to bigG (svg visualization area) and translate the g which holds the axis to the bottom or right etc
3. invoke .call(xAxisCall) method to run the axis generator
4. add optional tick text mods after the .call in the g stack
5. NOTE: chart TITLEs OR LABELs is added in a separate g which appends to bigG.


~~~
  bigG.append('g')
    .attr('class','classNm')
    .attr('transform','translate(0, '+ height +')')
  .call(xAxisCall)
    .selectAll('text')  // rotate and move each svg text element within this (g)roup
    .attr('x', 5)
    .attr('y', -7)
    .attr('text-anchor','end')
    .attr("transform", "rotate(-40)");  // 40 deg CCW
~~~ 

### d3.axisBottom
```
let xAxisCall = d3.axisBottom(xScaleHere)
  .tickSize(*defaults to 6*)
  
bigG.append('g')
  .attr('class','x-axis')
  .attr('transform','translate(0,' + height +')')
  .call(xAxisCall)
```

```
let yAxisCall = d3.axisLeft(yScaleHere)
  .tickSizeInner(*VALUE*)
  .tickSize(8.5);
    
bigG.append('g')
  .attr('class','y-axis')
  // no transform needed as defaults to left side
  .call(yAxisCall);
  
```

~~~
d3.axisBottom(xScaleName)
  .tick(10);  // gives us 10 tick units
  .tickFormat(d3.format(",.0f"));   // floating point no with no decimal places
  
  // added text ending like M or lbs to labels
  .tickFormat(d3.format(function(){ return d + 'lbs'}));
  
d3.axisBottom(xScaleName)
  .tickFormat(function(d){ return *TICK TEXT* });
 
d3.axisBottom(xScaleName) 
  .tickValues([1,2,3,4,5,6]);
~~~

### Chart Labels or Titles

// X label

~~~
 bigG.append('text')
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("font-size", "22px")
  .attr("text-anchor", "middle")
  .text("Words under the X axis")
~~~

// Y label on left and rotated 90 CCW

~~~
bigG.append('text')
  .attr("x", - (height / 2))
  .attr("y", -50)
  .attr("font-size", "22px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Words Left of the Y axis")
~~~


## Javascript
### Error Handling

```
.catch(function(error){
  console.log(error);
});
```

#### Bootstrap default

```
    <nav class="navbar navbar-default">
        <div class="container">
            <a class="navbar-brand" href="#"><img id="logo" src="img/logo.png"></a>      
        </div>
    </nav>

    <!-- Bootstrap grid setup -->
    <div class="container">
        <div class="row">
            <div id="chart-area"></div>
        </div>
    </div>
```

#### promises
```
let promises = [
	d3.json('path/data.json'),
	d3.csv('path/csvDat.csv')
]

Promise.all(promises).then(function(allData){
	let map = allData[0];
	let otherData = allData[1];

	console.log(map);
	console.log(otherData);

}).catch(function(error) {
	console.log(error);
});
```
   
<!-- Citation   -->
<!-- http://worldpopulationreview.com/countries/dr-congo-population/   -->

```
document.getElementById("graphic").textContent = "hi"
```

```
folks = [{name:"Stewart",age:58},{name:"Jack",age:11},{name:"Nate",age:13},{name:"Leah",age:45}, {name:"Chai",age:2}];
var months = ['March', 'Jan', 'Feb', 'Dec', 'Oct', 'May'];
```

```
.style("color", function(d) { 
    if (d > 15)
    { 
       return "red"; 
    } 
    else 
    {
      return "black";
    }
 });
```

adjust radius of pie or cirlce to smaller of 2 dimensions

```
const radius = Math.min(width, height) / 2;
```

```
let newNumber = Math.floor(Math.random() * 30);

.attr("x", (d, i) { return i * (w / dataset.length);})

.attr("width", w / dataset.length - barPadding)

invert y value of bars
height of the SVG and the corresponding data value
.attr("y", function(d) {  return hOfSvg - d; })

To put the “bottom” of the bar on the bottom of the SVG each rect’s height can be just the data value itself:
.attr("height", function(d) { return d; });

d3.max(dataset, function(d) { 
  return d[0]; 
  });

```
### Plugins
```
<script src="https://unpkg.com/d3-geo-scale-bar@0.2.0/build/d3-geo-scale-bar.js"></script>
```

## Refs
### javascript
[Eloquent Javascript](http://eloquentjavascript.net/)

[es6 Features](https://github.com/lukehoban/es6features)

[Keycode Info](http://keycode.info/)

[Javascript Linter](https://validatejavascript.com/)

[JSON Linter](https://jsonlint.com/)

### d3

[D# Tips and Tricks Leanpub](https://leanpub.com/D3-Tips-and-Tricks/read)

[Understanding the SVG Coord System](https://www.sarasoueidan.com/blog/svg-coordinate-systems/)

[CSS Trick SVG Monster Guide](https://css-tricks.com/mega-list-svg-information/)

[Responsifey SVG](https://benclinkinbeard.com/d3tips/make-any-chart-responsive-with-one-function/?utm_content=buffer976d6&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer)

[Sydney Tutorials](http://www.sydneyurbanlab.com/D3Tutorials.html)

[good v5 w exercises](https://github.com/sgratzl/d3tutorial#d3-data-join)
    good v5 eUe code

[d3.timeFormat api](https://github.com/d3/d3-time-format#locale_format)

[js Code Readability](https://www.codereadability.com/)

### Data

[Relief Web Data](https://reliefweb.int/country/cod)

[Non State Actor Data FORGE](http://ksgleditsch.com/eacd.html)

[Health Data Collaborative](https://www.healthdatacollaborative.org/)

[Global Part Sustain Dev Data](http://www.data4sdgs.org/)

[Global Fund Data API](https://data-service.theglobalfund.org/)

[UN Gender Inequal Indx](http://hdr.undp.org/en/composite/GII)

[WB MicroData](http://microdata.worldbank.org/index.php/home)

[WB Open Govt Toolkit](http://opendatatoolkit.worldbank.org/en/)

[World Bank Data Sets](https://datacatalog.worldbank.org/)

[UN Global Indicators by Country](http://hdr.undp.org/en/countries)

[UN Human Development](http://hdr.undp.org/en/global-reports)

[UN Gender Minimum Sets](https://genderstats.un.org/#/home)

[Open Data Network](https://www.opendatanetwork.com/)

[GDELT](http://analysis.gdeltproject.org/module-event-timemapper.html)

[Enigma](https://public.enigma.com/)

[OECD](http://www.oecd.org/countries/democraticrepublicofthecongo/)

[Quartz Directory of Essential Data](https://docs.google.com/spreadsheets/d/1hU7Snj4KZ-ppyy388l-sV4I26n4yGVb8xYnygPOS-5k/edit#gid=0)

[wikiData](https://www.wikidata.org/wiki/Wikidata:Main_Page)

[Google Public Data. ITC internet for ex.](https://www.google.com/publicdata/directory#)

[Google Developers](https://developers.google.com/chart/)

[Africapolis](http://africapolis.org/home)

[Peace Agreemtn Collections and dB](https://www.peaceagreements.org/portal)

[Peace Agreements Database (Women, Girls and Gender)](https://www.peaceagreements.org/wsearch)

[UN Econ & Soc Affairs](https://www.un.org/development/desa/publications/graphic)

[UN World Pop. 2017](https://population.un.org/wpp/)

[Mr. Data Converter](https://shancarter.github.io/mr-data-converter/)

[World Bank OpenData Catalog](https://datacatalog.worldbank.org/)

[World Bank](https://data.worldbank.org/indicator/IT.NET.USER.ZS)

[UN Food and Ag](http://www.fao.org/faostat/en/#data/)

[Relief Web](https://reliefweb.int/)

[HealthSites](https://healthsites.io/)

[Uppsala Conflict Data Prog](https://ucdp.uu.se/)

[Joshua Project](https://joshuaproject.net/countries/CG)

[Internal Displace Monitoring Center](http://www.internal-displacement.org/countries/democratic-republic-of-the-congo)

[Source. Open news](https://source.opennews.org/guides/)

[Reddit Datasets](https://www.reddit.com/r/datasets/)

### Data Cleaning
[Open Refine](http://openrefine.org/)

[Open Refine Links](http://kb.refinepro.com/search/label/data%20exploration)

### Design
[WSJ Graphics](https://graphics.wsj.com/)

[Sunlight DataVis Style Guide](https://github.com/amycesal/dataviz-style-guide/blob/master/Sunlight-StyleGuide-DataViz.pdf)

[Reddit Data is Beautiful](https://www.reddit.com/r/dataisbeautiful)

[Fowing Data](https://FlowingData.com)

[Vizualizing Economics](http://visualizingeconomics.com/)

[Learning d3](https://learningd3.com/blog/resources-to-improve-your-visualizations/)

### Tutorials & Classes
[Udemy](https://www.udemy.com/masteringd3js/learn/lecture/8081896#content)

[Curran Datavis 2018](https://curran.github.io/dataviz-course-2018/)

[Coursera](https://www.coursera.org/learn/information-visualization-programming-d3js/lecture/Rs0eW/practice-transforming-data)

[DUSPviz All Map Types many tutorials](http://duspviz.mit.edu/tutorials/)

[MIT d3 101](http://duspviz.mit.edu/d3-workshop/mapping-data-with-d3/)

[New Media @UCB](https://newmedia.report/classes/coding/2018/mapping-in-d3/)
> nice list of refs


### Legends
[Susie Lu Legends](https://d3-legend.susielu.com/)

### Bootstrap Resources

### State CSO
[Archived CSO](https://www.state.gov/j/cso/archive/pastengagements/)


### Code for Practice
[d3v5 10 City Wx](https://medium.com/@cheha6/d3-in-a-simple-real-life-example-68b86032f22a)

[USGS Earthquake Coding Challenge](https://www.youtube.com/watch?v=ZiYdOwOrGyc)

### Utilites and Helper Sites
[Color Brewer](http://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3)

[GeoCoder GPS Visualizer](http://www.gpsvisualizer.com/geocoder/)
> add csv fields and it produces lat/lon records with any other data you want.

[GeoJson packager for Natural Earth](https://geojson-maps.ash.ms/)

[ogr2ogr convert geoJson types includeind coord systems](https://ogre.adc4gis.com/)
> ref for ogr2ogr here [Mapping in 2018](https://newmedia.report/classes/coding/2018/mapping-in-d3/)

[Convert proj type in prj files into standard format](http://prj2epsg.org/search)

[MapServer Open src mapping](https://mapserver.org/index.html)

## Mapping

[State MapGive](https://www.mapgive.state.gov/)

* GeoJSON (a JSON-based format for specifying geographic data)
* projections (functions that convert from lat/long co-ordinates to x & y co-ordinates)
* geographic path generators (functions that convert GeoJSON shapes into SVG)

### GeoPath and Projection
A projection is the method by which 3D space is “projected” onto a 2D plane.

d3.geoPath() converts GeoJSON coordinates into SVG path code

```
var projection = d3.geoAlbersUsa()
    .translate([w/2, h/2])
    .scale([500]);
    
// .translate to center of SVG image

var path = d3.geoPath().projection(projection);

// also valid

var path = d3.geoPath(projection);
```

TK  filter()
sort()
d3.descending

TK array.map() compares all elements to some function

TK array.reduce() maps all elems to one value

reduce is an 'accumulator' where each value in turn combines with the previous total

### Transform
Transforming - To define a new coordinate system for a set of SVG elements by applying a transformation to each coordinate specified in this set of SVG elements.

The SVG Transform Attribute applies a list of transformations to an element and it's children.

```
<g transform="translate(...) scale(...) rotate(...) translate(...) rotate(...)">
<g transform="translate(80,0)">
```

move x 80 to the right but DOES NOT change the x value. it moves the coord system underneath
Each transform definition is separated by white space and or commas.The transformations are applied from right to left because they are treated as nested transforms.

```
<g>
<svg>
  <g>
    <g transform="translate(80,0)">
      <circle cx="20" cy="20" r="20" fill="green" />
      <circle cx="70" cy="70" r="20" fill="purple" />
    </g>
  </g>
  </svg>
  ```
  
### .topojson

often named file.json

there will always be an 'objects' section and within that the data you want
data.objects.states or properties or country...

```
var states = topojson.feature(data, data.objects.states).features
```

returns getJson object from Topojson encoded file

```topojson.feature(topology, object)```

Returns the GeoJSON Feature or FeatureCollection for the specified object in the given topology. If the specified object is a GeometryCollection, a FeatureCollection is returned, and each geometry in the collection is mapped to a Feature. Otherwise, a Feature is returned. The returned feature is a shallow copy of the source object: they may share identifiers, bounding boxes, properties and coordinates.

## D3 Update Pattern
- Join

>`.data()` matches in console, ENTER elems to be added, EXIT to be removed, GROUP all those on screen

`let text = g.selectAll('text').data(dataset)`

- Exit/Remove

>`.exit()` lists all those in DOM for which there is not a corresponding entry in dataset
`text.exit().remove();`
>`.remove()` removes them

- Update

> update attributes of DOM elemens which will remain.
> note lack of .enter() or .append() here. nothing new added, just update existing.

```
text.attr('class','notNew').attr('fill','red');
```

- Enter

> create new elems w enter() and append() set attr on new elements

```
text.enter()
.append('text')
.attr('class','enter')
.attr('x', function(d,i){ return i * 32})
.attr('y',20)
.attr('fill','green')
.text(function(d){ return d });
```

### Interval fn to loop code

```
    d3.interval(function(){
        // code goes here
    }, 1000);
```

### Tool Tip

```
<link rel="stylesheet" href="//rawgithub.com/Caged/d3-tip/master/examples/example-styles.css">
<script src="https://unpkg.com/d3-tip@^0.9"></script>  
```

```
let width = window.innerWidth
let height = window.innerHeight
let scaleInit = 300
let meteorites
let tip = d3.tip()
          .attr('class', 'd3-tip')
          .html((d) => {
            console.log(d)
            let date = d.properties.year
            return '<div class="tip-text">'+
                  'Name: '+d.properties.name+'<br>'+
                  'Mass: '+d.properties.mass+'<br>'+
                  'Class: '+d.properties.recclass+'<br>'+
                  'Latitude: '+d.properties.reclat+'<br>'+
                  'Longitude: '+d.properties.reclong+'<br>'+
                  'Year: '+date.slice(0,4) +'<br>'+
              '</div>'
          })
```


### .attr vs.style
```
.attr()
.attr("class", "bar")
svg.attr("width", svgWidth)
   .attr("height", svgHeight);
circles.attr("cx", function(d, i) { 
  return (i * 50) + 25; })
.attr("cy", h/2)
.attr("r", function(d) { 
    return d;
});
.attr("fill", "yellow")
.attr("stroke", "orange")
.attr("font-family", "sans-serif")
.attr("font-size", "11px")
.attr("stroke-width", function(d) { 
   return d/2; }
);


.attr("x", function(d, i) { 
  return i * 21; 
})
.attr("x", function(d, i) { 
  return i * (w / dataset.length);
})
.attr("fill", function(d) { 
  return "rgb(0, 0, " + Math.round(d * 10) + ")";
});
```

### .style()

applies a CSS property and value directly to an HTML element.
Same as inline css in html `<div style="height: 75px;"></div>`

```
.style("height", function(d) { 
  var barHeight = d * 5;
  return barHeight + "px";
});
.style("height", function(d) { return d + "px";});
```



### Random Numbers
```
var newNumber = Math.floor(Math.random() * 30);
.call(function[, arguments…])
```

Invokes the function exactly once, passing in this selection along with any optional arguments. Returns this selection.
This function allows names to be set via function call

```
var dataset = [];
for (var i = 0; i < 25; i++) { 
  var newNumber = Math.random() * 30;
 dataset.push(newNumber);
} 
```

```
function name(selection, first, last) {
  selection
      .attr("first-name", first)
      .attr("last-name", last);
}

d3.selectAll("div").call(name, "John", "Snow");

```

```
Text
svg.selectAll("text")
.data(dataset)
.enter()
.append("text")
.text(function(d) { return d; })
.attr("x", function(d, i) { 
  return i * (w / dataset.length) +
   (w / dataset.length - barPadding) / 2;
  })
.attr("y", function(d) { return h - (d * 4) + 14;})
.attr("text-anchor", "middle");
```

### Event Listener
```
d3.select("p")
.on("click", function() { //Do something on click });
```

This binds an event listener to the p paragraph element. on() takes two arguments: the event name, and the function to be executed when the event is triggered on the selected element.

Event compatibility tables

www.quirksmode.org

```
rect {
-moz-transition: all 0.25s;
-o-transition: all 0.25s;
-webkit-transition: all 0.25s;
transition: all 0.25s;
}
rect:hover { 
  fill: orange;
}
```

apply a 0.25-second transition to smooth changes

Within anonymous functions, D3 automatically sets the context of this so it references "the current element upon which we are acting." The end result is that, when we hand off anonymous functions to any of D3's methods, we can reference this when trying to act on the current element.

```
.on("mouseover", function() { 
  d3.select(this)
  .attr("fill","orange");
})
.on("mouseout", function(d) {
  d3.select(this)
  .transition()
  .duration(250)
  .attr("fill", "rgb(0, 0, " + (d * 10) + ")");
});
```

### Centroids
```
// Centroid Names
 let centroidG = mainSvg.append('g');
  
  centroidG
    .append("g")
    .selectAll("text")
    .data(jsonDataFeatures)
    .enter()
    .append("text")
    .attr("x", function(d) {
      return path.centroid(d)[0];
    })
    .attr("y", function(d) {
      return path.centroid(d)[1];
    })
    .attr("class", function() {
      if (projection.scale < 600) {
        return "hiddenNames";
      } else {
        return "nullClass";
      }
    })
    .text(function(d) {
      return d.properties.ABBREV;
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "central")
    .style("font-size", 10)
    .style("fill", "black");
```



## Citations
### ACLED

Sources:
Armed Conflict Location & Event Data Project (ACLED); acleddata.com


## Functions and Methods

### unary plus +

+variable

+'123'

Attempts to convert string representations of integers and floats, as well as the non-string values true, false, and null. 
Integers in both decimal and hexadecimal ("0x"-prefixed) formats are supported. 
Negative numbers are supported (though not for hex). If it cannot parse a particular value, it will evaluate to NaN.

+3     // 3

+'3'   // 3

+true  // 1

+false // 0

+null  // 0

+function(val){ return val } // NaN

### array.filter()
filter returns an array of what you want to keep

```
var words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

const result = words.filter(word => word.length > 6);
```

### .call() vs each()

Difference between .each() and .call() in D3

.each() invokes a callback function on each element in the selection. Think "loop".

.call() invokes a callback function on the selection itself. The function is called just once with the entire selection as the argument.


### Role of anonymous functions
`d` by itself is undefined. if must be paired with a {block}

`.attr('cy', function(d) { return ... })`

`function setX(d) { return time_scale(d.time); }`

Anonymous function, a function that isn't given a named label.
Anonymous functions in Javascript are objects so you can pass them as parameters into other javascript functions.

In the case of d3, it allows you to pass in a function as the second parameter.

### function(d,i,j)
d is current data
i is index of current data element
j is the index of the parent node of nested selections

## ES6 Javascript
### Arrow Functions
```
.attr("y", d => d.y)
.attr("x", (d, i) => i * 10)
```
Arrow Functions short syntax for anonymous functions.
If you have only one argument you don’t need to include parenthesis.
0 or 2+ arguments you will need to include parenthesis.
NOTE: javascript’s `this` (d3.select(this)) need to use a normal anonymous function.

### Let and Const

```
let x = 10;
const y = 20;
```

let works the same as var but it’s block scoped.
If you use it inside an if statement, it won’t be accessible outside the block. 

const is like let but once it has been assigned a value it can’t be reassigned.

### Import modules

`import * as scale from "d3-scale"`

Because D3 modules don’t export a default object, you’ll need to use this star syntax to import everything in the module (HT Mike).
Importing D3 as modules is especially useful if you are using D3.js in the context of a larger application.

### backtic strings

`.attr("transform", `translate(${x}, ${y})`);`

call javascript variables and expressions into strings with template strings. These strings can also be multi line!

### Default Parameters

`function(data = "n/a") { }`

You can set a parameters default value by adding an equal sign and then the default value
If the function is called without the parameter, or the parameter set to undefined the default value will be assigned.


## 'this' in javascript
D3 implements a useful pattern where functions that operate on selections are given the selected DOM element via this. It allows us to use the selection’s bound data and the DOM element within the same context.
```
selection.on('mouseenter', function(d) {
  d3.select(this).text(d.name);
});
```
This is possible because Javascript allows D3 to bind any object to this when calling our function, primarily via bind(), call(), or apply().

From the release notes:

;The standard args are the element’s datum (d), the element’s index (i), and the element’s group (nodes), with `this` as the element.
So now we can use the group along with the provided index to access the current DOM element.

```
selection.on('mouseenter', (d, i, nodes) => {
  d3.select(nodes[i]).text(d.name);
});
```
Perhaps not quite as elegant, but it lets us keep the best of both worlds and avoid inconsistent function definition syntax. Note that this still points to the DOM element if we choose to use the “classic” function definition as before.

===

forEach can be used to iterate over the data array.

d3.csv("/data/cities.csv").then(function(data) {
  data.forEach(function(d) {
    d.population = +d.population;
    d["land area"] = +d["land area"];
  });
  console.log(data[0]);
});

=> {city: "seattle", state: "WA", population: 652405, land area: 83.9}

Alternate method by d3.csv directly. Done by providing an accessor function to d3.csv, whose return value will be the individual data objects in our data array.

d3.csv("/data/cities.csv", function(d) {
  return {
    city : d.city,
    state : d.state,
    population : +d.population,
    land_area : +d["land area"]
  };
}).then(function(data) {
  console.log(data[0]);
});

=> {city: "seattle", state: "WA", population: 652405, land_area: 83.9}

Reading JSON Files

employees.json

[
 {"name":"Andy Hunt",
  "title":"Big Boss",
  "age": 68,
  "bonus": true
 },
 {"name":"Charles Mack",
  "title":"Jr Dev",
  "age":24,
  "bonus": false
 }
]

d3.json("/data/employees.json").then(function(data) {
  console.log(data[0]);
});

=> {name: "Andy Hunt", title: "Big Boss", age: 68, bonus: true}

Loading Multiple Files/Datasets with PROMISES


Promise.all([
  d3.csv("/data/cities.csv"),
  d3.tsv("/data/animals.tsv")
]).then(function(data) {  														// I believe you can also assign respective name. citiesData, animalsData
  console.log(data[0][0])  // first row of cities
  console.log(data[1][0])  // first row of animals
});

=> {city: "seattle", state: "WA", population: "652405", land area: "83.9"}

{name: "tiger", type: "mammal", avg_weight: "260"}

The method returns an array of our data sources. The first item returns our cities; the second, our animals.

===

//  CSV Data Row Conversion
//Function for converting CSV values from strings to Dates and numbers
var rowConverter = function(d) { 
	return {
  	Date: parseTime(d.Date),
    Amount: parseInt(d.Amount)
  };
}

===

ITERATE through multi level array

```
var aa = [[20, 37],[40, 61],[203, 77], [143, 107]];

var svg = d3.select("svg");

var breweryCircles = [];
for (i = 0; i < aa.length; i++) {
//use < here--^
    breweryCircles.push(aa[i]);

    svg.selectAll("circle")
        .data(breweryCircles)
        .enter()
        .append('circle')
        .attr("cx", function(d) {
            return d[0];
        })
        .attr("cy", function(d) {
            return d[1];
        })
        .attr("r", 5)
        .attr("fill", "red")
};

```
