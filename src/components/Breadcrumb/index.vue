<template>
  <el-breadcrumb class="app-breadcrumb" separator=">">
    <transition-group>
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="index">
        <span
          v-if="
            (item.redirect === 'noRedirect' || index == levelList.length - 1) &&
            item.meta.title
          "
          class="no-redirect"
          >{{ item.meta.title.toLocaleUpperCase() }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{
          item.meta.title.toLocaleUpperCase()
        }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null,
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    },
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      )
      const first = matched[0]
      if (
        matched.length > 1 &&
        matched[0].meta.title === matched[1].meta.title
      ) {
        matched = matched.filter((item, index) => index != 0)
      }

      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    },
    isCourses(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Courses1'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    },
  },
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
