// Setting constants, the size of svg and margins

var marginScatter = { top: 20, bottom: 60, left: 60, right: 40 },
    widthScatter = 600 - marginScatter.left - marginScatter.right,
    heightScatter = 360 - marginScatter.top - marginScatter.bottom,
    radius_scatter = 2;
const default_selection = null;
const axisTicks = { qty: 5 };

var marginrings = { top: 20, bottom: 20, left: 40, right: 40 };
widthrings = 600 - marginrings.left - marginrings.right;
heightrings = 630 - marginrings.top - marginrings.bottom;

// for SCATTER PLOT
var svgScatter;
var xScale;
var yScale;
var y1Scale;

// for RINGS
let radiusScale_rings;
let radiusScale1_rings;
let xScale_rings;
let yScale_rings;
let colorScale_rings;
let colorScale1_rings;

//application state

let state = {
    data: [],
    selection: "All",
};
const formatTime = d3.timeFormat("%b %d, %Y")
//load data
d3.csv("../../data/ebola_3.csv",
    d3.autoType)
    .then(data => data.map(d => ({
        Date: new Date(d.Date),
        Country: d.Country,
        Total_deaths: d.Total_deaths,
        Total_cases: d.Total_cases,
    })))
    .then(raw_data => {
        // console.log("raw_data", raw_data);
        state.data = raw_data;
        init();

    });
// ********* INITIALIZION FUNCTIONS

function init() {

    const selectElement = d3.select("#dropdown").on("change", function () {
        console.log("new country is", this.value);

        state.selection = this.value;
        // console.log("state", state.selection)
        draw();
        //.draw_rings();
    });

    selectElement
        .selectAll("option")
        .data(["All", "Guinea", "Liberia", "Sierra Leone"])
        // or //
        // .data([
        //     ...Array.from(new Set(state.data.map(d => d.Country))),
        //     default_selection,
        // ])
        .join("option")
        .attr("value", d => d)
        .text(d => d);

    init_scatter();
    init_rings();
    draw();
}

