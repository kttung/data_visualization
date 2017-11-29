var dataurl = "https://gist.githubusercontent.com/d3noob/5189284/raw/598d1ebe0c251cd506c8395c60ab1d08520922a7/world-110m2.json";
var murl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";
var width = 1200,
    height = 550;
var mass_cap = 6e6;
    
var projection = d3.geo.mercator();
  
var svg = d3.select(".chart")
  .attr("width", width)
  .attr("height", height);

svg.append("rect")
    .style("fill", "#81D4FA")
    .attr("width", width)
    .attr("height", height);
  
var path = d3.geo.path()
  .projection(projection);

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip");
    
    // load and display the World
d3.json(dataurl, function(error, topology) {
    if (error) throw error;
    svg.append("path")
    .datum(topojson.feature(topology, topology.objects.countries))
      .attr("d", path);
    svg.selectAll(".country")
      .data(topojson.feature(topology, topology.objects.countries).features)
      .enter().append("path")
      .attr("class", function(d) { return "country c" + d.id; })
      .attr("d", path);
  
    d3.json(murl, function(error, strikes) {
      if (error) throw error;
      
      var massScaler = d3.scale.linear()
      .domain([0, d3.max(strikes.features, function(x){
        return Math.min(mass_cap, parseInt(x.properties.mass!=null ? x.properties.mass : 1)); 
      })])
      .range([1, 30]);           
          
      svg.selectAll(".strike")
        .data(strikes.features.filter(x=>x.geometry!=null))
        .enter().append("g")        
        .attr("class", "strike")
        .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")";})
        .append("circle")                
        .attr("r", function(d) {return massScaler(Math.min(mass_cap, parseInt(d.properties.mass!=null ? d.properties.mass : 0))) + "px";})
        .on("mouseover", function(d){
          return tooltip.style("left", (event.pageX + 30) + "px")
            .style("top", (event.pageY - 30) + "px")
            .style("opacity", 1)
            .html("<strong>" + d.properties.name + "</strong><br>"
                  + "Mass: " + d.properties.mass + "<br/>"
                  + "Year: " + d.properties.year.slice(0,4) + "<br/>"
                  + "Class: " + d.properties.recclass);   
        })
        .on("mouseout", function(){
          return tooltip.style("opacity", 0);
        });            
    });  
  });