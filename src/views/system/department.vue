<template lang="html">
  <Card>
    <Row>

      <Col span="23" class="search-con">
        <Select v-model="searchState" class="search-col" clearable >
          <Option value="1">启用</Option>
          <Option value="0">停用</Option>
        </Select>
        <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchParameter" @keyup.enter.native="searchList(searchState,searchParameter)"/>
        <Button @click="searchList(searchState,searchParameter)" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
      </Col>
			<Col span="1" class="search-con">
				<Button style="margin: 10px 0;" type="primary" @click="add()" v-if="$isAuth('rootDepartment:add')"> 新增</Button>
			</Col>

      <Col span="24" class="table-con">
        <vxe-table ref="table" border resizable show-overflow :data="tableData" :tree-config="{children: 'children'}">
          <vxe-table-column field="depCode" title="部门编号" tree-node></vxe-table-column>
          <vxe-table-column field="depName" title="部门名称"></vxe-table-column>
          <vxe-table-column title="状态">
            <template  v-slot="{ row }">
              {{row.state ==1?　'启用' : '停用'}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
          <vxe-table-column title="操作">
            <template v-slot="{ row }">
              <Button type="success" @click="addChildren(row)" v-if="$isAuth('childDepartment:add')">添加</Button>
              <Button type="info" @click="editDepartment(row)" v-if="$isAuth('department:edit')">编辑</Button>
              <Button type="primary" @click="showLastTask(row)" v-if="$isAuth('goal:view')">目标</Button>
              <Button type="warning" @click="deleteDepartment(row)" v-if="$isAuth('department:remove')">删除</Button>
            </template>
          </vxe-table-column>
        </vxe-table>


        <Modal v-model="addModal" ref="addModal" title="新增父级部门" :mask-closable="false">
          <Form ref="addFormValidate" :model="addParentForm" :rules="ruleValidate" :label-width="80">
            <FormItem label="部门编码" prop="depCode">
              <Input v-model="addParentForm.depCode" placeholder="请填写部门编码"></Input>
            </FormItem>
            <FormItem label="部门名称" prop="depName">
              <Input v-model="addParentForm.depName" placeholder="请填写部门名称"></Input>
            </FormItem>
						<FormItem label="关联公司" prop="company">
						  <Select v-model.trim="addParentForm.companyId" placeholder="请选择公司" filterable>
						    <Option v-for="item in companyData" :value="item.id" :key="item.id">{{ item.name }}</Option>
						  </Select>
						</FormItem>
						<FormItem label="部门类型" prop="type">
						  <Select v-model.trim="addParentForm.type" placeholder="请选择部门类型" filterable>
						    <Option v-for="item in departmentType" :value="item.dataName" :key="item.id">{{ item.dataName }}</Option>
						  </Select>
						</FormItem>
<!-- 						<FormItem label="部门目标" prop="task">
						  <Input @on-blur="initTaskMonth(addParentForm)"  v-model="addParentForm.task" placeholder="请填写部门目标(单位:元)"></Input>
						</FormItem>
						<FormItem label="各月目标" prop="taskMonth">
						  <Input v-model="addParentForm.taskMonth" placeholder="请填写部门目标分月"></Input>
						</FormItem> -->
            <FormItem label="备注" prop="remark">
              <Input v-model="addParentForm.remark" placeholder="请填写备注"></Input>
            </FormItem>
            <FormItem label="是否可用" prop="state">
              <i-switch v-model="addParentForm.state" size="large" true-value="1" false-value="0" >
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="addCLEAN();">取消</Button>
            <Button type="primary" size="large" @click="addOK();">确定</Button>
          </div>
        </Modal>

        <Modal v-model="addChildrenModal"  ref="addChildrenModal"  title="添加子级部门" width="500" :mask-closable="false">
          <Form ref="addChildrenFormValidate" :model="addChildrenForm" :rules="ruleValidate" :label-width="100">
            <FormItem label="部门编码" prop="depCode">
              <Input v-model="addChildrenForm.depCode" on-change="if(value.length>5)value=value.slice(0,5)" placeholder="请填写部门编码"></Input>
            </FormItem>
            <FormItem label="部门名称" prop="depName">
              <Input v-model="addChildrenForm.depName" placeholder="请填写部门名称"></Input>
            </FormItem>
						<FormItem label="关联公司" prop="companyId">
						  <Select v-model.trim="addChildrenForm.companyId" placeholder="请选择公司" filterable>
						    <Option v-for="item in companyData" :value="item.id" :key="item.id">{{ item.name }}</Option>
						  </Select>
						</FormItem>
						<FormItem label="部门类型" prop="type">
						  <Select v-model.trim="addChildrenForm.type" placeholder="请选择部门类型" filterable>
						    <Option v-for="item in departmentType" :value="item.dataName" :key="item.id">{{ item.dataName }}</Option>
						  </Select>
						</FormItem>
<!-- 						<FormItem label="部门目标" prop="task">
						  <Input @on-blur="initTaskMonth(addChildrenForm)"  v-model="addChildrenForm.task" placeholder="请填写部门目标(单位:元)"></Input>
						</FormItem>
						<FormItem label="各月目标" prop="taskMonth">
						  <Input v-model="addChildrenForm.taskMonth" placeholder="请填写部门目标分月"></Input>
						</FormItem> -->
            <FormItem label="备注" prop="remark">
              <Input v-model="addChildrenForm.remark" placeholder="请填写备注"></Input>
            </FormItem>
            <FormItem label="是否可用" prop="state">
              <i-switch v-model="addChildrenForm.state"  size="large" true-value="1" false-value="0">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="addChildrenCLEAN();">取消</Button>
            <Button type="primary" size="large" @click="addChildrenOK();">确定</Button>
          </div>
        </Modal>

        <Modal v-model="editModal"  ref="editModal"  title="修改部门" width="500" :mask-closable="false">
          <Form ref="updateFormValidate" :model="updateForm" :rules="ruleValidate" :label-width="100">
            <FormItem label="部门编码" prop="depCode">
              <Input v-model="updateForm.depCode" readonly="readonly" placeholder="请填写部门编码"></Input>
            </FormItem>
            <FormItem label="部门名称" prop="depName">
              <Input v-model="updateForm.depName" placeholder="请填写部门名称"></Input>
            </FormItem>
						<FormItem label="关联公司" prop="companyId">
						  <Select v-model.trim="updateForm.companyId" placeholder="请选择公司" filterable clearable>
						    <Option v-for="item in companyData" :value="item.id" :key="item.id">{{ item.name }}</Option>
						  </Select>
						</FormItem>
						<FormItem label="部门类型" prop="type">
						  <Select v-model.trim="updateForm.type" placeholder="请选择部门类型" filterable>
						    <Option v-for="item in departmentType" :value="item.dataName" :key="item.id">{{ item.dataName }}</Option>
						  </Select>
						</FormItem>
<!-- 						<FormItem label="部门目标" prop="task">
						  <Input @on-blur="initTaskMonth(updateForm)" v-model="updateForm.task" placeholder="请填写部门目标(单位:元)"></Input>
						</FormItem>
						<FormItem label="各月目标" prop="taskMonth">
						  <Input v-model="updateForm.taskMonth" placeholder="请填写部门目标分月"></Input>
						</FormItem> -->
						<FormItem label="上级部门" prop="parentId">
						  <Select v-model="updateForm.parentId" placeholder="请选择上级部门" filterable>
						    <Option v-for="item in departmentData" :value="item.id" :key="item.id">{{ item.depName }}</Option>
						  </Select>
						</FormItem>
            <FormItem label="备注" prop="remark">
              <Input v-model="updateForm.remark" placeholder="请填写备注"></Input>
            </FormItem>
            <FormItem label="是否可用">
              <i-switch v-model="updateForm.state"   size="large"  true-value="1" false-value="0">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="updateCLEAN();">取消</Button>
            <Button type="primary" size="large" @click="updateOK();">确定</Button>
          </div>
        </Modal>

				<Modal v-model="taskModal" title="目标查看" footer-hide width="95%">
					<Row slot="header">
						<Col span="15" style="font-weight: 700;line-height: 32px;">
							{{ this.departmentView.depName}}
						</Col>
						<Col span="8" style="text-align: right;">
							<Button type="primary" @click="addDepTask()" v-if="$isAuth('departmentTask:add')">新增目标</Button>
						</Col>
					</Row>
				  <Table :columns="columns2" :data="lastTaskData">
						<template slot-scope="scope" slot="task">
							{{scope.row.task | moneyToString}}
						</template>
						<template slot-scope="scope" slot="Jan">
							{{scope.row.taskMonth[0] | moneyToString}}
						</template>
						<template slot-scope="scope" slot="Feb">
							{{scope.row.taskMonth[1] | moneyToString}}
						</template>
						<template slot-scope="scope" slot="Mar">
							{{scope.row.taskMonth[2] | moneyToString}}
						</template>
						<template slot-scope="scope" slot="Apr">
							{{scope.row.taskMonth[3] | moneyToString}}
						</template>
						<template slot-scope="scope" slot="May">
							{{scope.row.taskMonth[4] | moneyToString}}
						</template>
						<template slot-scope="scope" slot="Jun">
							{{scope.row.taskMonth[5] | moneyToString}}
						</template>
						<template slot-scope="scope" slot="Jul">
							{{scope.row.taskMonth[6] | moneyToString}}
						</template>
						<template slot-scope="scope" slot="Aug">
							{{scope.row.taskMonth[7] | moneyToString}}
						</template>
						<template slot-scope="scope" slot="Sept">
							{{scope.row.taskMonth[8] | moneyToString}}
						</template>
						<template slot-scope="scope" slot="Oct">
							{{scope.row.taskMonth[9] | moneyToString}}
						</template>
						<template slot-scope="scope" slot="Nov">
							{{scope.row.taskMonth[10] | moneyToString}}
						</template>
						<template slot-scope="scope" slot="Dec">
							{{scope.row.taskMonth[11] | moneyToString}}
						</template>
						<template slot-scope="scope" slot="isUsing">
							<span v-if="scope.row.isUsing == 1" class="active"> 在用</span>
							<span style="color: #C2CCD1;" v-else >过往</span>
						</template>
            <template slot-scope="scope" slot="type">
              <span v-if="scope.row.type == 0" class="active"> 总成交</span>
              <span style="color: #C2CCD1;" v-else >签约</span>
            </template>
						<template slot-scope="scope" slot="createTime">
							{{scope.row.createTime | dateFormatTime}}
						</template>
					</Table>
				</Modal>

				<Modal v-model="taskAddModal" title="新增目标" width="50%" :mask-closable="false">
					<Form ref="addTask" :model="addTask" :rules="addTaskValidate"  label-position="left" :label-width="80">
            <Row>
              <Col span="11">
                <FormItem label="部门名称" prop="departmentName">
                  <Input v-model="addTask.departmentName" readonly="readonly"></Input>
                </FormItem>
              </Col>
              <Col span="13" style="padding-left:20px;">
                <FormItem label="部门名称" prop="type">
                  <Select v-model="addTask.type"    placeholder="请选择目标类型">
                    <Option value="0">总目标</Option>
                    <Option value="1">签约目标</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>

						<Row>
							<Col span="11">
								<FormItem label="目标年份" prop="year">
								  <Input v-model="addTask.year" placeholder="请填写目标年份"></Input>
								</FormItem>
							</Col>
							<Col span="13" style="padding-left:20px;">
								<FormItem label="年度目标" prop="task">
								  <Input v-model="addTask.task" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="11">
								<FormItem label="1月目标" prop="taskMonth0">
								  <Input v-model="addTask.taskMonth[0]" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
							<Col span="13" style="padding-left:20px;">
								<FormItem label="2月目标" prop="taskMonth1">
								  <Input v-model="addTask.taskMonth[1]" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="11">
								<FormItem label="3月目标" prop="taskMonth2">
								  <Input v-model="addTask.taskMonth[2]" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
							<Col span="13" style="padding-left:20px;">
								<FormItem label="4月目标" prop="taskMonth3">
								  <Input v-model="addTask.taskMonth[3]" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="11">
								<FormItem label="5月目标" prop="taskMonth4">
								  <Input v-model="addTask.taskMonth[4]" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
							<Col span="13" style="padding-left:20px;">
								<FormItem label="6月目标" prop="taskMonth5">
								  <Input v-model="addTask.taskMonth[5]" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="11">
								<FormItem label="7月目标" prop="taskMonth6">
								  <Input v-model="addTask.taskMonth[6]" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
							<Col span="13" style="padding-left:20px;">
								<FormItem label="8月目标" prop="taskMonth7">
								  <Input v-model="addTask.taskMonth[7]" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="11">
								<FormItem label="9月目标" prop="taskMonth8">
								  <Input v-model="addTask.taskMonth[8]" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
							<Col span="13" style="padding-left:20px;">
								<FormItem label="10月目标" prop="taskMonth9">
								  <Input v-model="addTask.taskMonth[9]" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="11">
								<FormItem label="11月目标" prop="taskMonth10">
								  <Input v-model="addTask.taskMonth[10]" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
							<Col span="13" style="padding-left:20px;">
								<FormItem label="12月目标" prop="taskMonth11">
								  <Input v-model="addTask.taskMonth[11]" placeholder="请填写目标,单位(元)"></Input>
								</FormItem>
							</Col>
						</Row>
						<FormItem label="备注" prop="remark">
						  <textarea v-model="addTask.remark" style="width:100%;"></textarea>
						</FormItem>
					</Form>
					<div slot="footer">
					  <Button type="text" size="large" @click="taskAddModal = false">取消</Button>
					  <Button type="primary" size="large" @click="addTaskApi();">确定</Button>
					</div>
				</Modal>
      </Col>
    </Row>
  </Card>
</template>

<script>

  import { getDepaertmentData,addDepaertment,updateDepaertment,deleteDepartment,getDepaertment,getDepartmentTask,saveDepartmentTask} from '@/api/system/department'
	import { queryCompany } from '@/api/system/company'
	import {findDictionaryByDictValue} from '@/api/system/dictionary'
  export default {

    name: 'department',
    data() {
      return {
				departmentType:[],
				companyData:[],
        addModal: false,
        editModal: false,
        addChildrenModal: false,
        searchState: '',
        searchParameter: '',
				departmentData:[],//部门非树形列表


        //添加父级部门
        addParentForm: {
          depCode: '',
          depName: '',
          remark: '',
          state: '1',
        },

        //编辑资源
        updateForm:{
          depCode: '',
          depName: '',
          remark: '',
          state: '0',
        },

        //添加子集
        addChildrenForm:{
          depCode: '',
          depName: '',
          remark: '',
          state: '1',
					taskMonth:'',
        },

        //表单规则
        ruleValidate: {
          depCode: [
            { required: true, message: '部门编号不能为空', trigger: 'blur' }
          ],
          depName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ],
					type: [
					  { required: true, message: '部门名称不能为空', trigger: 'blur' }
					],
          state: [
            { required: true, message: '请选择状态', trigger: 'blur' }
          ]
        },
        tableData: [],
				taskModal:false,
				lastTaskData:[],
				departmentView:{},
				addTask:{
					departmentId:'',
					departmentName:'',
					remark:'',
					year:'',
					task:'',
					taskMonth:[],
				},
				taskAddModal:false,
				addTaskValidate:{
					year: [
					  { required: true, message: '目标年份不能为空', trigger: 'blur' }
					],
					task: [
					  { required: true, message: '年度目标不能为空', trigger: 'blur' }
					],
          type: [
            { required: true, message: '目标类型不能为空', trigger: 'change' }
          ],
					// taskMonth0: [
					//   { required: true, message: '1月目标不能为空', trigger: 'blur' }
					// ],
					// taskMonth1: [
					//   { required: true, message: '2月目标不能为空', trigger: 'blur' }
					// ],
					// taskMonth2: [
					//   { required: true, message: '3月目标不能为空', trigger: 'blur' }
					// ],
					// taskMonth3: [
					//   { required: true, message: '4月目标不能为空', trigger: 'blur' }
					// ],
					// taskMonth4: [
					//   { required: true, message: '5月目标不能为空', trigger: 'blur' }
					// ],
					// taskMonth5: [
					//   { required: true, message: '6月目标不能为空', trigger: 'blur' }
					// ],
					// taskMonth6: [
					//   { required: true, message: '7月目标不能为空', trigger: 'blur' }
					// ],
					// taskMonth7: [
					//   { required: true, message: '8月目标不能为空', trigger: 'blur' }
					// ],
					// taskMonth8: [
					//   { required: true, message: '9月目标不能为空', trigger: 'blur' }
					// ],
					// taskMonth9: [
					//   { required: true, message: '10月目标不能为空', trigger: 'blur' }
					// ],
					// taskMonth10: [
					//   { required: true, message: '11月目标不能为空', trigger: 'blur' }
					// ],
					// taskMonth11: [
					//   { required: true, message: '12月目标不能为空', trigger: 'blur' }
					// ],

				},
				columns2:[
					{
					  title: '年份',
						sortable:true,
					  key: 'year',
					},
					{
					  title: '目标',
					  slot: 'task',
					},
					{
					  title: '一月',
					  slot: 'Jan',
					},
					{
					  title: '二月',
					  slot: 'Feb',
					},
					{
					  title: '三月',
					  slot: 'Mar',
					},
					{
					  title: '四月',
					  slot: 'Apr',
					},
					{
					  title: '五月',
					  slot: 'May',
					},
					{
					  title: '六月',
					  slot: 'Jun',
					},
					{
					  title: '七月',
					  slot: 'Jul',
					},
					{
					  title: '八月',
					  slot: 'Aug',
					},
					{
					  title: '九月',
					  slot: 'Sept',
					},
					{
					  title: '十月',
					  slot: 'Oct',
					},
					{
					  title: '十一月',
					  slot: 'Nov',
					},
					{
					  title: '十二月',
					  slot: 'Dec',
					},
					{
					  title: '标识',
					  slot: 'isUsing',
					},
          {
            title: '类型',
            slot: 'type',
          },
					{
					  title: '确认时间',
					  slot: 'createTime',
						width:'150'
					},
				],

      };
    },
    computed: {
      propList() {
        return Object.keys(this.props).map(item => ({
          name: item,
        }));
      },
    },
    methods: {
      searchList(key,val){
        getDepaertmentData(key,val).then(res => {
          this.tableData = res.data
					if(this.tableData==null||this.tableData.length==0){
						getDepaertment(key,val).then(data => {
							this.tableData = data.data
						})
					}
        })
      },

      addOK() {
        this.$refs.addFormValidate.validate((valid) => {
          if (valid) {
            addDepaertment(this.addParentForm).then(res =>{
              this.searchList(this.searchState,this.searchParameter);
              this.$Message.info(res.data);
              this.$refs.addModal.close();
              this.$refs.addFormValidate.resetFields();
            }).catch(() =>{
              return false;
            })
          } else {
            this.$Message.error('添加失败!');
          }
        })
      },

      addCLEAN(){
        this.$refs.addFormValidate.resetFields();
        this.$refs.addModal.close();
      },

      addChildren(row){
        this.addChildrenForm.parentId = row.id;
        this.addChildrenForm.parentCode = row.depCode;
        this.addChildrenModal = true;
      },

      addChildrenOK(){
        this.$refs.addChildrenFormValidate.validate((valid) => {
          if (valid) {
            // delete this.addChildrenFormValidate['createTime'];
            addDepaertment(this.addChildrenForm).then(res =>{
              this.searchList(this.searchState,this.searchParameter);
							this.getDepaertment();
              this.$Message.info(res.data);
              this.$refs.addChildrenModal.close();
              this.$refs.addChildrenFormValidate.resetFields();
            }).catch(() =>{
              return false;
            })
          } else {
            this.$Message.error('添加失败!');
          }
        })
      },
      addChildrenCLEAN(){
        this.$refs.addChildrenFormValidate.resetFields();
        this.$refs.addChildrenModal.close();
      },

      editDepartment(row) {
        this.updateForm = row;
        this.editModal = true;
      },

      updateOK(){
        this.$refs.updateFormValidate.validate((valid) => {
          if (valid) {
            delete this.updateForm['createTime'];
						delete this.updateForm['lastUpdateTime'];
						delete this.updateForm['children'];
						console.log(this.updateForm)
						debugger
            updateDepaertment(this.updateForm).then(res =>{
              this.searchList(this.searchState,this.searchParameter);
              this.$Message.info(res.data);
              this.$refs.editModal.close();
            }).catch(() =>{
              return false;
            })
          } else {
            this.$Message.error('更新失败!');
          }
        })
      },
      updateCLEAN(){
        this.$refs.editModal.close();
      },
      deleteDepartment(row){
				this.$Modal.confirm({
				  title: '警告',
				  content: '会删掉当前部门以及下属部门，你确定要删除吗？',
				  onOk: () => {
				    deleteDepartment(row.id).then(res =>{
				      this.searchList(this.searchState,this.searchParameter);
				      this.$Message.info(res.data);
				    }).catch(() =>{
				      return false;
				    })
				  }
				});
      },
			initTaskMonth(formData){
				if(formData.task&&(formData.taskMonth==undefined||!formData.taskMonth)){
					const taskMon = (formData.task/12.0).toFixed(2);
					const taskMonth = taskMon+","+taskMon+","+taskMon+","+taskMon+","+taskMon+","+taskMon+","+taskMon+","+taskMon+","+taskMon+","+taskMon+","+taskMon+","+taskMon;
					formData.taskMonth = taskMonth;
				}
			},
			getDepaertment(){
				getDepaertment().then(res => {
					this.departmentData = res.data;
				});
			},
			showLastTask(row){
				// let lastTask = scope.row.lastTask;
				// if(lastTask){
				// 	let json = JSON.parse(lastTask);
				// 	for(let i=0;i<json.length;i++){
				// 		let obj = json[i];
				// 		let taskMonth = obj.taskMonth;
				// 		if(taskMonth){
				// 			let taskArr = taskMonth.split(",");
				// 			obj.Jan = this.$options.filters.numberformat(taskArr[0]/100000000.0)+'亿';
				// 			obj.Feb = this.$options.filters.numberformat(taskArr[1]/100000000.0)+'亿';
				// 			obj.Mar = this.$options.filters.numberformat(taskArr[2]/100000000.0)+'亿';
				// 			obj.Apr = this.$options.filters.numberformat(taskArr[3]/100000000.0)+'亿';
				// 			obj.May = this.$options.filters.numberformat(taskArr[4]/100000000.0)+'亿';
				// 			obj.Jun = this.$options.filters.numberformat(taskArr[5]/100000000.0)+'亿';
				// 			obj.Jul = this.$options.filters.numberformat(taskArr[6]/100000000.0)+'亿';
				// 			obj.Aug = this.$options.filters.numberformat(taskArr[7]/100000000.0)+'亿';
				// 			obj.Sept = this.$options.filters.numberformat(taskArr[8]/100000000.0)+'亿';
				// 			obj.Oct = this.$options.filters.numberformat(taskArr[9]/100000000.0)+'亿';
				// 			obj.Nov = this.$options.filters.numberformat(taskArr[10]/100000000.0)+'亿';
				// 			obj.Dec = this.$options.filters.numberformat(taskArr[11]/100000000.0)+'亿';
				// 		}
				// 	}
				// 	this.lastTaskData=json;
				// }else{
				// 	this.lastTaskData=[];
				// }
				// this.taskModal = true;
				this.lastTaskData = [];
				this.departmentView = row;
				getDepartmentTask(row.id).then(res=>{
					 this.lastTaskData=res.data;
					 this.taskModal = true;
				})
			},
			add(){
				this.addModal = true;
			},
			addDepTask(){
				this.addTask.departmentName = this.departmentView.depName;
				this.addTask.departmentId =  this.departmentView.id;
				this.taskAddModal = true;
			},
			addTaskApi(){
				this.$refs.addTask.validate((valid) => {
				  if (valid) {
						if(this.addTask.taskMonth.length==12){
							saveDepartmentTask(this.addTask).then(res =>{
								this.$Message.info(res.data);
								this.taskAddModal = false;
								this.taskModal = false;
							})
						}else{
							this.$Message.error("请填写各月份目标");
						}
				  }
				})

			}
    },

    mounted () {
      getDepaertmentData('','').then(res => {
        this.tableData = res.data
      });
			getDepaertment().then(res => {
				this.departmentData = res.data;
			});
			queryCompany().then(res => {
				this.companyData = res.data;
			});
			findDictionaryByDictValue("departmentType").then(res => {
				this.departmentType = res.data;
			});
    }
  }
</script>

<style scoped lang="less">
  .search-con{
    padding: 10px 0;
    .search{
      &-col{
        display: inline-block;
        width: 200px;
      }
      &-input{
        display: inline-block;
        width: 300px;
        margin-left: 2px;
      }
      &-btn{
        margin-left: 2px;
      }
    }
  }
</style>
