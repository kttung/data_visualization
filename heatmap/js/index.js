var height = 550, width = 1100;

var dataurl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

function valueToColor(value){
  return "hsl(" + (1.0 - value)*240 + ", 100%, 50%)";
}

$(document).ready(function() {
  var data = $.getJSON(dataurl, function(data) {
    plotData(data);
})
  .fail(function() {
    console.log('Failed to load data');
  });
});

function plotData(tempdata) {
  var baseTemp = tempdata.baseTemperature;
  var data = tempdata.monthlyVariance;
  
  var minTemp = d3.min(data, function(x){return x.variance;})
  var maxTemp = d3.max(data, function(x){return x.variance;})
  var tempScaler = d3.scale.linear().domain([minTemp, maxTemp]).range([0, 1]);
  
  var padding = {top: 30, right: 20, bottom: 90, left: 40};
  var chartHeight = height - padding.top - padding.bottom;
  var chartWidth = width - padding.left - padding.right;
  
  var xCellSize = chartWidth/(data.length/12);
  var yCellSize = chartHeight/12;

  var xscaler = d3.scale.linear()
    .domain([data[0].year, data[data.length-1].year])
    .range([0, chartWidth]); 
  var yscaler = d3.scale.linear()
    .domain([1, 12])
    .range([0, chartHeight]); 
  
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");
  
  var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");
    
  var cell = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { 
        var yoffset = i % 12;
        var xoffset = Math.floor((i - yoffset)/12);        
        return "translate(" + xoffset*xCellSize + ", " + yoffset*yCellSize + ")"; 
    });  
  cell.append("rect")
    .attr("width", xCellSize)
    .attr("height", yCellSize)
    .style("fill", function(d) {return valueToColor(tempScaler(d.variance));})
    .on("mouseover", function(d){
      return tooltip.style("left", (event.pageX + 30) + "px")
      .style("top", (event.pageY - 30) + "px")
      .style("opacity", 1)
      .html("<strong>" + (new Date(d.year+"-"+d.month+"-01")).toLocaleDateString("en-US", {year:'numeric', month:'long'}) + "</strong><br>" + 
            Math.round((baseTemp + d.variance)*1000)/1000 + " °C");    
      })
    .on("mouseout", function(){
      return tooltip.style("opacity", 0);
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
      .call(xAxis)
      .append("text")
      .style("text-anchor", "end")
      .attr("x", chartWidth)
      .attr("dy", "2rem")
      .text("Year");
  
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")  
      .attr("dy", "-2rem")
      .style("text-anchor", "end")
      .text("Month");
  
  chart.append("text")
        .attr("id", "chart-title")
        .attr("x", (chartWidth / 2))             
        .attr("dy", "-0.5rem")             
        .attr("text-anchor", "middle")  
        .text("Monthly Global Land-Surface Temperature");

  // legend
  var numColors = 11;
  var boxWidth = 0.4 * chartWidth / numColors;
  var temps = [];
  for (var i = 0; i<numColors; i++)
    temps.push(minTemp + i*(maxTemp-minTemp)/(numColors-1));
  var legend = chart.selectAll(".legend")
    .data(temps)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i){ 
        return "translate(" + (i*boxWidth + chartWidth - boxWidth*numColors)+ ","+ 1.075*chartHeight+")";
     });
  
  legend.append('rect')
    .attr("width", boxWidth + "px")
    .attr("height", boxWidth + "px")
    .style("fill", function(d) {return valueToColor(tempScaler(d));});
  legend.append('text')
    .attr("x", "0.5rem")
    .attr("y", (1.25*boxWidth) + "px")
    .text(function(d) {return Math.round((baseTemp + d)*10)/10;});
  
}