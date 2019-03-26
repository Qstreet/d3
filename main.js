let margin = { top: 0, right: 10, bottom: 20, left: 10 };
let width = 600 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

let bigG = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let dataset = [
  11,
  18,
  17,
  16,
  18,
  12,
  15,
  20,
  18,
  18,
  17,
  16,
  18,
  17,
  16,
  18,
  23
];

let xScale = d3
  .scaleBand()
  .domain(d3.range(dataset.length))
  .range([0, width]) // removed rangeRound to center labels
  .paddingInner(0.05);

let yScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset)])
  .range([0, height]);

var rects = bigG.selectAll("rect").data(dataset);

rects
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return xScale(i);
  })
  .attr("y", function(d) {
    return height - d * 4;
  })
  .attr("width", xScale.bandwidth())
  .attr("height", function(d) {
    return d * 4;
  })  .on("mouseover", function(d) {
    //Get this bar's x/y values, then augment for the tooltip
  var xPosition =
    parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
var yPosition = 
    parseFloat(d3.select(this).attr("y")) / 2 + height / 2;
  
//Update the tooltip position and value
  
  d3.select("#tooltip")
    .style("left", xPosition + "px")
    .style("top", yPosition + "px")
    .select("#value")
    .text(d);
    //Show the tooltip
  d3.select("#tooltip").classed("hidden", false);
})
 
  .on("mouseout", function() {    
  //Hide the tooltip
  d3.select("#tooltip").classed("hidden", true);
});

// Labels

bigG
  .selectAll("text")
  .data(dataset)
  .enter()
  .append("text")
  .text(function(d) {
    return d;
  })
  .attr("x", function(d, i) {
    return i * (width / dataset.length) + width / dataset.length / 2;
  })
  .attr("y", function(d) {
    return height - d * 4 + 16;
  })
  .attr("fill", "white")
  .style('text-shadow',"1px 1px 1px black")
  .attr("text-anchor", "middle");

// EVENT LISTNER check scope

d3.select(".update_button").on("click", function() {
  let numValues = dataset.length;
  dataset = [];
  let maxValue = 100;
  for (var i = 0; i < numValues; i++) {
    var newNumber = Math.floor(Math.random() * maxValue);
    dataset.push(newNumber);
  }
  
    let xScale = d3
  .scaleBand()
  .domain(d3.range(dataset.length))
  .range([0, width]) // removed rangeRound to center labels
  .paddingInner(0.05);

let yScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset)])
  .range([0, height]);
    

  bigG
    .selectAll("rect")
    .data(dataset)
    .transition()
    .duration(1000)
    .attr("y", function(d) {
      return height - yScale(d);
    })
    .attr("height", function(d) {
      return yScale(d);
    })
    .attr("fill", function(d) {
      return "rgb("+ Math.round(d*5) + ", 0, " + Math.round(d * 8) + ")";
    });

  bigG
    .selectAll("text")
    .data(dataset)
    .transition()
    .delay(function(d, i) {
      return i * 75;
    })
    .duration(1000)
    // .ease(d3.easeLinear)
    .text(function(d) {
      return d;
    })
    .attr("x", function(d, i) {
      return xScale(i) + xScale.bandwidth() / 2;
    })
    .attr("y", function(d) {
    if (d < 8) {
      return height - yScale(d) + -8
    } else {
      return height - yScale(d) + 16;
    }
    });
  
  
});
