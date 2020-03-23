/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
    height = window.innerHeight * 0.9,
    margin = { top: 20, bottom: 50, left: 60, right: 40 };

const formatTime = d3.timeFormat("%b %d, %Y")

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let radiusScale;
let projection;
let path;
let div;

/**
 * APPLICATION STATE
 * */
let state = {
    geojson: null,
    country: null,
    // hover: {
    //     // latitude: null,
    //     // longitude: null,
    //     country: null,
    // },
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
    d3.json("../data/countries.geojson"),
    d3.csv("../data/ebola_2014_2016_clean.csv", d3.autoType),
]).then(([geojson, country]) => {
    state.geojson = geojson;
    state.country = country;
    console.log("countries: ", state.country);
    init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
    // our projection and path are only defined once, and we don't need to access them in the draw function,
    // so they can be locally scoped to init()
    const projection = d3.geoEqualEarth().fitSize([width, height], state.geojson);
    const path = d3.geoPath().projection(projection);
    //const colorScale = d3.geoAlbersUsa().range(["paleturquoise", "darkblue"]);
    // create an svg element in our main `d3-container` element

    const selectElement = d3.select("#dropdown").on("change", function () {
        console.log("new country is", this.value);

        state.selectedCountry = this.value;
        draw();
    });
    selectElement
        .selectAll("option")
        .data(["Guinea", "Nigeria", "Sierra Leone", "Liberia", "Senegal", "Spain", "United States of America", "Mali", "Italy", "United Kingdom"])
        .join("option")
        .attr("value", d => d)
        .text(d => d);
    svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    //.attr("fill", d => colorScale(state.exremes));
    svg
        .selectAll(".country")
        // all of the features of the geojson, meaning all the states as individuals
        .data(state.geojson.features)
        .join("path")
        .attr("d", path)
        .attr("class", "country")
        .attr("stroke", "white")
    div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
    // return an array of [key, value] pairs
    raduisScale = d3.scaleSqrt()
        .domain(d3.extent(state.country, d => d.Confirmed_deaths))
        .range([1, 20])

    const dot = svg
        .selectAll(".circle")
        .data(state.country, d => d.Country)
        .join(
            enter =>
                enter
                    .append("circle")
                    .attr("class", "dot")
                    .attr("opacity", 0)
                    .attr("r", d3.scaleSqrt())//d => radiusScale(d.Confirmed_deaths))
                    .attr("transform", d => {
                        const [x, y] = projection([+d.coordinates]);
                        return `translate(${x}, ${y})`;
                    }),
            // .on('mouseover', d => {
            //     div
            //         .transition()
            //         .duration(50)
            //         .style('opacity', 0.8);
            //     div
            //         .html(
            //             "<h2>" + formatTime(new Date(d.Date)) + "</h2>" + "<p style=' font-size:14px; '><strong>" + d.Country + '</strong></p>' + "<p style='color: black; font-size:18px; '><strong> Confirmed deaths: " + d.Confirmed_deaths + '</strong>, ' + "<p style='color: black; font-size: 12px'> confirmed " + '</p>')
            //         .style("left", (d3.event.pageX) + "px")
            //         .style("top", (d3.event.pageY - 28) + "px");
            // })
            // .on('mouseout', () => {
            //     div
            //         .transition()
            //         .duration(100)
            //         .style('opacity', 0);
            // }),
            update => update,
            exit => exit
                .call(exit => exit.transition()
                    .remove())
        )
        .call(selection =>
            selection
                .transition(d3.easeElastic)
                .delay(d => d.Confirmed_deaths / 5))
        .attr("opacity", 0.3)
        .attr("fill", "brown")
        .attr("r", d => radiusScale(d.Confirmed_deaths))
        ;
}
