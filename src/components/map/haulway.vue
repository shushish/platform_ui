<template>
	<div id="content_haulway" style="width: 100%;height: 100%;position:relative;">
		<div id="haulway" class="mymap"></div>
		<div id="panel"></div>
		<Card class="tips_map">
			<p><span>起点：</span> <span>{{startAddr}}</span></p>
			<p><span>终点：</span> <span>{{endAddr}}</span></p>
			<p><span>车宽：</span> <Input v-model="width_" placeholder="请确认车宽" style="width: 100px" />米(m)</p>
			<p><span>车高：</span> <Input v-model="height_" placeholder="请确认车高" style="width: 100px" />米(m)</p>
			<p><span>载重：</span> <Input v-model="load_" placeholder="请确认车辆载重" style="width: 100px" />吨(t)</p>
			<p><span>自重：</span> <Input v-model="weight_" placeholder="请确认车辆自重" style="width: 100px" />吨(t)</p>
			<br>
			<p>
				<Button @click="loadHaulway()" type="primary" icon="ios-search">查找路线</Button>
				<Button @click="success()" type="success">确认路线</Button>
			</p>
		</Card>
	</div>
</template>

<script>
	import AMap from 'AMap'
	import html2canvas from 'html2canvas'
	import {saveProjectPng} from '@/api/behavior/project'
	export default {
		name:"haulway",
		data() {
			return {
				map:null,
				haulway:{},
				width_:2.5,
				height_:2,
				load_:1,
				weight_:12,
			}
		},
		props:["startAddr","startLnglat","endAddr","endLnglat","projectId"],
		mounted() {
			// setTimeout(function(){
				// this.map = new AMap.Map('haulway', {
				// 	zoom: 14,
				// 	resizeEnable: true
				// });
			// },1000)
			// this.startAddr = "测试开始地址";
			// this.endAddr = "测试结束地址";
			// this.startLnglat=[112.853499,28.231213];
			// this.endLnglat = [112.992631,28.2176];
			// this.loadHaulway();
		},
		methods: {
			success(){
				this.$Spin.show();
				this.saveImg()
			},
			saveImg(){
				let dom = document.getElementById("content_haulway");
				html2canvas(dom,{
					backgroundColor: '#142E48'
				}).then(canvas => {
					let dataURL = canvas.toDataURL("image/png")
					saveProjectPng(this.projectId,dataURL).then(res =>{
						let httpUrl = res.data;
						this.haulway.httpUrl = httpUrl;
						this.$emit('change',this.haulway);
						this.$Spin.hide();
					})
					.catch(e => {
						this.$Message.error('路线保存失败，请重试！！！');
						console.log(e);
					});
					// console.log(dataURL)
				});
			},
			loadHaulway(){
				// debugger
				// document.getElementById("panel").innerHTML = "";
                this.map = new AMap.Map('haulway', {
					zoom: 14,
					resizeEnable: true
				});
				let driving = null;
				this.map.plugin('AMap.TruckDriving',() =>{
					driving = new AMap.TruckDriving({
						map: this.map,
						policy: 5, // 规划策略
						size: 4, // 车型大小
						width: this.width_, // 宽度
						height: this.height_, // 高度      
						load: this.load_, // 载重
						weight: this.weight_, // 自重
						axlesNum: 2, // 轴数
						isOutline: true,
						outlineColor: '#ffeeee',
						// panel: 'panel',
						showTraffic: false
					});
				});
				// console.log(driving);
				// debugger
				driving.clear();
				
				var path = [];
				path.push({
					lnglat: this.startLnglat//
				}); //起点
				path.push({
					lnglat: this.endLnglat//[116.407012, 39.992093]
				}); //终点
				driving.search(path, (status, result) => {
					// result即是对应的货车导航信息，相关数据结构文档请参考 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
					if (status === 'complete') {
						console.log('获取路线成功')
						this.haulway = result.routes[0];
					} else {
						console.log('获取货车规划数据失败：' + result)
						alert("获取货车路线失败，请联系系统管理员，不然后期项目会推进不下去");
					}
				});
			}
		},
		
		watch:{
			endLnglat:function(newValue,oldValue){
				if(newValue !=''){
				if(this.startLnglat){
					this.endLnglat = newValue;
					this.loadHaulway();
				}
				}
			},
		}
	}
</script>

<style>
	.mymap {
		width: 100%;
		height: 100%;
	}
	.tips_map{
		position: absolute !important;
		width: 300px;
		height: 330px;
		top:10px;
		left: 10px;
		background-color: white;
	}
	.tips_map p{
		margin-top: 5px;
	}
	#panel {
        position: fixed;
        background-color: white;
        max-height: 90%;
        overflow-y: auto;
        top: 10px;
        right: 10px;
        width: 280px;
    }
    #panel .amap-lib-driving {
   	    border-radius: 4px;
        overflow: hidden;
    }
</style>
