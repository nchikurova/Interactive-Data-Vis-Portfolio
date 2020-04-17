import { Barchart } from "Barchart.js";
import { Scatter_plot } from "Scatter_plot.js"
import { Map } from "Map.js";

let barchart, scatter_plot, map;
//global state
let state = {
    data: [],
    domain: [],
    selectedCountry: null,
    selectedMetric: null,
};
d3.csv("../../data/ebola_3_1.csv", d3.autoType).then(data => {
    console.log("data", data);
    state.data = data;
    state.domain = [
        0,
        d3.max(data
            .map(d => [d["Guinea"], d["Liberia"], d["Sierra Leone"]])
            .flat()
        )]
    init();
});

function init() {
    barchart = new Barchart(state.setGlobalState);
    scatter_plot = new Scatter_plot(state.setGlobalState);
    map = new Map(state.setGlobalState);

    draw();
}

function draw() {
    barchart.draw(state);
    scatter_plot.draw(state.setGlobalState);
    map.draw(state.setGlobalState);
}

function setGlobalState(nextCountry) {
    state = { ...state, ...nextCountry };
    console.log("new country:", state);
    draw();
}