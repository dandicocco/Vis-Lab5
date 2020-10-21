let coffeeData;

d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{ 

    coffeeData = data;
    coffeeData.sort((a, b) => b.stores - a.stores);     //sort data desc. by population so smaller countries circles go on top

    console.log('data', coffeeData);
    
    //construct svg element
    const margin = ({top: 40, right: 40, bottom: 40, left: 40});

    const w = 650 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom;

  const svg = d3.select(".chart")
                    .append("svg")
                    .attr("width", w + margin.left + margin.right)
                    .attr("height", h + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const xScale = d3.scaleBand()
                        .domain(coffeeData.map(d=>d.company))
                        .rangeRound([0, w])
                        .paddingInner(0.1);

    let coffeeDomain = d3.extent(coffeeData, function(d) {
                                            return d.stores;
    });

    const yScale = d3.scaleLinear()
                        .domain([0,coffeeDomain[1]])
                        .range([h, 0]);  //reversed because of SVG

    // create axes
    const xAxis = d3.axisBottom()
                    .scale(xScale)

    const yAxis = d3.axisLeft()
                    .scale(yScale)

    // Draw the axes
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${h})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis y-axis")
 //       .attr("transform", `translate(0, ${h+margin.top/2})`)
        .call(yAxis);





    //create datapoints
    svg.selectAll("circle")
        .data(coffeeData)
        .enter()
        .append("circle")
        .attr('cx', function(d){
            return xScale(d.Income);
        })
        .attr('cy', function(d){
            return yScale(d.LifeExpectancy);
        })
        .attr('r', function(d){
            return aScale(d.Population);
        })
        .attr("stroke-width", 0.5)
        .attr("stroke", "black")
        .attr("fill", function(d){
            return legendColors(d.Region);
        })
        .attr("fill-opacity", 0.6)
        .on("mouseenter", (event, d) => {
            // show the tooltip
            const pos = d3.pointer(event, window);

            

            d3.select("#tooltip")
                .style("left", pos[0]-50+"px")
                .style("top", pos[1]-20+"px")
               // .select("#value")
                .html("<p>Country: " + d.Country + "<br/>" +
                    "Region: " + d.Region + "<br/>" +
                    "Population: " + d3.format("(,.3r")(d.Population) + "<br/>" +
                    "Income: " + d3.format("($,.0f")(d.Income) + "<br/>" +
                    "Life Expectancy: " + d.LifeExpectancy + "</p>"
                )

            d3.select("#tooltip").classed("hidden", false);
            

        })
        .on("mouseleave", (event, d) => {
            // hide the tooltip
            d3.select("#tooltip").classed("hidden", true);
        });


    //axes labels
    svg.append("text")
        .attr("class", "axis")
		.attr('x', 500)
        .attr('y', h-5)
		// add attrs such as alignment-baseline and text-anchor as necessary
        .text("Income");
        
    svg.append("text")
        .attr("class", "axis")
		.attr('x', 10)
        .attr('y', 0)
        .attr("writing-mode", "vertical-lr")
		// add attrs such as alignment-baseline and text-anchor as necessary
		.text("Life Expectancy")
        

})

