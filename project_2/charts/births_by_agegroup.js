// resources used
// https://bl.ocks.org/mjfoster83/7c9bdfd714ab2f2e39dd5c09057a55a0
// https://www.d3-graph-gallery.com/graph/barplot_stacked_basicWide.html

// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv("../data_project2/birth_by_age_group.csv", d3.autoType).then(data => {
    //console.log(data);

    /** CONSTANTS */
    // constants help us reference the same values throughout our code
    const margin6 = { top: 20, bottom: 100, left: 60, right: 60 },
        width6 = 840,
        height6 = 500

    const subgroups = data.columns.slice(1)
    //const groups = d3.map(data, function (d) { return (d.Year) }).keys()
    //data.sort(function (a, b) { return b.total - a.total; });
    const groups = d3.map(data, function (d) { return (d.Year) }).keys()
    const padding = 0.1;

    /** SCALES */
    const svg6 = d3
        .select("#d3-container6")
        .append("svg")
        .attr("width", width6)
        .attr("height", height6)
        .append("g")
        .attr("transform",
            "translate(" + margin6.left + "," + margin6.top + ")");

    const xScale6 = d3
        .scaleBand()
        .domain(groups)
        .range([0, width6 - margin6.right])
        .padding(padding)

    const yScale6 = d3
        .scaleLinear()
        .domain([0, 15000])
        .range([height6 - margin6.bottom, margin6.top])
    //.domain([0, d3.max(data, function (d) { return d.total; })]).nice();

    // reference for d3.axis: https://github.com/d3/d3-axis
    const xAxis6 = d3.axisBottom(xScale6)
    yAxis6 = d3.axisLeft(yScale6);
    //console.log(xScale6)
    const colorScale6 = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

    const stackedData = d3.stack()
        .keys(subgroups)(data)

    // append rects
    svg6
        .append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "rects")
        .attr("fill", function (d) { return colorScale6(d.key); })
        .selectAll("rect")
        // Enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function (d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return xScale6(d.data.Year); })
        .attr("y", function (d) { return yScale6(d[1]); })
        .attr("height", function (d) { return yScale6(d[0]) - yScale6(d[1]); })
        .attr("width", xScale6.bandwidth())

        .on("mouseover", function () { tooltip.style("display", null); })

        .on("mouseout", function () { tooltip.style("display", "none"); })
        .on("mousemove", function (d) {
            //console.log(d);
            const xPosition = d3.mouse(this)[0] - 15;
            const yPosition = d3.mouse(this)[1] - 25;
            // console.log(yPosition)
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")").attr("opacity", 1);
            tooltip.select("text").text(d[1] - d[0] + " thousands births")//+ " " + data.columns.slice(1))
            console.log(d.subgroups)
            //console.log(d[1] - d[0])


        });
    // adding title
    // svg6
    //     .append("text")
    //     .attr("x", width6 / 7)
    //     .attr("y", 3)
    //     .attr("class", "title")
    //     .style("font-color", "black")
    //     .style("font-size", "24px")
    //     .text("Number of births by 5-year age group of mother (thousands)");

    // add the X gridlines
    svg6
        .append("g")
        .style("font-size", 14)
        .attr("class", "axis6")
        .call(xAxis6)
        .attr("transform", `translate(0,${height6 - margin6.bottom})`)
        .selectAll("text")
        .style("font-weight", "bold")
        .attr("transform", "rotate(-45)")
        .attr("dx", "-3em")
        .attr("dy", ".15em")
        ;
    svg6
        .append("g")
        .style("font-size", 14)
        .style("font-weight", "bold")
        .attr("class", "axis6")
        .call(yAxis6);

    const tooltip = svg6.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("width", 170)
        .attr("height", 28)
        .attr("fill", "white")
        .style("opacity", 0.9)
        .attr("stroke", "black")

    tooltip.append("text")
        .attr("x", 80)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "14px")
        .style("font-weight", "bold")
        .style("opacity", 1);


    const legend = svg6
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(subgroups.slice())
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width6 - 180)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", colorScale6);

    legend.append("text")
        .attr("x", width6 - 68)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(d => d)

});