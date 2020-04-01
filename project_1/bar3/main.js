// load data
// d3.csv("../../data/totals.csv", d3.autoType).then(data => {
//     console.log(data);

// CONSTANTS
const width = window.innerWidth * 0.9,
    height = window.innerHeight / 3,
    barPadding = 0.3,
    margin = { top: 20, bottom: 40, left: 40, right: 40 };
axisTicks = { qty: 5, outerSize: 0, dateFormat: '%m-%d' };

let svg;
let x0Scale;
let x1Scale;
let yScale;
let country;

let state = {
    data: [],
    selectedYear: [],
};

d3.csv("../../data/totals.csv", d3.autoType).then(raw_data => {
    console.log("raw_data", raw_data)
    state.data = raw_data;
    init();
});

function init() {
    //SCALES

    x0Scale = d3
        .scaleBand()
        .rangeRound([margin.left, width - margin.right])
        .padding(barPadding)

    x1Scale = d3
        .scaleBand()
    //.range([0, width], .1);

    yScale = d3
        .scaleLinear()
        .range([height - margin.bottom, margin.top]);//([height - margin.bottom, margin.top])
    // AXES
    const xAxis = d3.axisBottom(x0Scale)
        .ticks(axisTicks.qty)
    //.ticksSizeOuter(axisTicks.outerSize);

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(".2s"));

    const selectElement = d3.select("#dropdown").on("change", function () {
        console.log("new selected year is", this.value);
        //'this' === the selectElement
        // this.value holds the dropdown value a user just selected
        state.selectedYear = this.value;
        draw(); //re-draw the graph based on this new selection
    })
    // add in dropdown options from the unique values in the data
    selectElement
        .selectAll("option")

        .data(["2014", "2015"]) // unique data values-- (hint: to do this programmatically take a look `Sets`)
        .join("option")
        .attr("value", d => d)
        .text(d => d);

    x0Scale.domain(state.data.map(d => d.Country))
    x1Scale.domain(['Total_cases', 'Total_deaths']).range([0, x0Scale.bandwidth()])
    yScale.domain([0, d3.max(state.data, d => d.Total_cases > d.Total_deaths ? d.Total_cases : d.Total_deaths)])

    const svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    // .append("g")
    // .attr("transform", `translate(${margin.left},${margin.top})`);
    svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, (${height - margin.bottom}))`)
        .call(xAxis);
    svg
        .append("g")
        .attr("class", "axis") // .attr("class, "axis") - x axis shows up on the top
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "center")
        .text("Total numbers per year");
    draw();
}

function draw() {

    let filteredData = state.data;
    // if there is a selectedType, filter the data before mapping it to our elements
    if (state.selectedYear !== []) {
        filteredData = state.data.filter(d => d.Year === state.selectedYear);
    }
    console.log(filteredData)
    country = svg
        .selectAll(".country")
        .data(filteredData, d => d.Year)
        .join(
            enter =>
                enter
                    .append("g")
                    .attr("transform", d => `translate(${x0Scale(d.Country)},0)`));

    country.selectAll(".rect.Total_cases")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "rect Total_cases")
        .attr("fill", "grey")
        .attr("width", x1Scale.bandwidth())
        .attr("x", d => x1Scale('Total_cases'))
        .attr("y", d => yScale(d.Total_cases))
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.Total_cases)
        })

    country.selectAll(".rect.Total_deaths")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "rect Total_deaths")
        .style("fill", "brown")
        .attr("x", d => x1Scale('Total_deaths'))
        .attr("y", d => yScale(d.Total_deaths))
        .attr("width", x1Scale.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.Total_deaths)
        })
        ;




};

