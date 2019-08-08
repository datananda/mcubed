// VARIABLES
const step = 30;
const minR = 1;
const maxR = 8;
// const selfR = 8;
const minWidth = 1;
const maxWidth = 10;
const margin = {top: 20, right: 10, bottom: 20};
const breakpoints = [480];

let data;
let selfR;

function arc(y1, y2) {
    if (y1 === y2) {
        return `M 0 ${y1} A ${selfR} ${selfR} 0 0 0 ${-2 * selfR} ${y1} A ${selfR} ${selfR} 0 0 0 0 ${y1}`
    } else {
        const arcR = Math.abs(y2 - y1) / 2;
        return `M 0 ${y1} A ${arcR} ${arcR} 0 0 ${y2 > y1 ? 1 : 0} 0 ${y2}`;
    }
}

function draw() {
    const t = d3.transition()
        .duration(750);

    selfR = document.body.clientWidth / 40;
    if (window.innerWidth >= breakpoints[0]) {
        margin.left = 200;
    }
    else {
        margin.left = 2 * selfR + maxWidth / 2;
    }

    const svgWidth = document.body.clientWidth;
    const width = svgWidth - margin.left - margin.right;
    const height = 2 * (document.body.clientWidth - margin.left);

    yScale.range([0, height]);

    svg.attr("width", svgWidth)
        .attr("height", height + margin.top + margin.bottom);
    
    chartG.attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    const links = linksG.selectAll("path")
        .data(data.links, d => `${d.source}-${d.target}`)
        .join(
            enter => enter.append("path")
                .classed("link", true)
                .attr("stroke-width", d => strokeScale(d.value))
                .attr("d", d => arc(yScale(d.source), yScale(d.target))),
            update => update
                .attr("d", d => arc(yScale(d.source), yScale(d.target)))
        );

    const nodes = nodesG.selectAll("g")
        .data(data.nodes, d => d.id)
        .join(
            enter => {
                const g = enter.append("g")
                    .attr("transform", d => `translate(0, ${yScale(d.id)})`);

                g.append("circle")
                    .classed("node-circle", true)
                    .attr("r", d => radiusScale(d.totalProjects));

                g.append("text")
                    .classed("node-text", true)
                    .attr("x", d => (window.innerWidth >= breakpoints[0] ? -1 : 1) * (radiusScale(d.totalProjects) + 2))
                    .text(d => d.name);
                
                return g;
            },
            update => {
                update.attr("transform", d => `translate(0, ${yScale(d.id)})`);

                update.select("text")
                    .attr("x", d => (window.innerWidth >= breakpoints[0] ? -1 : 1) * (radiusScale(d.totalProjects) + 2));
            
                return update;
            }
        );
    
    
    nodes.on("mouseover", d => {
            nodes.classed("selected-node", n => n === d);
            links.classed("selected-link", l => l.source === d.id || l.target === d.id)
                .filter(".selected-link")
                .raise();
        })
        .on("mouseout", d => {
            nodes.classed("selected-node", false);
            links.classed("selected-link", false);
        });
        // .on("click", d => {
        //     console.log("clicked")
        //     nodes.classed("selected-node", n => n === d);
        //     links.classed("selected-link", l => l.source === d.id || l.target === d.id)
        //         .filter(".selected-link")
        //         .raise();
        // });
}

// CHART SETUP
const yScale = d3.scalePoint();

const radiusScale = d3.scaleSqrt()
    .range([minR, maxR]);

const strokeScale = d3.scaleLinear()
    .range([minWidth, maxWidth]);

const svg = d3.select("#arc-diagram")
    .append("svg");

const chartG = svg.append("g");

const linksG = chartG.append("g");

const nodesG = chartG.append("g")
    .classed("nodes", true);


d3.json("./assets/data/mcubed.json").then((mcubedData) => {
    data = mcubedData;

    yScale.domain(data.nodes.map(d => d.id))

    radiusScale.domain(d3.extent(data.nodes, d => d.totalProjects));

    strokeScale.domain(d3.extent(data.links, d => d.value));

    draw();
});

window.addEventListener("resize", draw);