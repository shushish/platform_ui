<template>
  <div>
    <vxe-table id="dictionaryTable" ref="dicTable" border resizable show-overflow :data="dictionaryArray" :edit-config="{trigger: 'click', mode: 'row'}">
      <vxe-table-column field="dictName" title="类别名称" :edit-render="{name: 'input'}"></vxe-table-column>
      <vxe-table-column field="dictValue" title="标识" :edit-render="{name: 'input'}"></vxe-table-column>
      <vxe-table-column field="sort" title="排序" :edit-render="{name: 'input'}"></vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{ row,rowIndex }">
          <Button type="success" @click="openAdd(row.id)">添加</Button>
          <Button type="info" @click="show(rowIndex)">查看</Button>
          <template v-if="$refs.dicTable.hasActiveRow(row)">
            <Button type="primary" @click="handleSave(row)">保存</Button>
            <Button @click="cancleEdit">取消</Button>
          </template>
          <template v-else>
            <Button type="primary" @click="handleEdit(row)">编辑</Button>
          </template>
          <Button type="warning" @click="remove(rowIndex)">删除</Button>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
  import {
    queryDictionary,
    saveDictionary,
    deleteDictionary,
    updateDictionary,
    queryDictionaryData,
    deleteDictionaryData,
    saveDictionaryData,
    updateDictionaryData
  } from '@/api/system/dictionary'
  export default {
    name: "dictionary",
    data() {
      return {
        dictionaryArray: []
      }
    },
    methods: {
      queryDictionary(pageNum, searchValue, keyValue, order) {
        queryDictionary(pageNum, 10, searchValue, keyValue, order).then(res => {
          this.dictionaryArray = res.data.records;
        })
      },
      //编辑
      handleEdit(row) {
        this.$refs.dicTable.setActiveRow(row);
        // this.$set(row, '$isEdit', true)
      },
      cancleEdit() {
        this.$refs.dicTable.clearActived();
      },
      //编辑保存
      handleSave(row) {
        this.$refs.dicTable.clearActived().then(() => {
          // console.log(this.dictionaryArray)
          // this.$set(row, '$isEdit', false);
          // this.updateDictionary(row);
        })
      },
    },
    created() {
      console.log(this)
      this.queryDictionary(1);
    },
  }
</script>

<style>
</style>
