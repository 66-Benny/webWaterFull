<template>
  <div id="content">
    <vue-waterfall-easy ref="waterfall"
      :imgsArr="imgsArr"
      @scrollReachBottom="getData"
      @click="clickFn">
      <div class="img-info"
        slot-scope="props">
        <p class="some-info">{{props.value.info}}</p>
      </div>
    </vue-waterfall-easy>
    <imageDialog :imgInfo="imgInfo"
      :imageDialogVisible="imageDialogVisible"
      @updateDialogVisible="updateDialogVisible"
      :fullscreen="isMobile">
    </imageDialog>
  </div>
</template>

<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import imageDialog from '../components/imageDialog'

export default {
  name: 'index',
  components: {
    vueWaterfallEasy,
    imageDialog
  },
  data () {
    return {
      files: [], // 获取所有图片路径
      groupedCountries: [], // 将数组分片
      imgsArr: [], // 组件中按需加载图片
      count: 0,
      groupedCountriesLength: 0,
      imageDialogVisible: false,
      imgInfo: {
        src: '',
        title: ''
      }
    }
  },
  mounted () {
    this.getFiles()
  },
  methods: {
    // 获取全部要预加载的文件
    getFiles () {
      const files = require.context(
        '../assets/images',
        false,
        /.(png|jpg|jpeg|gif|bmp|webp)$/
      )
      const pages = []
      files.keys().forEach((key) => {
        const src = key.replace(/(\.\/|)/g, '')
        pages.push({
          info: src.replace(/(\.png)/g, ''),
          src: require(`@/assets/images/${src}`)
        })
      })
      this.files = pages.sort(this.compare('info'))
      this.groupedCountries = this.group(this.files, 12)
      this.groupedCountriesLength = this.groupedCountries.length
      if (this.files.length > 1) {
        this.getData()
      }
    },
    // 文件名排序
    compare (key) {
      return function (a, b) {
        var reA = /[^a-zA-Z]/g
        var reN = /[^0-9]/g
        var aA = a[key].replace(reA, '')
        var bA = b[key].replace(reA, '')
        if (aA === bA) {
          var aN = parseInt(a[key].replace(reN, ''), 10)
          var bN = parseInt(b[key].replace(reN, ''), 10)
          return aN === bN ? 0 : aN > bN ? 1 : -1
        } else {
          return aA > bA ? 1 : -1
        }
      }
    },
    // 数组分片
    group (array, subGroupLength) {
      var index = 0
      var newArray = []
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)))
      }
      return newArray
    },
    // 插入图片
    getData () {
      if (this.count < this.groupedCountriesLength) {
        setTimeout(() => {
          this.imgsArr = this.imgsArr.concat(
            this.groupedCountries[this.count++]
          )
        }, 500)
      } else {
        this.$refs.waterfall.waterfallOver()
      }
    },
    // 点击图片弹框
    clickFn (event, { index, value }) {
      this.imgInfo.title = value.info
      this.imgInfo.src = value.src
      this.imageDialogVisible = true
    },
    updateDialogVisible (val) {
      this.imageDialogVisible = val
    }
  },
  computed: {
    // 判断是否是手机端
    isMobile () {
      let flag = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
        navigator.userAgent
      )
      return flag
    }
  }
}
</script>

<style lang="scss" scoped>
#content {
  position: absolute;
  top: 32px;
  bottom: 0;
  width: 100%;
  /deep/ .img-inner-box {
    cursor: pointer;
  }
  .some-info {
    line-height: 1.6;
    text-align: center;
  }
  .dialog {
    height: 100vh;
    overflow: auto;
  }
}
</style>
