import d3_selection from "d3-selection";
import { planets } from "./planetData";
import { debounce } from "./helpers";

function bestRadius() {
  return Math.max(
    100, 
    Math.min(window.innerHeight-50, window.innerWidth - labelWidth, 800) / 2
  );
}

function distancePerPixel(planets, radius) {
  return radius / planets.reduce((max, curr) => {
    return max > curr.distance ? max : curr.distance;  
  }, -Infinity);  
}

let labelWidth = 200;
let radius = bestRadius();
let height = radius * 2;
let width = radius * 2 + labelWidth;

let pixelLength = distancePerPixel(planets, radius-25);
planets.forEach((p, i) => {
  // normalize the distance to the size of the svg
  p.normDistance = p.distance * pixelLength;
  p.orbits = 0;
});

// control variable
let offset = (radius-25)/planets.length;
const planetOffsets = [
  {
    label: "By Distance",
    fn: (d,i) => d.normDistance
  },
  {
    label: "By Position",
    fn: (d,i) => 25 + i*offset
  },
];
// default to drawing by distance from the sun
let offsetFunction = planetOffsets[0].fn;
let showLines = true;


const solarSystem = d3_selection.select("#solar-system");

const controls = solarSystem.append("div")
  .classed("controls", true);
const offsetControl = controls.append("div")
  .selectAll("label")
    .data(planetOffsets)
  .enter().append("label")
    .text(d => d.label)
    .append("input")
      .attr("type", "radio")
      .attr("name", "offset")
      .property("checked", (d,i) => i === 0)
      .on("change", (d,i) => {
        offsetFunction = d.fn;
        redraw(radius, planets);
      });

const toggleLines = controls.append("div")
  .append("label")
    .text("Show Orbit Lines")
    .append("input")
    .attr("type", "checkbox")
    .property("checked", showLines)
    .on("change", (d,i) => {
      showLines = !showLines;
      arcs.classed("hidden", !showLines);
      labelMarkers.classed("hidden", !showLines);
    });

// create the SVG
const svg = solarSystem
  .append("svg")
    .attr("width", width)
    .attr("height", height);
const g = svg
  .append("g")
    .attr("transform", `translate(${radius},${radius})`);

// create the arcs which depict the orbital path of the planets
const arcs = g.append("g")
    .classed("arcs", true)
  .selectAll("circle.arc")
    .data(planets)
  .enter().append("circle")
    .classed("arc", true)
    .attr("r", offsetFunction);

// create the labels
let labelSize = radius / planets.length;
const labels = g.append("g")
    .classed("labels", true)
  .selectAll("g.label")
    .data(planets)
  .enter().append("g")
    .classed("label", true)
    .attr("transform", (d, i) => {
      const y = i*labelSize;
      return `translate(${radius}, ${-y})`
    });

// lines connecting the orbital arcs to the labels
const labelMarkers = labels.append("path")
  .attr("d", (d,i) => {
    const y = i*labelSize;
    const diff = y - offsetFunction(d,i);
    return `M 0,0 L -20,${diff} L ${-radius},${diff}`;
  });

const descriptions = labels.append("text")
  .attr("dy", 5)
  .text(d => `${d.name} ${d.orbits}`);

// the starting line
const meridian = g.append("line")
  .classed("meridian", true)
  .attr("x1", 0)
  .attr("x2", 0)
  .attr("y1", 0)
  .attr("y2", -radius);

const sun = g.append("circle")
  .classed("sun", true)
  .attr("r", 4);

// create the planets
const planetCircles = g.append("g")
    .classed("planets", true)
  .selectAll("circle.planet")
    .data(planets)
  .enter().append("circle")
  .classed("planet", true)
  .attr("r", 3)
  .attr("transform", (d, i) => `translate(0, ${-offsetFunction(d,i)})`)

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
      return `rotate(${-rotate})translate(0, ${-offsetFunction(d,i)})`
    })
    .each((d,i) => {
      d.orbits = Math.floor(diff / (period*d.period));
    });

  descriptions.text(d => `${d.name} ${d.orbits}`);

  window.requestAnimationFrame(step);
}

function redraw(radius, planets) {
  height = radius * 2;
  width = radius * 2 + labelWidth
  offset = (radius-25)/planets.length;
  labelSize = radius / planets.length;

  // resize the SVG
  svg
    .attr("width", width)
    .attr("height", height);
  g.attr("transform", `translate(${radius},${radius})`);

  // recalculate the normalized distance for each planet (translation will
  // be handled in the step function)
  let pixelLength = distancePerPixel(planets, radius-25)
  planets.forEach((p, i) => {
    p.normDistance = p.distance * pixelLength;
  });

  // change radius of planets based on radius of svg
  const planetRadius = radius > 500 ? 3 : 2;
  planetCircles.attr("r", planetRadius);
  sun.attr("r", radius > 500 ? 4 : 2)

  // resize the arcs
  arcs.attr("r", offsetFunction);

  // translate the labels
  labels.attr("transform", (d, i) => {
    return `translate(${radius}, ${-i*labelSize})`
  });
  labelMarkers.attr("d", (d,i) => {
    const y = i*labelSize;
    const diff = y - offsetFunction(d,i);
    return `M 0,0 L -20,${diff} L ${-radius},${diff}`;
  });
  meridian.attr("y2", -radius);
}

// calculate the new dimensions of the SVG then redraw
const resize = debounce(function() {
  radius = bestRadius();
  redraw(radius, planets);
}, 250);

window.requestAnimationFrame(step);
window.onresize = resize;
