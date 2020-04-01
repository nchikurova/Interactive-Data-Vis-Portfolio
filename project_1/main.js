/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
    height = window.innerHeight * 0.9,
    margin = { top: 20, bottom: 50, left: 60, right: 40 };

const formatTime = d3.timeFormat("%b, %d, %Y")

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
    country: [],
    selectedCountry: [],
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
    d3.json("../data/custom.geo.json"),
    d3.csv("../data/ebola_3countries.csv", d3.autoType),
]).then(([geojson, country]) => {
    state.geojson = geojson;
    state.country = country;
    console.log("countries: ", state.country);

    init();
})

    ;

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
    projection = d3.geoMercator().fitSize([width, height], state.geojson);
    const path = d3.geoPath().projection(projection);

    // create an svg element in our main `d3-container` element

    const selectElement = d3.select("#dropdown").on("change", function () {
        console.log("new country is", this.value);

        state.selectedCountry = this.value;
        draw();
    });
    selectElement
        .selectAll("option")
        .data(["All", "Guinea", "Sierra Leone", "Liberia"])
        .join("option")
        .attr("value", d => d)
        .text(d => d);

    svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg
        .selectAll(".country")
        .data(state.geojson.features)
        .join("path")
        .attr("d", path)
        .attr("class", "country")
    // .attr("stroke", "white")
    div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    draw();

}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
    // return an array of [key, value] pairs
    let filteredData = state.country;
    // if there is a selectedType, filter the data before mapping it to our elements
    if (state.selectedCountry !== "All") {
        filteredData = state.country.filter(d => d.Country === state.selectedCountry);
    }
    console.log(state.selectedCountry)

    radiusScale = d3.scaleSqrt()
        .domain(d3.extent(state.country, d => d.Total_cases))
        .range([1, 100])


    const dot = svg
        .selectAll(".circle")

        .data(filteredData, d => d.Country)
        .join(
            enter =>
                enter
                    .append("circle")
                    .attr("class", "dot")
                    .attr("opacity", 0.5)
                    .attr("r", d => radiusScale(d.Total_cases))
                    .attr("transform", d => {
                        const [x, y] = projection([+d.Longitude, +d.Latitude]);
                        return `translate(${x}, ${y})`;
                    })

                    .on('mouseover', function (d) {
                        div
                            .transition()
                            .duration(200)
                            .style('opacity', 0.8);
                        div
                            .html(formatTime(new Date(d.Date)) + " Suspected cases: " + d.Suspected_cases + " Total cases: " + d.Total_cases)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on('mouseout', function (d) {
                        div
                            .transition()
                            .duration(100)
                            .style('opacity', 0);
                    }).call(enter =>
                        enter
                            .transition()
                            .duration(1200)),
            update =>
                update.call(update =>
                    update
                        .transition()
                        .delay(1000)
                        .duration(1000)
                ),
            //.attr("cy", func(d,i){return 30*(i+1)})
            //.duration(2000),
            exit => exit
                .call(exit => exit
                    .transition()
                    .delay(1000)
                    .remove())
        )

    dot.call(circles_selection =>
        circles_selection
            .transition()//d3.easeElastic)
            // .delay()
            .attr("opacity", 0.2)
            .attr("fill", "none")
            .attr("stroke", d => {
                if (d.Country === "Liberia") return "#8d2f03";
                else if (d.Country === "Guinea") return "coral";
                else return "brown";
            })
            .attr("r", d => radiusScale(d.Total_cases))
    );

}
