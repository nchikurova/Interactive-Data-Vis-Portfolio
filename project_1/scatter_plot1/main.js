//constant and globals
const width = window.innerWidth * 0.7,
    height = window.innerHeight * 0.7,
    margin = { top: 20, bottom: 50, left: 60, right: 40 },
    radius = 5,
    default_selection = "All";

//let
let svg;
let xScale;
let yScale;

//application state
let state = {
    data: [],
    selection: "All"
};
const formatTime = d3.timeFormat("%b %d, %Y")
//load data
d3.csv("../../data/ebola_3countries.csv",
    // d => ({
    //     Date: new Date(d.Date, 0, 1),
    //     Country: d.Country,
    // }),
    d3.autoType)
    .then(data => data.map(d => ({
        Date: new Date(d.Date),
        Country: d.Country,
        Total_deaths: d.Total_deaths,
    })))
    .then(raw_data => {
        console.log("raw_data", raw_data);
        state.data = raw_data;
        init();
    });
//const formatDate = d3.time.format("%m/%d/%y").parse
//initializion function
function init() {
    xScale = d3
        .scaleTime()
        .domain(d3.extent(state.data, d => d.Date))
        .range([margin.left, width - margin.right])
        ;
    console.log(xScale.domain())
    yScale = d3
        .scaleLinear()
        .domain([0, d3.max(state.data, d => d.Total_deaths)])
        .range([height - margin.bottom, margin.top]);

    // axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const selectElement_country = d3.select("#dropdown").on("change", function () {
        console.log("new country is", this.value);

        state.selection = this.value;
        draw();
    });

    selectElement_country
        .selectAll("option")
        .data([
            ...Array.from(new Set(state.data.map(d => d.Country))),
            default_selection,
        ])
        //.data(["Guinea", "Nigeria", "Sierra Leone", "Liberia", "Mali"])
        .join("option")
        .attr("value", d => d)
        .text(d => d);

    selectElement_country.property("value", default_selection)

    //create svg element

    svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // add axis

    svg
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .selectAll("text")
        .attr("x", "50%")
        .attr("dy", "3em")

        .attr("transform", "rotate(-35)");

    //.text("Year");

    svg
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("y", "50%")
        .attr("dx", "-3em")
        .attr("writing-mode", "vertical-rl")
        .text("Number of cases")
    div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
    draw();
};
// draw function calls every time data updates

function draw() {
    let filteredData = state.data;
    if (state.selection !== "All") {
        filteredData = state.data.filter(d => d.Country === state.selection);
    }
    console.log(filteredData)
    //colorScale = d3.scaleLinear().domain([0, d3.max(state.data, d => d.Country)]).range(["pink", "darkred"])

    const lineFunc = d3
        .line()
        .x(d => xScale(d.Date))
        .y(d => yScale(d.Total_deaths))
    //.y0(yScale(0));
    //console.log(filteredData);
    const dot = svg
        .selectAll(".dot")
        .data(filteredData, d => d.Total_deaths)
        .join(
            enter =>
                enter
                    .append("circle")
                    .attr("class", "dot")
                    //.attr("fill", " #8d2f03")
                    .attr("stroke", d => {
                        if (d.Country === "Liberia") return "#8d2f03";
                        else if (d.Country === "Guinea") return "coral";
                        else return "brown";
                    })
                    .attr("fill", "none")
                    .attr("r", radius)
                    .attr("cy", d => yScale(d.Total_deaths))
                    .attr("cx", d => xScale(d.Date))
                    .on("mouseover", function (d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", 1)
                        div.html("Total deaths on " + " " + formatTime(new Date(d.Date)) + " in " + d.Country + " " + "was " + d.Total_deaths)
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
        .call(
            selection =>
                selection
                    .transition() // initialize transition
                    .duration(1000) // duration 1000ms / 1s
                    .attr("cx", d => xScale(d.Date)) // started from the bottom, now we're here
        );

    const line = svg
        .selectAll("path.trend")
        .data([filteredData])
        .join(
            enter =>
                enter
                    .append("path")
                    .attr("class", "trend")
                    .attr("opacity", 0),
            update => update,
            exit => exit.remove()
        )
        .call(selection =>
            selection
                .transition()
                .duration(1000)
                .delay(1000)
                .remove()

        );

}







