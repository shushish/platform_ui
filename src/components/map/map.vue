<template>
	<div style="width: 100%;height: 100%;position:relative;">
		<div id="container" class="mymap"></div>
		<Row style="position:absolute;top:2%;width:100%;">
			<Col span="6">
				<input class="ivu-input ivu-input-default" id="tipinput" v-model="seachKey" placeholder="输入地址" type="text"  />
			</Col>
			<Col span="2" v-if="showButton" offset="16" >
				<Button size="large" type='primary' @click='onsubmit()'>确定选点</Button>
			</Col>
		</Row>
		<div class="info" >
			
		</div>
	</div>
</template>

<script>
	import AMap from 'AMap'
	import AMapUI from 'AMapUI'
	export default {
		name:"mapComponent",
		data() {
			return {
				choosePoint: null,
				address:"",
				citycode:"",
				showButton:false,
				seachKey:"",
				map:null,
			}
		},
		props:["addr","lnglat"],
		mounted() {
			this.map = new AMap.Map('container', {
				zoom: 14,
				resizeEnable: true
			});
		},
		methods: {
			loadmap() {
				//debugger
				var auto = null;
				this.map.plugin('AMap.Autocomplete',() =>{
					var autoOptions = {
						input: "tipinput"
					};
					auto = new AMap.Autocomplete(autoOptions);
				});
				
				var placeSearch = null; 
				this.map.plugin('AMap.PlaceSearch',() =>{
					placeSearch = new AMap.PlaceSearch({
						map: this.map
					}); 
				});

				AMap.event.addListener(auto, "select", function(e){
					//console.log(e)
					placeSearch.setCity(e.poi.adcode);
					placeSearch.search(e.poi.name); 
				});
				
				this.map.plugin('AMap.Geolocation', () => {
					const geolocation = new AMap.Geolocation({
						enableHighAccuracy: true, //是否使用高精度定位，默认:true
						//timeout: 10000, //超过10秒后停止定位，默认：5s
						buttonPosition: 'RB', //定位按钮的停靠位置
						buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
						zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点

					});
					//map.addControl(geolocation);
					geolocation.getCurrentPosition((status, result) => {
						AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
							const positionPicker = new PositionPicker({
								//mode: 'dragMarker',
								map: this.map
							});
							positionPicker.on('success', (positionResult) => {
								//console.log(positionResult)
								this.showButton = true;
								const content = [
									"<div style='font-size:1.2rem'>地  址 : " + positionResult.address + "</div>",
									"<div style='font-size:1.2rem'>经纬度 :"+positionResult.position+"</div>",
									"<div style='font-size:1.2rem'>区号 :"+positionResult.regeocode.addressComponent.citycode+"</div>"
								];
								const infoWindow = new AMap.InfoWindow({
									closeWhenClickMap:true,//点击地图关闭
									content: content.join("<br>"),//传入 dom 对象，或者 html 字符串

								});
								infoWindow.open(this.map, positionResult.position);
								this.address = positionResult.address;
								this.citycode = positionResult.regeocode.addressComponent.citycode;
								this.choosePoint = positionResult.position;
							});
							positionPicker.on('fail', (positionResult) => {
								console.log("选点失败");
								console.log(positionResult);
								this.showButton = false;
							});
							const onModeChange = (e) =>	 {
								positionPicker.setMode(e.target.value)
							}
							//确定初始点，有参数用参数，无参数用定位点
							let startAdd = null;
							if(this.lnglat){
								let arrarAdd = this.lnglat.split(',');
								startAdd = arrarAdd;
							}else{
								startAdd = result.position
							}
							positionPicker.start(startAdd);

						});
					});
				});
			},
			onsubmit() {
				const pointData={
					"address":this.address,
					"lngLat":this.choosePoint,
					"citycode":this.citycode
				}
				this.$emit('change',pointData);
// 				console.log(this.showButton)
// 				console.log(this.address)
// 				console.log(this.choosePoint)//lng  lat
// 				console.log(this.citycode)								
			}
		}

	}
</script>

<style>
	.mymap {
		width: 100%;
		height: 100%;
	}

	.info {
		//padding: .75rem 1.25rem;
		margin-bottom: 1rem;
		border-radius: .25rem;
		position: absolute;
		top: 1rem;
		//background-color: white;
		width: auto;
		//min-width: 22rem;
		border-width: 0;
		right: 1rem;
		box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
	}
	
	.info button{
		font-size: 1.5rem;
	}
	
	.amap-sug-result{
		z-index: 9999;
	}
</style>
