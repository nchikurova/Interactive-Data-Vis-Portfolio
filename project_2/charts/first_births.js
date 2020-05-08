d3.csv("../data_project2/first_births.csv", d3.autoType).then(function (data) {
    // from http://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/
    const slices = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {
                    Age: d.Age,
                    measurement7: +d[id]

                };
            })
        };
    });
    // console.log(data)
    // console.log("Column headers", data.columns);
    // console.log("Column headers without age", data.columns.slice(1));
    // // returns the sliced dataset
    // console.log("Slices", slices);
    // // returns the first slice
    // console.log("First slice", slices[0]);
    // // returns the array in the first slice
    // console.log("A array", slices[0].values);
    // // returns the date of the first row in the first slice
    // console.log("Age element", slices[0].values[0].Age);
    // // returns the array's length
    // console.log("Array length", (slices[0].values).length);
    // console.log(data);

    /** CONSTANTS */
    // constants help us reference the same values throughout our code
    const width7 = 680,
        height7 = 480,

        margin7 = { top: 30, bottom: 40, left: 60, right: 5 };

    axisTicksX = { qty: 20 };
    axisTicksY = { qty: 10 };
    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const xScale7 = d3
        .scaleLinear()
        .domain(d3.extent(data, function (d) {
            return d.Age
        }))
        .range([margin7.left, width7 - margin7.right]);
    //console.log(xScale7.domain())

    const yScale7 = d3
        .scaleLinear()
        .domain([0, 0.16]) // using this for all for graphs to show th difference better
        .range([height7 - margin7.bottom, margin7.top])
    // .domain([(0), d3.max(slices, function (c) {
    //     return d3.max(c.values, function (d) {
    //         return d.measurement7;
    //     });
    // })
    // ]);;

    //console.log(yScale7)

    const xAxis7 = d3.axisBottom(xScale7).ticks(axisTicksX.qty);

    const yAxis7 = d3.axisLeft(yScale7)
        .ticks((slices[0].values).length).ticks(axisTicksY.qty).tickFormat(d => d + " %");
    //console.log(yAxis1)

    /** MAIN CODE */
    const svg7 = d3
        .select("#d3-container7")
        .append("svg")
        .attr("width", width7)
        .attr("height", height7);

    // append dots and lines
    const lineFunc7 = d3.line()
        .x(function (d) { return xScale7(d.Age); })
        .y(function (d) { return yScale7(d.measurement7); });

    let id = 0;
    const ids = function () {
        return "line-first" + id++;
    }
    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(xScale7)
            .ticks(10)
    }
    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScale7)
            .ticks(8)
    }

    const lines7 = svg7
        .selectAll("lines")
        .data(slices)
        .enter()
        .append("g")

    lines7.append("path")
        .attr("class", ids)
        // .attr("d", function (d) {
        //     return lineFunc1(d.values);
        // });
        .attr('d', d => lineFunc7(d.values))
        .attr("stroke-width", 2)
        .style("stroke", "#1280C2")
        .attr("stroke-opacity", 1)
        //.attr("fill", "none")
        .attr("fill", "rgb(202, 227, 241)")
        .attr("fill-opacity", 0.4)
        .on('mouseover', function (d) {
            //console.log(d.Year)
            div.style('opacity', 0.9)
                .html(d.id)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on('mouseout', function (d) {
            div.style('opacity', 0);
        });


    //console.log(d.measurment)
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
    svg7
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin7.left},0)`)
        .call(yAxis7)
        .append("text")
        .attr("class", "axis-label")
        .attr("y", "50%")
        .attr("dx", "-4.5em")
        .attr("writing-mode", "vertical-rl")
        .text("Proportions of women by birth in %");

    //adding title   
    // svg7
    //     .append("text")
    //     .attr("x", width7 / 6)
    //     .attr("y", margin7.top - 10)
    //     .attr("class", "title")
    //     .style("font-color", "black")
    //     .style("font-size", "24px")
    //     .text("First births");

    // add the X gridlines
    svg7.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height7 - margin7.bottom})`)
        .call(make_x_gridlines()
            .tickSize(- height7 + 65)
            .tickFormat("")
        )
    // add the Y gridlines
    svg7.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin7.left},0)`)
        // .attr("transform", `translate(40,0)`)
        .call(make_y_gridlines()
            .tickSize(- width7)
            .tickFormat("")
        )
    div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .attr("position", "absolute")
    // Dash-array lines 
    svg7.append("line") //2010
        .attr("x1", margin7.left)
        .attr("y1", 220)
        .attr("x2", 540)
        .attr("y2", 220)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .attr("stroke-dasharray", 6)
    svg7.append("line") //2002
        .attr("x1", margin7.left)
        .attr("y1", 182)
        .attr("x2", 540)
        .attr("y2", 182)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .attr("stroke-dasharray", 6)
    svg7.append("line")//1989
        .attr("x1", margin7.left)
        .attr("y1", 57)
        .attr("x2", 540)
        .attr("y2", 57)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .attr("stroke-dasharray", 6)
    svg7.append("line")//1979
        .attr("x1", margin7.left)
        .attr("y1", 45)
        .attr("x2", 540)
        .attr("y2", 45)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .attr("stroke-dasharray", 6)
    svg7.append("line") //vertical 1979 and 1989
        .attr("x1", 175)
        .attr("y1", 45)
        .attr("x2", 175)
        .attr("y2", height7 - margin7.bottom)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .attr("stroke-dasharray", 6)
    svg7.append("line") //vertical 2002
        .attr("x1", 190)
        .attr("y1", 182)
        .attr("x2", 190)
        .attr("y2", height7 - margin7.bottom)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .attr("stroke-dasharray", 6)
    svg7.append("line")// vertical 2010
        .attr("x1", 232)
        .attr("y1", 220)
        .attr("x2", 232)
        .attr("y2", height7 - margin7.bottom)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .attr("stroke-dasharray", 6)

    svg7.append("text")
        .attr("x", 540)
        .attr("y", 46)
        .style("font-color", "black")
        .style("font-size", "18px")
        .text("0.150")

    svg7.append("text")
        .attr("x", 540)
        .attr("y", 63)
        .style("font-color", "black")
        .style("font-size", "18px")
        .text("0.153")

    svg7.append("text")
        .attr("x", 540)
        .attr("y", 188)
        .style("font-color", "black")
        .style("font-size", "18px")
        .text("0.100")

    svg7.append("text")
        .attr("x", 540)
        .attr("y", 228)
        .style("font-color", "black")
        .style("font-size", "18px")
        .text("0.086")


    const tooltip = d3.select('#tooltip');
    const tooltipLine = svg7.append('line');
    tipBox = svg7.append('rect')
        .attr('width', width7)
        .attr('height', height7)
        .attr('opacity', 0)
        .on('mousemove', drawTooltip)
        .on('mouseout', removeTooltip);

    function removeTooltip() {
        if (tooltip) tooltip.style('display', 'none');
        if (tooltipLine) tooltipLine.attr('stroke', 'none');
    }
    function drawTooltip() {
        const age = Math.floor((xScale7.invert(d3.mouse(tipBox.node())[0]) + 5) / 10) * 10;

        data.sort((a, b) => {
            return b.slices.values.find(h => h.age == age).measurement7 - a.slices.values.find(h => h.age == age).measurement7;
        })
        console.log(values)
        tooltipLine.attr('stroke', 'black')
            .attr('x1', xScale7(age))
            .attr('x2', xScale7(age))
            .attr('y1', 0)
            .attr('y2', height7);

        tooltip.html(d.Year)
            .style('display', 'block')
            .style('left', d3.event.pageX + 20)
            .style('top', d3.event.pageY - 20)
            .selectAll()
            .data(data).enter()
            .append('div')
            .style('color', "blue")
            .html(d => d.id + ': ' + d.slices.find(h => h.age == age).measurement7);
    }
});
