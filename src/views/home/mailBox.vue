<template>
  <div id="mailbox">
    <card>
    <Row style="margin-bottom: 0.5rem;">
      <Col span="24">
        <Button style="" @click="newMailBox">新建反馈</Button>
        <Button style="" @click="edit">编辑反馈</Button>
        <Button @click="refresh">刷新</Button>
      </Col>
    </Row>

      <Table height="640" :columns="columns" :data="tableData" @on-selection-change="currentRowChange" :loading="loading">
        <template slot-scope="scope"  slot="timeSlot">
          {{scope.row.createTime| dateFormat}}
        </template>
        <template slot-scope="scope"  slot="replyTimeSlot">
          {{scope.row.replyTime| dateFormat}}
        </template>
        <template slot-scope="scope"  slot="content">
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{scope.row.content}}</p>
        </template>
        <template slot-scope="scope" slot="isDelete">
          <div v-if ="scope.row.isDelete == '0'"><tag color="green">未删除</tag></div>
          <div v-else ="scope.row.isDelete == '1'"><tag color="red">已删除</tag></div>
        </template>
      </Table>
    <br/>
    <Page :total="total" :page-size="size" :current="current" @on-change="changePage" @on-page-size-change="changePageSize"  show-total show-sizer/>
      <br/>

  <!--新建-->
  <Modal v-model="newMailFlag" ref="add" title="新建反馈">
    <template>
      <Form  ref="add" :model="mail"  :label-width="150" inline  label-position = "right">
        <FormItem label="请输入主题：" prop="title" style="width: 90%">
          <Input v-model="mail.title" placeholder="请输入主题" style="width: 100%"></Input>
        </FormItem>

        <FormItem label="请输入反馈内容：" prop="content" style="width: 90%">
          <Input v-model="mail.content" placeholder="请输入反馈内容" type="textarea" style="width: 100%"></Input>
        </FormItem>
        <FormItem label="上传文件：" prop="approvedInstitution">
          <Upload ref="" action="http" :before-upload ="handleUpload" multiple show-upload-list>
            <Button icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
          <div>
            <Row  class="file" >
              <Col   v-for="(item,index) in fileData" :value="item.id" :key="item.id" >
                <!--<a :href="item.url" target="view_window" download >{{item.name}}</a>-->
                <a @click="downloadAttachement(item)">{{item.name}}</a>
                <Icon style="margin-left: 1px" type="md-close"  @click="removeFile(index)"/>
              </Col>
            </Row>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="addCancel">取消</Button>
        <Button type="primary" size="large" @click="addOk">确定</Button>
      </div>

    </template>
  </Modal>

      <!--编辑-->
      <Modal v-model="editMailFlag" ref="edit" title="编辑反馈">
        <template>
          <Form  ref="edit" :model="editRow"  :label-width="150" inline  label-position = "right">
            <FormItem label="请输入主题：" prop="title" style="width: 90%">
              <Input v-model="editRow.title" placeholder="请输入主题" style="width: 100%"></Input>
            </FormItem>

            <FormItem label="请输入反馈内容：" prop="content" style="width: 90%">
              <Input v-model="editRow.content" placeholder="请输入反馈内容" type="textarea" style="width: 100%"></Input>
            </FormItem>
            <FormItem label="上传文件：" prop="approvedInstitution">
              <Upload ref="" action="http" :before-upload ="handleUpload" multiple show-upload-list>
                <Button icon="ios-cloud-upload-outline">上传文件</Button>
              </Upload>
              <div>
                <Row  class="file" >
                  <Col   v-for="(item,index) in fileData" :value="item.id" :key="item.id" >
                    <!--<a :href="item.url" :download="item.name" target="view_window">{{item.name}}</a>-->
                    <a @click="downloadAttachement(item)">{{item.name}}</a>
                    <Icon style="margin-left: 1px" type="md-close"  @click="removeFile(index)"/>
                  </Col>
                </Row>
              </div>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="editCancel">取消</Button>
            <Button type="primary" size="large" @click="editOk">确定</Button>
          </div>

        </template>
      </Modal>


      <!--回复-->
      <Modal v-model="replyFlag" ref="edit" title="回复">
        <template>
          <Form  ref="edit" :model="reply"  :label-width="150" inline  label-position = "right">
            <FormItem label="主题：" prop="title" style="width: 90%">
              <Input v-model="reply.title" placeholder="请输入主题" style="width: 100%" disabled></Input>
            </FormItem>
            <FormItem label="反馈内容：" prop="content" style="width: 90%">
              <Input v-model="reply.content" placeholder="请输入反馈内容" type="textarea" disabled style="width: 100%"></Input>
            </FormItem>
            <FormItem label="回复内容：" prop="content" style="width: 90%">
              <Input v-model="reply.replyContent" placeholder="请输入回复内容" type="textarea" style="width: 100%"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="replyCancel">取消</Button>
            <Button type="primary" size="large" @click="replyOk">确定</Button>
          </div>

        </template>
      </Modal>
    </card>
  </div>

