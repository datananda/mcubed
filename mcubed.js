/* GLOBALS */
var count = 0;
var width  = 1000;          // width of svg image
var chart_width = 850;
var height = 700;           // height of svg image
var margin = 10;            // amount of margin around plot area
var pad = 10;               // actual padding amount
var radius = 5;             // fixed node radius
var xfixed = 220;   // y position for all nodes
var self_width = 30;        // radius of self-link circle
var dept_hash = {};         // hash table to contain dept to index

/* 2nd SVG GLOBALS*/
var width2 = 450;
var height2 = 650;
var margin2 = 20;

/* MAIN DRAW METHOD */

// Draws an arc diagram for the provided undirected graph
function arcDiagram(departments, links) {
    // create svg image
    var svg  = d3.select("#main_chart")
        .append("svg")
        .attr("id", "arc")
        .attr("viewBox", `0 0 ${height} ${width}`);
        // .attr("width", width)
        // .attr("height", height);

    // create plot area within svg image
    var plot = svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + 95 + ", " + 30 + ") rotate(0)");

    // create key area within svg image
    var arcKey = svg.append("g")
        .attr("id","arcKey")
        .attr("transform", "translate(430, 830)");

    arcKey.append("rect")
        .attr("class","chartKey")
        .attr("x",-10)
        .attr("y",-20)
        .attr("width",275)
        .attr("height",185);

    // create svg2 for details on demand based on # of links
    var svg2  = d3.select("#details_chart")
        .append("svg")
        .attr("id", "details")
        .attr("width", width2)
        .attr("height", height2);

    // create plot area within 2nd svg
    var plot2 = svg2.append("g")
        .attr("id","plot2")
        .attr("transform", "translate(" + pad + ", " + pad + ")");

    // find starting department
    var Medicine;
    departments.forEach(function(d, i) {
        if (d.DeptKey == "Medicine") {
            Medicine = d;
        }
    });

    detailsOnClick(Medicine,links);

    // fix graph links to map to objects instead of indices
    links.forEach(function(d, i) {
        d.dept1 = isNaN(d.dept1) ? d.dept1 : departments[d.dept1];
        // condition ? value-if-true : value-if-false
        d.dept2 = isNaN(d.dept2) ? d.dept2 : departments[d.dept2];
    });

    // must be done AFTER links are fixed
    linearLayout(departments, links);

    // draw links first, so nodes appear on top
    drawLinks(links);

    // draw nodes last
    drawNodes(departments,links);
}

// Layout nodes linearly, sorted by group
function linearLayout(nodes, links) {

    // used to scale node index to y position
    var yscale = d3.scale.linear()
        .domain([0, nodes.length])
        .range([radius, chart_width - pad - radius]);

    // calculate pixel location for each node
    nodes.forEach(function(d, i) {
        d.x = xfixed;
        d.y = yscale(i);
        dept_hash[d.DeptKey] = d.y
    });
}

