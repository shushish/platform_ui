<template>
  <div>
    <Card >
      <Row class="search">
        <Col span="4">
          <Select v-model="searchKey" class="search-input" @on-change="queryUserTree(searchKey,searchValue,searchCompanyId)">
            <Option v-for="item in lockedData" :value="item.val" :key="item.val">{{ item.itemName }}</Option>
          </Select>
        </Col>
				<Col span="4">
				  <Select filterable clearable v-model="searchCompanyId" @on-change="queryUserTree(searchKey,searchValue,searchCompanyId)" placeholder="请选择公司">
				    <Option v-for="item in companyData" :value="item.id" :key="item.id">{{ item.name }}</Option>
				  </Select>
				</Col>

        <Col span="8">
           <Input clearable placeholder="输入名称、工号或用户名搜索" class="search-input" v-model.trim="searchValue" @keyup.enter.native='queryUserTree(searchKey,searchValue,searchCompanyId)' />
        </Col>
        <Col span="4">
            <Button @click="queryUserTree(searchKey,searchValue,searchCompanyId)" class="search-input" type="primary"><Icon type="search"/>搜索</Button>
        </Col>
				<Col span="4" style="text-align: right;">
            <Button type="primary" @click="userExport" >导出</Button>
						<Button type="primary" @click="addModal = true" v-if="$isAuth('user:add')">新增</Button>
				</Col>
      </Row>
			<Row>
				<Col span="24" class="table-con">
            <vxe-table ref="table" border resizable show-overflow :data="tableData" :tree-config="{children: 'children'}">
              <vxe-table-column field="name" title="姓名" tree-node></vxe-table-column>
              <vxe-table-column field="username" title="用户名"></vxe-table-column>
              <vxe-table-column field="companyName" title="公司"></vxe-table-column>
              <vxe-table-column field="roleName" title="角色名称"></vxe-table-column>
              <vxe-table-column field="departmentName" title="部门名称"></vxe-table-column>
              <vxe-table-column field="title" title="职务"></vxe-table-column>
              <vxe-table-column title="操作">
                <template v-slot="{ row }">
                  <Button type="info" v-if="$isAuth('user:edit')" @click="edit(row.id)">编辑</Button>
                  <Button type="primary" v-if="$isAuth('user:edit')" @click="resetPassword(row.id)">重置</Button>
                  <Button type="warning" v-if="$isAuth('user:locked')&&row.locked==0" @click="locked(row)">锁定</Button>
                  <Button type="warning" v-if="$isAuth('user:locked')&&row.locked==1" @click="unLocked(row)">解锁</Button>
                  <Button type="warning" v-if="$isAuth('user:delete')" @click="remove(row.id)">删除</Button>
                </template>
              </vxe-table-column>
            </vxe-table>
				</Col>
			</Row>


      <br/>

      <Modal
        v-model="addModal"
        ref="add"
        title="新增用户" :mask-closable="false">
        <Form  ref="user" :model="user" :rules="addUserValidate" :label-width="100">
					<FormItem label="姓名：" prop="name">
					  <Input v-model.trim="user.name" placeholder="请输入姓名"></Input>
					</FormItem>
          <FormItem label="用户名：" prop="username">
            <Input v-model.trim="user.username" placeholder="请输入用户名"></Input>
          </FormItem>
          <FormItem label="工号：" prop="userCode">
            <Input v-model.trim="user.userCode" placeholder="请输入用户工号"></Input>
          </FormItem>
					<FormItem label="电话号码：" prop="phone">
					  <Input v-model.trim="user.phone" placeholder="请输入电话号码"></Input>
					</FormItem>
					<FormItem label="电子邮箱：" prop="email">
					  <Input v-model.trim="user.email" placeholder="请输入电子邮箱"></Input>
					</FormItem>
					<FormItem label="入职日期：" prop="hiredate">
						<DatePicker type="date"  @on-change="(date) => {user.hiredate = date;}" placement="bottom-end" placeholder="请选择日期"></DatePicker>
					</FormItem>
          <FormItem label="用户密码：" prop="password">
            <Input v-model.trim="user.password" type="password" placeholder="请输入密码"></Input>
          </FormItem>
					<FormItem label="职务：" prop="title">
						<Select v-model.trim="user.title " placeholder="请选择职务" filterable>
						  <Option v-for="item in titleData" :value="item.dataName" :key="item.dataName">{{ item.dataName }}</Option>
						</Select>
					</FormItem>
          <FormItem label="关联角色：" prop="role">
            <Select multiple v-model.trim="user.role " placeholder="请选择角色" filterable>
              <Option v-for="item in roleData" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
					<FormItem label="关联架构：" prop="department">
					  <Select  v-model.trim="user.department" placeholder="请选择架构" filterable>
					    <Option v-for="item in departmentData" :value="item.id" :key="item.id">{{ item.depName }}</Option>
					  </Select>
					</FormItem>
					<FormItem label="关联公司：" prop="company">
					  <Select multiple v-model.trim="user.company" placeholder="请选择公司" filterable>
					    <Option v-for="item in companyData" :value="item.id" :key="item.id">{{ item.name }}</Option>
					  </Select>
					</FormItem>
          <FormItem label="上级领导：" prop="manageId">
            <Select v-model.trim="user.manageId " placeholder="请选择上级领导" filterable>
              <Option v-for="item in userData" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="是否锁定：">
            <i-switch v-model.trim="user.locked" size="large" true-value="1" false-value="0">
              <span slot="open">锁定</span>
              <span slot="close">未锁定</span>
            </i-switch>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="addCancel">取消</Button>
          <Button type="primary" size="large" @click="addOk">确定</Button>
        </div>
      </Modal>
      <Modal
        v-model="editModal"
        ref="edit"
        title="用户编辑" :mask-closable="false">
        <Form ref="editUser" :model="editUser" :rules="editUserValidate" :label-width="100">
          <FormItem label="姓名：" prop="name">
            <Input v-model.trim ="editUser.name" placeholder="请输入姓名"></Input>
          </FormItem>
          <FormItem label="用户名：" prop="username">
            <Input v-model.trim="editUser.username" placeholder="请输入用户名"></Input>
          </FormItem>
          <FormItem label="工号：" prop="userCode">
            <Input v-model.trim="editUser.userCode" placeholder="请输入用户工号"></Input>
          </FormItem>
          <FormItem label="电话号码：" prop="phone">
            <Input v-model.trim="editUser.phone" placeholder="请输入电话号码"></Input>
          </FormItem>
          <FormItem label="电子邮箱：" prop="email">
            <Input v-model.trim="editUser.email" placeholder="请输入电子邮箱"></Input>
          </FormItem>
          <FormItem label="入职日期：" prop="hiredate">
          	<DatePicker type="date" format="yyyy-MM-dd" :value="editUser.hiredate" @on-change="(date) => {editUser.hiredate = date;}"  placement="bottom-end" placeholder="请选择日期"></DatePicker>
          </FormItem>
          <FormItem label="用户密码：" prop="password">
            <Input v-model.trim="editUser.password" type="password" placeholder="请输入密码"></Input>
          </FormItem>
					<FormItem label="职务：" prop="title">
						<Select v-model.trim="editUser.title" placeholder="请选择职务" filterable>
						  <Option v-for="item in titleData" :value="item.dataName" :key="item.dataName">{{ item.dataName }}</Option>
						</Select>
					</FormItem>
          <FormItem label="关联角色：" prop="role">
            <Select multiple v-model.trim="editUser.role" placeholder="请选择角色" filterable>
              <Option v-for="item in roleData" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="关联架构：" prop="department">
            <Select v-model="editUser.department" placeholder="请选择架构" filterable  clearable>
              <Option v-for="item in departmentData" :value="item.id" :key="item.id">{{ item.depName }}</Option>
            </Select>
          </FormItem>
          <FormItem  label="关联公司：" prop="company">
            <Select multiple v-model.trim="editUser.company" placeholder="请选择公司" filterable>
              <Option v-for="item in companyData" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="上级领导：" prop="manageId">
            <Select v-model="editUser.manageId " placeholder="请选择上级领导" filterable clearable>
              <Option v-for="item in userData" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="editCancel">取消</Button>
          <Button type="primary" size="large" @click="editOk('editUser')">确定</Button>
        </div>
      </Modal>
    </Card>
		<Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>


