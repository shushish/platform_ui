<template>
  <div>
    <Card>
      <Row style="height:42px" class="search">
        <Col span="8">
        <Input clearable placeholder="输入公司名称" class="search-input" v-model="searchValue" @keyup.enter.native="queryCompanyPage(current,size,searchValue)" />
        </Col>
        <Col span="15">
        <Button @click="queryCompanyPage(current,size,searchValue)" class="search-input" type="primary">
          <Icon type="search" />&nbsp;&nbsp;搜索</Button>
        </Col>
        <Col span="1">
        <Button type="primary" @click="add" v-if="$isAuth('company:add')">新增</Button>
        </Col>
      </Row>

      <Table stripe height="528" :columns="columns" :data="tableData">
        <template slot-scope="scope" slot="companyType">
          {{scope.row.isAll == 1 ? '全资':'合资'}}
        </template>

        <template slot-scope="scope" slot="lastUpdateTime">
          {{scope.row.lastUpdateTime | dateFormatTime}}
        </template>

        <template slot-scope="scope" slot="action">
          <Button type="info" @click="edit(scope.row)">编辑</Button>
          <Button type="warning" @click="remove(scope.row.id)">删除</Button>
        </template>
      </Table>
      <br />
      <Page :total="total" :page-size="size" :current="current" @on-change="changePage" @on-page-size-change="changePageSize"
        show-sizer show-total />

      <Modal v-model="addModal" ref="add" title="新增公司">
        <Form ref="company" :model="company" :rules="addValidate" :label-width="100">
          <FormItem label="公司名：" prop="name">
            <Input v-model="company.name" placeholder="请输入公司名"></Input>
          </FormItem>
          <FormItem label="公司全称：" prop="registeName">
            <Input v-model="company.registeName" placeholder="请输入公司公司全称"></Input>
          </FormItem>

          <FormItem label="公司省份：" prop="provincesSubordinate">
            <Select clearable v-model="company.provincesSubordinate" placeholder="公司省份" :transfer="true" @on-change="changeProvince(company.provincesSubordinate)">
              <Option v-for="item in projectProvinceArr" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>

          <FormItem label="公司城市：" prop="cityAffiliation">
            <Select clearable v-model="company.cityAffiliation" placeholder="公司城市" :transfer="true">
              <Option v-for="item in projectCityArr" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>

          <FormItem label="公司类型：" prop="isAll">
            <i-switch v-model="company.isAll" size="large" true-value="1">
              <span slot="open">全资</span>
              <span slot="close">合资</span>
            </i-switch>
          </FormItem>

          <FormItem label="序号：" prop="sort">
            <Input v-model="company.sort" placeholder="请输入公司排序" value="this.tableData.length"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="addCancel">取消</Button>
          <Button type="primary" size="large" @click="addOk">确定</Button>
        </div>
      </Modal>

      <Modal v-model="editModal" ref="edit" title="编辑公司">
        <Form ref="editCompany" :model="editCompany" :label-width="100">
          <FormItem label="公司名称：" prop="name">
            <Input v-model="editCompany.name" placeholder="请输入公司名"></Input>
          </FormItem>
          <FormItem label="公司全称：" prop="registeName">
            <Input v-model="editCompany.registeName" placeholder="请输入公司公司全称"></Input>
          </FormItem>

          <FormItem label="公司省份：">
            <Select clearable v-model="editCompany.provincesSubordinate" placeholder="公司省份" :transfer="true" @on-change="changeProvince(editCompany.provincesSubordinate)">
              <Option v-for="item in projectProvinceArr" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>

          <FormItem label="公司城市：">
            <Select clearable v-model="editCompany.cityAffiliation" placeholder="公司城市" :transfer="true">
              <Option v-for="item in projectCityArr" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>

          <FormItem label="公司类型：" prop="isAll">
            <i-switch v-model="editCompany.isAll" size="large" true-value="1" false-value="0">
              <span slot="open">全资</span>
              <span slot="close">合资</span>
            </i-switch>
          </FormItem>
          <FormItem label="序号：" prop="sort">
            <Input v-model="editCompany.sort" placeholder="请输入公司排序"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="editCancel">取消</Button>
          <Button type="primary" size="large" @click="editOk">确定</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>


