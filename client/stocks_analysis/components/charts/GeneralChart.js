import React, { Component } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5stock from "@amcharts/amcharts5/stock";


let stockChart;

class GeneralChart extends Component {
    
    
  componentDidMount() {

    const { data, name,uniqueID, strokeWidth } = this.props;

    const processedData = data.map(item => ({
        ...item,
        Date: Date.parse(item.Date), 
      }));

    
        let root = am5.Root.new(`${uniqueID}`);

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    stockChart = root.container.children.push(am5stock.StockChart.new(root, {
    }));

    let mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
        wheelY: "zoomX",
        panX: true,
        panY: true
      }));

      let valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      }));
      
      let dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
        baseInterval: {
          timeUnit: "day",
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {})
      }));

      let valueSeries = mainPanel.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: name,
        valueXField: "Date",
        valueYField:"Close",
        openValueYField:"Open",
        lowValueYField : "Low",
        highValueYField: "High",
        xAxis: dateAxis,
        yAxis: valueAxis,
        showCandles:true,
        calculateAggregates: true,
        stroke: "#74ee15",

    
        legendValueText: "Open: {openValueY}\nLow: {lowValueY}\nHigh: {highValueY}\nClose: {valueY}",
        //tooltipText:"Open: {openValueYField}\nLow: {lowValueY}\nHigh: {highValueY}\nClose: {valueY}"
      }));
    
    valueSeries.data.setAll(processedData);
      root.interfaceColors.set("grid",am5.color("#74ee15"))
      root.interfaceColors.set("text",am5.color("#74ee15"))

      valueSeries.strokes.template.setAll({
        strokeWidth: strokeWidth
      });
 
    // let valueLegend = mainPanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
    //     stockChart: stockChart
    //   }));
    //   valueLegend.data.setAll([valueSeries]);

    //   let volumePanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
    //     wheelY: "zoomX",
    //     panX: true,
    //     panY: true,
    //     height: am5.percent(30)
    //   }));

    //   let volumeValueAxis = volumePanel.yAxes.push(am5xy.ValueAxis.new(root, {
    //     numberFormat: "#.#a",
    //     renderer: am5xy.AxisRendererY.new(root, {})
    //   }));
      
    //   let  volumeDateAxis = volumePanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
    //     baseInterval: {
    //       timeUnit: "day",
    //       count: 1
    //     },
    //     renderer: am5xy.AxisRendererX.new(root, {})
    //   }));
      
    //   // Add series
    //   // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    //   let volumeSeries = volumePanel.series.push(am5xy.ColumnSeries.new(root, {
    //     name: "Volume",
    //     valueXField: "Date",
    //     valueYField: "Volume",
    //     xAxis: volumeDateAxis,
    //     yAxis: volumeValueAxis,
    //     legendValueText: "{valueY}"
    //   }));
      
    //   volumeSeries.data.setAll(processedData);

    //   stockChart.set("volumeSeries", volumeSeries);

    //   let volumeLegend = volumePanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
    //     stockChart: stockChart
    //   }));
    //   volumeLegend.data.setAll([volumeSeries]);

      mainPanel.set("cursor", am5xy.XYCursor.new(root, {
        yAxis: valueAxis,
        xAxis: dateAxis,
        snapToSeries: [valueSeries],
        snapToSeriesBy: "y!"
      }));
      
    //   volumePanel.set("cursor", am5xy.XYCursor.new(root, {
    //     yAxis: volumeValueAxis,
    //     xAxis: volumeDateAxis,
    //     snapToSeries: [volumeSeries],
    //     snapToSeriesBy: "y!"
    //   }));

      

    // let toolbar = am5stock.StockToolbar.new(root, {
    //     container: document.getElementById("chartcontrols"),
    //     stockChart: stockChart,
    //     controls: [
           
    //       am5stock.DrawingControl.new(root, {
    //         stockChart: stockChart
    //       }),
    //       am5stock.ResetControl.new(root, {
    //         stockChart: stockChart
    //       }),
    //       am5stock.SettingsControl.new(root, {
    //         stockChart: stockChart
    //       })
    //     ]
    //   });

     
    //   let scrollbar = mainPanel.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
    //     orientation: "horizontal",
    //     height: 50
    //   }));
    //   stockChart.toolsContainer.children.push(scrollbar);
      
    //   let sbDateAxis = scrollbar.chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
    //     baseInterval: {
    //       timeUnit: "day",
    //       count: 1
    //     },
    //     renderer: am5xy.AxisRendererX.new(root, {})
    //   }));
      
    //   let sbValueAxis = scrollbar.chart.yAxes.push(am5xy.ValueAxis.new(root, {
    //     renderer: am5xy.AxisRendererY.new(root, {})
    //   }));
      
    //   let sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
    //     valueYField: "Close",
    //     valueXField: "Date",
    //     xAxis: sbDateAxis,
    //     yAxis: sbValueAxis
    //   }));
      
    //   sbSeries.fills.template.setAll({
    //     visible: true,
    //     fillOpacity: 0.3
    //   });
      
      //sbSeries.data.setAll(processedData);
    

    
  }

  componentWillUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  }

  render() {
    const {isDark, height,uniqueID} = this.props
    return (
        <div>
<div id="chartcontrols" ></div>
      <div id={uniqueID} style={{ width: "100%", height: height, color: isDark ? "#FFFFFF" : "black"}}></div>
        </div>
        
    );
  }
}

export default GeneralChart;