// Draws nodes on plot
function drawNodes(nodes, links) {
    // min & max of links
    var extent = d3.extent(nodes, function(d) { return d.NumFaculty; });

    d3.select("#plot").selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", function(d) { return "node " + d.DeptKey; })
        .attr("id", function(d, i) { return d.DeptKey; })
        .attr("cx", function(d, i) { return d.x; })
        .attr("cy", function(d, i) { return d.y; })
        .attr("r",  function(d, i) { return radius; })
        .on("click", function(d) {
            d3.selectAll(".node").style("fill",function(n) {
                if (n.DeptKey === d.DeptKey) {
                    return "#ffffff";
                }
                else {
                    return "#333333";
                }
            })
            .style("stroke",function(n) {
                if (n.DeptKey === d.DeptKey) {
                    return "#333333";
                }
                else {
                    return "none";
                }
            });
            d3.selectAll(".link").style("stroke",function(l) {
                if (l.dept1 === d.DeptKey || l.dept2 === d.DeptKey) {
                    return "#0000ff";
                }
                else {
                    return "#888888";
                }
            });
            d3.selectAll(".label").style("fill",function(l) {
                if (l.DeptKey === d.DeptKey) {
                    return "#0000cc";
                }
                else {
                    return "#000000";
                }
            });
            detailsOnClick(d,links);
        });

    d3.select("#plot").selectAll(".label")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", function(d) { return "label " + d.DeptKey; })
        .attr("id", function(d, i) { return d.DeptKey; })
        // .attr("transform", function(d, i) {
        //     return "rotate(" + 45 + ", " + d.x + ", " + d.y + ")";
        // })
        .attr("x", function(d, i) { return d.x - 10; })
        .attr("y", function(d, i) { return d.y + radius / 1.5 + 1; })
        .attr("text-anchor","end")
        .text(function(d, i) { return d.DeptFullName; })
        .on("click", function(d) {
            d3.selectAll(".node").style("fill",function(n) {
                if (n.DeptKey === d.DeptKey) {
                    return "#ffffff";
                }
                else {
                    return "#333333";
                }
            })
            .style("stroke",function(n) {
                if (n.DeptKey === d.DeptKey) {
                    return "#333333";
                }
                else {
                    return "none";
                }
            });
            d3.selectAll(".link").style("stroke",function(l) {
                if (l.dept1 === d.DeptKey || l.dept2 === d.DeptKey) {
                    return "#0000ff";
                }
                else {
                    return "#888888";
                }
            });
            d3.selectAll(".label").style("fill",function(l) {
                if (l.DeptKey === d.DeptKey) {
                    return "#0000cc";
                }
                else {
                    return "#000000";
                }
            });
            detailsOnClick(d,links);
        });;

    d3.selectAll(".node").style("fill",function(n) {
        if (n.DeptKey === "Medicine") {
            return "#ffffff";
        }
        else {
            return "#333333";
        }
    })
    .style("stroke",function(n) {
        if (n.DeptKey === "Medicine") {
            return "#333333";
        }
        else {
            return "none";
        }
    });

    d3.selectAll(".link").style("stroke",function(l) {
        if (l.dept1 === "Medicine" || l.dept2 === "Medicine") {
            return "#0000ff";
        }
        else {
            return "#888888";
        }
    });
    d3.selectAll(".label").style("fill",function(l) {
        if (l.DeptKey === "Medicine") {
            return "#0000cc";
        }
        else {
            return "#000000";
        }
    });
}