</template>



<script>
  import {getMailBoxListById} from "../../api/behavior/project";
  import {deleteMailAttachement, mailReply, saveEditMail, saveMail} from "../../api/behavior/statistics";
  import {now} from "moment";
  import axios from 'axios';
    export default {
        name: "mailBox",

		data() {
			return {
			  newMailFlag:false,
        replyFlag:false,
        reply:{},
        title:'',
        content:'',
        loading :false,
        total:0,
        size:10,
        current:1,
        columns:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title:'反馈主题',
            key:'title',
            align:'center',
          },
          {
            title:'反馈内容',
            slot:'content',
            width:'550px'
          },
          {
            title:'公司',
            key:'company',
            align:'center',
          },
          {
            title:'职位',
            key:'station',
            align:'center',
          },
          {
            title:'创建时间',
            slot:'timeSlot',
            align:'center',
            sortable: true,
          },
          {
            title:'回复内容',
            key:'replyContent',
            sortable: true,
          },
          {
            title:'回复时间',
            slot:'replyTimeSlot',
            align:'center',
          },
          {
            title: '操作',
            key: 'action',
            width:'250px',
            align: 'center',
            render: (h, params) => {
              let buttons = []
              //待后续配置按钮权限
              //if(this.$isAuth("att:down")){
              if(1==1){
                buttons.push(h('Button', {
                  props: {
                    type: 'primary',
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.replyMail(params.row);
                    }
                  }
                }, '回复'))
              }
              return h('div',buttons.length>0 ? buttons :[ h('Tag', {
                props: {
                  color: 'warning'
                }
              }, '暂无权限按钮')]);
            }
          },
        ],
        tableData:[],
        mailboxAttachementList:[],
        fileData:[],
        mail:{},
        editRow:{},
        editMailFlag:false,
        selections:[],
        currentSelectedIds:'',
      }
		},
     methods:{
       replyMail(row){
         this.reply = row
         this.replyFlag = true;
       },

      newMailBox(){
        this.newMailFlag = true;
        this.fileData = [];
      },

       save(mail,ref){
         delete mail['createTime'];
         delete mail['lastUpdateTime'];
         saveMail(mail,this.fileData).then(res =>{
           this.$Message.info(res.data);
           this.newMailFlag = false;
           this.fileData = [];
           this.selections = [];
           this.initQueryMailboxList(this.current,this.size);
         })
       },
       addOk () {
         let tittle = this.mail.title;
         let content = this.mail.content;
         if( undefined == tittle || undefined == content){
           this.$Message.warning('请输入反馈主题和内容');
           return
         }
         this.save(this.mail,this.$refs.add);

       },


       handleUpload(file){
         this.fileData.push(file);
         return false;
       },
       removeFile(index){
         if(this.fileData[index].id != null){
           //调用后台删除记录接口
           deleteMailAttachement(this.fileData[index].id).then(res =>{
               this.$Message.info(res.data)
             })
           }
         this.fileData.splice(this.fileData.findIndex(item => item.index === index), 1)
       },
       editOk () {
         var editRow = this.editRow;
         editRow.lastUpdateTime = this.$options.filters.dateFormatTime(now());
         delete editRow['mailboxAttachementList'];
         delete editRow['createTime'];
         delete editRow['lastUpdateTime'];
         saveEditMail(editRow,this.fileData).then(res =>{
           this.$Message.info(res.data);
           this.editMailFlag = false;
           this.selections = [];
           this.initQueryMailboxList(this.current,this.size);
         })
       },

       replyOk () {
         let reply = this.reply
         let id = reply.id;
         let replyContent = reply.replyContent;
         if(undefined == replyContent){
           this.$Message.warning('请输入回复内容');
           return
         }

         if(''!=id && null != id &&''!=replyContent && null != replyContent){
           mailReply(id,replyContent).then(res => {
             this.$Message.info(res.data);
             this.replyFlag = false;
             this.reply.replyContent = '';
             this.initQueryMailboxList(this.current,this.size);
           })
         }
       },

       edit(){
         var selections = this.selections;
         if(selections.length != 1 ){
           this.$Message.warning('请选择一条记录。');
           return;
         }
         this.editRow = selections[0];
         this.fileData = this.editRow.mailboxAttachementList || [];
         this.editMailFlag = true;
       },

       currentRowChange(currentRow){
         var selections = currentRow;
         this.selections = currentRow;
         var selectedIds = '';
         for(var i=0;i<selections.length;i++){
           selectedIds = selectedIds + selections[i].id+ ',';
         }
         this.currentSelectedIds = selectedIds;
       },

      //反馈内容翻页查询
       changePage(num){
         getMailBoxListById(num,this.size).then(res => {
           this.tableData = res.data.records;
           this.total = res.data.total;
           this.size = res.data.size;
           this.current = res.data.current;
         })
       },
       //更改页面展示内容条数
       changePageSize(size){
           getMailBoxListById(this.current,size).then(res => {
           this.tableData = res.data.records;
           this.total = res.data.total;
           this.size = res.data.size;
           this.current = res.data.current;
         })
       },
       //初始化查询用户已反馈内容列表
       initQueryMailboxList(current,size){
         this.loading = true;
         getMailBoxListById(current,size).then(res => {
           this.tableData = res.data.records;
           this.total = res.data.total;
         })
         this.loading = false;
       },
       refresh(){
        this.selections = [];
         this.initQueryMailboxList(this.current,this.size);
       },
       addCancel(){
         this.newMailFlag= false;
       },
       editCancel(){
         this.editMailFlag= false;
       },
       replyCancel(){
         this.editMailFlag= false;
       },
       //下载附件
       downloadAttachement(data){
         if (!data) {
           return
         }
         this.$Spin.show({
           render: (h) => {
             return h('div', [
               h('Icon', {
                 'class': 'demo-spin-icon-load',
                 props: {
                   type: 'ios-loading',
                   size: 18
                 }
               }),
               h('div', '文件下载中...')
             ])
           }
         });
         axios.get(data.url, {responseType: 'blob',}).then(response => {
           const url = window.URL.createObjectURL(new Blob([response.data]));
           const link = document.createElement('a');
           //let fname = data.name+'.'+data.suffix;
           let fname = data.name;
           link.href = url;
           link.setAttribute('download', fname);
           document.body.appendChild(link);
           link.click();
           this.$Spin.hide();
         }).catch(res =>{
           this.$Spin.hide();
         })
       },
     },
		mounted () {
      this.initQueryMailboxList(this.current,this.size);
		},
		computed:{

		},
		created(){
		}
    }
</script>

<style>
  #mailbox Button{background: rgb(10,96,154);color: white}
  #mailbox .ivu-table th {text-align: center;}
</style>
