google.load('visualization', '1', {'packages': ['geochart']});
//google.setOnLoadCallback(drawRegionsMap);

var chart, options;

function drawRegionsMap(data) {

document.getElementById('chart_div').innerHTML = '';


data=JSON.parse(data);
var table = [];
table.push(['Country', 'Happiness Index']);
for(i=0; i<data.length; i++){
  var jData = JSON.parse(data[i]);
  table.push([jData.Country, jData.Score]);
}
var data=google.visualization.arrayToDataTable(table);

  options = {colorAxis:{minValue: 0,  colors: ['FF0000', '#00FF00']},height:'550'};

  chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
  chart.draw(data, options);
};