// Draws nice arcs for each link on plot
function drawLinks(links) {
    // min & max of links
    var extent = d3.extent(links, function(d) { return d.links; });

    // stroke-width scale
    var strokescale = d3.scale.pow()
        .domain([extent[0], extent[1]])
        .range([1, 10]);

    // scale to generate radians (just for lower-half of circle)
    var radians = d3.scale.linear()
        .range([0, Math.PI]);
    var radians_full = d3.scale.linear()
        .range([Math.PI / 2, 5 * Math.PI / 2]);

    // path generator for arcs (uses polar coordinates)
    var arc = d3.svg.line.radial()
        .interpolate("basis")
        .tension(0)
        .angle(function(d) { return radians(d); });

    var arc_full = d3.svg.line.radial()
        .interpolate("basis")
        .tension(0)
        .angle(function(d) { return radians_full(d); });

    // add links
    d3.select("#plot").selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", function(d, i) {
            return "link";
        })
        .attr("source", function(d) {
            return d.dept1;
        })
        .attr("target", function(d) {
            return d.dept2;
        })
        .attr("transform", function(d, i) {
            if (d.dept1 == d.dept2) {
                var xshift = xfixed - self_width / 2 + radius;
                var yshift = dept_hash[d.dept1] - self_width / 2 + radius / 2;
                return "translate(" + xshift + "," + yshift + ") rotate(" + 45 + ", " + 0 + "," + 0 + ")";
            }
            else {
                // arc will always be drawn around (0, 0)
                // shift so (0, 0) will be between source and target
                var xshift = xfixed;
                var yshift = dept_hash[d.dept1] + (dept_hash[d.dept2] - dept_hash[d.dept1]) / 2;
                return "translate(" + xshift + ", " + yshift + ")";                
            }
        })
        .attr("d", function(d) {
            if (d.dept1 == d.dept2) {
                // get x distance between source and target
                var xdist = self_width;

                // set arc radius based on x distance
                arc_full.radius(self_width / 2);

                // want to generate 1/3 as many points per pixel in x direction
                var points = d3.range(0, 10);

                // set radian scale domain
                radians_full.domain([0, points.length - 1]);

                // return path for arc
                return arc_full(points);  
            }
            else {
                // get x distance between source and target
                var xdist = Math.abs(dept_hash[d.dept1] - dept_hash[d.dept2]);

                // set arc radius based on x distance
                arc.radius(xdist / 2);

                // want to generate 1/3 as many points per pixel in x direction
                var points = d3.range(0, Math.ceil(xdist / 3));

                // set radian scale domain
                radians.domain([0, points.length - 1]);

                // return path for arc
                return arc(points);                
            }
        })
        .attr("stroke-width", function(d) {
            return strokescale(d.links);
        });

    // add key based on link widths
    var arcKey = d3.select("#arcKey")

    arcKey.append("text")
        .attr("class","keyTitle")
        .text("Chart Key");

    var desc_y = 25;

    arcKey.append("text")
        .attr("y", desc_y)
        .attr("class","keyDescr")
        .text("Line width shows # of faculty collaborations:");

    arcKey.append("line")
        .attr("class","keylink")
        .attr("x1",0)
        .attr("y1",desc_y+17)
        .attr("x2",100)
        .attr("y2",desc_y+17)
        .attr("stroke-width", function() {
            return strokescale(80);
        })

    arcKey.append("text")
        .attr("x", 110)
        .attr("y", desc_y+20)
        .attr("class","keyLabel")
        .text("80");

    arcKey.append("line")
        .attr("class","keylink")
        .attr("x1",0)
        .attr("y1",desc_y+2*17)
        .attr("x2",100)
        .attr("y2",desc_y+2*17)
        .attr("stroke-width", function() {
            return strokescale(20);
        })

    arcKey.append("text")
        .attr("x", 110)
        .attr("y", desc_y+2*19)
        .attr("class","keyLabel")
        .text("20");

    arcKey.append("line")
        .attr("class","keylink")
        .attr("x1",0)
        .attr("y1",desc_y+3*17)
        .attr("x2",100)
        .attr("y2",desc_y+3*17)
        .attr("stroke-width", function() {
            return strokescale(5);
        })

    arcKey.append("text")
        .attr("x", 110)
        .attr("y", desc_y+3*18)
        .attr("class","keyLabel")
        .text("5");

    var desc_y2 = 150;

    arcKey.append("text")
        .attr("y", 100)
        .attr("class","keyDescr")
        .text("Shape shows type of collaboration:");

    arcKey.append("text")
        .attr("y", desc_y2)
        .attr("class","keyLabel")
        .text("cross-department");

    arcKey.append("text")
        .attr("x",140)
        .attr("y", desc_y2)
        .attr("class","keyLabel")
        .text("within-department");

    arcKey.append("path")
        .attr("d", function(d) {
            var xdist = 50;
            arc.radius(xdist / 2);
            var points = d3.range(0, Math.ceil(xdist / 3));
            radians.domain([0, points.length - 1]);
            return arc(points);                
        })
        .attr("stroke","#888888")
        .attr("fill","none")
        .attr("stroke-width", function(d) {
            return strokescale(10);
        })
        .attr("transform", "rotate(-90) translate(" + - 135 + ", " + 49 + ")");

    arcKey.append("circle")
        .attr("cx",188)
        .attr("cy",123)
        .attr("r",13)
        .attr("stroke","#888888")
        .attr("fill","none")
        .attr("stroke-width", function(d) {
            return strokescale(10);
        });
}

