var height = 500, width = 1000;

var dataurl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

var legendMap = [{"color":"steelblue", "text":"No doping allegations"}, {"color":"red", "text":"With doping allegations"}]; 

function secondsToTimeStr(sec) {
  var minute = Math.floor(sec / 60);
  var second = sec - 60*minute;
  return minute + ":" + (second<10 ? "0" : "") + second;
}
// MM:SS

$(document).ready(function() {
  var data = $.getJSON(dataurl, function(data) {
    plotData(data);
})
  .fail(function() {
    console.log('Failed to load data');
  });
});

function plotData(data) {
  var padding = {top: 30, right: 20, bottom: 30, left: 50};
  var chartHeight = height - padding.top - padding.bottom;
  var chartWidth = width - padding.left - padding.right;
  
  var barWidth = chartWidth/data.length;
  
  for (var i=0; i<data.length; i++) {
    data[i].deltaSeconds = data[i].Seconds - data[0].Seconds;
  }
  
  var xscaler = d3.scale.linear()
    .domain([data[0].deltaSeconds, data[data.length-1].deltaSeconds])
    .range([chartWidth, 0]); // flip the x
  var yscaler = d3.scale.linear()
    .domain([0, data[data.length-1].Place - data[0].Place])
    .range([0, chartHeight]); 
  
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");
  
  var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");
    
  var dot = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { 
        return "translate(" + xscaler(d.deltaSeconds) + ", " + yscaler(d.Place) + ")"; 
    });  
  dot.append("circle")
    .attr("cx", 0)
    .attr("cy", -barWidth/2)
    .attr("r", 0.75*0.5*barWidth)
    .style("fill", function(d) {return legendMap[d.Doping=="" ? 0: 1].color;})
    .on("mouseover", function(d){
      return tooltip.style("left", (event.pageX + 30) + "px")
      .style("top", (event.pageY - 30) + "px")
      .style("opacity", 1)
      .html("<strong>" + d.Name + "(" + d.Nationality + ")</strong><br>" + 
            d.Year + " " + d.Time + "<br>" + 
            d.Doping);    
      })
    .on("mouseout", function(){
      return tooltip.style("opacity", 0);
    });
  
  var xAxis = d3.svg.axis()
    .scale(xscaler)
    .orient("bottom")
    .tickFormat(secondsToTimeStr);
  
  var yAxis = d3.svg.axis()
    .scale(yscaler)
    .orient("left");
  
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + 0 + "," + chartHeight + ")")
      .call(xAxis)
      .append("text")
      .style("text-anchor", "end")
      .attr("x", chartWidth)
      .attr("dy", "-0.5em")
      .text("Minutes Behind The Fastest Time");
  
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")  
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Ranking");
  
  chart.append("text")
        .attr("id", "chart-title")
        .attr("x", (chartWidth / 3))             
        .attr("text-anchor", "middle")  
        .text("Doping in Professional Bicycle Racing");
  chart.append("text")
        .attr("id", "chart-subtitle")             
        .attr("x", (chartWidth / 3))                     
        .attr("y", "2.5rem")            
        .attr("text-anchor", "middle")  
        .text("35 Fastest times up Alpe d'Huez");  
   
  var legend = chart.selectAll(".legend")
    .data(legendMap)
    .enter().append("g")
    .attr("class", "legend")
    .style("z-index", 2)
    .attr("transform", function(d, i) { 
        return "translate(" + 0.8*chartWidth + ", " + (0.8*chartHeight + i*barWidth) + ")"; 
    });  
  
  legend.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 0.75*0.5*barWidth)
    .style("fill", function(d){console.log(d); return d.color;});   
  legend.append("text")
    .attr("x", barWidth)
    .attr("y", barWidth/5)
    .text(function(d){console.log(d); return d.text});
  
}