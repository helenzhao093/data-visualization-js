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

console.log(dataset)

function BarChart({data}) {
  const margin = {top: 20, right: 30, bottom: 20, left: 30};
  const width = (500 - margin.left - margin.right)
  const height = (400 - margin.top - margin.bottom);

  const allFruits = ["orange", "pear", "apple"]; 
  const [fruits, setFruits] = React.useState(allFruits);

  const xScale = d3.scaleBand()
    .domain(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept","Oct", "Nov", "Dec"])    
    .rangeRound([0, width])
    .padding(0.1)

  const xAxis = d3.axisBottom(xScale);
 
  const [maxFruit, setMaxFruit] = React.useState(20);
  const [yScale, setYScale] = React.useState(() => d3.scaleLinear()
                                                  .domain([0, maxFruit])
                                                  .rangeRound([0, height]));
  
  const [selectedValue, setValue] = React.useState("all")  
  const [isStacked, setIsStacked] = React.useState(true);                                            

  const selectionChanged = (e) => {
    let fruitSelection = e.target.value
    setValue(fruitSelection)
    if (fruitSelection == 'all') {
      setFruits(allFruits);
      setMaxFruit(20);
      setIsStacked(true);
    } else {
      setFruits([fruitSelection]);
      setMaxFruit(10);
      setIsStacked(false);
    }
  }               

  
  React.useEffect(() => {
    console.log('only onces')
    d3.select(".x-axis")
    .call(xAxis);
  }, [])

  React.useEffect(() => {
    setYScale(() =>  d3.scaleLinear()
      .domain([0, maxFruit])
      .rangeRound([0, height]));
    
    let yScaleDraw = d3.scaleLinear()
      .domain([0, maxFruit])
      .rangeRound([height, 0])
    let yAxis = d3.axisLeft(yScaleDraw);
    d3.select(".y-axis").call(yAxis)
  }, [maxFruit])

  return (
    <div>
        <FruitSelection selectedValue={selectedValue} handleChange={selectionChanged}/>
        <svg width={500} height={400}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            <g transform={`translate(0,${height})`} class="x-axis"/>
            <g class="y-axis"/>
            { data.map( data => 
              <Column isStacked={isStacked} data={data} xScale={xScale} yScale={yScale} 
                      maxFruit={maxFruit} fruits={fruits}/>
            )}
          </g>
        </svg>
    </div>
  )
}

const colorFunc = d3.scaleOrdinal()
  .domain(['orange', 'pear', 'apple'] )
  .range(["orange", "green", "red"])


function Column({isStacked, data, fruits, xScale, yScale, maxFruit}) {
  return (
    <g class={"column"}>
      { fruits.map(f => { return (
        <rect class={f} 
              x={xScale(data.month)} 
              width={xScale.bandwidth()} 
              y={(isStacked) ? 
                    yScale(maxFruit) - yScale(data[f][0].prevSum) - yScale(data[f][0].count) : 
                    yScale(maxFruit) - yScale(data[f][0].count) } 
              height={yScale(data[f][0].count)}
              fill={colorFunc(f)}/>
      )})}
    </g>
  )
}

function FruitSelection({selectedValue, handleChange}) {
  const options = ["all", "orange", "pear", "apple"]

  return (
    <select onChange={handleChange} value={selectedValue}
      style={{ display: 'flex', margin: '0 auto'}}>
      {
        options.map(o => { return (
          <option value={o}>{o}</option>
        )})
      }
    </select>
  )
}

ReactDOM.render(<BarChart data={dataset}/>, document.getElementById('root'));