import React, { Component } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5stock from "@amcharts/amcharts5/stock";


let stockChart;
let root;
class PredictionCharts extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isDark:false
    };
  }
    
  componentDidUpdate(){
     
  }
    
  splitData(data){
    const totalPairs = Object.keys(data).length;

    const sizeOfPart1 = Math.floor(totalPairs * 0.9);
    const sizeOfPart2 = totalPairs - sizeOfPart1;

    const part1 = data.slice(0, sizeOfPart1);
    const part2 = data.slice(sizeOfPart1);
    return [part1,part2];
  }
  componentDidMount() {

    const { data,predictionData, name,uniqueID, strokeWidth } = this.props;

    
    const processedData = data.map(item => ({
        ...item,
        Date: Date.parse(item.Date), 
      }));

    const [trainData,testData] = this.splitData(processedData)

    const processedPredictionData = predictionData.map(item => ({
      ...item,
      Date: Date.parse(item.Date), 
    }));

    
    root = am5.Root.new(`${uniqueID}`);

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
        renderer: am5xy.AxisRendererY.new(root, {}),
        
      }));
      
      let dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
        baseInterval: {
          timeUnit: "day",
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
      }));

      let trainSeries = mainPanel.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: name,
        valueXField: "Date",
        valueYField:"RSI",
        xAxis: dateAxis,
        yAxis: valueAxis,
        stroke: "#ef476f",
        legendValueText: "{valueY}",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "Train:{valueY}"
        })
    
        //legendValueText: "Open: {openValueY}\nLow: {lowValueY}\nHigh: {highValueY}\nClose: {valueY}",
        //tooltipText:"Open: {openValueYField}\nLow: {lowValueY}\nHigh: {highValueY}\nClose: {valueY}"
      }));


      let testSeries = mainPanel.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: name,
        valueXField: "Date",
        valueYField:"RSI",
        xAxis: dateAxis,
        yAxis: valueAxis,
        stroke: "#ffd166",
        legendValueText: "{valueY}",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "Test:{valueY}"
        })
    
        //legendValueText: "Open: {openValueY}\nLow: {lowValueY}\nHigh: {highValueY}\nClose: {valueY}",
        //tooltipText:"Open: {openValueYField}\nLow: {lowValueY}\nHigh: {highValueY}\nClose: {valueY}"
      }));

      let valSeries = mainPanel.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: name,
        valueXField: "Date",
        valueYField:"RSI",
        xAxis: dateAxis,
        yAxis: valueAxis,
        stroke: "#06d6a0",
        legendValueText: "{valueY}",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "Val:{valueY}"
        })
    
        //legendValueText: "Open: {openValueY}\nLow: {lowValueY}\nHigh: {highValueY}\nClose: {valueY}",
        //tooltipText:"Open: {openValueYField}\nLow: {lowValueY}\nHigh: {highValueY}\nClose: {valueY}"
      }));
    

      trainSeries.strokes.template.setAll({
        strokeWidth: strokeWidth
      });
      testSeries.strokes.template.setAll({
        strokeWidth: strokeWidth
      });
      valSeries.strokes.template.setAll({
        strokeWidth: strokeWidth
      });

      if(this.props.isDark === true){
        root.interfaceColors.set("grid",am5.color("#CCCCCC"))
        root.interfaceColors.set("text",am5.color("#ffffff"))
      }else if(this.props.isDark === false){
        root.interfaceColors.set("grid",am5.color("#CCCCCC"))
        root.interfaceColors.set("text",am5.color("#000000"))
      }else{
        root.interfaceColors.set("grid",am5.color("#74ee15"))
        root.interfaceColors.set("text",am5.color("#74ee15"))       
      }
 
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
        snapToSeries: [trainSeries],
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
      trainSeries.data.setAll(trainData);
      testSeries.data.setAll(testData);
      valSeries.data.setAll(processedPredictionData);

      stockChart.appear(1000,200);
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
<div id="chartcontrols"></div>
      <div id={uniqueID} style={{ width: "100%", height: height, color: this.props.isDark ? "#FFFFFF" : "black", backgroundColor : this.props.isDark ? "#000000" : "#ffffff"}}></div>
        </div>
        
    );
  }
}

export default PredictionCharts;