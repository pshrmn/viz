import d3 from "d3";
import { planets } from "./planetData";
import { debounce } from "./helpers";

let labelWidth = 200;
let radius = Math.min(window.innerHeight, window.innerWidth - labelWidth) / 2;
let height = radius * 2;
let width = radius * 2 + labelWidth;

const distancePerPixel = (radius-25) / planets.reduce((max, curr) => {
  return max > curr.distance ? max : curr.distance;  
}, -Infinity);

planets.forEach((p, i) => {
  // normalize the distance to the size of the svg
  p.normDistance = p.distance * distancePerPixel;
  p.orbits = 0;
});

function distanceOffset(d, i) {
  return d.normDistance;
}

let offset = (radius-25)/planets.length;
function positionOffset(d, i) {
  return 25 + i*offset;
}

let offsetFunction = positionOffset;

// create the SVG
const svg = d3.select("#solar-system")
  .append("svg")
    .attr("width", width)
    .attr("height", height);
const solarSystem = svg
  .append("g")
    .attr("transform", `translate(${radius},${radius})`);

// create the arcs which depict the orbital path of the planets
const arcs = solarSystem.append("g")
    .classed({"arcs": true})
  .selectAll("circle.arc")
    .data(planets)
  .enter().append("circle")
    .classed({"arc": true})
    .attr("r", offsetFunction);

// create the labels
let labelSize = radius / planets.length;
const labels = solarSystem.append("g")
    .classed({"labels": true})
  .selectAll("g.label")
    .data(planets)
  .enter().append("g")
    .classed({"label": true})
    .attr("transform", (d, i) => {
      const y = i*labelSize;
      return `translate(${radius}, -${y})`
    });

const labelMarkers = labels.append("path")
  .attr("d", (d,i) => {
    const y = i*labelSize;
    const diff = y - offsetFunction(d,i);
    return `M 0,0 L -20,${diff} L ${-radius},${diff}`;
  });

const descriptions = labels.append("text")
  .attr("dy", 5)
  .text(d => `${d.name} - ${d.orbits}`);

// create the planets
const planetCircles = solarSystem.append("g")
    .classed({"planets": true})
  .selectAll("circle.planet")
    .data(planets);

planetCircles.enter().append("circle")
  .classed({"planet": true})
  .attr("r", 3)
  .attr("transform", (d, i) => `translate(0, -${offsetFunction(d,i)})`)


const sun = solarSystem.append("circle")
  .classed({"sun": true})
  .attr("r", 5);

// the animation callback
let start = null;
let period = 3650;
function step(timestamp) {
  if ( start === null ) {
    start = timestamp;
  }
  const diff = timestamp - start;

  planetCircles
    .attr("transform", (d, i) => {
      const rotate = (360 * (diff / (period * d.period))) % 360;
      return `rotate(${-rotate})translate(0, -${offsetFunction(d,i)})`
    })
    .each((d,i) => {
      d.orbits = Math.floor(diff / (period*d.period));
    });

  descriptions.text(d => `${d.name} - ${d.orbits}`);

  window.requestAnimationFrame(step);
}

const resize = debounce(function() {
  // calculate the new dimensions of the SVG
  radius = Math.min(window.innerHeight, window.innerWidth - labelWidth) / 2;
  height = radius * 2;
  width = radius * 2 + labelWidth
  offset = (radius-25)/planets.length;
  labelSize = radius / planets.length;

  // resize the SVG
  svg
    .attr("width", width)
    .attr("height", height);
  solarSystem
    .attr("transform", `translate(${radius},${radius})`);

  // recalculate the normalized distance for each planet (translation will
  // be handled in the step function)
  const distancePerPixel = (radius-25) / planets.reduce((max, curr) => {
    return max > curr.distance ? max : curr.distance;  
  }, -Infinity);
  planets.forEach((p, i) => {
    // normalize the distance to the size of the svg
    p.normDistance = p.distance * distancePerPixel;
  });

  // resize the arcs
  arcs.attr("r", offsetFunction);

  // translate the labels
  labels
    .attr("transform", (d, i) => {
      const y = i*labelSize;
      return `translate(${radius}, -${y})`
    });
  labelMarkers
    .attr("d", (d,i) => {
      const y = i*labelSize;
      const diff = y - offsetFunction(d,i);
      return `M 0,0 L -20,${diff} L ${-radius},${diff}`;
    });
}, 250);

window.requestAnimationFrame(step);
window.onresize = resize;