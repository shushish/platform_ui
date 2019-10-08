<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  import {
    getToken,
    loadMenu,
    loadAuth
  } from "./utils/auth";
  import {
    mapActions
  } from 'vuex'
  import watermark from '@/utils/watermark'

  export default {
    name: 'App',
    provide () {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        //数据值
        transitionName: 'slide-right',
        //控制刷新路由
        isRouterAlive: true
      }
    },
    mounted() {
      var interceptUri = ['/handle', '/login']
      if (getToken() && interceptUri.indexOf(this.$route.path) == -1) {
        this.getUserInfo();
        loadMenu()
        loadAuth()
      }
      this.$router.afterEach((to) => {
        let suffix = this.$store.getters.userCode;
        if(suffix == null || suffix == ''){
          suffix = this.$store.getters.departmentName;
        }
        watermark.set(this.$store.getters.userName + ' ' + suffix)
      });
    },
    methods: {
      ...mapActions([
        'getUserInfo'
      ]),
      reload () {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
      //方法
    },
    computed: { //计算属性
      apptitle() {
        var dom = document.getElementsByTagName("title")[0],
          title = this.$route.meta.title;
        if (title === undefined) {
          dom.innerHTML = "CRM"
          return "CRM"
        } else {
          dom.innerHTML = title
          return title
        }
      },
      noBack() {
        if (this.$route.meta.noBack) {
          return false;
        }
        return true;
      },
      noHeader() {
        if (this.$route.meta.noHeader) {
          return false;
        }
        return true;
      }
    },
    watch: {
      '$route'(to, from) {
        let isBack = this.$router.isBack //  监听路由变化时的状态为前进还是后退
        if (isBack) {
          this.transitionName = 'slide-right';
        } else {
          this.transitionName = 'slide-left';
        }
        this.$router.isBack = false
      },
    },

  }
</script>

<style lang="less">
  .size {
    width: 100%;
    height: 100%;
  }

  html,
  body {
    .size;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  #app {
    .size;
  }
</style>