<script>
  import {
    queryCompanyPage,
    saveCompany,
    updateCompany,
    removeCompany
  } from '@/api/system/company'
  import
  global
  from '@/config/global.js'
  import axios from 'axios'

  export default {
    name: "company",
    data() {
      return {
        searchValue: "",
        columns: [{
            title: '序号',
            key: 'sort',
            sortable: true
          },
          {
            title: '公司名称',
            key: 'name'
          },
          {
            title: '公司类型',
            slot: 'companyType'
          },
          {
            title: '更改时间',
            slot: 'lastUpdateTime'
          },
          {
            title: '操作',
            slot: 'action',
            width: 200,
            align: 'center'
          }
        ],
        tableData: [],
        total: 0,
        size: 10,
        current: 1,
        projectProvinceArr: [], //项目省份
        projectCityArr: [], //项目城市
        province: '', //搜索省
        city: '', //搜索市
        addModal: false,
        editModal: false,
        company: {},
        editCompany: {},
        addValidate: {
          name: [{
            trigger: 'blur',
            required: true,
            message: "公司名称不能为空"
          }],
          provincesSubordinate: [{
            trigger: 'change',
            required: true,
            message: "公司所属省份不能为空"
          }],
          cityAffiliation: [{
            trigger: 'change',
            required: true,
            message: "公司所属城市不能为空"
          }]
        },
      }
    },

    methods: {
      changePage(num) {
        queryCompanyPage(num, this.size, this.key).then(res => {
          this.tableData = res.records;
          this.total = res.total;
          this.size = res.size;
          this.current = res.current;
        })
      },
      changePageSize(size) {
        queryCompanyPage(this.current, size, this.key).then(res => {
          this.tableData = res.records;
          this.total = res.total;
          this.size = res.size;
          this.current = res.current;
        })
      },
      queryCompanyPage(pageNum, pageSize, key) {
        queryCompanyPage(pageNum, pageSize, key).then(res => {
          this.tableData = res.records;
          this.total = res.total;
          this.size = res.size;
          this.current = res.current;
        })
      },
      save(company, ref) {
        saveCompany(company).then(res => {
          this.$Message.info(res.data);
          ref.close();
          this.$refs.company.resetFields();
          this.queryCompanyPage(this.current, this.size, '', '');
        })
      },
      add() {
        this.company.sort = this.total + 1;
        this.addModal = true;
      },
      addOk() {
        this.$refs.company.validate((valid) => {
          if (valid) {
            let url = 'https://restapi.amap.com/v3/config/district?key=6d4b8eed8e1a5c68df269a915124f2c3&subdistrict=0&extensions=base&keywords='+this.company.cityAffiliation;
            axios.get(url).then(res =>{
            	if(res.data&&'OK'== res.data.info){
            		let citycode = res.data.districts[0].citycode;
            		if(citycode){
            			if(citycode.length>3){
            				citycode = citycode.substring(1,4);
            			}
                  this.company.cityCode = citycode;
                  this.save(this.company, this.$refs.add);
            		}else{
            			this.$Message.error("获取区号失败，请联系管理员！");
            		}
            	}else{
            		this.$Message.error("获取行政区域失败，请联系管理员！");
            	}
            	this.loadingObtain = false;
            });
          }
        })
      },
      addCancel() {
        this.$refs.add.close();
        this.$refs.company.resetFields();
      },
      update(company, ref) {
        delete company['createTime'];
        delete company['lastUpdateTime'];
        delete company['children'];
        if (company.provincesSubordinate == '') {
          company.cityAffiliation = '';
        }
        updateCompany(company).then(res => {
          this.$Message.info(res.data);
          this.queryCompanyPage(this.current, this.size, '', '');
          ref.close();
        });
      },
      initProjectProvinceArr() {
        this.projectProvinceArr = global.provinceArr;
      },
      edit(row) {
        this.editModal = true;
        this.editCompany = row;
      },
      editOk() {
        this.$refs.editCompany.validate((valid) => {
          if (valid) {
            this.update(this.editCompany, this.$refs.edit)
          }
        })
      },
      editCancel() {
        this.$refs.edit.close();
      },

      remove(id) {
        this.$Modal.confirm({
          title: '警告',
          content: '你确定要删除该用户吗？',
          onOk: () => {
            // console.log(id)
            removeCompany(id).then(res => {
              this.$Message.info(res.data);
              this.queryCompanyPage(this.current, this.size, '', '');
            }).catch(() => {
              return false;
            })
          }
        });
      },
      changeProvince(province) {
        for (var i = 0; i < this.projectProvinceArr.length; i++) {
          if (province == this.projectProvinceArr[i]) {
            this.projectCityArr = global.city[i];
          }
        }
      },
    },

    mounted() {
      this.queryCompanyPage(this.current, this.size, '', '');
      this.initProjectProvinceArr();
    }
  }
</script>
