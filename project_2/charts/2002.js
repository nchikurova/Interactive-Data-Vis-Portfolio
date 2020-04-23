d3.csv("../data_project2/2002.csv", d3.autoType).then(data => {
    // from http://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/
    const slices3 = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {
                    Age: d.Age,
                    measurement3: +d[id]

                };
            })
        };
    });

    // console.log("Column headers", data.columns);
    // console.log("Column headers without age", data.columns.slice(1));
    // // returns the sliced dataset
    // console.log("slices3", slices3);
    // // returns the first slice
    // console.log("First slice", slices3[0]);
    // // returns the array in the first slice
    // console.log("A array", slices3[0].values);
    // // returns the date of the first row in the first slice
    // console.log("Age element", slices3[0].values[0].Age);
    // // returns the array's length
    // console.log("Array length", (slices3[0].values).length);
    // console.log(data);

    /** CONSTANTS */
    // constants help us reference the same values throughout our code

    const width3 = 400,
        height3 = 250,
        margin3 = { top: 30, bottom: 40, left: 60, right: 5 };
    axisTicksX = { qty: 20 };
    axisTicksY = { qty: 9 };
    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const xScale3 = d3
        .scaleLinear()
        .domain(d3.extent(data, function (d) {
            return d.Age
        }))
        .range([margin3.left, width3
            - margin3.right]);
    //console.log(xScale3)

    const yScale3 = d3
        .scaleLinear()
        //.domain(d3.extent(data, d => d.b1))
        .domain([0, 0.16])
        .range([height3 - margin3.bottom, margin3.top]);

    console.log(yScale3)

    const xAxis3 = d3.axisBottom(xScale3).ticks(axisTicksX.qty);

    const yAxis3 = d3.axisLeft(yScale3)
        .ticks((slices3[0].values).length).ticks(axisTicksY.qty).tickFormat(d => d + " %");
    console.log(yAxis3)
    // colorScale = d3.scaleLinear().range(["beighe", "red"]).domain(d3.map(data, d => d.b))

    /** MAIN CODE */
    const svg3 = d3
        .select("#d3-container3")
        .append("svg")
        .attr("width", width3
        )
        .attr("height", height3);

    // append dots and lines
    const lineFunc3 = d3.line()
        .x(function (d) { return xScale3(d.Age); })
        .y(function (d) { return yScale3(d.measurement3); });

    let id = 0;
    const ids = function () {
        return "line-" + id++;
    }
    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(xScale3)
            .ticks(10)
    }
    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScale3)
            .ticks(8)
    }
    const lines3 = svg3
        .selectAll("lines")
        .data(slices3)
        .enter()
        .append("g")

    lines3.append("path")
        .attr("class", ids)
        .attr("d", function (d) { return lineFunc3(d.values); });

    svg3
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height3 - margin3.bottom})`)
        .call(xAxis3)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", "50%")
        .attr("dy", "3em")
        .text("Age");
    svg3
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin3.left},0)`)
        .call(yAxis3)
        .append("text")
        .attr("class", "axis-label")
        .attr("y", "50%")
        .attr("dx", "-4.5em")
        .attr("writing-mode", "vertical-rl")
        .text("Proportions of women by birth in %");

    //adding title   
    svg3
        .append("text")
        .attr("x", width3 / 6)
        .attr("y", margin3.top - 10)
        .attr("class", "title")
        .style("font-color", "black")
        .style("font-size", "24px")
        .text("2002");


    // add the X gridlines
    svg3.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height3 - margin3.bottom})`)
        .call(make_x_gridlines()
            .tickSize(-height3 + 65)
            .tickFormat("")
        )
    // add the Y gridlines
    svg3.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin3.left},0)`)
        .call(make_y_gridlines()
            .tickSize(- width3
            )
            .tickFormat("")
        )


});