function init_scatter() {
    xScale = d3
        .scaleTime()
        .domain(d3.extent(state.data, d => d.Date))
        .range([marginScatter.left, widthScatter - marginScatter.right]);
    yScale = d3 //counting deaths
        .scaleLinear()
        .domain([0, d3.max(state.data, d => d.Total_cases)])
        .range([heightScatter - marginScatter.bottom, marginScatter.top]);
    y1Scale = d3 //counting cases
        .scaleLinear()
        .domain([0, d3.max(state.data, d => d.Total_cases)])
        .range([heightScatter - marginScatter.bottom, marginScatter.top]);

    // axes
    const xAxis = d3.axisBottom(xScale).ticks(axisTicks.qty);
    const yAxis = d3.axisLeft(yScale);

    //create svg element
    svgScatter = d3
        .select("#d3-container1")
        .append("svg")
        .attr("width", widthScatter)
        .attr("height", heightScatter)

    // add axis
    svgScatter
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${heightScatter - marginScatter.bottom})`)
        .call(xAxis)

    svgScatter
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${marginScatter.left},0)`)
        .call(yAxis)

    div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
    draw_scatter();
};
// draw function calls every time data updates
function init_rings() {
    xScale_rings = d3.scaleLinear()
        .domain(d3.extent(state.data, d => d.Total_cases))
        .range([marginrings.left, widthrings - marginrings.right]);

    yScale_rings = d3.scaleLinear()
        .domain(d3.extent(state.data, d => d.Total_cases))
        .range([heightrings - marginrings.bottom, marginrings.top]);
    // create an svg element in our main `d3-container` element

    svgRings = d3
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
// ****** DRAW FUNCTION
// ****** we call this everytime there is an update to the data/state

function draw() {
    draw_scatter();
    draw_rings();
}

function draw_scatter() {
    let filteredData = state.data;
    if (state.selection !== "All") {
        filteredData = state.data.filter(d => d.Country === state.selection);
    }
    // console.log(state.selection)

    console.log("fd", filteredData);

    const lineFunc = d3
        .line()
        .x(d => xScale(d.Date))
        .y(d => yScale(d.Total_deaths))

    const line = svgScatter
        .selectAll("path.trend")
        .data(d3.groups(filteredData, d => d.Country))
        .join(
            enter =>
                enter
                    .append("path")
                    .attr("class", "trend")
                    .attr("opacity", 0)
                    .on("mouseover", function (d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", 1)
                        div.html("The number of total deaths " + " " + " in " + d[0])//formatTime(new Date(d[1])) + " in " + d[0] + " " + "was " + d[1])
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px")
                    })
                    .on("mouseout", function (d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", 0)
                    }),
            update => update,
            exit => exit.remove()
        )
        .call(selection_dots =>
            selection_dots
                .transition()
                .duration(1000)
                .attr("opacity", 1)
                .attr("d", d => lineFunc(d[1]))
        );

    const lineFunc1 = d3
        .line()
        .x(d => xScale(d.Date))
        .y(d => y1Scale(d.Total_cases))

    const countryData = d3.groups(filteredData, d => d.Country)
    console.log(countryData)
    const line1 = svgScatter
        .selectAll("path.trend1")
        .data(d3.groups(filteredData, d => d.Country))
        .join(
            enter =>
                enter
                    .append("path")
                    .attr("class", "trend1")
                    .on("mouseover", function (d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", 1) //console.log("search", d[0][1].Date)
                        div.html("The number of total deaths " + " " + " in " + d[0])
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px")

                    })
                    .on("mouseout", function (d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", 0)
                    }),

            update => update,
            exit => exit.remove()
        )
        .call(selection_dot1 =>
            selection_dot1
                .transition()
                .duration(1000)
                .attr("opacity", 1)
                .attr("d", d => lineFunc1(d[1]))
        );
}

function draw_rings() {
    // return an array of [key, value] pairs
    let filteredData = state.data;
    if (state.selection !== "All") {
        filteredData = state.data.filter(d => d.Country === state.selection);
        console.log(filteredData)
    }

    radiusScale_rings = d3.scaleSqrt()
        .domain(d3.extent(state.data, d => d.Total_cases))
        .range([10, 100])
    colorScale_rings = d3.scaleLinear().domain(d3.extent(state.data, d => d.Total_cases))
        .range(["#737373", "#262626"])
    radiusScale1_rings = d3.scaleSqrt()
        .domain(d3.extent(state.data, d => d.Total_cases))
        .range([10, 100])
    colorScale1_rings = d3.scaleLinear().domain(d3.extent(state.data, d => d.Total_deaths))
        .range(["#cc0000", "#330000"])

    let dot_rings = svgRings
        .selectAll(".circle")
        .data(filteredData, d => d.Country)
        .join(
            enter =>
                enter
                    .append("circle")
                    .attr("class", "circle")
                    .attr("opacity", 0)
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
                            .style('opacity', 1);
                        div
                            .html("The number of total cases on " + " " + formatTime(new Date(d.Date)) + " in " + d.Country + " " + "was " + d.Total_cases)
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
                    update.transition()
                        .duration(250)),
            exit =>
                exit.call(exit =>
                    exit
                        .transition()
                        //.delay(100)
                        .duration(500)
                        .remove()
                )
        )

    dot_rings.call(circles_selection =>
        circles_selection
            .transition()
            .duration(3000)
            .attr("opacity", 0.2)
            .attr("fill", "none")
            .attr("stroke", d => colorScale_rings(d.Total_cases))
            //.attr("stroke-width", 3)
            .attr("r", d => radiusScale_rings(d.Total_cases))
    );

    let dot1_rings = svgRings
        .selectAll(".circle1")
        .data(filteredData, d => d.Country)
        .join(
            enter =>
                enter
                    .append("circle")
                    .attr("class", "circle1")
                    .attr("opacity", 0)
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
                            .style('opacity', 1);
                        div
                            .html("The number of total deaths on " + " " + formatTime(new Date(d.Date)) + " in " + d.Country + " " + "was " + d.Total_deaths)
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
                    update.transition()
                        .duration(250)),
            exit =>
                exit.call(exit =>
                    exit
                        .transition()
                        // .delay(100)
                        .duration(500)
                        .remove())
        )

    dot1_rings.call(circles_selection =>
        circles_selection
            .transition()
            .duration(3000)
            .attr("opacity", 0.2)
            .attr("fill", "none")
            .attr("stroke", d => colorScale1_rings(d.Total_deaths))
            .attr("r", d => radiusScale1_rings(d.Total_deaths))
    );

}






