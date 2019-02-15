var req = new XMLHttpRequest();
const sourceURL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

req.open("GET", sourceURL, true);
req.send();

req.onload = () => {
  document.getElementById("bgm").play();
  json = JSON.parse(req.responseText);
  generateFig(json);
};

const w = 800;
const h = 400;
const padding = 40;

// Title

const title = d3.select("body")
                .append("svg")                
                .attr("id", "title")
                .attr("class", "title")
                .attr("width", w)
                .attr("height", 100);

title.append("text")
    .attr("x", 120)
    .attr("y", 50)
    .text("UNITED STATES GDP")

title.append("text")
    .attr("x", 300)
    .attr("y", 90)
    .text("1946-2015")
    .attr("font-size", 30)

// SVG element for main figure

const svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h + 50);


// Stars and stripes
 
var n = 9;
var bgcolor = ['#666666', '#888888'];
  
const bg = svg.append("g");
while(n--){  
  bg.append("rect")
     .attr("x", padding)
     .attr("y", padding + n * (h - 2 * padding) / 9)
     .attr("width", w - 2 * padding)
     .attr("height", (h - 2 * padding) / 9 + 1)
     .attr("fill", bgcolor[n % 2])
}
   
bg.append("rect")
   .attr("x", padding)
   .attr("y", padding)
   .attr("width", (w - 2 * padding) / 3)
   .attr("height", 4 * (h - 2 * padding) / 9)
   .attr("fill", '#999999')

function starX(j){
  if (j % 11 < 6) {
    return ((j % 11) % 6) * 40;
  }
  else{
    return 20 + ((j % 11) - 6) % 5 * 40;
  };
}  
function starY(j){
  if (j % 11 < 6) {
    return Math.floor(j / 11)*26;
  }
  else {
    return 13 + Math.floor(j / 11)*26
  };
}  
  
var j = 50;
while(j--){
  bg.append("polygon")
    .attr("points", "100,10 40,198 190,78 10,78 160,198")
    .attr("transform", "translate(" + (padding + 10 + starX(j)) + ", " + (padding + 10 + starY(j)) + ") " + "scale(0.08)")
    .attr("fill", "yellow");
}

// Figure generation function

generateFig = (json) => {
  
const tooltip = d3.select("body")
                  .append("div")
                  .attr("id","tooltip")
                  .attr("opacity",0);
  
const dataset = Object.keys(json.data).map(i => json.data[i]);
  
const xScale = d3.scaleTime()
                 .domain([d3.min(dataset, row => new Date(row[0])),
                          d3.max(dataset, row => new Date(row[0]))
                        ])
                 .range([padding, w - padding]);

const yScale = d3.scaleLinear()
                 .domain([0, d3.max(dataset, row => row[1])])
                 .range([h - padding, padding]);
  
// main figure bars

svg.append("g")
  .selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("data-date", d => d[0])
  .attr("data-gdp", d => d[1])
  .attr("x", d => xScale(new Date(d[0])))
  .attr("y", d => yScale(d[1]))
  .attr("width", (w - 2 * padding) / dataset.length)
  .attr("height", d => h - padding - yScale(d[1]))

  // Tooltip interaction

  .on('mouseover', d => {
      tooltip.transition()
             .duration(10)
             .style("top", (yScale(d[1]) - 30) + "px")
             .style("left", (d3.event.pageX - 30) + "px")
             .style("opacity", 0.9);
      tooltip.attr("data-date", d[0])
             .html(() => {var date = new Date(d[0]);
                var q = Math.floor(date.getMonth() / 3) + 1;
                return 'Q' + q + ' ' + date.getFullYear() + '<br>' + '$' + d[1].toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion';
                })
             ;
   })
  .on('mouseout', d => {
      tooltip.transition()
             .duration(40)
             .style("opacity", 0)
  });

// Axes

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.format(".2s"));

svg.append("g")
   .attr("id", "x-axis")
   .attr("class", "axes")
   .attr("transform", "translate(0," + (h - padding) + ")" )
   .call(xAxis);
  
svg.append("g")
   .attr("id","y-axis")
   .attr("class", "axes")
   .attr("transform", "translate(" + padding + ", 0)" )
   .call(yAxis);  
  
svg.append("text")
   .attr("id", "x-label")
   .attr("class", "axes-label")
   .attr("transform", "translate(" + (w / 2 - padding) + "," + (h - padding + 50) + ")" )
   .text("Year");

svg.append("text")
   .attr("id", "y-label")
   .attr("class", "axes-label")
   .attr("transform", "translate(0, " + (padding - 10) + ")" )
   .text("Billion USD");
}