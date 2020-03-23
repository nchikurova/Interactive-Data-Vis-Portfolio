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
    data: []
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
        .range([height, - margin.bottom, margin.top]);

    // axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const selectElement = d3.select("#dropdown").on("change", function () {
        console.log("new selected case is", this.value);

        state.selectedCase = this.value;

        const selectDeathElement = d3.select("#dropdown2").on("change", function () {
            console.log("new selected death case is", this.value);

            state.selectedDeathCase = this.value;

            draw(); // re-draw the graph based on this new selection
        });

    }


