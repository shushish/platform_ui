<style lang="less">
  @import './login.less';
</style>
<template>
  <div class="login" style="background-color: white;">
    <div>
      <img src="../../assets/images/yuanda_logo.png" style="width: 5%;height: 10%;margin-left: 10%" />
    </div>
    <div>
      <img src="../../assets/images/yuanda_title.png" style="width: 15%;height: 10%;margin-left: 10%;" />

    </div>
<!--    <Row v-if="showFlag" style="background:#eee;padding:20px;margin-left:35%;width:20%;height:25%;">
      <Col span="23">
      <Card :bordered="false">
        <h2 slot="title" style="color:#FFA500">提示</h2>
        <p slot="title" style="color:#FFA500">360兼容模式或IE下使用系统</p>
        <p slot="title" style="color:#FFA500">可能会出现不可预知的错误</p>
        <p slot="title" style="color:#FFA500">请更改极速模式或者使用其他浏览器</p>
      </Card>
      </Col>
    </Row> -->

    <div style="background-color: rgb(232,232,232);margin-top:3%;height: 268px">
      <div style="display: inline-block;width: 50%">
        <img src="../../assets/images/cover3.jpg" style="width: 500px;margin-left: 20%;height: 268px" />
      </div>
      <div class="login" style="display:inline-block;width: 300px;float: right;margin-right: 10% ;border:1px solid rgb(232,232,232);">
        <Card icon="log-in" title="欢迎登录" :bordered="false" style="height: 266px;">
          <div class="form-con">
            <login-form @on-success-valid="handleSubmit" style="background-color: transparent;"></login-form>
            <p class="login-tip"></p>
          </div>
        </Card>
      </div>
    </div>

  </div>
</template>
<script>
  import LoginForm from "@/components/login-form"
  import {
    mapActions,
    mapMutations
  } from 'vuex'
  import {
    loadMenu,
    loadAuth
  } from "../../utils/auth";

  export default {
    components: {
      LoginForm
    },
    name: 'login',
    data() {
      return {
        showFlag: false,
      }
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      ...mapMutations([
        'setMenuList'
      ]),
      handleSubmit(form) {
        this.$Spin.show();
        this.handleLogin(form).then(() => {
          this.getUserInfo().then(() => {
            loadMenu().then(res => {
              this.setMenuList(res);
              localStorage.tagNaveList = [];
              loadAuth().then(() => {
                this.$goRouter('/home')
              })
            });
          })
        }).catch(() => {
          this.$Spin.hide();
        })
      },
      IEVersion() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE) {
          var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
          reIE.test(userAgent);
          var fIEVersion = parseFloat(RegExp["$1"]);
          if (fIEVersion == 7) {
            return 7;
          } else if (fIEVersion == 8) {
            return 8;
          } else if (fIEVersion == 9) {
            return 9;
          } else if (fIEVersion == 10) {
            return 10;
          } else {
            return 6; //IE版本<=7
          }
        } else if (isEdge) {
          return 'edge'; //edge
        } else if (isIE11) {
          return 11; //IE11
        } else {
          return -1; //不是ie浏览器
        }
      }
    },
    mounted() {
      if('-1' != this.IEVersion()){
        alert("建议放弃使用IE浏览器；建议使用谷歌浏览器。")
      }
    }
  }
</script>
<style>

</style>
