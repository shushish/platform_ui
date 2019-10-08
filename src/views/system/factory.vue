<template>
	<div>
		<Card>
			<Row style="height:42px" class="search">
				<Col span="8">
				<Input clearable placeholder="输入工厂名称" class="search-input" v-model="searchValue" @keyup.enter.native="queryFactoryPage(current,size,searchValue)" />
				</Col>
				<Col span="15">
				<Button @click="queryFactoryPage(current,size,searchValue)" class="search-input" type="primary">
					<Icon type="search" />&nbsp;&nbsp;搜索</Button>
				</Col>
				<Col span="1">
				<Button type="primary" class="add" @click="addModal = true" v-if="$isAuth('factory:add')">新增</Button>
				</Col>
			</Row>

			<Table stripe height="528" :columns="columns" :data="tableData">
				<template slot-scope="scope"  slot="lastUpdateTime">
				 {{scope.row.lastUpdateTime | dateFormatTime}}
			   </template>
			</Table>
			<br />
			
			<Page :total="total" :page-size="size" :current="current" @on-change="changePage" @on-page-size-change="changePageSize"
			 show-sizer show-total />
			<Modal v-model="addModal" ref="add" title="新增工厂" :mask-closable="false">
				<Form ref="factory" :model="factory" :rules="addValidate" :label-width="100">
					<FormItem label="工厂名称：" prop="name">
						<Input v-model="factory.name" placeholder="请输入工厂名称"></Input>
					</FormItem>
					<FormItem label="工厂编码：" prop="code">
						<Input v-model="factory.code" placeholder="工厂编码"></Input>
					</FormItem>
					<FormItem label="工厂地址：" prop="address">
						<Row>
							<Col span="18">
							<Input v-model="factory.address" placeholder="请选择公司公司地址" readonly="readonly"></Input>
							</Col>
							<Col span="6">
							<Button type="primary" @click="openMap">选择地址</Button>
							</Col>
						</Row>
					</FormItem>
					
					<FormItem  label="关联公司：" prop="company">
						<Select multiple v-model.trim="factory.company" placeholder="请选择公司" filterable>
							<Option v-for="item in companyData" :value="item.id" :key="item.id">{{ item.name }}</Option>
						</Select>
					</FormItem>
					<FormItem label="备注：" prop="remark">
						<Input v-model="factory.remark" placeholder="请输入备注信息"></Input>
					</FormItem>
					<FormItem label="序号：" prop="sort">
						<Input v-model="factory.sort" placeholder="请输入排序"></Input>
					</FormItem>
				</Form>
				<div slot="footer">
					<Button type="text" size="large" @click="addCancel">取消</Button>
					<Button type="primary" size="large" @click="addOk">确定</Button>
				</div>
			</Modal>

			<Modal v-model="editModal" ref="edit" title="编辑工厂">
				<Form ref="editFactory" :model="editFactory" :label-width="100">
					<FormItem label="工厂名称：" prop="name">
						<Input v-model="editFactory.name" placeholder="请输入工厂名称"></Input>
					</FormItem>
					<FormItem label="工厂编码：" prop="code">
						<Input v-model="editFactory.code" placeholder="工厂编码"></Input>
					</FormItem>
					<FormItem label="工厂地址：" prop="address">
						<Row>
							<Col span="18">
							<Input v-model="editFactory.address" placeholder="请选择公司公司地址" readonly="readonly"></Input>
							</Col>
							<Col span="6">
							<Button type="primary" @click="openMap">选择地址</Button>
							</Col>
						</Row>
					</FormItem>

					<FormItem label="关联公司：" prop="company">
						<Select multiple v-model.trim="editFactory.company" placeholder="请选择公司" filterable>
							<Option v-for="item in companyData" :value="item.id" :key="item.id">{{ item.name }}</Option>
						</Select>
					</FormItem>
					<FormItem label="备注：" prop="remark">
						<Input v-model="editFactory.remark" placeholder="请输入备注信息"></Input>
					</FormItem>
					<FormItem label="序号：" prop="sort">
						<Input v-model="editFactory.sort" placeholder="请输入排序"></Input>
					</FormItem>
				</Form>
				<div slot="footer">
					<Button type="text" size="large" @click="editCancel">取消</Button>
					<Button type="primary" size="large" @click="editOk">确定</Button>
				</div>
			</Modal>
			
			<Modal v-model="mapModal" ref="map" title="选择工厂地址" fullscreen footer-hide>
				<div class="mapComponent">
					<mapComponent ref="map_component" @change="getPoint"></mapComponent>
				</div>
			</Modal>
		</Card>
	</div>
</template>


