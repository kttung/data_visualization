var height = 500, width = 1000;

var dataurl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

$(document).ready(function() {
  var data = $.getJSON(dataurl, function(data) {
    plotGDPData(data.data);
})
  .fail(function() {
    console.log('Failed to load GDP data');
  });
});

function plotGDPData(data) {
  var padding = {top: 30, right: 0, bottom: 30, left: 50};
  var chartHeight = height - padding.top - padding.bottom;
  var chartWidth = width - padding.left - padding.right;
  
  var barWidth = chartWidth/data.length;
  
  var xscaler = d3.time.scale()
    .domain([new Date(data[0][0]), new Date(data[data.length-1][0])])
    .range([0, chartWidth]);
  var yscaler = d3.scale.linear()
    .domain([0, d3.max(data, function(x){return x[1];})])
    .range([chartHeight, 0]); // flip the y range
  
  var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");
    
  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { 
        return "translate(" + i * barWidth + ", " + yscaler(d[1]) + ")"; 
    });  
  bar.append("rect")
    .attr("width", barWidth)
    .attr("height", function(d) {    
        return chartHeight - yscaler(d[1]);
      })
    .on("mouseover", function(d){
      return d3.select("#tooltip").style("left", (event.pageX - 80) + "px")
      .style("top", (event.pageY) + "px")
      .style("visibility", "visible")
      .html("<strong>$" + d[1] + " Billion</strong><br>" + (new Date(d[0])).toLocaleDateString("en-US", {year:'numeric', month:'long'}));    
      })
    .on("mouseout", function(){
      return d3.select("tooltip").style("visibility", "hidden");
    });
  


  var xAxis = d3.svg.axis()
    .scale(xscaler)
    .orient("bottom");
  
  var yAxis = d3.svg.axis()
    .scale(yscaler)
    .orient("left");
  
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + 0 + "," + chartHeight + ")")
      .call(xAxis);
  
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")  
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("GDP (Billion USD)");

  
  chart.append("text")
        .attr("id", "chart-title")
        .attr("x", (chartWidth / 2))             
        .attr("text-anchor", "middle")  
        .text("Gross Domestic Product");  
}