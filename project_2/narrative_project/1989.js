d3.csv("../data_project2/1989.csv", d3.autoType).then(data => {
    // from http://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/
    const slices2 = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {
                    Age: d.Age,
                    measurement2: +d[id]

                };
            })
        };
    });

    // console.log("Column headers", data.columns);
    // console.log("Column headers without age", data.columns.slice(1));
    // // returns the sliced dataset
    // console.log("slices2", slices2);
    // // returns the first slice
    // console.log("First slice", slices2[0]);
    // // returns the array in the first slice
    // console.log("A array", slices2[0].values);
    // // returns the date of the first row in the first slice
    // console.log("Age element", slices2[0].values[0].Age);
    // // returns the array's length
    // console.log("Array length", (slices2[0].values).length);
    // console.log(data);

    /** CONSTANTS */
    // constants help us reference the same values throughout our code

    const width2 = 400,
        height2 = 250,
        margin2 = { top: 30, bottom: 40, left: 60, right: 5 };
    axisTicksX = { qty: 20 };
    axisTicksY = { qty: 9 };
    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const xScale2 = d3
        .scaleLinear()
        .domain(d3.extent(data, function (d) {
            return d.Age
        }))
        .range([margin2.left, width2 - margin2.right]);
    //console.log(xScale2)

    const yScale2 = d3
        .scaleLinear()

        .domain([0, 0.16])
        .range([height2 - margin2.bottom, margin2.top]);

    //console.log(yScale2)

    const xAxis2 = d3.axisBottom(xScale2).ticks(axisTicksX.qty);

    const yAxis2 = d3.axisLeft(yScale2)
        .ticks((slices2[0].values).length).ticks(axisTicksY.qty).tickFormat(d => d + " %");
    //console.log(yAxis2)

    /** MAIN CODE */
    const svg2 = d3
        .select("#d3-container2")
        .append("svg")
        .attr("width", width2)
        .attr("height", height2);

    // append dots and lines
    const lineFunc2 = d3.line()
        .x(function (d) { return xScale2(d.Age); })
        .y(function (d) { return yScale2(d.measurement2); });

    let id = 0;
    const ids = function () {
        return "line-" + id++;
    }
    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(xScale2)
            .ticks(10)
    }
    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScale2)
            .ticks(8)
    }

    const lines2 = svg2
        .selectAll("lines")
        .data(slices2)
        .enter()
        .append("g")

    lines2.append("path")
        .attr("class", ids)
        .attr("d", function (d) { return lineFunc2(d.values); });


    svg2
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height2 - margin2.bottom})`)
        .call(xAxis2)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", "50%")
        .attr("dy", "3em")
        .text("Age");
    svg2
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin2.left},0)`)
        .call(yAxis2)
        .append("text")
        .attr("class", "axis-label")
        .attr("y", "50%")
        .attr("dx", "-4.5em")
        .attr("writing-mode", "vertical-rl")
        .text("Proportions of women by birth in %");

    //adding title   
    svg2
        .append("text")
        .attr("x", width2 / 6)
        .attr("y", margin2.top - 10)
        .attr("class", "title")
        .style("font-color", "black")
        .style("font-size", "24px")
        .text("1989");

    // add the X gridlines
    svg2.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height2 - margin2.bottom})`)
        .call(make_x_gridlines()
            .tickSize(-height2 + 65)
            .tickFormat("")
        )
    // add the Y gridlines
    svg2.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin2.left},0)`)
        .call(make_y_gridlines()
            .tickSize(- width2)
            .tickFormat("")
        )

    // I moved legends to 1979 line chart
    // // append legends using example https://www.d3-graph-gallery.com/graph/custom_legend.html
    // keys = ["1st births", "2nd births", "3rd births", "4th births", "5th + births"]
    // // if our columns were named as above, for keys we could use data.columns.slice(1)
    // const color = d3.scaleOrdinal().domain(["1st births", "2nd births", "3rd births", "4th births", "5th + births"]).range(["#1280C2", "#F19322", " #44A62C", "#EDD151", "#77D9DF"])

    // // Add one dot in the legend for each name.
    // svg2.selectAll("myrect")
    //     .data(keys)
    //     .enter()
    //     .append("rect")
    //     .attr("width", 12)
    //     .attr("height", 12)
    //     .attr("x", 308)
    //     .attr("y", function (d, i) { return 5 + i * 20 }) // 100 is where the first dot appears. 25 is the distance between dots
    //     .style("fill", function (d) { return color(d) })
    // //.style("stroke", "black")
    // //.style("stroke-width", 0.5)

    // // Add one dot in the legend for each name.
    // svg2.selectAll("mylabels")
    //     .data(keys)
    //     .enter()
    //     .append("text")
    //     .style("font-size", 14)
    //     .attr("x", 325)
    //     .attr("y", function (d, i) { return 12 + i * 20 }) // 10 is where the first dot appears. 25 is the distance between dots
    //     //.style("fill", function (d) { return color(d) }) // if you want text the same color as circles
    //     .style("fill", "black")
    //     .text(function (d) { return d })
    //     .attr("text-anchor", "left")
    //     .style("alignment-baseline", "middle")

});
