d3.json("./assets/dataset.json").then(data=>{
    console.log(data);
    generateFig(data)
});

// global variables for dashboard area
const w = 1000;
const h = 500;
const padding = 50;

function generateFig(dataset) {

    const data = dataset.data

    // some divs to keep components in place
    const titleDiv = d3.select(".title")
    const figureDiv = d3.select(".chart")
    const selectionDiv = d3.select(".selection")


    // title
    const title = titleDiv
                  .append("svg")
                  .attr("id", "title")
                  .attr("class", "title")
                  .attr("fill", "red")
                  .attr("width", w)
                  .attr("height", h/5);

    title.append("text")
         .attr("x", 10)
         .attr("y", 50)
         .text(`Currently viewing: ${data.name}`);

    // main figure
    const figW = w*3/4;
    const figH = h*4/5;

    const fig = figureDiv
                  .append("svg")
                  .attr("width", figW)
                  .attr("height", figH);

    const xScale = d3.scaleTime()
                  .domain([d3.min(data.values, d => new Date(d.date)),
                           d3.max(data.values, d => new Date(d.date))
                         ])
                  .range([padding, figW - padding]);
 
    const yScale = d3.scaleLinear()
                  .domain([0, d3.max(data.values, d => d.value)])
                  .range([figH - padding, padding]);

    const bars = fig.append("g").selectAll("rect")
                    .data(data.values)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", d => xScale(new Date(d.date)))
                    .attr("y", d => yScale(d.value))
                    .attr("width", (figW - 2 * padding) / data.values.length)
                    .attr("height", d => figH - padding - yScale(d.value))
                    .on("mouseover", d => {
                        data.children.forEach(elem=>{
                            console.log(elem.values.filter(val => val.date==d.date)[0])
                        })
                        
                    });

    // selection pane
    paneW = w/4;
    paneH = h*4/5;
    
    function updatePanel(data){

        var selectItems = selectionDiv
                .selectAll("div")
                .data(data);

        selectItems.enter()
                .append("div")
                .merge(selectItems)
                .attr("class", "selection-node")
                .attr("data-children", d => d.children)
                .html(d => d.name);

        selectItems.exit().remove();
        

    }

    updatePanel(data.children);

    document.querySelectorAll(".selection-node").forEach(node => {
        node.addEventListener("click", e => updatePanel(e.target.dataset.children))
    })
}