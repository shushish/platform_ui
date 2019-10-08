<template>
  <div id="showProject">
    <Card span="24">
      <Row style="margin-bottom: 0.5rem;">
        <Col>
          <span style="font-weight: bold">{{this.title}}：&nbsp;&nbsp;</span>
          <DatePicker v-model  = "startTime" type="date" placeholder="开始时间" placement="bottom-end" style="width: 180px"></DatePicker>
          <DatePicker v-model  = "endTime" type="date" placeholder="结束时间" placement="bottom-end" style="width: 180px"></DatePicker>
          <!--异常反馈和交付项目查询条件：公司id-->
          <Select v-if="this.type == 3 || this.type == 2" v-model="choosedCompany" placeholder="选择公司" style="width: 10%" v-on:change="changeCompany()" clearable>
              <Option v-for="item in companys" :key="item.id" v-bind:value="item.id">{{item.name}}</Option>
          </Select>
          <!--异常反馈信息查询条件：异常类型-->
          <Select v-if="this.type == 3" v-model="choosedAbnormityType" placeholder="选择类型" style="width: 10%" clearable>
            <Option v-for="item in abnormityTypes" :key="item.id" v-bind:value="item.dataName">{{item.dataName}}</Option>
          </Select>
          <!--交付阶段查询条件：交付状态-->
          <Select v-if="this.type == 2" v-model="choosedDeliveryStatus" placeholder="选择类型" style="width: 10%" clearable>
            <Option v-for="item in deliveryStatus" :key="item.name" v-bind:value="item.value">{{item.name}}</Option>
          </Select>
          <Button style="background-color:rgb(10,96,154);color: white; margin-left: 15px;"  @click="initQuery()" class="ivu-btn ivu-btn-info" v-if="$isAuth('project:export')" >搜索</Button>
          <Button style="background-color:rgb(10,96,154);color: white; margin-left: 15px;"  @click="projectExport()" class="add" v-if="$isAuth('project:export')" >搜索并导出</Button>
        </Col>
      </Row>

      <Table height="680" :columns="columns" :data="tableData">
        <template slot-scope="scope"  slot="name">
          <div v-on:click="jumpToProjectDetail(scope.row.id)"><a>{{scope.row.name}}</a></div>
        </template>
        <template slot-scope="scope"  slot="timeSlot">
          {{scope.row.createTime | dateFormatTime}}
        </template>
        <template slot-scope="scope"  slot="staticSlot">
          {{scope.row.statisticsDate | dateFormat}}
        </template>
        <template slot-scope="scope"  slot="contractSlot">
          {{scope.row.contractDate | dateFormat}}
        </template>
        <template slot-scope="scope"  slot="abnormityBom">
          {{(scope.row.abnormityBom *100).toFixed(1)}}%
        </template>
      </Table>
    </Card>
  </div>
</template>


