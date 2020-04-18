//constant and globals
// const width = window.innerWidth * 0.7,
//     height = window.innerHeight * 0.7,
const margin = { top: 20, bottom: 50, left: 60, right: 40 },
    width = 600 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom,
    radius = 3,
    default_selection = "All";
axisTicks = { qty: 9 };
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
d3.csv("../../data/ebola_3.csv",
    d3.autoType)
    .then(data => data.map(d => ({
        Date: new Date(d.Date),
        Country: d.Country,
        Total_deaths: d.Total_deaths,
        Total_cases: d.Total_cases,
    })))
    .then(raw_data => {
        console.log("raw_data", raw_data);
        state.data = raw_data;
        init();
    });

//initializion function
function init() {
    xScale = d3
        .scaleTime()
        .domain(d3.extent(state.data, d => d.Date))
        .range([margin.left, width - margin.right])
        ;
    //console.log(xScale.domain())
    yScale = d3
        .scaleLinear()
        .domain([0, d3.max(state.data, d => d.Total_cases)])
        .range([height - margin.bottom, margin.top]);
    y1Scale = d3
        .scaleLinear()
        .domain([0, d3.max(state.data, d => d.Total_cases)])
        .range([height - margin.bottom, margin.top]);
    // axes
    const xAxis = d3.axisBottom(xScale).ticks(axisTicks.qty);
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
        .select("#d3-container2")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // add axis

    svg
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)

    svg
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")


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
    //console.log(state.selection)
    console.log(filteredData)
    // bisect = {
    //     const: bisect = d3.bisector(d => d.Date).left,
    //     return: mx => {
    //         const Date = x.invert(mx);
    //         const index = bisect(state.data, Date, 1);
    //         const a = state.data[index - 1];
    //         const b = state.data[index];
    //         return Date - a.Date > b.Date - Date ? b : a;
    //     },
    // }
    // const lineFunc = d3
    //     .line()
    //     .x(d => xScale(d.Date))
    //     .y(d => yScale(d.Total_deaths))

    const dot = svg
        .selectAll(".dot")
        .data(filteredData, d => d.Total_deaths, d => d.Country)
        //.data(filteredData, d => d.Country)
        .join(
            enter =>
                enter
                    .append("circle")
                    .attr("class", "dot")
                    .attr("fill", "brown")
                    // .attr("fill", " none")
                    // .attr("stroke", "brown")

                    .attr("r", radius)
                    .attr("cy", d => yScale(d.Total_deaths))
                    .attr("cx", d => xScale(d.Date))

                    //         svg.on("touchmove mousemove", function (d) {
                    //             const { Date, Total_deaths } = bisect(d3.mouse(this)[0]);
                    //             div.attr("transform", `translate(${x(Date)}, $y{(Total_deaths)})`)
                    //                 .call(callout, `${Total_deaths}, ${Date}`)
                    //         }));
                    // svg.on("touchend mouseleave", () =>
                    //     div.call(callout, null));
                    // return svg.node(),

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
            exit => exit.call(exit =>
                // exit selections -- all the `.dot` element that no longer match to HTML elements
                exit
                    .transition()
                    // .delay(d => d.Date)
                    .delay(1000)
                    .duration(500)
                    .attr("cy", height - margin.bottom)
                    .remove()
            ).remove()
        )
        .call(
            selection =>
                selection
                    .transition() // initialize transition
                    .duration(1000) // duration 1000ms / 1s
                    .attr("cx", d => xScale(d.Date)) // started from the bottom, now we're here
        );

    // const line = svg
    //     .selectAll("path.trend")
    //     .data(d3.groups(filteredData, d => d.Country))
    //     .join(
    //         enter =>
    //             enter
    //                 .append("path")
    //                 .attr("class", "trend")
    //                 .attr("opacity", 0),
    //         update => update,
    //         exit => exit.remove()
    //     )
    //     .call(selection_dots =>
    //         selection_dots
    //             .transition()
    //             .duration(1000)
    //             // .delay(1000)
    //             // .remove()
    //             .attr("opacity", 0.8)
    //             .attr("fill", "brown")
    //             .attr("d", d => lineFunc(d[1])) // 1 is position of d after passing d3.groups
    //     );

    // const lineFunc1 = d3
    //     .line()
    //     .x(d => xScale(d.Date))
    //     .y(d => y1Scale(d.Total_cases))

    //.y(d => yScale(d.Total_cases))
    //.y0(yScale(0));
    //console.log(filteredData);
    const dot1 = svg
        .selectAll(".dot1")
        .data(filteredData, d => d.Total_cases)
        .join(
            enter =>
                enter
                    .append("circle")
                    .attr("class", "dot1")
                    .attr("fill", " none")
                    .attr("stroke", " black")

                    .attr("r", radius)
                    .attr("cy", d => y1Scale(d.Total_cases))
                    .attr("cx", d => xScale(d.Date))
                    .on("mouseover", function (d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", 1)
                        div.html("Total cases on " + " " + formatTime(new Date(d.Date)) + " in " + d.Country + " " + "was " + d.Total_cases)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px")

                    })
                    .on("mouseout", function (d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", 0)
                    }),
            update => update,
            exit => exit.call(exit =>
                // exit selections -- all the `.dot` element that no longer match to HTML elements
                exit
                    .transition()
                    // .delay(d => d.Date)
                    .delay(1000)
                    .duration(500)
                    .attr("cy", height - margin.bottom)
                    .remove()
            ).remove()
        )
        .call(
            selection =>
                selection
                    .transition() // initialize transition
                    .duration(1000) // duration 1000ms / 1s
                    .attr("cx", d => xScale(d.Date)) // started from the bottom, now we're here
        );

    // const line1 = svg
    //     .selectAll("path.trend")
    //     .data(d3.groups(filteredData, d => d.Country))
    //     .join(
    //         enter =>
    //             enter
    //                 .append("path")
    //                 .attr("class", "trend")
    //                 .attr("opacity", 1)
    //                 .attr("fill", "black")
    //                 .attr("stroke", 3),
    //         update => update,
    //         exit => exit.remove()
    //     )
    //     .call(selection_dots =>
    //         selection_dots
    //             .transition()
    //             .duration(1000)
    //             // .delay(1000)
    //             // .remove()
    //             .attr("opacity", 0.8)
    //             .attr("fill", "black")
    //             .attr("stroke", 3)
    //             .attr("d", d => lineFunc1(d[1]))
    //     );

}

