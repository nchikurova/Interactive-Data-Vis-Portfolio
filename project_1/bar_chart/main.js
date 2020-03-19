// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv("../../data/ebola_2014_2016_clean.csv",

    d3.autoType).then(data => {
        console.log(data);

        // data.sort((first, second) => first.count - second.count)
        data.sort((first, second) => d3.descending(first.count, second.count))

        /** CONSTANTS */
        // constants help us reference the same values throughout our code
        const width = window.innerWidth * 0.9,
            height = window.innerHeight / 2,
            paddingInner = 0.2,
            paddingOuter = 0.2,
            margin = { top: 10, bottom: 10, left: 100, right: 40 }

        const formatYear = d3.timeFormat("%Y")

        /** SCALES */
        // reference for d3.scales: https://github.com/d3/d3-scale
        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.Total_cases)])
            .range([width - margin.left, margin.right])

        //console.log(xScale)

        const yScale = d3
            .scaleBand()
            .domain(data.map(d => d.Country))
            .range([margin.top, height - margin.bottom]) // range!!!! might be changed
            .paddingInner(paddingInner)
            .paddingOuter(paddingOuter);


        // reference for d3.axis: https://github.com/d3/d3-axis
        const yAxis = d3
            .axisLeft(yScale)
            .ticks(data.length);

        const xAxis = d3
            .axisBottom(xScale)
        //.ticks(data.length);

        /** MAIN CODE */
        const svg = d3
            .select("#d3-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        const colorScale = d3.scaleLinear().domain([0, d3.max(data, d => d.Total_cases) + 30]).range(["paleturquoise", "darkblue"])
        // append rects
        const rect = svg
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", 0, d => xScale(d.Total_cases))
            .attr("y", d => yScale(d.Country))
            .attr("width", d => xScale(d.Total_cases))
            .attr("height", yScale.bandwidth())
            .attr("transform", `translate(100, ${height - margin.bottom, margin.top})`)
            .attr("fill", d => colorScale(d.Total_cases))
        // .attr("fill", d => {
        //     if (d.Date === "2013") return "#EDBB99";
        //     else if (d.Date === "2014") return "red";
        //     else return "purple";
        // })
        // append text
        const text = svg
            .selectAll("text")
            .data(data)
            .join("text")
            .attr("class", "label")
            // this allows us to position the text in the center of the bar
            .attr("y", d => yScale(d.Country))
            .attr("x", d => xScale(d.Total_cases))
            .text(d => d.Total_cases)
            //.attr("dy", "200")
            .attr("dx", "-.8")

        svg
            .append("g")
            .attr("class", "axis")
            .attr("transform", `translate(80,10)`)
            .call(yAxis);

        svg
            .append("g")
            .attr("class", "axis") // .attr("class, "axis") - x axis shows up on the top
            .attr("transform", `translate( ${margin.left}, 0)`)
            //.style("text-anchor", "left")
            .call(xAxis);
    });