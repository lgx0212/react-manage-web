import React, { useEffect } from "react";
import * as Echarts from "echarts";
import axios from "axios";
export default function FrontPage() {
  useEffect(() => {
    getData().then((res) => {
      console.log(res);
      let xAxis = []
      res[0].data.forEach((item)=>{
        xAxis.push(item.title)
      })
      let yAxis = []
      for(let i = 0;i<xAxis.length;i++){
        yAxis[i] = 0
      }
      res[1].data.forEach((item)=>{
        let index = xAxis.indexOf(item.category.title)
        if(index !== -1){
          yAxis[index] ++
        }
      })
      var myChart = Echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "新闻统计",
        },
        tooltip: {},
        legend: {
          data: ["数量"],
        },
        xAxis: {
          data: xAxis,
        },
        yAxis: {
          minInterval: 1
        },
        series: [
          {
            name: "数量",
            type: "bar",
            data: yAxis,
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    });
  }, []);
  const getData = () => {
    return Promise.all([
      axios.get(`/api1/categories`),
      axios.get(`/api1/news?publishState=2&_expand=category`),
    ]);
  };
  return (
    <div>
      <div id="main" style={{ width: "90%", height: "400px" }}></div>
    </div>
  );
}
