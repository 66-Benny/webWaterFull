<template>
  <div class="fundRanking">
    <el-card class="box-card">
      <div class="inputValue">
        <el-form ref="form"
          :inline="true"
          :model="form"
          class="demo-form-inline">
          <el-form-item label="周期选择">
            <el-input-number v-model="form.fundArrayNum"
              :step="1"
              :max="4"
              :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="排行范围">
            <el-input-number v-model="form.pageSize"
              :step="1"
              :min="1"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
              @click="onClickSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="24">
          <div id="main"
            style="max-width:1500px;height:600px"
            @click="onEchartClick"></div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="fundInfo">
            <el-table :data="tableData"
              style="width: 100%">
              <el-table-column v-for="(colum, index) of colums"
                :key="index"
                :prop="colum.prop"
                :label="colum.label"
                :width="colum.width || 165"
                align="center">
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import echarts from "echarts";
import colums from "./js/colums.js";

export default {
  name: "fundRanking",
  data() {
    return {
      form: {
        fundArrayNum: 4,
        pageSize: 10,
      },
      fundArray: [
        {
          name: "z",
          fundCode: [],
        },
        {
          name: "1y",
          fundCode: [],
        },
        {
          name: "3y",
          fundCode: [],
        },
        {
          name: "6y",
          fundCode: [],
        },
      ],
      mergeFundCodeArray: [], // 合并周、月、季、半年数组
      fundCount: {}, // 统计基金代码出现次数
      fundCountArray: { xAxisData: [], yAxisData: [] },
      searchFundInfo: {
        sort: "z",
        pageIndex: 1,
        pageSize: 10,
      },
      index: 0,
      fundNames: [],
      tableData: [],
      colums: colums.colums,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.index < this.fundArray.length) {
        this.getFundData();
      } else {
        this.mergeFund();
        this.drawChart();
      }
    },
    getFundData() {
      this.$axios
        .post("https://api.doctorxiong.club/v1/fund/rank", this.searchFundInfo)
        .then((res) => {
          if (res.data.code === 200) {
            this.fundArray[this.index].fundCode = res.data.data.rank;
            this.index++;
            if (this.index < this.fundArray.length) {
              this.searchFundInfo.sort = this.fundArray[this.index].name;
            }
            this.init();
          } else {
            this.$message({
              center: true,
              duration: 8000,
              type: "warning",
              message: "访问次数已达上限，请一小时以后再访问",
            });
          }
        });
    },
    onClickSearch() {
      this.fundNames = [];
      this.tableData = [];
      this.index = 0;
      this.searchFundInfo.pageSize = this.form.pageSize;
      this.fundArray = this.fundArray.splice(0, this.form.fundArrayNum);
      this.init();
    },
    mergeFund() {
      const mergeArr = [];
      this.fundArray.forEach((element) => {
        element.fundCode.forEach((item) => {
          mergeArr.push(item.code);
        });
      });
      this.mergeFundCodeArray = _.flattenDeep(mergeArr);
      this.fundCount = this.mergeFundCodeArray.reduce(function (
        allNames,
        name
      ) {
        if (name in allNames) {
          allNames[name]++;
        } else {
          allNames[name] = 1;
        }
        return allNames;
      },
      {});
      const xData = [];
      const yData = [];
      _.forIn(this.fundCount, function (value, key) {
        xData.push(key);
        yData.push(value);
      });
      this.fundCountArray.xAxisData = xData;
      this.fundCountArray.yAxisData = yData;
    },
    drawChart() {
      let myChart = echarts.init(document.getElementById("main"));
      //堆叠折线图所需参数对象
      let option = {
        title: {
          text: "基金排行统计",
          subtext: "各阶段进入最佳次数",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          data: this.fundCountArray.xAxisData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            name: `出现次数`,
            label: {
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "black",
                fontSize: 16,
              },
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#B71C1C" },
                { offset: 0.5, color: "#FFC107" },
                { offset: 1, color: "#E0E0E0" },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#212121" },
                  { offset: 0.7, color: "#616161" },
                  { offset: 1, color: "#9E9E9E" },
                ]),
              },
            },
            data: this.fundCountArray.yAxisData,
          },
        ],
      };
      myChart.setOption(option);
    },
    onEchartClick(params) {
      let myChart = echarts.init(document.getElementById("main"));
      let pointInPixel = [params.offsetX, params.offsetY];
      if (myChart.containPixel("grid", pointInPixel)) {
        let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [
          params.offsetX,
          params.offsetY,
        ])[0];
        this.getFundInfo(xIndex);
      }
    },
    getFundInfo(index) {
      const clickFundCodeIs = this.fundCountArray.xAxisData[index];
      this.$axios
        .get(
          `https://api.doctorxiong.club/v1/fund/detail?code=${clickFundCodeIs}`
        )
        .then((res) => {
          if (res.data.code === 200) {
            this.$set(this.tableData, index, res.data.data);
            this.getFundName(index);
          }
        });
    },
    getFundName(index) {
      const clickFundCodeIs = this.fundCountArray.xAxisData[index];
      let fundName = [];
      this.fundArray.forEach((item) => {
        item.fundCode.forEach((item2) => {
          if (item2.code === clickFundCodeIs) {
            fundName.push(item.name);
          }
        });
      });
      fundName.forEach((item, index) => {
        item === "z" ? (fundName[index] = "近一周") : "";
        item === "1y" ? (fundName[index] = "近一月") : "";
        item === "3y" ? (fundName[index] = "近三月") : "";
        item === "6y" ? (fundName[index] = "近半年") : "";
      });
      this.$set(
        this.tableData,
        index,
        Object.assign(this.tableData[index], {
          fundName: fundName.toString(),
          index,
        })
      );
      // this.tableData[index] = Object.assign(this.tableData[index], {
      //   fundName: fundName.toString(),
      // });
    },
  },
  computed: {},
  watch: {},
};
</script>

<style scoped>
.box-card {
  margin-bottom: 25px;
}
/* .fundRanking {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
} */
</style>