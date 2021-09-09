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
        >确定</el-button>
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
        value: [],
        rangeValue: [],
        randomHours: "",
        randomMinutes: "",
        randomKm: "",
        hoursStart: 21,
        hoursEnd: 21,
        minutesStart: 0,
        minutesEnd: 59,
        kmStart: 34,
        kmEnd: 35
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
      let start = this.formInline.value[0] - 1000 * 3600 * 24;
      let end = this.formInline.value[1];
      let length = (end - start) / (1000 * 3600 * 24);
      for (let index = 0; index < length; index++) {
        let startDate = moment(start).add(1, "days").format("YYYY-MM-DD");
        this.formInline.randomHours = this.randomNum(this.formInline.hoursStart, this.formInline.hoursEnd, 0);
        this.formInline.randomMinutes = this.randomNum(this.formInline.minutesStart, this.formInline.minutesEnd, 0);
        this.formInline.randomKm = this.toInteger(this.randomNum(this.formInline.kmStart, this.formInline.kmEnd, 1))
        if (this.formInline.randomHours === this.formInline.hoursEnd) {
          this.formInline.randomMinutes = (this.formInline.randomMinutes / 4).toFixed();
        }
        if (this.formInline.randomMinutes < 10) {
          this.formInline.randomMinutes = "0" + this.formInline.randomMinutes;
        }
        let startDateTime = `${startDate} ${this.formInline.randomHours}:${this.formInline.randomMinutes} ${this.formInline.randomKm}Km`;
        this.formInline.rangeValue.push(startDateTime);
        start = startDate;
        this.formInline.randomHours = "";
        this.formInline.randomMinutes = "";
      }
      this.onCopy()
    },
    randomNum (minNum, maxNum, fixedTo) {
      return (Math.random() * (maxNum - minNum) + minNum).toFixed(fixedTo) * 1;
    },
    toInteger (obj) {
      if (typeof obj === 'number' && obj % 1 === 0) {
        return obj + '.0'
      } else {
        return obj
      }
    },
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
    copyRangeValue () {
      const reg = new RegExp(",", "g");
      return this.formInline.rangeValue.toString().replace(reg, "\n");
    },
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