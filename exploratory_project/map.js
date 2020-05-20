d3.json("../data/custom.geo.json", d3.autoType).
    then(geojson => {

        var svg;

        var marginMap = { top: 20, bottom: 50, left: 60, right: 40 },
            widthMap = 700 - marginMap.left - marginMap.right,
            heightMap = 700 - marginMap.top - marginMap.bottom;

        //var radiusScale;
        var projection;
        var path1;

        projection = d3.geoMercator().fitSize([widthMap, heightMap], geojson);
        path1 = d3.geoPath().projection(projection);


        svg = d3
            .select("#d3-container3")
            .append("svg")
            .attr("width", widthMap)
            .attr("height", heightMap);
        div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll(".country")
            .data(geojson.features)
            .join("path")
            .attr("d", path1)
            .attr("class", "country1")

            .style("fill", d => {

                if (d.properties.admin === "Liberia") return "#787575";
                else if (d.properties.admin === "Guinea") return "#8B8888";
                else if (d.properties.admin === "Sierra Leone") return "#6B6868";
                else if (d.properties.admin === "Nigeria") return "#BDBBBB";
                else if (d.properties.admin === "Mali") return "#CAC8C8";
                else return "none";

            })
            .on('mouseover', d => {
                div
                    .transition()
                    .duration(50)
                    .style('opacity', 0.8);
                div
                    .html("Country: " + d.properties.admin)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on('mouseout', () => {
                div
                    .transition()
                    .duration(100)
                    .style('opacity', 0);
            });
    })
