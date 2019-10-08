<template>
  <div>
    <Card>
      <Row class="search">
        <Col span="8">
        <Input class="search-input" v-model="searchValue" placeholder="输入名称或标识" @keyup.enter.native='changeValue(searchValue)' />
        </Col>
        <Col span="8">
        <Button @click="changeValue(searchValue)" class="search-btn" type="primary">
          <Icon type="search" />搜索</Button>
        </Col>
        <Col span="8" style="text-align: right;">
        <!-- <Button type="primary" class="add" @click="exportExcel()">导出</Button> -->
        <Button type="primary" class="add" @click="add()" v-if="$isAuth('dictionary:add')">新增</Button>
        </Col>
      </Row>

      <vxe-table id="dictionaryTable" ref="dicTable" border resizable show-overflow :data="dictionaryArray"
        :edit-config="{trigger: 'click', mode: 'row'}"
        :tree-config="{children: 'children'}">
       <vxe-table-column type="index" width="200" title="序号" tree-node></vxe-table-column>
        <vxe-table-column field="dictName" title="类别名称" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="dictValue" title="标识" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="sort" title="排序" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column title="操作">
          <template v-slot="{ row,rowIndex }">
            <Button type="primary" @click="openAdd(row.id)">添加</Button>
            <template v-if="$refs.dicTable.hasActiveRow(row)">
              <Button type="primary" @click="handleSave(row)">保存</Button>
            </template>
            <Button type="warning" @click="remove(row.id)">删除</Button>
          </template>
        </vxe-table-column>
      </vxe-table>

      <Modal v-model="addModal" ref="add" title="新增字典" :mask-closable="false">
        <Form ref="dictionary" :model="dictionary" :rules="addModalValidate" label-position="top">
          <FormItem label="类别名称" prop="dictName">
            <Input v-model="dictionary.dictName" placeholder="请输入类别名称">></Input>
          </FormItem>
          <FormItem label="类别标识" prop="dictValue">
            <Input v-model="dictionary.dictValue" placeholder="请输入类别标识"></Input>
          </FormItem>
          <FormItem label="排序" prop="sort">
            <InputNumber v-model="dictionary.sort" style="width: 150px" placeholder="请输入排序值"></InputNumber>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancel">取消</Button>
          <Button type="primary" size="large" @click="ok">确定</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import {queryDictionary,saveDictionary,deleteDictionary,updateDictionary} from '../../api/system/dictionary'
  import {export_table_to_excel} from '../../libs/excel'
  export default {
    name: "dictionary",
    data() {
      return {
        isDisable: false,
        addModal: false,
        searchValue: '',
        dictionary: {
          dictName: '',
          dictValue: '',
          parentId:'',
          sort: 0
        },
        //新增校验
        addModalValidate: {
          dictName: [{
            required: true,
            message: '类别名称不能为空',
            trigger: 'blur'
          }],
          dictValue: [{
            required: true,
            message: '类别标识不能为空',
            trigger: 'blur'
          }]
        },
        dictionaryArray: []
      }
    },
    methods: {
      //查询
      queryDictionary(searchValue) {
        queryDictionary(searchValue).then(res => {
          this.dictionaryArray = res.data;
          this.searchValue = searchValue;
        })
      },
      //保存
      saveDictionary(dictionary, ref) {
        saveDictionary(dictionary).then(res => {
          this.$Message.info('操作成功');
          this.cancel();
          this.queryDictionary(this.searchValue);
        }).catch(() => {
          return false;
        })
      },
      //删除
      deleteDictionary(id) {
        deleteDictionary(id).then(res => {
          this.$Message.info('操作成功');
          this.queryDictionary(this.searchValue);
        })
      },
      //更新字典
      updateDictionary(dictionary) {
        updateDictionary(dictionary).then(res => {
          this.$Message.info('操作成功');
          this.queryDictionary(this.searchValue);
        }).catch(() => {
          return false;
        })
      },
      //打开子集增加
      openAdd(id) {
        this.isDisable = false;
        this.dictionary.parentId = id;
        this.addModal = true;
      },
      //增加页面确定按钮事件
      ok() {
        this.$refs.dictionary.validate((valid) => {
          if (valid) {
            this.saveDictionary(this.dictionary, this.$refs.add);
          } else {
            this.addModal = true;
          }
        })
      },
      //关闭
      cancel() {
        this.$refs.add.close();
        this.$refs.dictionary.resetFields();
      },
      //删除按钮
      remove(id) {
        this.$Modal.confirm({
          title: '提醒',
          content: '你确定要删除该类别',
          onOk: () => {
            this.deleteDictionary(id)
          },
          onCancel: () => {
            this.$Message.info('取消删除');
          }
        });
      },
      cancleEdit() {
        this.$refs.dicTable.clearActived();
      },
      //编辑保存
      handleSave(row) {
        this.$refs.dicTable.clearActived().then(() => {
          // console.log(this.dictionaryArray)
          // this.$set(row, '$isEdit', false);
          this.updateDictionary(row);
        })
      },
      changeValue(searchValue) {
        this.queryDictionary(searchValue);
      },
      add() {
        this.addModal = true;
      },
      exportExcel() {
        export_table_to_excel("dictionaryTable", "字典数据.xls");
      }
    },
    created() {
      this.queryDictionary();
    },
  }
</script>

<style scoped lang="less">
  .ivu-page {
    margin-top: 10px;
  }

  .add {
    margin-bottom: 10px;
  }
</style>