function detailsOnClick(d,links) {

    // get top 10 collaborating departments
    var dept_links = [];
    links.forEach( function (obj) {
        if (obj.dept1 == d.DeptKey) {
            dept_links.push({"col_dept": obj.dept2, "links": obj.links});
        }
        else if (obj.dept2 == d.DeptKey) {
            dept_links.push({"col_dept":obj.dept1, "links": obj.links});
        }
    });
    
    dept_links.sort(function (a, b) {
      if (a.links < b.links) {
        return 1;
      }
      if (a.links > b.links) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    dept_links = dept_links.slice(0,10);
    new_height = 1.02 * height2 - 20 * (10 - dept_links.length)

    d3.select("#details")
        .attr("height", new_height)

    var detailplot = d3.select("#details");
    // first remove everything from details svg
    detailplot.selectAll("*").remove();

    // create frame
    detailplot.append("rect")
        .attr("class","detailFrame")
        .attr("x",0)
        .attr("y",0)
        .attr("width", width2)
        .attr("height", 40)
        .attr("fill","#cccccc");

    detailplot.append("text")
        .attr("class","detailTitle")
        .attr("x",20)
        .attr("y",25)
        .text(d.DeptFullName);

    // draw doughnut chart
    var dPlot = detailplot.append("g")
        .attr("transform", "translate(" + 50 + ", " + 0 + ")");

    dPlot.append("text")
        .attr("x", 30)
        .attr("y", 70)
        .attr("class","keyDescr")
        .text("Department Engagement in the MCubed Program");

    doughnut(dPlot,d);

    // draw bar chart
    var barX = 100;
    var txtX = barX - 20;
    var barY = 370;
    var barSpace = 20;

    detailplot.append("text")
        .attr("x", barX - 45)
        .attr("y", barY)
        .attr("class","keyDescr")
        .text("Top Collaborating Departments (# of Faculty Connections)");

  var barKeyData = [
    {"color":"#1abfb7","txt":"Within-department collaborations"},
    {"color":"#666666","txt":"Cross-department collaborations"}
  ];

  var barkey = detailplot.selectAll(".barkey")
    .data(barKeyData)
    .enter().append("g")
    .attr("class","barkey")
    .attr("transform", "translate(" + 120 + ", " + 390 + ")");

  barkey.append("rect")
    .attr("x",0)
    .attr("y", function(d, i) { return i*20; })
    .attr("height",10)
    .attr("width",10)
    .style("fill", function(d) { return d.color; });

  barkey.append("text")
    .attr("class","arcLabel")
    .attr("x",15)
    .attr("y", function(d, i) { return i*20 + 9; })
    .text(function(d) { return d.txt; });

    if (dept_links[0].links >= 50) {
        var barScale = d3.scale.linear()
            .domain([0, 100])
            .range([0, 300]);
    }
    else if (dept_links[0].links >= 20) {
        var barScale = d3.scale.linear()
            .domain([0, 50])
            .range([0, 300]);        
    }
    else if (dept_links[0].links >= 10) {
        var barScale = d3.scale.linear()
            .domain([0, 20])
            .range([0, 300]);        
    }
    else if (dept_links[0].links >= 5) {
        var barScale = d3.scale.linear()
            .domain([0, 10])
            .range([0, 300]);        
    }
    else {
        var barScale = d3.scale.linear()
            .domain([0,5])
            .range([0,300]);
    }
    var xAxis = d3.svg.axis().scale(barScale).tickSize(-3).orient("top").tickFormat(d3.format("d")).ticks(5);   

    detailplot.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + barX + "," + (barY + barSpace + 10 + 50) + ")")
      .call(xAxis);

    detailplot.selectAll(".bar")
        .data(dept_links)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("x",barX)
        .attr("y",function(d, i) { return barY + i*barSpace + barSpace + 18 + 50;})
        .attr("width",function(d) { return barScale(d.links); })
        .attr("height", 10)
        .style("fill", function(b) {
            if (b.col_dept == d.DeptKey) {
                return "#1abfb7";
            }
        });

    detailplot.selectAll(".barLabel")
        .data(dept_links)
        .enter()
        .append("text")
        .attr("class","barLabel")
        .attr("x",txtX)
        .attr("y",function(d, i) { return barY + i*barSpace + 47 + 50;})
        .text(function(d) {
            return d.col_dept;
        })
        .attr("text-anchor","end")
        .style("fill", function(b) {
            if (b.col_dept == d.DeptKey) {
                return "#128e88";
            }
        });

}

queue()
    .defer(d3.csv, "data/mcubed.csv")
    .defer(d3.tsv, "data/mcubed_departments.txt")
    .await(ready);

function ready(error, projects, departments) {
    // loading data / data manipulation
    var all_nest = d3.nest()
        .key(function(d) {return d.Department1}).sortKeys(d3.ascending)
        .rollup(function(leaves) {return leaves.length; })
        .entries(projects);
    var nested_projects = d3.nest()
        .key(function(d) { return d.Department1}).sortKeys(d3.ascending)
        .key(function(d) { return d.Department2}).sortKeys(d3.ascending)
        .rollup(function(leaves) { return leaves.length; })
        .entries(projects);
    var links = [];
    nested_projects.forEach( function (dept1) {
        dept1.values.forEach( function (dept2) {
            links.push({"dept1": dept1.key, "dept2": dept2.key, "links": dept2.values});
        })
    })

    arcDiagram(departments, links);  
}