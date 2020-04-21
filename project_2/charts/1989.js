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
        margin2 = { top: 5, bottom: 40, left: 40, right: 0 };
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
        //.domain(d3.extent(data, d => d.b1))
        .domain([0, 0.16])
        .range([height2 - margin2.bottom, margin2.top]);

    console.log(yScale2)

    const xAxis2 = d3.axisBottom(xScale2).ticks(axisTicksX.qty);

    const yAxis2 = d3.axisLeft(yScale2)
        .ticks((slices2[0].values).length).ticks(axisTicksY.qty);
    console.log(yAxis2)
    // colorScale = d3.scaleLinear().range(["beighe", "red"]).domain(d3.map(data, d => d.b))

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

    //adding title   
    svg2
        .append("text")
        .attr("x", width2 / 2)
        .attr("y", 25)
        // .attr("class", "title")
        .style("font-color", "black")
        .style("font-size", "22px")
        .text("1989");

    // add the X gridlines
    svg2.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height2 - margin2.bottom})`)
        .call(make_x_gridlines()
            .tickSize(-height2)
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

});
