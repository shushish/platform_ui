import Vue from 'vue'
import verify from './index'
const myRules = {
  amount: {
    test: function (val) {
      var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
      if (exp.test(val)) {
        if(val > 0){
          return true
        }
      }
      return false
    },
    message: '金额格式错误'
  },
  accountNo: {
    test:function (value) {
      if (/[^0-9 -]+/.test(value))
        return false;
      return true;

    },
    message: '银行账号格式错误'
  },
  mobile: {
    test:function(val){
      if(val){
        var exp = /^1[34578]\d{9}$/
        if (!exp.test(val)) {
          return false
        }
      }
      return true
    },
    message: '手机号码格式不正确'
  },
  email: {
    test:function(val){
      if(val){
        var exp = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        if (!exp.test(val)) {
          return false
        }
      }
      return true
    },
    message: '邮箱格式不正确'
  },
  emailOrPhone: {
    test:function(val){

      if(val){
        var reg = new RegExp("(^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$)|(^0(10|2[0-5789]|\\d{3})\\d{7,8}$)");
        if (!reg.test(val) ) {
          return false
        }
      }
      return true
    },
    message: '用户名格式不正确'
  },
  paymentDate : {
    test:function(val){
      if(val){
        var nowDate = new Date();
        var payDate = new Date(val);
        if (payDate > nowDate) {
          return false
        }
      }
      return true
    },
    message: '转账时间不能大于当前时间'
  },
  number: {
    test: function (val) {
      var exp = /^[0-9]*$/
      if (exp.test(val)) {
        if(val > 0){
          return true
        }
      }
      return false
    },
    message: '数量格式错误'
  },
  amount2: {  //可为负的金额验证
    test: function (val) {
      var exp = /^([\-]?)([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
      if (exp.test(val)) {
        return true
      }
      return false
    },
    message: '金额格式错误'
  },
}
Vue.use(verify, {
  rules:myRules
})
