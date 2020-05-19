/**
 * CONSTANTS AND GLOBALS
 * */
const width7 = window.innerWidth * 0.7,
    height7 = window.innerHeight * 0.7,
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
d3.csv("data_project2/first_b.csv", d => ({
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
        )
        .call(
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

// d3.csv("../data_project2/first_births.csv", d3.autoType).then(function (data) {
//     // from http://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/
//     const slices = data.columns.slice(1).map(function (id) {
//         return {
//             id: id,
//             values: data.map(function (d) {
//                 return {
//                     Age: d.Age,
//                     measurement7: +d[id]

//                 };
//             })
//         };
//     });
//     // console.log(data)
//     // console.log("Column headers", data.columns);
//     // console.log("Column headers without age", data.columns.slice(1));
//     // // returns the sliced dataset
//     // console.log("Slices", slices);
//     // // returns the first slice
//     // console.log("First slice", slices[0]);
//     // // returns the array in the first slice
//     // console.log("A array", slices[0].values);
//     // // returns the date of the first row in the first slice
//     // console.log("Age element", slices[0].values[0].Age);
//     // // returns the array's length
//     // console.log("Array length", (slices[0].values).length);
//     // console.log(data);

//     /** CONSTANTS */
//     // constants help us reference the same values throughout our code
//     const width7 = 680,
//         height7 = 480,

//         margin7 = { top: 30, bottom: 40, left: 60, right: 5 };

//     axisTicksX = { qty: 20 };
//     axisTicksY = { qty: 10 };
//     /** SCALES */
//     // reference for d3.scales: https://github.com/d3/d3-scale
//     const xScale7 = d3
//         .scaleLinear()
//         .domain(d3.extent(data, function (d) {
//             return d.Age
//         }))
//         .range([margin7.left, width7 - margin7.right]);
//     //console.log(xScale7.domain())

//     const yScale7 = d3
//         .scaleLinear()
//         .domain([0, 0.16]) // using this for all for graphs to show th difference better
//         .range([height7 - margin7.bottom, margin7.top])

//     //console.log(yScale7)

//     const xAxis7 = d3.axisBottom(xScale7).ticks(axisTicksX.qty);

//     const yAxis7 = d3.axisLeft(yScale7)
//         .ticks((slices[0].values).length).ticks(axisTicksY.qty).tickFormat(d => d + " %");
//     //console.log(yAxis1)

//     /** MAIN CODE */
//     const svg7 = d3
//         .select("#d3-container7")
//         .append("svg")
//         .attr("width", width7)
//         .attr("height", height7);

//     // append dots and lines
//     const lineFunc7 = d3.line()
//         .x(function (d) { return xScale7(d.Age); })
//         .y(function (d) { return yScale7(d.measurement7); });

//     let id = 0;
//     const ids = function () {
//         return "line-first" + id++;
//     }
//     // gridlines in x axis function
//     function make_x_gridlines() {
//         return d3.axisBottom(xScale7)
//             .ticks(10)
//     }
//     // gridlines in y axis function
//     function make_y_gridlines() {
//         return d3.axisLeft(yScale7)
//             .ticks(8)
//     }
//     FirstBirthscolor = d3.scaleOrdinal().domain(d3.extent(slices, d => d.id)).range(["#E5B729", "brown"])//.range(["#E5B729", "#C6501D"])
//     console.log(FirstBirthscolor.range())
//     const lines7 = svg7
//         .selectAll("lines")
//         .data(slices)
//         .enter()
//         .append("g")

//     lines7.append("path")
//         .attr("class", ids)
//         .attr('d', d => lineFunc7(d.values))
//         .attr("stroke-width", 2)
//         .style("stroke", d => FirstBirthscolor(d.id))
//         .attr("stroke-opacity", 1)
//         .attr("fill", d => FirstBirthscolor(d.id))
//         .attr("fill-opacity", 0.4)
//         .on('mouseover', function (d) {
//             //console.log(d.Year)
//             div.style('opacity', 0.9)
//                 .html(d.id)
//                 .style("left", (d3.event.pageX) + "px")
//                 .style("top", (d3.event.pageY - 28) + "px");
//         })
//         .on('mouseout', function (d) {
//             div.style('opacity', 0);
//         });

//     svg7
//         .append("g")
//         .attr("class", "axis x-axis")
//         .attr("transform", `translate(0,${height7 - margin7.bottom})`)
//         .call(xAxis7)
//         .append("text")
//         .attr("class", "axis-label")
//         .attr("x", "50%")
//         .attr("dy", "3em")
//         .text("Age");
//     svg7
//         .append("g")
//         .attr("class", "axis y-axis")
//         .attr("transform", `translate(${margin7.left},0)`)
//         .call(yAxis7)
//         .append("text")
//         .attr("class", "axis-label")
//         .attr("y", "50%")
//         .attr("dx", "-4.5em")
//         .attr("writing-mode", "vertical-rl")
//         .text("Proportions of women by birth in %");

//     //adding title   
//     // svg7
//     //     .append("text")
//     //     .attr("x", width7 / 6)
//     //     .attr("y", margin7.top - 10)
//     //     .attr("class", "title")
//     //     .style("font-color", "black")
//     //     .style("font-size", "24px")
//     //     .text("First births");

//     // add the X gridlines
//     svg7.append("g")
//         .attr("class", "grid")
//         .attr("transform", `translate(0,${height7 - margin7.bottom})`)
//         .call(make_x_gridlines()
//             .tickSize(- height7 + 65)
//             .tickFormat("")
//         )
//     // add the Y gridlines
//     svg7.append("g")
//         .attr("class", "grid")
//         .attr("transform", `translate(${margin7.left},0)`)
//         // .attr("transform", `translate(40,0)`)
//         .call(make_y_gridlines()
//             .tickSize(- width7)
//             .tickFormat("")
//         )
//     div = d3.select("body")
//         .append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0)
//         .attr("position", "absolute")
//     // Dash-array lines 
//     svg7.append("line") //2010
//         .attr("x1", margin7.left)
//         .attr("y1", 220)
//         .attr("x2", 540)
//         .attr("y2", 220)
//         .attr("stroke", "black")
//         .style("stroke-width", 1)
//         .attr("stroke-dasharray", 6)
//     svg7.append("line") //2002
//         .attr("x1", margin7.left)
//         .attr("y1", 182)
//         .attr("x2", 540)
//         .attr("y2", 182)
//         .attr("stroke", "black")
//         .style("stroke-width", 1)
//         .attr("stroke-dasharray", 6)
//     svg7.append("line")//1989
//         .attr("x1", margin7.left)
//         .attr("y1", 57)
//         .attr("x2", 540)
//         .attr("y2", 57)
//         .attr("stroke", "black")
//         .style("stroke-width", 1)
//         .attr("stroke-dasharray", 6)
//     svg7.append("line")//1979
//         .attr("x1", margin7.left)
//         .attr("y1", 45)
//         .attr("x2", 540)
//         .attr("y2", 45)
//         .attr("stroke", "black")
//         .style("stroke-width", 1)
//         .attr("stroke-dasharray", 6)
//     svg7.append("line") //vertical 1979 and 1989
//         .attr("x1", 175)
//         .attr("y1", 45)
//         .attr("x2", 175)
//         .attr("y2", height7 - margin7.bottom)
//         .attr("stroke", "black")
//         .style("stroke-width", 1)
//         .attr("stroke-dasharray", 6)
//     svg7.append("line") //vertical 2002
//         .attr("x1", 190)
//         .attr("y1", 182)
//         .attr("x2", 190)
//         .attr("y2", height7 - margin7.bottom)
//         .attr("stroke", "black")
//         .style("stroke-width", 1)
//         .attr("stroke-dasharray", 6)
//     svg7.append("line")// vertical 2010
//         .attr("x1", 232)
//         .attr("y1", 220)
//         .attr("x2", 232)
//         .attr("y2", height7 - margin7.bottom)
//         .attr("stroke", "black")
//         .style("stroke-width", 1)
//         .attr("stroke-dasharray", 6)

//     svg7.append("text")
//         .attr("x", 540)
//         .attr("y", 46)
//         .style("font-color", "black")
//         .style("font-size", "18px")
//         .text("0.150")

//     svg7.append("text")
//         .attr("x", 540)
//         .attr("y", 63)
//         .style("font-color", "black")
//         .style("font-size", "18px")
//         .text("0.153")

//     svg7.append("text")
//         .attr("x", 540)
//         .attr("y", 188)
//         .style("font-color", "black")
//         .style("font-size", "18px")
//         .text("0.100")

//     svg7.append("text")
//         .attr("x", 540)
//         .attr("y", 228)
//         .style("font-color", "black")
//         .style("font-size", "18px")
//         .text("0.086")

// });

