const lighting = () =>  Math.floor(Math.random() * 255)

const generateRandomColor = () => `rgb(${lighting()}, ${lighting()}, ${lighting()})`

const countDistance = (a,b) => Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2)

let ALPHA = 0
const interpolation = (a, b) => {
    //interpolation a->b
    return b*ALPHA+a*(1-ALPHA)
    }

const canvas = document.querySelector('canvas');
 
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const c = canvas.getContext('2d')
c.font = "40px Arial";

const degree = Math.PI/180,
percent = 3.6 * degree,
axis = {x:300, y:300}, 
radius = 150,
percentages = [35,15,20,10,15,5],
chartItems = []


let text='',
    mouse={x:0, y:0}

const getChartItems = () => {
    percentages.forEach((percent, index)=> {
        const charItemStart = chartItems[index-1] ? chartItems[index-1].end : 0 
        chartItems.push({
            start: charItemStart,
            end: charItemStart + percent,
            x:axis.x+Math.random() * 400,
            y:axis.y+Math.random() * 400,
            color: generateRandomColor()
        })
    })

    return chartItems
}

const drawChart = () => {
    requestAnimationFrame(drawChart)
    c.clearRect(0,0,innerWidth, innerHeight)

    chartItems.forEach(chartItem => {
        const x = interpolation(chartItem.x, axis.x)
        const y = interpolation(chartItem.y, axis.y)

        c.beginPath()
        c.arc(x, y, radius, chartItem.start*percent, chartItem.end*percent)
        c.fillStyle = chartItem.color
        c.lineTo(x, y)
        c.fill()
    })
    
    c.fillStyle = 'white'
    c.fillText(text, mouse.x, mouse.y);
    c.strokeText(text, mouse.x, mouse.y);

    if(ALPHA < 1){
        ALPHA = Math.min(ALPHA+0.03, 1)
    }
}

const createChart = () => {
    const percentagesCount = percentages.reduce(
        (previousValue, currentValue) => previousValue + currentValue);
        
    if(percentagesCount!=100){
        console.log('percentages count must be equal 100')
        return
    }

    getChartItems() 
    drawChart()
}

createChart() 

canvas.addEventListener('mousemove', (e)=>{
    mouse.x = e.clientX
    mouse.y = e.clientY
    
    const distanceMouseFromAxis = countDistance(axis, mouse)
    
    if(distanceMouseFromAxis<radius){
    let angle = (Math.atan2( e.clientY - axis.y, e.clientX - axis.x) * 180 / Math.PI )
    if(angle<0){
        angle = 360+angle
    }

    chartItems.forEach((chartItem)=>{
        if(angle/3.6>chartItem.start && angle/3.6<chartItem.end){
            text = chartItem.end-chartItem.start
        }
    })
    }else{
        text = ''
    }
})