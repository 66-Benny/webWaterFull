<template>
  <div id="mobileContent">
     <el-dialog :title="imgInfo.title"
      :visible.sync="DialogVisible"
      width="45%"
      top="1%"
      center
      modal
      :fullscreen="fullscreen"
      class="dialog">
       <el-image :src="`${imgInfo.src}`"
        class="dialogImg"
        fit="fill">
      </el-image>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array
    },
    imgInfo: {
      type: Object
    },
    imageDialogVisible: {
      type: Boolean,
      default () {
        return false
      }
    },
    fullscreen: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  computed: {
    DialogVisible: {
      get () {
        return this.imageDialogVisible
      },
      set (val) {
        this.$emit('updateDialogVisible', val)
      }
    }
  }
}
</script>
