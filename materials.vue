<template>
  <div>
  <Table border :columns="columns7" :data="data6"></Table><br>
    <Button type="primary" class="add" @click="addModal = true">新增</Button>
  </div>
</template>

<!--<Modal v-model="addModal"  ref="add" title="新增基础数据" >
  <Form  ref="materials"  :model="materials" :rules="addModalValidate"  label-position="top"   >
    <FormItem label="编码" prop="mcode">
      <Input v-model="materials.mcode" placeholder="请输入类别名称">></Input>
    </FormItem>
    <FormItem label="类别标识" prop="dictValue">
      <Input v-model="dictionary.dictValue" placeholder="请输入类别标识"></Input>
    </FormItem>
    <FormItem label="排序" prop="sort">
      <InputNumber  v-model="dictionary.sort" style="width: 150px" placeholder="请输入排序值"></InputNumber>
    </FormItem>
  </Form>
  <div slot="footer">
    <Button type="text" size="large" @click="cancel">取消</Button>
    <Button type="primary" size="large" @click="ok">确定</Button>
  </div>
</Modal>-->

<script>
  export default {
    data () {
      return {
        addModal: false,
        columns7: [
          {
            title: 'Name',
            key: 'name',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('strong', params.row.name)
              ]);
            }
          },
          {
            title: 'Age',
            key: 'age'
          },
          {
            title: 'Address',
            key: 'address'
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, 'View'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, 'Delete')
              ]);
            }
          }
        ],
        data6: [
          {
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park'
          },
          {
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park'
          },
          {
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park'
          }
        ]
      }
    },
    methods: {
      show (index) {
        this.$Modal.info({
          title: 'User Info',
          content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
        })
      },
      remove (index) {
        this.data6.splice(index, 1);
      }
    }
  }
</script>

<style scoped>

</style>
