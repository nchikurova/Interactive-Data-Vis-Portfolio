//constant and globals
const width = window.innerWidth * 0.7,
    height = window.innerHeight * 0.7,
    margin = { top: 20, bottom: 50, left: 60, right: 40 },
    radius = 5,
    default_selection = "Select a case";

//let
let svg;
let xScale;
let yScale;

//application state
let state = {
    data: [],
    selectedCountry: "All",
    selection: null
};

//load data
d3.csv("../../data/ebola_2014_2016_clean.csv", d => ({
    year: new Date(d.Date, 0, 1),
    country: d.Country,

}),

    d3.autoType)
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
        .range([margin.left, width - margin.right]);

    yScale = d3
        .scaleLinear()
        .domain([0, d3.max(state.data, d => d.Total_cases)])
        .range([height - margin.bottom, margin.top]);

    // axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const selectElement = d3.select("#dropdown").on("change", function () {
        console.log("new selected case is", this.value);

        state.selectedCase = this.value;
        draw();
    });
    const selectElement_deathcase = d3.select("#dropdown2").on("change", function () {
        console.log("new selected death case is", this.value);

        state.selectedDeathCase = this.value;
        draw(); // re-draw the graph based on this new selection
    });
    const selectElement_country = d3.select("#dropdown3").on("change", function () {
        console.log("new country is", this.value);

        state.selectedCountry = this.value;
        draw();
    });
    selectElement
        .selectAll("option")
        .data(["Suspected_cases", "Probable_cases", "Confirmed_cases", "Total_cases"])
        .join("option")
        .attr("value", d => d)
        .text(d => d);

    selectElement_deathcase
        .selectAll("option")
        .data(["Suspected_deaths", "Probable_deaths", "Confirmed_deaths", "Total_deaths"])
        .join("option")
        .attr("value", d => d)
        .text(d => d);

    selectElement_country
        .selectAll("option")
        .data(["Guinea", "Nigeria", "Sierra Leone", "Liberia", "Senegal", "Spain", "United States of America", "Mali", "Italy", "United Kingdom"])
        .join("option")
        .attr("value", d => d)
        .text(d => d);

    selectElement.property("value", default_selection);
    selectElement_deathcase.property("value", "Select");
    selectElement_country.property("value", "Select country")
    //create svg element
    svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // add axis

    svg
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", "50%")
        .attr("dy", "3em")
        .text("Year");

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
        .text("Number of cases");

    draw();
}

// draw funstion calls every time data updates

function draw() {
    let filteredData = state.data;

    if (state.select !== "All") {
        filteredData = state.data.filter(d => d.Country === state.selection);
    }
    const dot = svg
        .selectAll(".dot")
        .data(filteredData, d => d.Country)
        .join(
            enter =>
                enter
                    .append("circle")
                    .attr("class", "dot")
                    .attr("stroke", "lightgrey")
                    .attr("opacity", 0.6)
                    .attr("fill", d => {
                        if (d.Country === "Italy") return "blue";
                        else if (d.Country === "United Kingdom") return "red";
                        else return "green";

                    })
                    .attr("r", radius)
                    .attr("cy", d => yScale(d.Total_cases))
                    .attr("cx", d => margin.left)
                    .call(enter =>
                        enter
                            .transition()
                            .delay(d => 500)
                            .duration(d => 500)
                            .attr("cx", d => xScale(d.Date))
                    ),
            exit =>
                exit.call(exit =>
                    exit
                        .transition()
                        .delay(1000)
                        .duration(500)
                        .attr("cx", width)
                        .remove()
                )
        )
}







