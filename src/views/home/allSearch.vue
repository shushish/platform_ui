<template>
    <div>
      <Card >
		  <div>
	  			<div class="file_type">客户信息</div>
				<Table stripe :columns="accountCol" :data="accountData">
					<template slot-scope="scope"  slot="name">
						<router-link :to="{ name:'accountInfo',query:{id:scope.row.id} }">{{scope.row.name}}</router-link>
					</template>
				</Table>
		  </div>
		  <br>
		   <div>
				<div class="file_type">项目信息</div>
				<Table stripe :columns="projectCol" :data="projectData">
					<template slot-scope="scope"  slot="name">
						<router-link :to="{ name:'projectInfo',query:{id:scope.row.id} }">{{scope.row.name}}</router-link>
					</template>
				</Table>
		  </div>
	  </Card >
    </div>
</template>

<script>
	import {queryAccountPage} from '@/api/behavior/account';
	import {queryProjectPage} from '@/api/behavior/project';
    export default {
        name: "allSearch",
		data() {
			return {
				accountData:[],
				accountCol:[
					{
						title: '客户名称',
						slot:'name'
					},
					{
					  title:'所属集团',
					  key:'clique'
					},
					{
					  title:'客户类型',
					  key:'type'
					},
					{
					  title:'所属公司',
					  key:'companyName'
					},
					{
					  title:'所有人',
					  key:'userName'
					}
				],
				projectData:[],
				projectCol:[
					{
						title: '项目名称',
						slot:'name'
					},
					{
						title:'项目编号',
						key:'number'
					},
					{
						title:'项目阶段',
						key:'stage'
					},
					{
						title:'所属公司',
						key:'projectCompany'
					},
					{
						title:'所有人',
						key:'projectPeople'
					},
				]
			}
		},
		methods:{
			searchAccount(){
				queryAccountPage(1,10,this.key,'','','','','',null).then(res => {
					this.accountData = res.records;
				});
			},
			searchProject(){
				queryProjectPage(1,10,this.key,'','','','','').then(res => {
					this.projectData = res.records;
				});
			}
		},
		computed:{
			key(){
				return this.$route.query.key;
			}
		},
		created(){

		},
		mounted(){
			this.searchAccount();
			this.searchProject();
		},
		watch: {
			'$route'(to,from){
				this.searchAccount();
				this.searchProject();
			}
		},
    }
</script>

<style scoped lang="less">
	.file_type{
		font-size: 1.3rem;
	}
</style>
