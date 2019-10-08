<template lang="html">
  <Card>
    <Row>
      <Col span="23" class="search-con">
        <Select v-model="searchAvailable" class="search-col" clearable >
          <Option value="1">可用</Option>
          <Option value="0">不可用</Option>
        </Select>
        <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchParameter" @keyup.enter.native="getListNotTree(searchAvailable,searchParameter)" />
        <Button @click="getListNotTree(searchAvailable,searchParameter)" class="search-btn" type="primary">&nbsp;&nbsp;搜索</Button>
      </Col>
			<Col span="1">
				<Button type="primary" @click="openAddModal();" v-if="$isAuth('permission:add:root')"> 新增</Button>
			</Col>
		</Row>

		<Row>
      <Col span="24" class="table-con" style="height: 740px">
        <vxe-table ref="table" border resizable show-overflow :data="tableData" :tree-config="{children: 'children'}">
          <vxe-table-column field="name" title="资源名称" tree-node></vxe-table-column>
          <vxe-table-column field="type" title="资源类型"></vxe-table-column>
          <vxe-table-column field="perCode" title="权限代码"></vxe-table-column>
          <vxe-table-column field="url" title="URL地址"></vxe-table-column>
          <vxe-table-column field="clazz" title="样式"></vxe-table-column>
          <vxe-table-column field="sortString" title="排序号"></vxe-table-column>
          <vxe-table-column field="isUse" title="是否可用"></vxe-table-column>
          <vxe-table-column title="状态">
            <template  v-slot="{ row }">
              {{row.createTime | dateFormatTime}}
            </template>
          </vxe-table-column>

          <vxe-table-column title="操作">
            <template v-slot="{ row }">
              <Button type="success" @click="openAddChildrenModal(row)" v-if="$isAuth('permission:add:node')">添加</Button>
              <Button type="info" @click="openEditModal(row)" v-if="$isAuth('permission:edit')">编辑</Button>
              <Button type="warning" @click="openDeleteModal(row)" v-if="$isAuth('permission:delete')">删除</Button>
              <Tag color="warning" v-if="$isAuth('permission:add:node') == false && $isAuth('permission:edit') ==false && $isAuth('permission:delete') == false">暂无权限按钮</Tag>
            </template>
          </vxe-table-column>
        </vxe-table>
      </Col>

      <Modal
        v-model="addModal"
        ref="addModal"
        title="新增父级资源" :mask-closable="false">
        <Form ref="addFormValidate" :model="addFormValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="资源名称" prop="name">
            <Input v-model="addFormValidate.name" placeholder="请填写资源名称"></Input>
          </FormItem>
          <FormItem label="资源类型" prop="type">
            <RadioGroup v-model="addFormValidate.type">
              <Radio v-for="item in permissionTypeList" :label="item.dictValue" :key="item.dictValue">{{item.dictName}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="权限代码" prop="perCode">
            <Input v-model="addFormValidate.perCode" placeholder="请填写资源类型"></Input>
          </FormItem>
          <FormItem label="URL地址" prop="url">
            <Input v-model="addFormValidate.url" placeholder="请填写URL地址"></Input>
          </FormItem>
          <FormItem label="样式" prop="clazz">
            <Input v-model="addFormValidate.clazz" placeholder="请填写样式"></Input>
          </FormItem>
          <FormItem label="排序号" prop="sortString">
            <Input v-model="addFormValidate.sortString" placeholder="请填写排序号"></Input>
          </FormItem>
          <FormItem label="是否可用" prop="available">
            <i-switch v-model="addFormValidate.available" :value="addFormValidate.available" size="large" true-value="1" false-value="0">
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


      <Modal
        v-model="editModal"
        ref="editModal"
        title="编辑资源" :mask-closable="false">
        <Form ref="updateFormValidate" :model="updateFormValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="资源名称" prop="name">
            <Input v-model="updateFormValidate.name" placeholder="请填写资源名称"></Input>
          </FormItem>
          <FormItem label="资源类型" prop="type">
            <RadioGroup v-model="updateFormValidate.type">
              <Radio v-for="item in permissionTypeList" :label="item.dictValue" :key="item.dictValue">{{item.dictName}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="权限代码" prop="perCode">
            <Input v-model="updateFormValidate.perCode" placeholder="请填写资源类型"></Input>
          </FormItem>
          <FormItem label="URL地址" prop="url">
            <Input v-model="updateFormValidate.url" placeholder="请填写URL地址"></Input>
          </FormItem>
					<FormItem label="上级资源" prop="parentId">
					  <Select v-model="updateFormValidate.parentId" placeholder="请选择上级资源" filterable clearable>
					    <Option v-for="item in permissionData" :value="item.id" :key="item.id">{{ item.name }}</Option>
					  </Select>
					</FormItem>
          <FormItem label="样式" prop="clazz">
            <Input v-model="updateFormValidate.clazz" placeholder="请填写样式"></Input>
          </FormItem>
          <FormItem label="排序号" prop="sortString">
            <Input v-model="updateFormValidate.sortString" placeholder="请填写排序号"></Input>
          </FormItem>
          <FormItem label="是否可用" prop="available">
            <i-switch v-model="updateFormValidate.available" :value="updateFormValidate.available" size="large" true-value="1" false-value="0">
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

      <Modal
        v-model="addChildrenModal"
        ref="addChildrenModal"
        title="添加子级资源" :mask-closable="false">
        <Form ref="addChildrenFormValidate" :model="addChildrenFormValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="资源名称" prop="name">
            <Input v-model="addChildrenFormValidate.name" placeholder="请填写资源名称"></Input>
          </FormItem>
          <FormItem label="资源类型" prop="type">
            <RadioGroup v-model="addChildrenFormValidate.type">
              <Radio v-for="item in permissionTypeList" :label="item.dictValue" :key="item.dictValue">{{item.dictName}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="权限代码" prop="perCode">
            <Input v-model="addChildrenFormValidate.perCode" placeholder="请填写资源类型"></Input>
          </FormItem>
          <FormItem label="URL地址" prop="url">
            <Input v-model="addChildrenFormValidate.url" placeholder="请填写URL地址"></Input>
          </FormItem>
          <FormItem label="样式" prop="clazz">
            <Input v-model="addChildrenFormValidate.clazz" placeholder="请填写样式"></Input>
          </FormItem>
          <FormItem label="排序号" prop="sortString">
            <Input v-model="addChildrenFormValidate.sortString" placeholder="请填写排序号"></Input>
          </FormItem>
          <FormItem label="是否可用" prop="available">
            <i-switch v-model="addChildrenFormValidate.available" size="large" true-value="1" false-value="0">
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
    </Row>
  </Card>
</template>

<script>

  import { getList,getTableData, savePermission , updatePermission , deletePermission} from '@/api/system/data'
  import { findDictionaryByDictValue} from '@/api/system/dictionary'
  export default {
    //name: 'example',
    data() {
      return {
				permissionData:[],
        addModal: false,
        editModal: false,
        addChildrenModal: false,
        searchAvailable: '',
        searchParameter: '',

        //添加资源
        addFormValidate: {
          name: '',
          type: '',
          perCode: '',
          url: '',
          clazz: '',
          sortString: '',
          available: '1'
        },

        //编辑资源
        updateFormValidate:{
          name: '',
          type: '',
          perCode: '',
          url: '',
          clazz: '',
          sortString: '',
          available: '0'
        },

        //添加子集
        addChildrenFormValidate:{
          name: '',
          type: '',
          perCode: '',
          url: '',
          clazz: '',
          sortString: '',
          available: '1'
        },

        //表单规则
        ruleValidate: {
          name: [
            { required: true, message: '资源名称不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '资源类型不能为空', trigger: 'blur' }
          ],
          perCode: [
            { required: true, message: '权限代码不能为空', trigger: 'blur' }
          ]
        },
        tableData: [],
        permissionTypeList: []
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
        getTableData(key,val).then(res => {
          this.tableData = res.data
        })
      },
			getListNotTree(key,val){
				getList(key,val,'').then(res =>{
					this.tableData = res.data
				})
			},
      openAddModal(){
        this.addModal = true;
      },

      addOK() {
        this.$refs.addFormValidate.validate((valid) => {
          if (valid) {
            savePermission(this.addFormValidate).then(res =>{
              this.searchList('','');
              this.$Message.info(res.data);
              this.$refs.addModal.close();
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


      openEditModal(row) {
        this.updateFormValidate = row;
        if(row.available == 1) this.updateFormValidate.available = '1';
        this.editModal = true;
      },

      updateOK(){
        this.$refs.updateFormValidate.validate((valid) => {
          if (valid) {
            delete this.updateFormValidate['createTime'];
            updatePermission(this.updateFormValidate).then(res =>{
              this.searchList('','');
              this.$refs.updateFormValidate.resetFields();
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
        this.$refs.updateFormValidate.resetFields();
        this.$refs.editModal.close();
      },
      openAddChildrenModal(row){
        this.addChildrenFormValidate.parentId = row.id;
        this.addChildrenModal = true;
      },

      addChildrenOK(){
        this.$refs.addChildrenFormValidate.validate((valid) => {
          if (valid) {
            delete this.addChildrenFormValidate['createTime'];
            savePermission(this.addChildrenFormValidate).then(res =>{
              this.searchList('','');
              this.$Message.info(res.data);
              this.$refs.addChildrenModal.close();
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
        this.addChildrenFormValidate.available = false;
        this.$refs.addChildrenModal.close();
      },

      openDeleteModal(row){
        this.$Modal.confirm({
          title: '提示消息',
          content: '确认删除数据！',
          onOk: ()=>
            deletePermission(row.id).then(res =>{
              this.searchList('','');
              this.$Message.info(res.data);
            }).catch(() =>{
              return false;
            })
        })
      }
    },

    mounted () {
      getTableData('','').then(res => {
        this.tableData = res.data;
      }),
			getList('','','menu').then(res => {
				this.permissionData = res.data;
			}),
      findDictionaryByDictValue('ZYLX').then(res =>{
        this.permissionTypeList = res.data;
      })
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
