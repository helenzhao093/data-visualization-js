var dataset = [
    { month: "Jan", orange: 7, pear: 5, apple: 1 },
    { month: "Feb", orange: 8, pear: 2, apple: 9 },
    { month: "Mar", orange: 5, pear: 8, apple: 2 },
    { month: "Apr", orange: 10, pear: 1, apple: 7 },
    { month: "May", orange: 3, pear: 8, apple: 9 },
    { month: "Jun", orange: 0, pear: 6, apple: 8 },
    { month: "July", orange: 7, pear: 5, apple: 1 },
    { month: "Aug", orange: 8, pear: 2, apple: 9 },
    { month: "Sept", orange: 5, pear: 8, apple: 2 },
    { month: "Oct", orange: 10, pear: 1, apple: 7 },
    { month: "Nov", orange: 3, pear: 8, apple: 9 },
    { month: "Dec", orange: 0, pear: 6, apple: 8 },
  ]

let fruits = ["orange", "pear", "apple"]

dataset.forEach(d => {
    fruits.forEach((f,i) => {
        let entry = {month: d.month, count: d[f], prevSum:0 }
        if (i > 0) {
            entry.prevSum += d[fruits[i-1]][0].count + d[fruits[i-1]][0].prevSum
        }
        d[f] = [entry]
    })
})

var margin = {top: 20, right: 15, bottom: 35, left: 15};

var width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var totalWidth = 500;
var totalHeight = 400;


  var svg = d3.select("body")
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var xScale = d3.scaleBand()
    .domain(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept","Oct", "Nov", "Dec"])    
    .rangeRound([0, width])
    .padding(0.1)

var maxFruit = 20
var yScale = d3.scaleLinear()
        .domain([0, maxFruit])
        .rangeRound([0, height])

console.log(xScale("2007"))
console.log(yScale(1))

var groups = svg.selectAll("g.cost")
  .data(dataset)
  .enter().append("g")
  .attr("class", "cost")

let selections = ["rect.orange"]

var colorFunc = d3.scaleOrdinal()
        .domain(['orange', 'pear', 'apple'] )
        .range(["orange", "green", "red"])

fruits.forEach(fruit => {
    groups.selectAll("rect." + fruit)
    .data(function(d) { return d[fruit]; })
    .enter()
    .append("rect")
    .attr("x", function(d) { console.log(d); return xScale(d.month); })
    .attr("y", function(d) { console.log(yScale(d.count)); return yScale(maxFruit) - yScale(d.prevSum) - yScale(d.count); })
    .attr("height", function(d) { return yScale(d.count); })
    .attr("width", xScale.bandwidth())
    .attr("fill", colorFunc(fruit))
    .attr("class", fruit);
})
var yScaleDraw = d3.scaleLinear()
  .domain([0, maxFruit])
  .rangeRound([height, 0])
var yAxis = d3.axisLeft(yScaleDraw);
var xAxis = d3.axisBottom(xScale);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);