d3.csv("../data_project2/All_fert_rates.csv", d3.autoType).then(data => {
    // examples used  http://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/
    const slices5 = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {
                    Year: new Date(d.Year),
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
    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const xScale5 = d3
        .scaleLinear()
        .domain(d3.extent(data, function (d) {
            return d.Year
        }))
        .range([margin5.left, width5 - margin5.right]);

    console.log(xScale5.domain())
    const yScale5 = d3
        .scaleLinear()
        //.domain(d3.extent(data, d => d.values))
        //.domain([0, 4])
        .domain([
            (0), d3.max(slices5, function (c) {
                return d3.max(c.values, function (d) {
                    return d.measurement5;
                });
            })
        ])
        .range([height5 - margin5.bottom, margin5.top]);

    //console.log(yScale5.domain())

    const xAxis5 = d3.axisBottom(xScale5).ticks(axisTicksX.qty).tickFormat(d3.format("d"));

    const yAxis5 = d3.axisLeft(yScale5)
        .ticks((slices5[0].values).length).ticks(axisTicksY.qty);
    //console.log(yAxis5)
    //var colorScale = d3.scaleLinear()
    // .range(["beige", "red"])
    //.domain(d3.map(data[0]).filter)
    //.domain(d3.map(data, d => d.id))
    //keys = data.columns.slices(1)

    //console.log(colorScale.domain())
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

    const lines5 = svg5
        .selectAll("lines")
        .data(slices5)
        .enter()
        .append("g")
    //.attr("fill", d => colorScale(d.id))

    lines5.append("path")
        //.attr("class", "lines5")
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
    //.attr("stroke", (d, i) => colorScale(i))


    svg5
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height5 - margin5.bottom})`)
        .call(xAxis5)
        .attr("font-size", 16)
        .append("text")
        .attr("class", "axis-label")
        .attr("font-size", 16)
        .attr("x", "50%")
        .attr("dy", "3em")
        .text("Year");

    svg5
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin5.left},0)`)
        .call(yAxis5)

    //adding title   
    svg5
        .append("text")
        .attr("x", width5 / 2)
        .attr("y", 15)
        .attr("class", "title")
        .style("font-color", "black")
        .style("font-size", "22px")
        .text("Fertility rates");


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


});