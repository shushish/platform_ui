<template>
  <div class="header-bar">
    <div style="float: left"><sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger></div>
    <div class="custom-bread-crumb" style="float: left" >
      <Input size="large" type="text" v-model="key" search placeholder="搜索" @on-search="allSearch" />
    </div>

    <div class="custom-content-con">
      <h3 style="margin-left:10px ;color: #000000;font-weight: normal;">{{nowDate}}&nbsp;&nbsp;第{{nowWeek}}周</h3>
      <div style="margin-left: 10px"><a :href ="'#/mailBox'" style="float: left"><Badge :count=this.count :offset="[10,0]"><div class="notice_aa"><a href="#/mailBox"><img src="../../../../assets/images/maiBox.png" /></a></div></Badge></a></div>

      <!--<Divider type="vertical" style="margin: 22px 10px;" />-->
			<slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import moment from 'moment'
import './header-bar.less'
export default {
  name: 'HeaderBar',
	data(){
		return{
			key:"",
      count:null,
		}
	},
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean,
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    },
		nowDate(){
			return moment().format("YYYY年MM月DD日");
		},
		nowWeek(){
			return moment().format("w");
		},
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    },
		allSearch(){
			if(!this.key){
				return;
			}
			this.$router.push({ name:'allSearch',query:{key:this.key}})
		},
    //获取信箱未读消息
    getCount(){
      this.count = 8;
    },

  },
  created() {
    this.getCount();
  }

}
</script>
<style>
  /*头部信箱角标*/
  .header-bar .ivu-badge-count{
    height: 15px;
    line-height: 12px;
    padding: 0 3px;
    top: -5px;
    min-width: auto;
  }
  /*头部展示登录人名称的圆圈样式调整*/
  .ivu-dropdown .ivu-avatar{
    width: 32px;
    height: 32px;
    margin-top: 0px;
  }
  /*搜索框小图标调整*/
  .header-bar .ivu-input-icon{
    left: 0;
  }
  /*搜索框样式调整*/
  .header-bar .ivu-input{
    padding: 4px 7px 4px 30px;
  }
  /*头部颜色变深*/
  /* .main .header-con{background-color: rgb(01,37,63);} */

  /*头部高度*/
  .ivu-layout-header{
    height: 55px;
    line-height: 50px;
  }
  /*头部最左边收拉框按钮调整*/
  .sider-trigger-a{
    margin-top: 12px!important;
    margin-left: -25px;
  }
  .custom-content-con{
    line-height: 54px;
  }
  /*头部分割竖线*/
/* .ivu-divider, .ivu-divider-vertical {
    margin: 22px 10px;
  } */
  .header-bar .ivu-select-dropdown{
    width: 100px;
    margin-top: -10px;
    margin-left: 40px;
    background-color: rgb(240,240,240);
  }
  .notice_aa { float: left; margin-left:12px; text-align:center; }
  .notice_aa a { display: inline-block; width: 34px; height: 34px; line-height: 34px; border: 1px solid #e7e8ec; }
  .notice_aa img { vertical-align:middle; margin-bottom:3px; }

  /*.header { background: #f6f7f9; line-height: 60px; height: 60px; position: fixed; top: 0; left: 65px; right: 0; border-bottom: 1px solid #e7e8ec; border: 1px solid #e7e8ec; border-top: none; border-right: none; }
  .header .left { float:left; margin-left:15px; }
  .header .left .menu { float: left; margin-top:12px; }
  .header .left .menu span { display: block; width: 34px; height: 34px; border: 1px solid #e7e8ec; background:url(../../../../assets/home/img/menu.png) no-repeat center center; vertical-align:middle; }
  .search { float: left; position: relative; margin-left: 12px; width: 238px; height: 34px; line-height: 34px; border: 1px solid #e7e8ec; margin-top:12px; padding-left:42px; }
  .search input { width: 100%; border:none; background:none; }
  .search a { display:block; width:42px; height:34px; background:url(../../../../assets/home/img/search.png) no-repeat center center; position:absolute; top:0; left:0; }
  .header .right { float:right; margin-right:14px; }*/

</style>
