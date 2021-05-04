am4core.useTheme(am4themes_animated);

var chart = am4core.create("chartdiv", am4maps.MapChart);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
//console.log(data["Countries"][0]);
chart.geodata = am4geodata_worldLow;
chart.projection = new am4maps.projections.NaturalEarth1();
chart.panBehavior = "rotateLong";
chart.padding(10, 10, 10, 10);

chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#eeeeee");
chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;


var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

polygonSeries.useGeodata = true;

fetch('https://api.covid19api.com/summary').then(function (response) {
  return response.json();
}).then(function (data) {

  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.nonScalingStroke = true;
  polygonTemplate.tooltipHTML = `<center style="color: #4f9c48"><strong>{name}</strong></center>
  <hr />
  <table>
  <tr>
    <th align="left">New Confirmed: </th>
    <td>{newConfirmed}</td>
  </tr>
  <tr>
    <th align="left">New Deaths: </th>
    <td>{newDeaths}</td>
  </tr>
  <tr>
    <th align="left">New Recovered: </th>
    <td>{newRecovered}</td>
  </tr>
  </table>
  <hr />
  <table>
  <tr>
    <th align="left">Total Confirmed: </th>
    <td>{value}</td>
  </tr>
  <tr>
    <th align="left">Total Deaths: </th>
    <td>{totalDeaths}</td>
  </tr>
  <tr>
    <th align="left">Total Recovered: </th>
    <td>{totalRecovered}</td>
  </tr>
  </table>
  `;



  polygonSeries.tooltip.getFillFromObject = false;
  // polygonSeries.tooltip.pointerOrientation = "up";
  polygonSeries.tooltip.background.fill = am4core.color("#fff");
  polygonSeries.tooltip.label.fill = am4core.color("#000");
  polygonSeries.tooltip.background.cornerRadius = 10;
  polygonSeries.tooltip.label.wrap = true;
  polygonSeries.tooltip.background.fillOpacity = 0.9;
  //polygonSeries.tooltip.label.width = 220;
  //imageSeries2.tooltip.pointerOrientation = "vertical";
  //polygonSeries.tooltip.label.padding(0, 0, 0, 0);
  //polygonSeries.tooltip.label.margin(0, 0, 0, 0);
  polygonSeries.tooltip.background.stroke = am4core.color("#000");//4f6e8e");
  polygonSeries.tooltip.background.strokeWidth = 1.5;
  //polygonSeries.tooltip.keepTargetHover = true;

  polygonTemplate.propertyFields.fill = "fill";
  polygonTemplate.propertyFields.fillOpacity = 1;


  var graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
  graticuleSeries.fitExtent = false;
  graticuleSeries.mapLines.template.strokeOpacity = 0.3;
  graticuleSeries.mapLines.template.stroke = am4core.color("#000");


  var legend = new am4maps.Legend();
  legend.parent = chart.chartContainer;
  // legend.background.fill = am4core.color("#000");
  // legend.background.fillOpacity = 0.05;
  legend.width = 150;
  legend.height = 230;
  legend.fontSize = 10;
  legend.align = "left";
  legend.valign = "bottom";
  legend.padding(10, 5, 0, 0);
  legend.margin(0, 5, 0, 0);

  legend.data = [{
    "name": "0 : 100",
    "fill": "#c6e6c3"
  }, {
    "name": "100 : 1000",
    "fill": "#9fd89a"
  }, {
    "name": "1000 : 10,000",
    "fill": "#4f9c48"
  },
  {
    "name": "10,000 : 100,000",
    "fill": "#297322"
  }, {
    "name": "100,000 : 1000,000",
    "fill": "#124e0c"
  }, {
    "name": "more than 1m",
    "fill": "#093804"
  }
  ];
  legend.itemContainers.template.clickable = false;
  legend.itemContainers.template.focusable = false;

  // var legendTitle = legend.createChild(am4core.Label);
  // legendTitle.text = "[bold]Total Confirmed:";

  chart.zoomControl = new am4maps.ZoomControl();
  chart.zoomControl.valign = "top";
  var x = [];


  function getColorScale(total) {
    if (total <= 100) {
      return "#c6e6c3";
    } else if (total > 100 && total <= 1000) {
      return "#9fd89a";
    }
    else if (total > 1000 && total <= 10000) {
      return "#4f9c48";
    }
    else if (total > 10000 && total <= 100000) {
      return "#297322";
    }
    else if (total > 100000 && total <= 1000000) {
      return "#124e0c";
    }
    else {
      return "#093804";
    }
  }


  for (let i = 0; i < data['Countries'].length; i++) {
    x.push({
      id: data['Countries'][i]['CountryCode'],
      value: data['Countries'][i]['TotalConfirmed'],
      fill: getColorScale(data['Countries'][i]['TotalConfirmed']),
      totalDeaths: data['Countries'][i]['TotalDeaths'],
      totalRecovered: data['Countries'][i]['TotalRecovered'],
      newConfirmed: data['Countries'][i]['NewConfirmed'],
      newRecovered: data['Countries'][i]['NewRecovered'],
      newDeaths: data['Countries'][i]['NewDeaths'],
    });
  }

  polygonSeries.data = x;

  // excludes Antarctica
  polygonSeries.exclude = ["AQ"];

})