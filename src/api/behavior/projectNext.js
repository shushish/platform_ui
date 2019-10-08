import fetch from '@/utils/fetch'
import qs from 'qs'

//只查询展示的楼栋信息
export function getBuildingsByProjectId(projectId){
  const params = {projectId:projectId,isShowAll:'yes'};
  return fetch.post("/api/projectNext/getBuildingsByProjectId",qs.stringify(params))
}
//查询该项目下所有楼栋信息
export function getAllBuildings(projectId){
  const params = {projectId:projectId,isShowAll:''};
  return fetch.post("/api/projectNext/getBuildingsByProjectId",qs.stringify(params))
}
//更新楼栋信息表
export function updateMarketOrders(array){
  return fetch({method: 'POST',url: '/api/projectNext/updateMarketOrders',data: array,headers: {'content-type': 'application/json;charset=utf-8'}});
}
/** projectInfo单个修改楼栋附件信息 **/
export function uploadAttachement(attachement,fileData) {
  let form = new FormData();
  form.append("projectBuildingId",attachement.buildingNum);
  form.append("type",attachement.type);
  form.append("remark",attachement.remark);
  form.append("projectId",attachement.projectId);
  fileData.forEach(file => {
    form.append("file", file);
  })
  return fetch.post("/api/projectNext/uploadAttachment",form);
}
//查询该项目交付模块,所有上传的附件信息
export function getAllBuildingsAttachement(projectId,type,buildingId){
  const params = {projectId:projectId,type:type,buildingId:buildingId};
  return fetch.post("/api/projectNext/getBuildingAttachementByProjectId",qs.stringify(params))
}
//更新项目楼栋附件信息
export function updateBuildAttachement(params) {
  return fetch.post("/api/projectNext/updateProjectBuildingAttachement",qs.stringify(params))
}
//删除项目楼栋附件信息
export function deleteBuildAttachement(id,url,name,projectId) {
  const params = {id:id,url:url,name:name,projectId:projectId};
  return fetch.post("/api/projectNext/deleteProjectBuildingAttachement",qs.stringify(params))
}
//根据项目id获取项目异常统计信息1(按类型统计)
export function getAbnormitiesCount(projectId) {
  const params = {projectId:projectId};
  return fetch.post("/api/projectNext/countAbnormitiesByProjectId",qs.stringify(params))
}
//根据项目id获取项目异常统计信息2(按异常等级统计)
export function getAbnormitiesCount2(projectId) {
  const params = {projectId:projectId};
  return fetch.post("/api/projectNext/countAbnormitiesByProjectId2",qs.stringify(params))
}
//根据项目id和类型获取项目异常统计信息
export function getAbnormitiesByCondition(projectId,type) {
  const params = {projectId:projectId,type:type};
  return fetch.post("/api/projectNext/getAbnormitiiesByCondition",qs.stringify(params))
}
//根据项目id和等级获取项目异常统计信息
export function getAbnormitiesByLevel(projectId,level) {
  const params = {projectId:projectId,level:level};
  return fetch.post("/api/projectNext/getAbnormitiiesByLevel",qs.stringify(params))
}
//根据项目id更新项目备注信息
export function updateProjectRemarkInfo(projectId,remark) {
  const params = {projectId:projectId,remark:remark};
  return fetch.post("/api/projectNext/updateProjectRemarkInfo",qs.stringify(params))
}
//根据项目id获取项目日志信息
export function getProjectLogs(projectId) {
  const params = {projectId:projectId};
  return fetch.post("/api/projectNext/getProjectLogs",qs.stringify(params))
}
/**项目交付页面的通过操作名称获取跟踪字段列表 **/
export function queryFootmarkPageByObjectName(pageNum,pageSize,objectName,projectId){
  const params = {pageNum:pageNum,pageSize:pageSize,objectName:objectName,projectId:projectId};
  return fetch.post("/api/projectNext/queryFootmarkPageByObjectName",qs.stringify(params))
}
//根据项目id获取项目构件信息
export function getComponentsByProjectId(projectId) {
  const params = {projectId:projectId};
  return fetch.post("/api/projectNext/getComponentsByProjectId",qs.stringify(params))
}
//根据项目id获取项目构件信息
export function getFactoryInfo(projectId) {
  const params = {projectId:projectId};
  return fetch.post("/api/projectNext/getFactoryInfo",qs.stringify(params))
}
//根据项目id获取项目构件信息
export function getFactoryBomInfoByProjectId(projectId) {
  const params = {projectId:projectId};
  return fetch.post("/api/projectNext/getFactoryBomInfoByProjectId",qs.stringify(params))
}
//根据项目id获取项目构件信息
export function getFloorsInfoByBuildingId(buildingId) {
  const params = {buildingId:buildingId};
  return fetch.post("/api/projectNext/getFloorsInfoByBuildingId",qs.stringify(params))
}
//更新预制层段楼层信息
export function updateFloorsInfo(array){
  return fetch({method: 'POST',url: '/api/projectNext/updateFloorsInfo',data: array,headers: {'content-type': 'application/json;charset=utf-8'}});
}
//市场订单信息推送到工厂BPL部门
export function pushOrdersToBPL(array){
  return fetch({method: 'POST',url: '/api/projectNext/pushOrdersToBPL',data: array,headers: {'content-type': 'application/json;charset=utf-8'}});
}
//推送(开工)异常到设计
export function pushAbnormityToDesign(projectId,content) {
  const params = {projectId:projectId,content:content};
  return fetch.post("/api/projectNext/pushAbnormityToDesign",qs.stringify(params))
}
//手动完成异常反馈处理
export function finishAbnormity(abnormityId) {
  const params = {abnormityId:abnormityId};
  return fetch.post("/api/projectNext/finishAbnormity",qs.stringify(params))
}
//异常责任异议提交
export function dutyOppositionSubmit(abnormityId,dep,description,projectId,missionContent) {
  const params = {abnormityId:abnormityId,dep:dep,description:description,projectId:projectId,missionContent:missionContent};
  return fetch.post("/api/projectNext/dutyOppositionSubmit",qs.stringify(params));
}
//异常详情页面，查询下拉框公司列表
export function getAllCompanysById() {
  return fetch.post("/api/company/getAllFullMoneyCompanys");
}
//异常详情页面，查询下拉异常类型列表
export function getAllAbnormityTypes() {
  return fetch.post("/api/abnormity/getAllAbnormityTypes");
}
//交付阶段根据项目id查询项目信息
export function getDeliveryProject(projectId) {
  const params = {projectId:projectId};
  return fetch.post("/api/projectNext/getDeliveryProject",qs.stringify(params));
}
