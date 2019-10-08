<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <!-- <Avatar :src="userAvator"/> -->
			<!-- <Badge :dot="!!messageUnreadCount"> -->
      <Avatar style="font-weight: bold;color: white;background-color:rgb(171,211,236)">{{userName}}</Avatar>
      <!--<span style="margin-left: 10px;color: #000000;font-weight: normal;">{{companyName}}-{{departmentName}}-{{title}}</span>-->
			<!-- </Badge> -->
			
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
				<DropdownItem name="modifypassword">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="modifypassword" ref="modifypassword" title="修改密码">
			<Form  ref="user" :model="formCustom"  :rules="modifypasswordValidate" :label-width="100">
				<FormItem label="旧密码：" prop="oldPwd">
				  <Input v-model="formCustom.oldPwd" type="password" placeholder="请输入旧密码"></Input>
				</FormItem>
				<FormItem label="新密码：" prop="newPwd">
				  <Input v-model="formCustom.newPwd" type="password" placeholder="请输入新密码"></Input>
				</FormItem>
				<FormItem label="确认密码：" prop="newPwd1">
				  <Input v-model="formCustom.newPwd1" type="password" placeholder="请再次输入新密码"></Input>
				</FormItem>
			</Form>	
			<div slot="footer">
			  <Button type="text" size="large" @click="modifyCancel">取消</Button>
			  <Button type="primary" size="large" @click="modifyPassword">确定</Button>
			</div>
		</Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { updatePwd } from '@/api/system/user'
import { getUserInfo } from "@/api/system/login";
export default {
  name: 'User',
	data() {
		const validatePassCheck = (rule, value, callback) => {
				if (value !== this.formCustom.newPwd) {
						callback(new Error('新密码两次输入不一致'));
				} else {
						callback();
				}
		};
		return {
			modifypassword:false,
			formCustom:{
					oldPwd:'',
					newPwd:'',
					newPwd1:''
			},
			modifypasswordValidate:{
				oldPwd: [
				  { required: true, message: '密码不能为空', trigger: 'blur' }
				],
				newPwd: [
				  { required: true, message: '密码不能为空', trigger: 'blur' }
				],
				newPwd1: [
					{ required: true, message: '密码不能为空', trigger: 'blur' },
				  { validator:validatePassCheck, trigger: 'blur' }
				]
			},
			
		}
	},
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
					break
				case 'modifypassword':
					this.modifypassword=true
          break
      }
    },
		modifyPassword(){
			//console.log(getUserInfo())
			this.$refs.user.validate((valid) => {
			  if (valid) {
			    this.updatePwd(this.formCustom,this.$refs.modifypassword);
			  }
			})	
		},
		modifyCancel () {
		  this.$refs.modifypassword.close();
		  this.$refs.user.resetFields();
		},
		updatePwd(formCustom,ref){
			updatePwd(formCustom.newPwd,formCustom.oldPwd).then(res => {
				this.$Message.info(res.data);
				this.$refs.user.resetFields();
				ref.close();
			});
		}
  },
	computed:{
		userName(){
		  var name = this.$store.getters.userName;
		  if(name.length <= 2){
        return name;
      }else{
		    return name.slice(1)
      }
		},
    departmentName(){
      return this.$store.getters.departmentName;
    },
    title(){
      return this.$store.getters.title;
    },
    companyName(){
      return this.$store.getters.companyName;
    }
	},
	mounted () {

	}
}
</script>