<script>
  import {
    abnormityExport, checksExport, getAbnormityProject,
    projectExport,
    queryAbnormityInfo, queryBiddingProjectInfo, queryCheckInfo, queryDeliverProjectInfo,
    queryPreProjectInfo,
    querySinningProjectInfo,
    queryStartProjectInfo, statisticsProjectExport
  } from "../../api/behavior/project";
  import {download} from "../../utils";
  import {getAllAbnormityTypes, getAllCompanysById} from "../../api/behavior/projectNext";

    export default {
        name: "showProject",
		data() {
			return {
        basicCol:[
          {
            title: '项目名称',
            slot:'name'
          },
          {
            title:'项目金额',
            key:'money'
          },
          {
            title:'项目阶段',
            key:'stage'
          },
          {
            title:'所有人',
            key:'projectPeople'
          },
          {
            title:'统计日期',
            slot:'staticSlot',
            align:'center',
            /*sortable:'true',*/
          },
          /*{
            title:'创建时间',
            slot:'timeSlot',
            align:'center',
          },*/
        ],
        columns:[],
        type:null,
        startTime:null,
        endTime:null,
			  tableData:[],
        title:'',
        companys:[],
        choosedCompany:'',
        abnormityTypes:[],
        choosedAbnormityType:'',
        choosedDeliveryStatus:'',
        deliveryStatus:[
        {
          name:'进行中',
          value:'进行中'
        },{
          name:'待生产',
          value:'待生产'
        },{
          name:'未推送',
          value:'未推送'
        },{
          name:'已完工',
          value:'已完工'
        }],
			}
		},

		methods:{
			//初始化查询
			initQuery() {
        let params = this.$route.query;
        this.type = params.type;
        if (0 == this.type) {
          this.title = '签约项目';
          this.columns.length = 0;
          this.columns = [].concat(this.basicCol);
          this.columns.push({
            title: '签约日期',
            slot: 'contractSlot',
            align: 'center',
            sortable:true
          });
          this.$Spin.show();
          querySinningProjectInfo(this.startTime,this.endTime).then(res => {
            this.tableData = res.data;
            this.$Spin.hide();
          })
        }
        /*中标项目*/
        else if (1 == this.type) {
          this.title = '中标项目';
          this.columns.length = 0;
          this.columns = [].concat(this.basicCol);
          this.$Spin.show();
          queryBiddingProjectInfo(this.startTime,this.endTime).then(res => {
            this.tableData = res.data;
            this.$Spin.hide();
          })
        }
        /*交付项目*/
        else if (2 == this.type) {
          this.title = '交付项目';
          this.columns.length = 0;
          this.columns = [].concat(this.basicCol);
          this.columns.push({
            title: '客服名称',
            key: 'servicerPeople',
          });
          this.$Spin.show();
          queryDeliverProjectInfo(this.startTime,this.endTime,this.choosedDeliveryStatus,this.choosedCompany).then(res => {
            this.tableData = res.data;
              this.$Spin.hide();
          })
        }
        else if (3 == this.type) {
          this.title = '异常信息';
          this.columns.length = 0;
          this.columns.push({
            title: '反馈项目',
            key: 'projectName'
          });
          this.columns.push({
            title: '异常类型',
            key: 'type',
            width:'100',
          });
          this.columns.push({
            title: '异常级别',
            key: 'level',
            align:'center',
          });
          this.columns.push({
            title: '反馈内容',
            key: 'content',

          });
          this.columns.push({
            title: '客户需求描述',
            key: 'customDemand',
          });
          this.columns.push({
            title: '客户反馈人',
            key: 'customer',
            align:'center',
            width:'150',
          });
          this.columns.push({
            title: '受理部门',
            key: 'factoryDep',
            align:'center',
            width:'100',
          });
          this.columns.push({
            title: '现场处理',
            key: 'disposeWayNow',
          });
          this.columns.push({
            title: '状态',
            slot: 'productStatus',
            width:'80',
            align:'center',
            render: (h, params) => {
              if(null == params.row.dateLast){
                return h('span','进行中');
              }else{
                return h('span','已解决');
              }
            }
          });
          this.columns.push({
            title: '时间',
            slot:'timeSlot',
            sortable:true,
            align:'center',
          });
          this.$Spin.show();
          queryAbnormityInfo(this.startTime,this.endTime,this.choosedCompany,this.choosedAbnormityType).then(res => {
            this.tableData = res.data;
            this.$Spin.hide();
          })
        }

        else if (4 == this.type) {
          this.title = '被点检项目';
          this.columns.length = 0;
          this.columns.push({
            title: '被点检人',
            key: 'userId'
          });
          this.columns.push({
            title: '创建人',
            key: 'ownerId'
          });
          this.columns.push({
            title: '被点检项目',
            key: 'projectId'
          });
          this.columns.push({
            title: '点检内容',
            key: 'content'
          });
          this.columns.push({
            title: '点检类型',
            key: 'type'
          });
          this.columns.push({
            title: '时间',
            slot:'timeSlot',
            sortable:true,
          });
          this.$Spin.show();
          queryCheckInfo(this.startTime,this.endTime).then(res => {
            this.tableData = res.data;
            this.$Spin.hide();
          })
        }
        //异形率超过15的项目
        else if (5 == this.type) {
          this.title = '项目异常';
          this.columns.length = 0;
          this.columns = [].concat(this.basicCol);
          this.columns.push({
            title: '异形率',
            slot:'abnormityBom',
          });
          this.$Spin.show();
          getAbnormityProject(this.startTime,this.endTime).then(res => {
            this.tableData = res.data;
            this.$Spin.hide();
          })
        }
      },
      //导出项目(分条件不分页)
      projectExport() {
			  if("0"==this.type||"1"==this.type||"2"==this.type){
          this.$Spin.show();
          statisticsProjectExport(this.type.toString(),this.startTime,this.endTime,this.choosedDeliveryStatus,this.choosedCompany).then(res => {
            download(res);
            this.$Spin.hide();
          });
        }
        //异常信息导出
        else if("3"==this.type){
          this.$Spin.show();
          abnormityExport(this.startTime,this.endTime,this.choosedCompany,this.choosedAbnormityType).then(res => {
            download(res);
            this.$Spin.hide();
          });
        }
        //点检信息导出
        else if("4"==this.type){
          this.$Spin.show();
          checksExport(this.type.toString(),this.startTime,this.endTime).then(res => {
            download(res);
            this.$Spin.hide();
          });
        }
      },
      jumpToProjectDetail(id){
        this.$router.push({name: 'projectInfo', query: {'id': id}});
      },
      getAllCompanysById(){
        getAllCompanysById().then(res =>{
          if(null != res && null != res.data){
            this.companys = res.data;
          }
        })
      },
      getAllAbnormityTypes(){
        getAllAbnormityTypes().then(res =>{
          if(null != res && null != res.data){
            this.abnormityTypes = res.data;
          }
        })
      },
		},
		mounted () {
      this.initQuery();
      this.getAllCompanysById();
      this.getAllAbnormityTypes()
    },
		computed:{

		},
		created(){

		}
    }
</script>

<style>
  /*解决页面靠右显示问题*/
  #showProject .ivu-table{float:left}
</style>
