d3.csv("../data_project2/All_fert_rates.csv", d3.autoType).then(data => {
    // examples used  http://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/

    const slices5 = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {

                    Year: new Date(d.Year),
                    //Year: d3.timeParse("%Y")(d.Year),
                    measurement5: +d[id]

                };
            })
        };
    });

    // console.log("Column headers", data.columns);
    // console.log("Column headers without year", data.columns.slice(1));
    // // returns the sliced dataset
    // console.log("slices5", slices5);
    // // returns the first slice
    // console.log("First slice", slices5[0]);
    // // returns the array in the first slice
    // console.log("A array", slices5[0].values);
    // // returns the date of the first row in the first slice
    // console.log("Year element", slices5[0].values[0].Year);
    // // returns the array's length
    // console.log("Array length", (slices5[0].values).length);
    // console.log(data);

    /** CONSTANTS */
    // constants help us reference the same values throughout our code

    const width5 = 800,
        height5 = 250,
        margin5 = { top: 5, bottom: 40, left: 40, right: 0 };
    axisTicksX = { qty: 10 };
    axisTicksY = { qty: 9 };

    //sortedData = data.sort((a, b) => +a.Poland - +b.Poland)
    //const parser = d3.timeParse("%Y")
    //const formatter = d3.timeFormat("%Y");
    //sortedData = data.sort((a, b) => +a.Poland - +b.Poland)
    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const xScale5 = d3
        .scaleTime()
        .domain(d3.extent(data, d => d.Year))//d => parser(d.Year)))
        .range([margin5.left, width5 - margin5.right]);
    console.log(xScale5.range())
    console.log(xScale5.domain())
    const yScale5 = d3
        .scaleLinear()
        .domain([
            (0), d3.max(slices5, function (c) {
                return d3.max(c.values, function (d) {
                    return d.measurement5;
                });
            })
        ])
        .range([height5 - margin5.bottom, margin5.top]);
    //data.filter(d => d.Year > new Date("1900"))
    //data.find(d => d.Year > new Date("1900"))
    console.log(yScale5.domain())

    const xAxis5 = d3.axisBottom(xScale5).ticks(axisTicksX.qty).tickFormat(d3.format("d")); //'.tickFormat(d3.format("d"))' takes away comma in year

    const yAxis5 = d3.axisLeft(yScale5)
        .ticks((slices5[0].values).length).ticks(axisTicksY.qty);


    /** MAIN CODE */

    const svg5 = d3
        .select("#d3-container5")
        .append("svg")
        .attr("width", width5)
        .attr("height", height5);

    // append dots and lines
    const lineFunc5 = d3.line()
        .x(function (d) { return xScale5(d.Year); })
        .y(function (d) { return yScale5(d.measurement5); });

    let id = 0;
    const ids = function () {
        return "rate-" + id++;
    }
    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(xScale5)
            .ticks(10)
    }
    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScale5)
            .ticks(8)
    }
    // add the X gridlines
    svg5.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height5 - margin5.bottom})`)
        .call(make_x_gridlines()
            .tickSize(-height5)
            .tickFormat("")
        )
    // add the Y gridlines
    svg5.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin5.left},0)`)
        .call(make_y_gridlines()
            .tickSize(- width5)
            .tickFormat("")
        )
    const lines5 = svg5
        .selectAll("lines")
        .data(slices5)
        .enter()
        .append("g")

    lines5.append("path")
        .attr("class", ids)
        .attr("stroke", d => {
            if (d.id === "Russian Federation") return "black";
            else return "#9EA19D"
        })
        .attr("fill", " none")
        .attr("stroke-width", d => {
            if (d.id === "Russian Federation") return 4;
            else return 2
        })
        .attr("d", d => lineFunc5(d.values))


        // svg5
        //     .on("mousemove", function () {
        //         const [x, y] = d3.mouse(this);
        //         // finding X
        //         const closestDate = formatter(xScale5.invert(x));
        //         console.log(d3.timeParse(closestDate))
        //         console.log("found using date/x", data.find(d => d.Year === closestDate));

        //         //finding Y
        //         // const closestY = yScale5.invert(y);
        //         // const bisector = d3.bisector(d => d.Poland);
        //         // const closestPolandVal = bisector.right(data, closestY);
        //         // console.log("found using y/value", data[closestPolandVal]);
        //         d3.select("text").text(`x:${x}, closestDate:${closestDate}`)
        //         //d3.select("text").text(`y:${y}, closestY:${closestY}`)

        //         const text = svg5
        //         .append("text")
        //         .attr("transform", `translate(100, 100)`)
        //         .text("");

        //     });


        .on('mouseover', function (d) {
            //console.log(d.Year)
            div.style('opacity', 0.9)
                .html(d.id) //+ "<p style=' '><strong>" + d.id.values + d.id.Year + "</strong></p>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on('mouseout', function (d) {
            div.style('opacity', 0);
        });


    div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .attr("position", "absolute")
    svg5
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height5 - margin5.bottom})`)
        .call(xAxis5)
        .attr("font-size", 16)
    // .append("text")
    // .attr("class", "axis-label")
    // .attr("font-size", 16)
    // .attr("x", "50%")
    // .attr("dy", "3em")
    // .text("Year");

    svg5
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin5.left},0)`)
        .call(yAxis5)

    // Adding line and text to imphasize Ruassian Federation
    svg5.append("line")
        .attr("x1", 700)
        .attr("y1", 70)
        .attr("x2", 735)
        .attr("y2", 95)
        .attr("stroke", "black")
        .style("stroke-width", 2)

    svg5.append("text")
        .attr("x", 615)
        .attr("y", 65)
        .text("Russian Federation")
        .attr("fill", "black")
        .style("font-size", 18)

    //adding title   
    // svg5
    //     .append("text")
    //     .attr("x", width5 / 4)
    //     .attr("y", 15)
    //     .attr("class", "title")
    //     .style("font-color", "black")
    //     .style("font-size", "22px")
    //     .text("Fertility rates in Eastern European countries");
});