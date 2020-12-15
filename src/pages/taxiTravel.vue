<template>
  <div class="taxiTravel">
    <el-date-picker v-model="value"
      type="daterange"
      format="yyyy 年 MM 月 dd 日"
      value-format="timestamp"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      clearable
      style="margin-bottom: 20px">
    </el-date-picker>
    <el-button type="success"
      @click="onSubmit">生成数据</el-button>
    <el-button type="primary"
      v-clipboard:copy="copyRangeValue"
      v-clipboard:success="onCopy">复制数据</el-button>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "taxiTravel",
  data() {
    return {
      value: "",
      rangeValue: [],
      randomHours: "",
      randomMinutes: "",
      randomKm: "",
    };
  },
  methods: {
    onSubmit() {
      if (!this.value) {
        return;
      }
      let start = this.value[0] - 1000 * 3600 * 24;
      let end = this.value[1];
      let length = (end - start) / (1000 * 3600 * 24);
      for (let index = 0; index < length; index++) {
        let startDate = moment(start).add(1, "days").format("YYYY-MM-DD");
        this.randomHours = this.randomNum(21, 22, 0);
        this.randomMinutes = this.randomNum(0, 58, 0);
        this.randomKm = this.randomNum(34, 35.6, 1);
        if (this.randomHours === "22") {
          this.randomMinutes = (this.randomMinutes / 2).toFixed();
        }
        if (this.randomMinutes.length < 2) {
          this.randomMinutes = "0" + this.randomMinutes;
        }
        let startDateTime = `${startDate} ${this.randomHours}:${this.randomMinutes} ${this.randomKm}Km`;
        this.rangeValue.push(startDateTime);
        start = startDate;
        this.randomHours = "";
        this.randomMinutes = "";
      }
      this.$notify({
        duration: 3000,
        type: "success",
        message: "生成数据成功!",
      });
    },
    randomNum(minNum, maxNum, fixedTo) {
      return (Math.random() * (maxNum - minNum) + minNum).toFixed(fixedTo);
    },
    onCopy() {
      this.$copyText(this.copyRangeValue).then(() => {
        this.$notify({
          duration: 3000,
          type: "success",
          message: "数据已复制到剪贴板, 日期初始化完成!",
        });
        this.value = "";
        this.rangeValue = [];
        this.randomHours = "";
        this.randomMinutes = "";
        this.randomKm = "";
      });
    },
  },
  computed: {
    copyRangeValue() {
      const reg = new RegExp(",", "g");
      return this.rangeValue.toString().replace(reg, "\n");
    },
  },
  watch: {
    value(val) {
      if (!val) {
        this.rangeValue = [];
        this.randomHours = "";
        this.randomMinutes = "";
        this.randomKm = "";
      }
    },
  },
};
</script>

<style scoped>
.taxiTravel {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -40%);
}
</style>