<script>
	import { queryFactoryPage,saveFactory,updateFactory,removeFactory } from '@/api/system/factory';
	import { queryCompany } from '@/api/system/company';
	import mapComponent from '@/components/map/map.vue';
	export default {
		name: "factory",
		data() {
			return {
				searchValue: "",
				mapModal: false,
				columns: [{
						title: '序号',
						key: 'sort',
						sortable: true
					},
					{
						title: '工厂名',
						key: 'name'
					},
					{
						title: '工厂编码',
						key: 'code'
					},
					{
						title: '所属公司',
						key: 'companyName'
					},
					{
						title:'更新时间',
						slot:'lastUpdateTime'
					},
					{
						title: '操作',
						key: 'action',
						width: 200,
						align: 'center',
						render: (h, params) => {
							let buttons = []
							if (this.$isAuth("factory:edit")) {
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
							if (this.$isAuth("factory:delete")) {
								buttons.push(h('Button', {
									props: {
										type: 'warning',
									},
									on: {
										click: () => {
											this.remove(params.row.id)
										}
									},
								}, '删除'))
							}
							return h('div', buttons.length > 0 ? buttons : [h('Tag', {
								props: {
									color: 'warning'
								}
							}, '暂无权限按钮')]);
						}
					}
				],
				tableData: [],
				total: 0,
				size: 10,
				current: 1,
				companyData: [], //公司列表
				addModal: false,
				editModal: false,
				factory: {},
				editFactory: {},
				addValidate: {},

			}
		},
		methods: {
			changePage(num) {
				queryFactoryPage(num, this.size, this.key).then(res => {
					this.tableData = res.records;
					this.total = res.total;
					this.size = res.size;
					this.current = res.current;
				})
			},
			changePageSize(size) {
				queryFactoryPage(this.current, size, this.key).then(res => {
					this.tableData = res.records;
					this.total = res.total;
					this.size = res.size;
					this.current = res.current;
				})
			},
			queryFactoryPage(pageNum, pageSize, key) {
				queryFactoryPage(pageNum, pageSize, key).then(res => {
					this.tableData = res.records;
					this.total = res.total;
					this.size = res.size;
					this.current = res.current;
				})
			},
			save(factory, ref) {
				saveFactory(factory).then(res => {
					this.$Message.info(res.data);
					ref.close();
					this.$refs.factory.resetFields();
					this.queryFactoryPage(this.current, this.size, '', '');
				})
			},
			addOk() {
				this.factory.companyId = this.factory.company.toString();
				this.$refs.factory.validate((valid) => {
					if (valid) {
						this.save(this.factory, this.$refs.add);
					}
				})
			},
			addCancel() {
				this.$refs.add.close();
				this.$refs.factory.resetFields();
			},
			update(factory, ref) {
				delete factory['createTime'];
				delete factory['lastUpdateTime'];
				updateFactory(factory).then(res => {
					this.$Message.info(res.data);
					this.queryFactoryPage(this.current, this.size, '', '');
					ref.close();
				});
			},
			edit(index) {
				this.editModal = true;
				//this.editFactory = JSON.parse(JSON.stringify(this.tableData[index]));
				this.editFactory = this.tableData[index];
				this.editFactory.company = this.editFactory.companyId.split(",");
			},
			editOk() {
				this.editFactory.companyId = this.editFactory.company.toString();
				this.$refs.editFactory.validate((valid) => {
					if (valid) {
						this.update(this.editFactory, this.$refs.edit)
					}
				})
			},
			editCancel() {
				this.$refs.edit.close();
			},
			initCompany() {
				queryCompany().then(res => {
					this.companyData = res.data;
				})
			},
			remove(id) {
				debugger
				this.$Modal.confirm({
					title: '警告',
					content: '你确定要删除该用户吗？',
					onOk: () => {
						removeFactory(id).then(res => {
							this.$Message.info(res.data);
							this.queryFactoryPage(this.current, this.size, '', '');
						}).catch(() => {
							return false;
						})
					}
				});
			},
			getPoint(res) {
				this.mapModal = false; //关闭地图
				if(this.addModal){
					this.factory.address = res.address;
					this.factory.lngLat = res.lngLat.toString();					
				}
				if(this.editModal){
					this.editFactory.address = res.address;
					this.editFactory.lngLat = res.lngLat.toString();
				}
			},
			openMap() {
				this.$refs.map_component.loadmap();
				this.mapModal = true;
			}
		},
		mounted() {
			this.queryFactoryPage(this.current, this.size, '');
			this.initCompany();
		},
		components: {
			mapComponent
		}
	}
</script>

<style>
	.mapComponent {
		width: 100%;
		height: 100%;
	}
</style>
