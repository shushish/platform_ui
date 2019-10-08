// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import store from './store';
import iView from 'iview';
import config from '@/config';
import '@/assets/icons/iconfont.css';
import 'iview/dist/styles/iview.css';
import './index.less';
import commonFiltes from '@/filtres/index';
import {getStaffInfo} from "./api/system/login";
// import ZkTable from 'vue-table-with-tree-grid';
import {isAuth} from "./utils/auth";
// import echarts from 'echarts';
// import * as d3 from "d3";
// import("babel-polyfill");
import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/index.css';





// Vue.use(ZkTable)
Vue.use(iView)
Vue.use(Vuex)
Vue.use(VXETable)
Vue.config.productionTip = false

Object.keys(commonFiltes).forEach(function (key, index, arr) {
  Vue.filter(key, commonFiltes[key]);
})

Vue.prototype.$goRouter = function (path,params) {
    this.$router.push({path,query:params || {}})
}

Vue.prototype.$goRouterByParams = function (name, param) {
  this.$router.push({name, params: param || {}})
}
Vue.prototype.$goRouterReplace = function (path) {
  this.$router.replace(path)
}
Vue.prototype.$goRouterReplaceByParams = function (name, param) {
  this.$router.replace({name, params: param || {}})
}

// Vue.prototype.$utils = XEUtils;

Vue.prototype.$isAuth = isAuth;

Vue.prototype.$config = config

Vue.prototype.$iskeepAlive = function(){
  return this.$route.meta.keepAlive || false;
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
