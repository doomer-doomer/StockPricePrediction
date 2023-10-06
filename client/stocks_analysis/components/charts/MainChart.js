import React, { Component } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5stock from "@amcharts/amcharts5/stock";


let stockChart;

class MainChart extends Component {
    
    
  componentDidMount() {

    const { data, name,uniqueID, strokeWidth } = this.props;

    const processedData = data.map(item => ({
        ...item,
        Date: Date.parse(item.Date), 
      }));

    
    let root = am5.Root.new(`${uniqueID}`)

    root.setThemes([
        am5themes_Animated.new(root)
      ]);
      
      
      // Create a stock chart
      // -------------------------------------------------------------------------------
      // https://www.amcharts.com/docs/v5/charts/stock/#Instantiating_the_chart
      let stockChart = root.container.children.push(am5stock.StockChart.new(root, {
      }));
      
      
      // Set global number format
      // -------------------------------------------------------------------------------
      // https://www.amcharts.com/docs/v5/concepts/formatters/formatting-numbers/
      root.numberFormatter.set("numberFormat", "#,###.00");
      
      
      // Create a main stock panel (chart)
      // -------------------------------------------------------------------------------
      // https://www.amcharts.com/docs/v5/charts/stock/#Adding_panels
      let mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
        wheelY: "zoomX",
        panX: true,
        panY: true
      }));
      
      
      // Create value axis
      // -------------------------------------------------------------------------------
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      let valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          pan: "zoom"
        }),
        extraMin: 0.1, // adds some space for for main series
        tooltip: am5.Tooltip.new(root, {}),
        numberFormat: "#,###.00",
        extraTooltipPrecision: 2
      }));
      
      let dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
        baseInterval: {
          timeUnit: "day",
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
      }));
      
      
      // Add series
      // -------------------------------------------------------------------------------
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      let valueSeries = mainPanel.series.push(am5xy.CandlestickSeries.new(root, {
        
        clustered: false,
        valueXField: "Date",
        valueYField: "Close",
        highValueYField: "High",
        lowValueYField: "Low",
        openValueYField: "Open",
        calculateAggregates: true,
        xAxis: dateAxis,
        yAxis: valueAxis,
        // legendValueText: "open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]",
        legendRangeValueText: ""
      }));
      
      
      root.interfaceColors.set("grid",am5.color("#74ee15"))
      root.interfaceColors.set("text",am5.color("#74ee15"))

      stockChart.set("stockSeries", valueSeries);
      

      let valueLegend = mainPanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
        stockChart: stockChart
      }));
      
    
      let volumeAxisRenderer = am5xy.AxisRendererY.new(root, {
        inside: true
      });
      
      volumeAxisRenderer.labels.template.set("forceHidden", true);
      volumeAxisRenderer.grid.template.set("forceHidden", true);
      
      let volumeValueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
        numberFormat: "#.#a",
        height: am5.percent(20),
        y: am5.percent(100),
        centerY: am5.percent(100),
        renderer: volumeAxisRenderer
      }));
      
 
      let volumeSeries = mainPanel.series.push(am5xy.ColumnSeries.new(root, {
        name: "Volume",
        clustered: false,
        valueXField: "Date",
        valueYField: "Volume",
        xAxis: dateAxis,
        yAxis: volumeValueAxis,
        legendValueText: "[bold]{valueY.formatNumber('#,###.0a')}[/]"
      }));
      
      volumeSeries.columns.template.setAll({
        strokeOpacity: 0,
        fillOpacity: 0.5
      });
      
      // color columns by stock rules
      volumeSeries.columns.template.adapters.add("fill", function(fill, target) {
        let dataItem = target.dataItem;
        if (dataItem) {
          return stockChart.getVolumeColor(dataItem);
        }
        return fill;
      })
      
      
  
      stockChart.set("volumeSeries", volumeSeries);
      valueLegend.data.setAll([valueSeries, volumeSeries]);
      

      mainPanel.set("cursor", am5xy.XYCursor.new(root, {
        yAxis: valueAxis,
        xAxis: dateAxis,
        snapToSeries: [valueSeries],
        snapToSeriesBy: "y!"
      }));
      
      
  
      let seriesSwitcher = am5stock.SeriesTypeControl.new(root, {
        stockChart: stockChart
      });
      
      seriesSwitcher.events.on("selected", function(ev) {
        setSeriesType(ev.item.id);
      });
      
      function getNewSettings(series) {
        let newSettings = [];
        am5.array.each(["name", "valueYField", "highValueYField", "lowValueYField", "openValueYField", "calculateAggregates", "valueXField", "xAxis", "yAxis", "legendValueText", "stroke", "fill"], function(setting) {
          newSettings[setting] = series.get(setting);
        });
        return newSettings;
      }
      
      function setSeriesType(seriesType) {
        // Get current series and its settings
        let currentSeries = stockChart.get("stockSeries");
        let newSettings = getNewSettings(currentSeries);
      
        // Remove previous series
        let data = currentSeries.data.values;
        mainPanel.series.removeValue(currentSeries);
      
        // Create new series
        let series;
        switch (seriesType) {
          case "line":
            series = mainPanel.series.push(am5xy.LineSeries.new(root, newSettings));
            break;
          case "candlestick":
          case "procandlestick":
            newSettings.clustered = false;
            series = mainPanel.series.push(am5xy.CandlestickSeries.new(root, newSettings));
            if (seriesType == "procandlestick") {
              series.columns.template.get("themeTags").push("pro");
            }
            break;
          case "ohlc":
            newSettings.clustered = false;
            series = mainPanel.series.push(am5xy.OHLCSeries.new(root, newSettings));
            break;
        }
      
        // Set new series as stockSeries
        if (series) {
          valueLegend.data.removeValue(currentSeries);
          series.data.setAll(data);
          stockChart.set("stockSeries", series);
          let cursor = mainPanel.get("cursor");
          if (cursor) {
            cursor.set("snapToSeries", [series]);
          }
          valueLegend.data.insertIndex(0, series);
        }
      }
      
    
      let toolbar = am5stock.StockToolbar.new(root, {
        container: document.getElementById("chartcontrols"),
        stockChart: stockChart,
        controls: [
          am5stock.IndicatorControl.new(root, {
            stockChart: stockChart,
            legend: valueLegend
          }),
        
          am5stock.PeriodSelector.new(root, {
            stockChart: stockChart
          }),
          seriesSwitcher,
          am5stock.DrawingControl.new(root, {
            stockChart: stockChart
          }),
         
          am5stock.SettingsControl.new(root, {
            stockChart: stockChart
          })
        ]
      })
      

valueSeries.data.setAll(processedData);
volumeSeries.data.setAll(processedData);

  }

  componentWillUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  }

  render() {
    const {isDark, height,uniqueID} = this.props
    return (
        <div style={{position:'relative'}}>
<div style={{display:"flex",justifyContent:'end'}} id="chartcontrols" ></div>
      <div id={uniqueID} style={{ width: "100%", height: height, color: isDark ? "#FFFFFF" : "black"}}></div>
        </div>
        
    );
  }
}

export default MainChart;