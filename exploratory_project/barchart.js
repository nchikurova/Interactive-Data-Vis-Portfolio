//load data
d3.csv("../../data/totals.csv", d3.autoType).then(data => {
    console.log(data);
    // CONSTANTS
    // const width = window.innerWidth * 0.9,
    //     height = window.innerHeight / 3,
    var barPadding = 0.3,
        margin = { top: 20, bottom: 20, left: 40, right: 40 };
    width = 600 - margin.left - margin.right;
    height = 300 - margin.top - margin.bottom;
    //axisTicks = { outerSize: 0 };

    // SCALES
    const x0Scale = d3
        .scaleBand()
        .rangeRound([margin.left, width - margin.right])
        .padding(barPadding)

    const x1Scale = d3
        .scaleBand()

    const yScale = d3
        .scaleLinear()
        .range([height - margin.bottom, margin.top]);

    // AXES
    const xAxis = d3.axisBottom(x0Scale)

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(".2s"));

    x0Scale.domain(data.map(d => d.Country))
    x1Scale.domain(['Total_cases', 'Total_deaths']).range([0, x0Scale.bandwidth()])
    yScale.domain([0, d3.max(data, d => d.Total_cases > d.Total_deaths ? d.Total_cases : d.Total_deaths)])

    var svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis);
    svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("y", "50%")
        .attr("dx", "-3em")
        .attr("writing-mode", "vertical-rl")
        .text("Number of cases");

    var country = svg
        .selectAll(".country")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "country")
        .attr("transform", d => `translate(${x0Scale(d.Country)},0)`);

    country.selectAll(".rect.Total_cases")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "rect Total_cases")
        .attr("fill", "#525050")
        .attr("width", x1Scale.bandwidth())
        .attr("x", d => x1Scale('Total_cases'))
        .attr("y", d => yScale(d.Total_cases))
        .attr("height", d => {
            return height - margin.top - yScale(d.Total_cases)
        })
        .on('mouseover', function (d) {
            div.style('opacity', 0.9)
                .html("Total cases: " + d.Total_cases)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on('mouseout', function (d) {
            div.style('opacity', 0);
        });

    country.selectAll(".rect.Total_deaths")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "rect Total_deaths")
        .style("fill", "brown")
        .attr("x", d => x1Scale('Total_deaths'))
        .attr("y", d => yScale(d.Total_deaths))
        .attr("width", x1Scale.bandwidth())
        .attr("height", d => {
            return height - margin.top - yScale(d.Total_deaths)
        })
        .on('mouseover', function (d) {
            div.style('opacity', 0.9)
                .html("Total deaths: " + d.Total_deaths)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on('mouseout', function (d) {
            div.style('opacity', 0);
        });
});
