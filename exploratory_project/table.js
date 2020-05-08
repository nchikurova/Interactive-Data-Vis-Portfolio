d3.csv("../../data/table.csv").then(data => {
    // once the data loads, console log it
    console.log("data", data);

    // select the `table` container in the HTML
    const table = d3.select("#d3-container5");

    /** HEADER */
    const thead = table.append("thead");
    thead
        .append("tr")
        .append("th")
        .attr("colspan", "15")
        .text("Other affected by Ebola countries:");

    thead
        .append("tr")
        .selectAll("th")
        .data(data.columns)
        .join("td")
        .text(d => d);

    /** BODY */
    // rows
    const rows = table
        .append("tbody")
        .selectAll("tr")
        .data(data)
        .join("tr");

    // cells
    rows
        .selectAll("td")
        .data(d => Object.values(d))
        .join("td")
        // update the below logic to apply to your dataset
        .attr("class", d => +d > 3 ? 'high' : null)
        .text(d => d);
});
