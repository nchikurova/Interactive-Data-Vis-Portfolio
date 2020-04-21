d3.csv("../data_project2/2010.csv", d3.autoType).then(data => {
    // from http://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/
    const slices4 = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {
                    Age: d.Age,
                    measurement4: +d[id]

                };
            })
        };
    });

    console.log("Column headers", data.columns);
    console.log("Column headers without age", data.columns.slice(1));
    // returns the sliced dataset
    console.log("slices4", slices4);
    // returns the first slice
    console.log("First slice", slices4[0]);
    // returns the array in the first slice
    console.log("A array", slices4[0].values);
    // returns the date of the first row in the first slice
    console.log("Age element", slices4[0].values[0].Age);
    // returns the array's length
    console.log("Array length", (slices4[0].values).length);
    console.log(data);

    /** CONSTANTS */
    // constants help us reference the same values throughout our code

    const width4 = 400,
        height4 = 250,
        margin4 = { top: 5, bottom: 40, left: 40, right: 0 };
    axisTicksX = { qty: 20 };
    axisTicksY = { qty: 9 };
    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const xScale4 = d3
        .scaleLinear()
        .domain(d3.extent(data, function (d) {
            return d.Age
        }))
        .range([margin4.left, width4
            - margin4.right]);
    //console.log(xScale3)

    const yScale4 = d3
        .scaleLinear()
        //.domain(d3.extent(data, d => d.b1))
        .domain([0, 0.16])
        .range([height4 - margin4.bottom, margin4.top]);

    console.log(yScale4)

    const xAxis4 = d3.axisBottom(xScale4).ticks(axisTicksX.qty);

    const yAxis4 = d3.axisLeft(yScale4)
        .ticks((slices4[0].values).length).ticks(axisTicksY.qty);
    console.log(yAxis4)
    // colorScale = d3.scaleLinear().range(["beighe", "red"]).domain(d3.map(data, d => d.b))

    /** MAIN CODE */
    const svg4 = d3
        .select("#d3-container4")
        .append("svg")
        .attr("width", width4
        )
        .attr("height", height4);

    // append dots and lines
    const lineFunc4 = d3.line()
        .x(function (d) { return xScale4(d.Age); })
        .y(function (d) { return yScale4(d.measurement4); });

    let id = 0;
    const ids = function () {
        return "line-" + id++;
    }
    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(xScale4)
            .ticks(10)
    }
    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScale4)
            .ticks(8)
    }

    const lines4 = svg4
        .selectAll("lines")
        .data(slices4)
        .enter()
        .append("g")

    lines4.append("path")
        .attr("class", ids)
        .attr("d", function (d) { return lineFunc4(d.values); });

    svg4
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height4 - margin4.bottom})`)
        .call(xAxis4)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", "50%")
        .attr("dy", "3em")
        .text("Age");
    svg4
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin4.left},0)`)
        .call(yAxis4)

    //adding title   
    svg4
        .append("text")
        .attr("x", width4 / 2)
        .attr("y", 25)
        //.attr("class", "title")
        .style("font-color", "black")
        .style("font-size", "22px")
        .text("2010");


    // add the X gridlines
    svg4.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height4 - margin4.bottom})`)
        .call(make_x_gridlines()
            .tickSize(-height4)
            .tickFormat("")
        )
    // add the Y gridlines
    svg4.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin4.left},0)`)
        .call(make_y_gridlines()
            .tickSize(- width4
            )
            .tickFormat("")
        )


});