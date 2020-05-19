/**
 * CONSTANTS AND GLOBALS
 * */
const width7 = 700,
    height7 = 500,
    margin7 = { top: 30, bottom: 60, left: 60, right: 40 },
    radius = 4,
    default_selection = "Select year";

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg7;
let xScale7;
let yScale7;
let yAxis7;
let FirstBirthscolor;

let state = {
    data: [],
    selectedYear: null,
};

/**
 * LOAD DATA
 * */
d3.csv("../data_project2/first_births.csv", d => ({
    age: d.Age,
    year: d.Year,
    first_births: +d.First_births,
})).then(raw_data => {
    console.log("raw_data", raw_data);
    state.data = raw_data;
    init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
    // SCALES
    xScale7 = d3
        .scaleLinear()
        .domain(d3.extent(state.data, d => d.age))
        .range([margin7.left, width7 - margin7.right]);

    yScale7 = d3
        .scaleLinear()
        .domain([0, d3.max(state.data, d => d.first_births)])
        .range([height7 - margin7.bottom, margin7.top]);

    // AXES
    const xAxis7 = d3.axisBottom(xScale7);
    const yAxis7 = d3.axisLeft(yScale7);

    // UI ELEMENT SETUP
    const selectElement = d3.select("#dropdown").on("change", function () {
        console.log("new year is", this.value);
        // `this` === the selectElement
        // this.value holds the dropdown value a user just selected
        state.selectedYear = this.value;
        draw(); // re-draw the graph based on this new selection
    });
    console.log('v', selectElement)
    // add in dropdown options from the unique values in the data
    selectElement
        .selectAll("option")
        .data([
            ...Array.from(new Set(state.data.map(d => d.year))),
            default_selection,
        ])
        .join("option")
        .attr("value", d => d)
        .text(d => d);

    // this ensures that the selected value is the same as what we have in state when we initialize the options
    selectElement.property("value", default_selection);

    // create an svg element in our main `d3-container` element
    svg7 = d3
        .select("#d3-container7")
        .append("svg")
        .attr("width", width7)
        .attr("height", height7);

    // add the xAxis
    svg7
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height7 - margin7.bottom})`)
        .call(xAxis7)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", "50%")
        .attr("dy", "3em")
        .text("Age");

    // add the yAxis
    svg7
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin7.left},0)`)
        .call(yAxis7)
        .append("text")
        .attr("class", "axis-label")
        .attr("y", "50%")
        .attr("dx", "-3em")
        .attr("writing-mode", "vertical-rl")
        .text("Proportion");
    div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
    draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
    // filter the data for the selectedParty
    let filteredData;
    if (state.selectedYear !== null) {
        filteredData = state.data.filter(d => d.year === state.selectedYear);
    }
    FirstBirthscolor = d3.scaleOrdinal().domain(d3.extent(state.data, d => d.year)).range(["#E5B729", "brown"])
    // we define our line function generator telling it how to access the x,y values for each point
    const lineFunc7 = d3
        .line()
        .x(d => xScale7(d.age))
        .y(d => yScale7(d.first_births));

    const dot = svg7
        .selectAll(".dot")
        .data(filteredData, d => d.age) // use `d.year` as the `key` to match between HTML and data elements
        .join(
            enter =>
                // enter selections -- all data elements that don't have a `.dot` element attached to them yet
                enter
                    .append("circle")
                    .attr("class", "dot") // Note: this is important so we can identify it in future updates
                    .attr("r", radius)
                    .attr("cy", height7 - margin7.bottom) // initial value - to be transitioned
                    .attr("cx", d => xScale7(d.age))
                    .on("mouseover", function (d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", 1)
                        div.html("The proportion of women at first birth in " + "<p style=' '><strong>" + d.year + "</strong></p>" + " at " + "<p style=' '><strong>" + d.age + "</strong></p>" + " years old" + " was " + "<p style=' '><strong>" + d.first_births + "</strong></p>")
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px")
                    })
                    .on("mouseout", function (d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", 0)
                    }),
            update => update,
            exit =>
                exit.call(exit =>
                    // exit selections -- all the `.dot` element that no longer match to HTML elements
                    exit
                        .transition()
                        .delay(d => d.age)
                        .duration(500)
                        .attr("cy", height7 - margin7.bottom)
                        .remove()
                )
        ).call(
            selection =>
                selection
                    .transition() // initialize transition
                    .duration(1000) // duration 1000ms / 1s
                    .attr("cy", d => yScale7(d.first_births)) // started from the bottom, now we're here
        );

    const line7 = svg7
        .selectAll("path.trend")
        .data([filteredData])
        .join(
            enter =>
                enter
                    .append("path")
                    .attr("class", "trend")
                    .attr("opacity", 0), // start them off as opacity 0 and fade them in
            update => update, // pass through the update selection
            exit => exit.remove()
        )
        .call(selection =>
            selection
                .transition() // sets the transition on the 'Enter' + 'Update' selections together.
                .duration(1000)
                .attr("opacity", 1)
                .attr("d", d => lineFunc7(d))
        );
}