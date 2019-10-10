<template>
	<div>
		<Card>
			<Row class="search">
				<Col span="4">
				<Select v-model="searchKey" class="search-input">
					<Option v-for="item in availableData" :value="item.val" :key="item.val">{{ item.itemName }}</Option>
				</Select>
				</Col>
				<Col span="8">
				<Input clearable placeholder="输入角色名称搜索" class="search-input" v-model="searchValue" />
				</Col>
				<Col span="11">
				<Button @click="queryRoleList(searchKey,searchValue)" class="search-input" type="primary">
					<Icon type="search" />搜索</Button>
				</Col>
				<Col span="1">
				<Button type="primary" class="add" @click="addModal = true" v-if="$isAuth('role:add')">新增</Button>
				</Col>
			</Row>
			<Table stripe height="600" :columns="columns" :data="tableData"></Table>
			<Page :total="total" :page-size="size" :current="current" @on-change="changePage" @on-page-size-change="changePageSize"
			 show-sizer show-total />

			<Modal ref="add" v-model="addModal" title="新增角色" width="1200">
				<Form ref="addRole" :model="addRole" :rules="roleValidate" :label-width="100">
					<FormItem label="角色代码：" prop="code">
						<Input v-model="addRole.code" placeholder="请输入角色代码"></Input>
					</FormItem>
					<FormItem label="角色名称：" prop="name">
						<Input v-model="addRole.name" placeholder="请输入角色名称"></Input>
					</FormItem>
					<FormItem label="关联资源：" prop="permissionId">
<!-- 						<zk-table ref="treeTableAdd" sum-text="sum" index-text="#" :border="true" :data="permissionTableData" :columns="treeDataColumns"
						 :expand-type="false" :selection-type="true">
						</zk-table> -->
            <vxe-table
              ref="treeTableAdd"
              auto-resize
              :tree-config="{children: 'children'}"
              :data="permissionTableData">
              <vxe-table-column type="selection" tree-node></vxe-table-column>
              <vxe-table-column field="name" title="资源名称"></vxe-table-column>
              <vxe-table-column field="type" title="资源类型"></vxe-table-column>
              <vxe-table-column field="perCode" title="权限代码"></vxe-table-column>
              <vxe-table-column field="url" title="URL地址"></vxe-table-column>
              <vxe-table-column field="clazz" title="样式"></vxe-table-column>
            </vxe-table>
					</FormItem>
					<FormItem label="是否可用：">
						<i-switch v-model="addRole.available" size="large" true-value="1" false-value="0">
							<span slot="open">可用</span>
							<span slot="close">不可用</span>
						</i-switch>
					</FormItem>

				</Form>
				<div slot="footer">
					<Button type="text" size="large" @click="addCancel">取消</Button>
					<Button type="primary" size="large" @click="addOk">确定</Button>
				</div>
				<!--</Select>-->
			</Modal>
			<Modal ref="update" v-model="updateModal" title="编辑角色" width="1200">
				<Form ref="updateRole" :model="updateRole" :rules="roleValidate" :label-width="100">
					<FormItem label="角色代码：" prop="code">
						<Input v-model="updateRole.code" placeholder="请输入角色代码"></Input>
					</FormItem>
					<FormItem label="角色名称：" prop="name">
						<Input v-model="updateRole.name" placeholder="请输入角色名称"></Input>
					</FormItem>
					<FormItem label="关联资源：" prop="permissionId">
						<!-- <zk-table ref="treeTableUpdate" sum-text="sum" index-text="#" :border="true" :data="permissionTableData" :columns="treeDataColumns"
						 :expand-type="false" :selection-type="true" v-model="updateRole.permissionId">
						</zk-table> -->
            <vxe-table
              ref="treeTableUpdate"
              auto-resize
              :tree-config="{children: 'children'}"
              :select-config="{checkStrictly:true}"
              :data="permissionTableData"
              row-id = "id">
              <vxe-table-column type="selection" tree-node></vxe-table-column>
              <vxe-table-column field="name" title="资源名称"></vxe-table-column>
              <vxe-table-column field="type" title="资源类型"></vxe-table-column>
              <vxe-table-column field="perCode" title="权限代码"></vxe-table-column>
              <vxe-table-column field="url" title="URL地址"></vxe-table-column>
              <vxe-table-column field="clazz" title="样式"></vxe-table-column>
            </vxe-table>
					</FormItem>
					<FormItem label="是否可用：">
						<i-switch v-model="updateRole.available" size="large" true-value="1" false-value="0">
							<span slot="open">可用</span>
							<span slot="close">不可用</span>
						</i-switch>
					</FormItem>
				</Form>
				<div slot="footer">
					<Button type="text" size="large" @click="editCancel">取消</Button>
					<Button type="primary" size="large" @click="editOk">确定</Button>
				</div>
				<!--</Select>-->
			</Modal>
		</Card>
	</div>

