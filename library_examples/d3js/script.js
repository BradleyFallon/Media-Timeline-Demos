const margin = {top: 0, right: 20, bottom: 60, left: 20}
const width = 600 - margin.left - margin.right;
const height = 160 - margin.top - margin.bottom;

// origin (and moment of origin)
const origin = new Date(2021, 02, 01)
const originMoment = moment(origin);

// zoom function 
const zoom = d3.zoom()
  .on("zoom", () => {
    svg.select(".x-axis")
      .call(customizedXTicks, d3.event.transform.rescaleX(xScale2));
    svg.select(".x-axis2")
      .call(d3.axisBottom(d3.event.transform.rescaleX(xScale2)));
  })
  .scaleExtent([-Infinity, Infinity]); 

// x scale
// use arbitrary end point a few days away
const xScale = d3.scaleTime()
  .domain([origin, new Date(2021, 02, 11)])
  .range([0, width]);

// x scale copy for zoom rescaling
const xScale2 = xScale.copy();

// fixed scale for days, months, quarters etc
// domain is in days i.e. 86400000 milliseconds
const intervalScale = d3.scaleThreshold()
  .domain([0.03, 1, 7, 28, 90, 365, Infinity])
  .range(["minute", "hour", "day", "week", "month", "quarter", "year"]);

// svg
const svg = d3.select("#scale")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .call(zoom) 
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// clippath 
svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("x", 0)
  .attr("width", width)
  .attr("height", height);
    
// render x-axis
svg.append("g")
  .attr("class", "x-axis")
  .attr("clip-path", "url(#clip)") 
  .attr("transform", `translate(0,${height / 4})`)
  .call(customizedXTicks, xScale); 

// render x-axis
svg.append("g")
  .attr("class", "x-axis2")
  .attr("clip-path", "url(#clip)") 
  .attr("transform", `translate(0,${height - 10})`)
  .call(d3.axisBottom(xScale)); 
  
function customizedXTicks(selection, scale) {
  // get interval d3 has decided on by comparing 2nd and 3rd ticks
  const t1 = new Date(scale.ticks()[1]);
  const t2 = new Date(scale.ticks()[2]);
  // get interval as days
  const interval = (t2 - t1) /  86400000;
  // get interval scale to decide if minutes, days, hours, etc
  const intervalType = intervalScale(interval);
  // get new labels for axis
  newTicks = scale.ticks().map(t => `${diffEx(t, origin, intervalType)} ${intervalType}s`);
  // update axis - d3 will apply tick values based on dates
  selection.call(d3.axisBottom(scale));
  // now override the d3 default tick values with the new labels based on interval type
  d3.selectAll(".x-axis .tick > text").each(function(t, i) {
    d3.select(this)
      .text(newTicks[i])
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");
  });
  
  function diffEx(from, to, type) {
    let t = moment(from).diff(moment(to), type, true);
    return Number.isInteger(t) ? t : parseFloat(t).toFixed(1);
  }
}