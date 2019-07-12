function doughnut(plot,d) {

var formatPercent = d3.format(".0%");

if (d.MaxFunded > d.NumFaculty) {
  d.MaxFunded = d.NumFaculty;
}

if (d.TotalProjects > d.MaxFunded) {
  d.MaxFunded = d.TotalProjects;
}

var doughnut1 = [
  {"label":"Number of Faculty","txt":d.NumFaculty,"value": d.NumFaculty,"inner": 50,"outer": 60}
];

var doughnut2 = [
  {"label":"% Faculty Able to Cube","txt":d.MaxFunded,"value": d.MaxFunded,"inner": 60,"outer": 70},
  {"label":"","txt":"","value": d.NumFaculty - d.MaxFunded,"inner": 60,"outer": 70}
];

var doughnut3 = [
  {"label":"% Faculty on a Cube","txt":d.TotalProjects,"value": d.TotalProjects,"inner": 70,"outer": 80},
  {"label":"1","txt":"","value": d.MaxFunded - d.TotalProjects,"inner": 70,"outer": 80},
  {"label":"2","txt":"","value": d.NumFaculty - d.MaxFunded,"inner": 70,"outer": 80}
];

var color = d3.scale.ordinal()
    .range(["#999999", "#0033cc", "#", "#", "#6699ff", "#"]);

var arc = d3.svg.arc();

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.value; });

var g1 = plot.selectAll(".arc1")
    .data(pie(doughnut1))
    .enter().append("g")
    .attr("class", "arc1")
    .attr("transform", "translate(" + 160 + ", " + 175 + ")");

g1.append("path")
    .attr("d", function(d, i) {
      arc.outerRadius(d.data.outer).innerRadius(d.data.inner);
      return arc(d); })
    .style("fill", function(d) { return color(d.data.label); });

g1.append("text")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", -65)
    .attr("class","arcTitle")
    .style("text-anchor", "middle")
    .text(function(d) { return d.data.txt; });  

g1.append("text")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", -50)
    .attr("class","arcTitle")
    .style("text-anchor", "middle")
    .text("faculty");  

g1.append("text")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", -35)
    .attr("class","arcTitle")
    .style("text-anchor", "middle")
    .text(function(d) {
      if (d.data.value == 1) {
        return "member";
      }
      else {
        return "members";
      }
    });  

var g3 = plot.selectAll(".arc3")
    .data(pie(doughnut3))
    .enter().append("g")
    .attr("class", "arc3")
    .attr("transform", "translate(" + 160 + ", " + 175 + ")");

g3.append("path")
    .attr("class", function(d, i) {
      if (d.data.txt == "") {
        return "transparent";
      }
      else {
        return "filled";
      }
    })
    .attr("d", function(d, i) {
      arc.outerRadius(d.data.outer).innerRadius(d.data.inner);
      return arc(d); })
    .style("fill", function(d) { 
      if (color(d.data.label) == "#") {
        return "transparent";
      }
      else {
        return color(d.data.label);       
      }
    })

    text3 = g3.append("text")
      .attr("class","arcLabel")
      .attr("dy",-74)
      .attr("dx",-3)
      .style("text-anchor", "end")
      .style("fill", function(d) { return color(d.data.label); })
      .text(function(d) {
        if (d.endAngle != 6.283185307179586) {
          return d.data.txt;
        }
        else {
          return '';
        }
      });        

var g2 = plot.selectAll(".arc2")
    .data(pie(doughnut2))
    .enter().append("g")
    .attr("class", "arc2")
    .attr("transform", "translate(" + 160 + ", " + 175 + ")");

g2.append("path")
    .attr("class", function(d, i) {
      if (d.data.txt == "") {
        return "transparent";
      }
      else {
        return "filled";
      }
    })
    .attr("d", function(d, i) {
      arc.outerRadius(d.data.outer).innerRadius(d.data.inner);
      return arc(d); })
    .style("fill", function(d) { 
      if (color(d.data.label) == "#") {
        return "transparent";
      }
      else {
        return color(d.data.label);       
      }
    })
    .each(function(d) { this._current = d; })

    text2 = g2.append("text")
      .attr("class","arcLabel")
      .attr("dy",-62)
      .attr("dx",-3)
      .style("text-anchor", "end")
      .style("fill", function(d) { return color(d.data.label); })
      .text(function(d) {
        if (d.endAngle != 6.283185307179586) {
          return d.data.txt;
        }
        else {
          return '';
        }
      });          

  // add key to bottom
  var keyData = [
    {"color":"#999999","txt":"Total number of faculty in department"},
    {"color":"#6699ff","txt":"Maximum number of MCubed projects"},
    {"color":"#0033cc","txt":"Total MCubed projects underway"},
  ];

  var doughnutKey = plot.selectAll(".doughnutKey")
    .data(keyData)
    .enter().append("g")
    .attr("class","doughnutKey")
    .attr("transform", "translate(" + 70 + ", " + 270 + ")");;

  doughnutKey.append("rect")
    .attr("x",0)
    .attr("y", function(d, i) { return i*20; })
    .attr("height",10)
    .attr("width",10)
    .style("fill", function(d) { return d.color; });

  doughnutKey.append("text")
    .attr("class","arcLabel")
    .attr("x",15)
    .attr("y", function(d, i) { return i*20 + 9; })
    .text(function(d) { return d.txt; });
}