</template>

<script>
	import {queryRolePage,queryRoleList,saveRole,updateRole,removeRole} from '@/api/system/role'
	import {getTableData} from '@/api/system/data'
	export default {
		name: "role",
		data() {
			return {
				addModal: false, //新增模态框
				updateModal: false,
				searchKey: '', //是否锁定
				searchValue: '', //角色名称
				//保存角色信息
				addRole: {
					code: '',
					name: '',
					available: true,
					permissionId: ''
				},
				//修改
				updateRole: {
					id: '',
					code: '',
					name: '',
					available: false,
					permissionId: ''
				},
				//校验
				roleValidate: {
					code: [{
						required: true,
						message: '角色代码不能为空',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '角色名称不能为空',
						trigger: 'blur'
					}],
					permissionId: [{
						required: true,
						message: '管理资源不能为空',
						trigger: 'blur'
					}]
				},
				availableData: [{
						val: '',
						itemName: "全部"
					},
					{
						val: 1,
						itemName: "可用"
					},
					{
						val: 0,
						itemName: "不可用"
					}
				], //是否锁定下拉选
				permissionTableData: [], //资源数据
				roleData: [], //角色列表
				total: 0,
				size: 10,
				current: 1,
				columns: [{
						title: '角色代码',
						key: 'code'
					},
					{
						title: '角色名称',
						key: 'name'
					},
					{
						title: '角色是否可用',
						key: 'available',
						render: (h, params) => {
							return h('div', [
								h('Tag', {
									props: {
										color: params.row.available == true ? 'cyan' : '#c5c8ce'
									}
								}, params.row.available == true ? '可用' : '不可用')
							]);
						}
					},
					// {
					//   title: '资源名称',
					//   key: 'permissionName'
					// },
					{
						title: '操作',
						key: 'action',
						width: 200,
						align: 'center',
						render: (h, params) => {
							let buttons = [];
							if (this.$isAuth("role:edit")) {
								buttons.push(h('Button', {
									props: {
										type: 'info',
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.edit(params.index)
										}
									}
								}, '编辑'))
							}
							if (this.$isAuth("role:delete")) {
								buttons.push(h('Button', {
									props: {
										type: 'warning',
									},
									on: {
										click: () => {
											this.remove(params.row.id)
										}
									}
								}, '删除'))
							}
							return h('div', buttons.length > 0 ? buttons : [h('Tag', {
									props: {
										color: 'warning'
									}
								}, '暂无权限按钮')]
								// h('Button', {
								//   props: {
								//     type: 'info',
								//     size: 'small'
								//   },
								//   style: {
								//     marginRight: '5px'
								//   },
								//   on: {
								//     click: () => {
								//       this.edit(params.index)
								//     }
								//   }
								// }, '查看')
							);
						}
					}
				],
				tableData: [],
        selected:[]
			}
		},
		methods: {
			queryRolePage(available, key) {
				queryRolePage(available, key).then(res => {
					this.tableData = res.records;
					this.total = res.total;
					this.size = res.size;
					this.current = res.current;
				})
			},
			changePage(num) {
				queryRolePage(num, this.size, this.searchKey, this.searchValue).then(res => {
					this.tableData = res.records;
					this.total = res.total;
					this.size = res.size;
					this.current = res.current;
				})
			},
			changePageSize(size) {
				queryRolePage(this.current, size, this.searchKey, this.searchValue).then(res => {
					this.tableData = res.records;
					this.total = res.total;
					this.size = res.size;
					this.current = res.current;
				})
			},
			queryRoleList(available, key) {
				queryRoleList(available, key).then(res => {
					this.tableData = res.data;
				})
			},
			saveRole(role) {
				saveRole(role).then(res => {
					this.$Message.info(res.data);
					this.clearAddFields(this.$refs.treeTableAdd, this.$refs.add);
					this.queryRolePage(this.current, this.size, '', '');
				}).catch(err => {})
			},
			clearAddFields(treeRef, modalRef) {
				modalRef.close();
				treeRef.bodyData.forEach((item, index) => {
					item._isChecked = false;
				});
				this.$refs.addRole.resetFields();
			},
			editRole(role, ref) {
				delete role['createTime'];
				delete role['lastUpdateTime'];
				updateRole(role).then(res => {
					this.$Message.info(res.data);
					this.queryRolePage(this.current, this.size, '', '');
					ref.close();
				}).catch(() => {
					return false;
				})
			},
			addOk() {
        const rows = this.$refs.treeTableAdd.getSelectRecords();
        const rowsId = [];
        //把父级菜单也加上
        rows.forEach((item) => {
          if(rowsId.indexOf(item.id)==-1){
            rowsId.push(item.id);
          }
          if(rowsId.indexOf(item.parentId)==-1&&item.parentId){
            rowsId.push(item.parentId);
          }
        })
        this.addRole.permissionId = rowsId.toString();
				this.$refs.addRole.validate((valid) => {
					if (valid) {
						this.saveRole(this.addRole);
					}
				})
			},
			addCancel() {
				// this.$refs.add.close();
				this.$refs.add.close()
				this.$refs.addRole.resetFields();
			},
			//打开编辑弹框
			edit(index) {
				this.updateModal = true;
        const tableObj = this.$refs.treeTableUpdate;
        //清空选择项
        this.selected = [];
        tableObj.clearSelection();
        //給需要修改的角色赋值
				this.updateRole = this.tableData[index];
				const permissionId = this.updateRole.permissionId;
				const perArr = permissionId.toString().split(","); //防止第二次点击时 权限ID已经转换成数组
        this.updateRole.permissionId = perArr;
        this.selected = perArr;
        const selectedRows = [];
        this.selected.forEach((item) => {
          selectedRows.push(tableObj.getRowById(item))
        })
        tableObj.setSelection(selectedRows, true);
			},
			//编辑保存
			editOk() {
				const rows = this.$refs.treeTableUpdate.getSelectRecords();
        const rowsId = [];
        //把父级菜单也加上
        rows.forEach((item) => {
          if(rowsId.indexOf(item.id)==-1){
            rowsId.push(item.id);
          }
          if(rowsId.indexOf(item.parentId)==-1&&item.parentId){
            rowsId.push(item.parentId);
          }
        })
				this.updateRole.permissionId = rowsId.toString();
				this.$refs.updateRole.validate((valid) => {
					if (valid) {
						this.editRole(this.updateRole, this.$refs.update);
					}
				})
			},
			editCancel() {
				this.$refs.update.close();
			},
			remove(id) {
				this.$Modal.confirm({
					title: '警告',
					content: '你确定要删除该角色吗？',
					onOk: () => {
						removeRole(id).then(res => {
							this.$Message.info(res.data);
							this.queryRolePage(this.current, this.size, '', '');
						}).catch(() => {
							return false;
						})
					}
				});
			}
		},
		mounted() {
			this.queryRolePage(this.current, this.size, '', '');
			getTableData('1', '').then(res => {
				this.permissionTableData = res.data
			})
		}
	}
</script>

<style scoped lang="less">
	.search {
		padding-bottom: 10px;

		&-input {
			padding-right: 10px;
		}
	}

	.add {
		margin-top: 10px;
	}
</style>
