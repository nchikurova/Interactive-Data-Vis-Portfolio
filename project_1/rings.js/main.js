/**
 * CONSTANTS AND GLOBALS
 * */
// const width = window.innerWidth * 0.9,
//     height = window.innerHeight * 0.9,
//     margin = { top: 20, bottom: 50, left: 60, right: 40 };
var marginrings = { top: 20, bottom: 20, left: 40, right: 40 };
widthrings = 600 - marginrings.left - marginrings.right;
heightrings = 600 - marginrings.top - marginrings.bottom;
default_selection_rings = "All";
const formatTime_rings = d3.timeFormat("%b, %d, %Y")

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let radiusScale_rings;
let xScale_rings;
let yScale_rings;
let radiusScale1_rings;
let colorScale_rings;
let colorScale1_rings;
let div;

/**
 * APPLICATION STATE
 * */
let state = {
    country2: [],
    selectedCountry2: [],
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */

d3.csv("../../data/ebola_3_1.csv", d3.autoType).
    then(raw_data => {
        console.log("raw_data", raw_data)
        state.country2 = raw_data;
        init_rings();
    });


/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init_rings() {
    xScale_rings = d3.scaleLinear()
        .domain(d3.extent(state.country2, d => d.Total_cases))
        .range([marginrings.left, widthrings - marginrings.right]);

    yScale_rings = d3.scaleLinear()
        .domain(d3.extent(state.country2, d => d.Total_cases))
        .range([heightrings - marginrings.bottom, marginrings.top]);
    // create an svg element in our main `d3-container` element

    //   const xAxis = d3.axisBottom(xScale)
    //   const yAxis = d3.axisLeft(yScale); 

    const selectElement = d3.select("#dropdown").on("change", function () {
        console.log("new country is", this.value);

        state.selectedCountry2 = this.value;
        draw_rings();
    });
    selectElement
        .selectAll("option")
        .data(["All", "Guinea", "Liberia", "Sierra Leone"])
        .join("option")
        .attr("value", d => d)
        .text(d => d);

    svg = d3
        .select("#d3-container4")
        .append("svg")
        .attr("width", widthrings)
        .attr("height", heightrings);

    // svg

    div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .attr("position", "absolute")
    draw_rings();

}
//selectElement.property("value", default_selection)
/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw_rings() {
    // return an array of [key, value] pairs
    let filteredData2 = state.country2;
    // if there is a selectedType, filter the data before mapping it to our elements
    if (state.selectedCountry2 !== "All") {
        filteredData2 = state.country2.filter(d => d.Country === state.selectedCountry2);
        console.log(filteredData2)
    }


    radiusScale_rings = d3.scaleSqrt()
        .domain(d3.extent(state.country2, d => d.Total_cases))
        .range([10, 100])
    colorScale_rings = d3.scaleLinear().domain(d3.extent(state.country2, d => d.Total_cases))
        .range(["#737373", "#262626"])
    radiusScale1_rings = d3.scaleSqrt()
        .domain(d3.extent(state.country2, d => d.Total_cases))
        .range([10, 100])
    colorScale1_rings = d3.scaleLinear().domain(d3.extent(state.country2, d => d.Total_deaths))
        .range(["#cc0000", "#330000"])


    let dot = svg
        .selectAll(".circle")
        .data(filteredData2, d => d.Country)
        .join(
            enter =>
                enter
                    .append("circle")
                    .attr("class", "dot")
                    .attr("opacity", 0.3)
                    .attr("r", 0)
                    .attr("cx", 200)
                    .attr("cy", d => {
                        if (d.Country === "Liberia") return "200";
                        else if (d.Country === "Guinea") return "60";
                        else return "400";
                    })
                    .on('mouseover', function (d) {
                        div
                            .transition()
                            .duration(200)
                            .style('opacity', 0.8);
                        div
                            .html(formatTime_rings(new Date(d.Date)) + " Total cases: " + d.Total_cases)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on('mouseout', function (d) {
                        div
                            .transition()
                            .duration(100)
                            .style('opacity', 0);
                    }),
            update =>
                update.call(update =>
                    update
                        .transition()
                        .duration(1000)
                ),

            exit => exit
                .call(exit => exit
                    .transition()
                    .delay(1000)
                    .remove())
        )

    dot.call(circles_selection =>
        circles_selection
            .transition()
            .duration(3000)
            .attr("opacity", 0.2)
            .attr("fill", "none")
            .attr("stroke", d => colorScale_rings(d.Total_cases))
            .attr("r", d => radiusScale_rings(d.Total_cases))
    );

    let dot1 = svg
        .selectAll(".circle")
        .data(filteredData2, d => d.Country)
        .join(
            enter =>
                enter
                    .append("circle")
                    .attr("class", "dot")
                    .attr("opacity", 0.3)
                    .attr("r", 0)
                    .attr("cx", 200)
                    .attr("cy", d => {
                        if (d.Country === "Liberia") return "200";
                        else if (d.Country === "Guinea") return "60";
                        else return "400";
                    })
                    .on('mouseover', function (d) {
                        div
                            .transition()
                            .duration(200)
                            .style('opacity', 0.8);
                        div
                            .html(formatTime_rings(new Date(d.Date)) + " Total deaths: " + d.Total_deaths)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on('mouseout', function (d) {
                        div
                            .transition()
                            .duration(100)
                            .style('opacity', 0);
                    }),
            update =>
                update.call(update =>
                    update
                        .transition()
                        .duration(1000)
                ),
            exit => exit
                .call(exit => exit
                    .transition()
                    .delay(1000)
                    .remove())
        )

    dot1.call(circles_selection =>
        circles_selection
            .transition()
            .duration(3000)
            .attr("opacity", 0.2)
            .attr("fill", "none")
            .attr("stroke", d => colorScale1_rings(d.Total_deaths))
            .attr("r", d => radiusScale1_rings(d.Total_deaths))
    );

}