<script>
  import { queryUserPage,queryUserList,saveUser,updateUser,removeUser,getUser,resetPwd,queryUserTree,unLocked,locked,userExport } from '../../api/system/user'
  import { queryRoleList } from '@/api/system/role'
	import { getDepaertment } from '@/api/system/department'
	import { queryCompany } from '@/api/system/company'
  import { mapActions } from 'vuex'
	import {findDictionaryByDictValue} from '@/api/system/dictionary'
	import {download} from '@/utils'
    export default {
      name: "user",
      data () {
				const validateManage = (rule, value, callback) =>{
					const errors = []
					if (value == this.editUser.id) { errors.push('上级不能为本身') }
					callback(errors)
				};
				const validateDepartment = (rule, value, callback) =>{
					const errors = []
          value = this.editUser.department;
					if (!value) { errors.push('必须选择部门') }
					callback(errors)
				};
        return {
					spinShow:true,
					titleData:[],
          addModal: false,//模态框
          editModal: false,//模态框
          searchKey:'',//是否锁定
          searchValue:'',//用户名或工号
					searchCompanyId:'',//公司搜索id
          //保存用户信息
          user:{
            id:"",
            username:'',
            userCode:'',
            locked:false,
            password:'',
            roleId:'',
						role:'',
            roleName:'',
						departmentId:'',
						department:''
          },
          //新增用户校验
           addUserValidate:{
						name: [
						  { required: true, message: '名称不能为空', trigger: 'blur' }
						],
						title: [
						  { required: true, message: '职位不能为空', trigger: 'blur' }
						],
            username: [
              { required: true, message: '用户名不能为空', trigger: 'blur' }
            ],
            role: [
              { required: true, type: 'array', min: 1, message: '请选择至少一种权限', trigger: 'blur' }
            ],
						department:[
							{ required: true, message: '请选择一个部门', trigger: 'blur'}
						],
						company: [
						  { required: true, type: 'array', min: 1, message: '请选择至少一个公司', trigger: 'blur' }
						]
           },
					 //编辑用户信息
					 editUser:{
					   name:'',
					   title:'',
					   username:'',
					   role:[],
					   roleName:'',
						 department:'',
						 company:'',
						 manageId:''
					 },
          //编辑用户校验
          editUserValidate:{
						name: [
						  { required: true, message: '名称不能为空', trigger: 'blur' }
						],
						title: [
						  { required: true, message: '名称不能为空', trigger: 'blur' }
						],
            username: [
              { required: true, message: '用户名称不能为空', trigger: 'blur' }
            ],
            role: [
              { required: true, type: 'array', min: 1, message: '请选择至少一种权限', trigger: 'blur' }
            ],
						// department:[
						// 	{ required: true, message: '请选择一个部门', trigger: 'change' }
						// ],
						department:[
							{required: true,validator: validateDepartment,trigger: 'change'}
						],
						company: [
						  { required: true, type: 'array', min: 1, message: '请选择至少一个公司', trigger: 'blur' }
						],
						manageId:[
							{ validator:validateManage,trigger: 'blur'}
						],
          },
          //是否锁定下拉选
          lockedData: [
            {
              val:'',
              itemName:"全部"
            },
            {
              val:1,
              itemName:"锁定"
            },
            {
              val:0,
              itemName:"未锁定"
            }
          ],
          roleData: [],//角色列表
					departmentData:[],//部门列表
					companyData:[],//公司列表
          tableData:[],
					userData:[],
          total:0,
          size:10,
          current:1,
          userInfo:{}
        }
      },
      methods: {
        //加载角色列表
        initRoleList(available,key){
          queryRoleList(available,key).then(res => {
            this.roleData = res.data;
          })
        },
				initDepartment(){
					getDepaertment().then(res => {
						this.departmentData = res.data;
					})
				},
				initCompany(){
					queryCompany().then(res => {
						this.companyData = res.data;
					})
				},
        queryUserTree (locked,key,companyId){
          queryUserTree(locked,key,companyId).then(res => {
            this.tableData = res.data;
						if(this.tableData==null||this.tableData.length==0){
							queryUserList(this.searchKey,this.searchValue,this.searchCompanyId).then(res => {
								this.tableData = res.data;
							});
						}
          });
        },
        //页码切换
//         changePage (num){
//           queryUserPage(num,this.size,this.searchKey,this.searchValue).then(res => {
//             this.tableData = res.records;
//             this.total = res.total;
//             this.size = res.size;
//             this.current = res.current;
//           })
//         },
        //分页条数切换
//         changePageSize(size){
//           queryUserPage(this.current,size,this.searchKey,this.searchValue).then(res => {
//             this.tableData = res.records;
//             this.total = res.total;
//             this.size = res.size;
//             this.current = res.current;
//           })
//         },
        saveUser(user,ref) {
					user.roleId = user.role.toString();
					user.departmentId = user.department.toString();
					user.companyId = user.company.toString();
					if(!user.locked){
						user.locked='0';
					}
          saveUser(user).then(res =>{
						if("该部门的职务的用户已存在" == res.data){
							this.$Message.error(res.data);
						}else{
							this.$Message.info(res.data);
							ref.close();
							this.queryUserTree(this.searchKey,this.searchValue,this.searchCompanyId);
						}
          }).catch(() =>{
            return false;
          })
        },
        updateUser(user,ref){
          user.roleId = user.role.toString();
          user.departmentId = user.department.toString();
					user.companyId = user.company.toString();
          delete user['createTime'];
          delete user['lastUpdateTime'];
					if(user.manageId == undefined){
						user.manageId="";
					}
          updateUser(user).then(res =>{
						console.log(res.data);
						if(res.data == '该部门的职务的用户已存在'){
							this.$Message.error(res.data);
						}else{
							this.$Message.info(res.data);
							this.queryUserTree(this.searchKey,this.searchValue,this.searchCompanyId);
							ref.close();
							this.$refs.editUser.resetFields();
						}
          }).catch(() =>{
            return false;
          })
        },
        getUser(id){
          getUser(id).then(res =>{
            this.userInfo = res.data
            // this.queryUserList('','');
            this.queryUserTree(this.searchKey,this.searchValue,this.searchCompanyId);
          }).catch(() =>{
          })
        },
        //新增确认
        addOk () {
          this.$refs.user.validate((valid) => {
            if (valid) {
              this.saveUser(this.user,this.$refs.add);
            }
          })
        },
        //新增取消
        addCancel () {
          this.$refs.add.close();
          this.$refs.user.resetFields();
        },
        //编辑确认
        editOk(name){
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.updateUser(this.editUser,this.$refs.edit);
            }
          })
        },
        //编辑取消
        editCancel(){
          this.$refs.edit.close();
        },
        //打开编辑弹框
        edit (id){
					getUser(id).then(res => {
						this.editUser = res.data;
						this.editUser.password='';
						this.editUser.hiredate = this.$options.filters.dateFormat(this.editUser.hiredate);
						const roleId = this.editUser.roleId;
						if(roleId!=null&&roleId!=''){
							this.editUser.role = roleId.split(",");
						}
						const departmentId = this.editUser.departmentId;
						if(departmentId!=null&&departmentId!=''){
							this.editUser.department = departmentId.split(",");
						}
						const companyId = this.editUser.companyId;
						if(companyId!=null&&companyId!=''){
							this.editUser.company = companyId.split(",");
						}
					}).then(
						this.editModal = true
					);
        },
				resetPassword(id){
					this.$Modal.confirm({
						title: '警告',
						content: '你确定重置该用户密码吗？',
						onOk: () => {
							resetPwd(id).then(res =>{
								this.$Message.info(res.data);
							}).catch(() =>{
                return false;
              });
						}
					});

				},
        remove (id){
          this.$Modal.confirm({
            title: '警告',
            content: '你确定要删除该用户吗？',
            onOk: () => {
              removeUser(id).then(res =>{
                this.$Message.info(res.data);
                this.queryUserTree(this.searchKey,this.searchValue,this.searchCompanyId);
              }).catch(() =>{
                return false;
              })
            }
          });
        },
				locked(user){
					this.$Modal.confirm({
						title: '警告',
						content: '你确定锁定该用户吗？',
						onOk: () => {
							delete user['createTime'];
							delete user['lastUpdateTime'];
						  locked(user).then(res => {
								this.$Message.info(res.data);
								this.queryUserTree(this.searchKey,this.searchValue,this.searchCompanyId);
							});
						}
					});
				},
				unLocked(user){
          delete user['createTime'];
          delete user['lastUpdateTime'];
					unLocked(user).then(res => {
						this.$Message.info(res.data);
						this.queryUserTree(this.searchKey,this.searchValue,this.searchCompanyId);
					});
				},
				initTitleData(){
					findDictionaryByDictValue("title").then(res => {
						this.titleData = res.data;
					});
				},
				initUserData(){
					queryUserList(this.searchKey,this.searchValue).then(res => {
						this.userData = res.data;
					});
				},
				userExport(){
          this.$Spin.show();
					userExport(this.locked,this.key,this.searchCompanyId).then(res => {
						download(res);
            this.$Spin.hide();
					})
				}
      },
      computed:{
        rules(){
          return {
          }
        }
      },
      mounted () {
				this.searchKey = 0;
        this.queryUserTree(0,'','');
        this.initRoleList('1','');
				this.initDepartment();
				this.initCompany();
				this.initTitleData();
				this.spinShow=false;
				this.initUserData();
// 				this.$nextTick(() => {
// 					// 禁用右键
// 					document.oncontextmenu = new Function("event.returnValue=false");
// 					// 禁用选择
// 					document.onselectstart = new Function("event.returnValue=false");
// 				});
      }
    }
</script>

<style scoped lang="less">
  .search{
    padding-bottom: 10px;
    &-input{
      padding-right: 10px;
    }
  }
  .add{
    margin-top: 10px;
  }
</style>
