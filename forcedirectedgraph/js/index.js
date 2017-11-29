var height = 550, width = 1100;

var dataurl = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

var padding = {top: 0, right: 0, bottom: 0, left: 0};
var chartHeight = height - padding.top - padding.bottom;
var chartWidth = width - padding.left - padding.right;

d3.json(dataurl, function(error, data) {
  if (error) throw eror;
 
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");
  
  var flags = d3.select("#container").selectAll(".flag")
    .data(data.nodes)
    .enter()
    .append("div")
    .attr("class", function(d) {return "flag flag-"+d.code;})
    .on("mouseover", function(d){
        return tooltip.style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 30) + "px")
          .style("opacity", 1)
          .html("<strong>" + d.country + "</strong>");    
     })
   .on("mouseout", function(){
      return tooltip.style("opacity", 0);
    });


  var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");
  
var force = d3.layout.force()
    .nodes(data.nodes)
    .links(data.links)
    .size([width, height])
    .linkDistance(40)
    .gravity(0.1)
    .charge(-40)
    .on("tick", onTick)
    .start();
  
  var links = chart.selectAll(".links")      
      .data(data.links)
      .enter()
      .append("g")
      .append("line")
      .attr("class", "links");   
  
var nodes = chart.selectAll(".nodes")
     .data(data.nodes)
     .enter()
     .append("g")
     .attr("class", "nodes")
     .call(force.drag);

 function onTick() {  
  links.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  flags.style("left", function(d) {return (d.x - 4) + "px";}) 
   .style("top", function(d){return (d.y + 14) + "px";});
 }    
    
});