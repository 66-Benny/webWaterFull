<template>
  <div
    class="taxiTravel"
    :class="isMobile ? 'top' : ''"
  >
    <el-form
      :model="formInline"
      class="demo-form-inline"
    >
      <el-row :gutter="30">
        <el-col
          :xs="12"
          :md="6"
        >
          <el-form-item label="小时开始">
            <el-input-number
              size="small"
              clearable
              v-model="formInline.hoursStart"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col
          :xs="12"
          :md="6"
        >
          <el-form-item label="小时结束">
            <el-input-number
              size="small"
              clearable
              v-model="formInline.hoursEnd"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col
          :xs="12"
          :md="6"
        >
          <el-form-item label="分钟开始">
            <el-input-number
              size="small"
              clearable
              v-model="formInline.minutesStart"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col
          :xs="12"
          :md="6"
        >
          <el-form-item label="分钟结束">
            <el-input-number
              size="small"
              clearable
              v-model="formInline.minutesEnd"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col
          :xs="12"
          :md="6"
        >
          <el-form-item label="公里开始">
            <el-input-number
              size="small"
              clearable
              v-model="formInline.kmStart"
              placeholder="公里开始"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col
          :xs="12"
          :md="6"
        >
          <el-form-item label="公里结束">
            <el-input-number
              size="small"
              clearable
              v-model="formInline.kmEnd"
              placeholder="公里结束"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item
            label="日期范围"
            v-show="!isMobile"
          >
            <el-date-picker
              v-model="formInline.value"
              type="daterange"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              align="center"
              style="margin-bottom:20px"
              size="small"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <inlineCalendar
          ref="myCalendar"
          v-show="isMobile"
          mode="during"
          style="margin-bottom:20px"
          @change="onChange"
          enableTouch
          class="mobileDate"
        />
      </el-row>
      <el-form-item>
        <el-button
          type="success"
          @click="onSubmit"
        >确定生成</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "taxiTravel",
  data () {
    return {
      formInline: {
        value: [], // 选中日期范围的开始日期时间戳和结束日期时间戳
        rangeValue: [], // 生成合并后的数据，例如：["2021-09-10 21:13 34.4Km","2021-09-11 21:04 34.9Km"]
        randomHours: "", // 生成的小时数据
        randomMinutes: "", // 生成的分钟数据
        randomKm: "", // 生成的公里数据
        hoursStart: 21, // 小时开始
        hoursEnd: 21, // 小时结束
        minutesStart: 0, // 分钟开始
        minutesEnd: 59, // 分钟结束
        kmStart: 34, // 公里开始
        kmEnd: 35 // 公里结束
      }
    };
  },
  methods: {
    onChange (date) {
      if (date.length === 2) {
        this.formInline.value = [
          moment(date[0].$d).valueOf(),
          moment(date[1].$d).valueOf(),
        ];
      }
    },
    onSubmit () {
      if (!this.formInline.value.length) {
        this.$notify({
          title: '警告',
          message: '日期范围为必填项',
          type: 'error'
        });
        return;
      }
      // 得到选中日期范围的开始日期
      let start = this.formInline.value[0] - 1000 * 3600 * 24;
      // 得到选中日期范围的结束日期
      let end = this.formInline.value[1];
      // 获取一共有多少天
      let length = (end - start) / (1000 * 3600 * 24);
      // 循环处理整合数据，逐一push到rangeValue数组中
      for (let index = 0; index < length; index++) {
        let startDate = moment(start).add(1, "days").format("YYYY-MM-DD");
        // 生成随机小时
        this.formInline.randomHours = this.randomNum(this.formInline.hoursStart, this.formInline.hoursEnd, 0);
        // 生成随机分钟
        this.formInline.randomMinutes = this.randomNum(this.formInline.minutesStart, this.formInline.minutesEnd, 0);
        // 生成随机公里数
        this.formInline.randomKm = this.toInteger(this.randomNum(this.formInline.kmStart, this.formInline.kmEnd, 1))
        // 判断如果生成的随机小时等于输入框输入的小时结束时间，则分钟数除以4 （目的是生成的分钟数不那么假）
        if (this.formInline.randomHours === this.formInline.hoursEnd) {
          this.formInline.randomMinutes = (this.formInline.randomMinutes / 4).toFixed();
        }
        // 分钟数补0
        if (this.formInline.randomMinutes < 10) {
          this.formInline.randomMinutes = "0" + this.formInline.randomMinutes;
        }
        // 数据组合
        let startDateTime = `${startDate} ${this.formInline.randomHours}:${this.formInline.randomMinutes} ${this.formInline.randomKm}Km`;
        // 最终逐一 push 到 rangeValue 数组中
        this.formInline.rangeValue.push(startDateTime);
        start = startDate;
        this.formInline.randomHours = "";
        this.formInline.randomMinutes = "";
      }
      // 执行数据的 copy 功能
      this.onCopy()
    },
    // 生成随机数函数
    randomNum (minNum, maxNum, fixedTo) {
      return (Math.random() * (maxNum - minNum) + minNum).toFixed(fixedTo) * 1;
    },
    // 判断是否是整数，若是整数，后面加 .0 展示，例如：35 => 35.0
    toInteger (obj) {
      if (typeof obj === 'number' && obj % 1 === 0) {
        return obj + '.0'
      } else {
        return obj
      }
    },
    // 复制功能
    onCopy () {
      this.$copyText(this.copyRangeValue).then(() => {
        this.$notify({
          duration: 3000,
          type: "success",
          message: "数据已复制到剪贴板, 日期初始化完成!",
        });
        this.formInline.value = [];
        this.formInline.rangeValue = [];
        this.formInline.randomHours = "";
        this.formInline.randomMinutes = "";
        this.formInline.randomKm = "";
        this.$refs.myCalendar.init();
      });
    },
  },
  computed: {
    // 复制最终生成的数据
    copyRangeValue () {
      const reg = new RegExp(",", "g");
      return this.formInline.rangeValue.toString().replace(reg, "\n");
    },
    // 判断是否是手机端
    isMobile () {
      let flag = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
        navigator.userAgent
      );
      return flag;
    },
  },
  watch: {
    "formInline.value" (val) {
      if (!val) {
        this.formInline.rangeValue = [];
        this.formInline.randomHours = "";
        this.formInline.randomMinutes = "";
        this.formInline.randomKm = "";
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
.setTime {
  margin-bottom: 60px;
}
.top {
  margin-top: 20px;
}
.mobileDate {
  width: 150%;
  position: relative;
  left: -25%;
}
</style>