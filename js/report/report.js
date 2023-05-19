function getReport(){
    fetch('http://127.0.0.1:5000/report/')
    .then(response => response.json())
    .then(report => {
        loadInformation(report);
    });
}

function displayChart(title, id, options={}){
    const ctx = document.getElementById(id);
    new Chart(ctx, {
        type: options?.type,
        data: {
        labels: options?.labels,
        datasets: [{
            label: title,
            data: options?.values,
            borderWidth: 1,
            backgroundColor: options?.backgroundColor,
            borderColor: options?.borderColor,
        }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getDataOrderReport(orderReport){
    let labels = []
    let values = []
    for(let i=0; i<orderReport.length; i++){
        const orderItem = orderReport[i]
        labels.push(orderItem.month)
        values.push(orderItem.revenue)
    }
    return {labels, values}
}

function getDataIngredientsReport(ingredientReport){
    let labels = []
    let values = []
    for(let i=0; i<ingredientReport.length; i++){
        const ingredient = ingredientReport[i]
        console.log(ingredient)
        labels.push(ingredient.ingredient.name)
        values.push(ingredient.ingredient_count)
    }
    return {labels, values}
}


function displayCustomerTable(customerReport, id, idAppend){
    let template = $(id).html();
    const renderedTemplate = Mustache.render(template, {customers: customerReport});
    $(idAppend).append(renderedTemplate);
}

function loadInformation(report){
    const {labels: ingredientLabels, values: ingredientValues} = getDataIngredientsReport(report.ingredient_report)
    const ingredientChartOptions = {
        type: 'bar',
        labels: ingredientLabels,
        values: ingredientValues,
        backgroundColor: ['rgb(255, 99, 132, 0.2)']
    }
    const {labels: orderLabels, values: orderValues} = getDataOrderReport(report.order_report)
    const orderChartOptions = {
        type: 'line',
        labels: orderLabels,
        values: orderValues,
        backgroundColor: ['rgb(54, 162, 235)'],
        borderColor: ['rgb(54, 162, 235)']
    }
    displayChart('The most required ingredients', 'ingredient-report-chart',ingredientChartOptions)
    displayChart('Revenue vs Month', 'order-report-chart', orderChartOptions)
    displayCustomerTable(report.customer_report, '#customer-item-template','#customer-item')
}


window.onload = getReport;