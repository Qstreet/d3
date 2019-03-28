var margin = { top: 10, right: 10, bottom: 10, left: 10 };

var width = 960 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

var bigG = d3
  .select("#graphic")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
// .attr("viewBox", `0 0 ${width} ${height}`)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// .attr("viewBox", "0 0 700 500")
// .attr("preserveAspectRatio", "xMinYMin meet")
// .append("g")
const gg = svg.append('g');
const geoJsonUrl = "drc_contour_geoJson.json";

// const projection = d3.geoOrthographic();
// const projection = d3.geoEqualEarth();
 const projection = d3.geoMercator()
/* 
// these seem to disable the globe projections
// .center([0, 20])
//     .rotate([0, 0])
//     .scale(100)
//     .translate([width / 2, height / 2]);
//
End of globe breakers */

// const projection = d3.geoStereographic();
// const graticule = d3.geoGraticule();
// const projection = d3.geoEquirectangular();

const pathGenerator = d3.geoPath().projection(projection);

svg.call(d3.zoom().on('zoom', () => {
  gg.attr('transform', d3.event.transform)
}))


d3.json(geoJsonUrl).then(data => {
  // const countries = topojson.feature(data, data.objects.countries);
  const paths = gg.selectAll("path").data(countries.features);
  paths
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", pathGenerator)
    .append("title")
    .text("howdy");
});
