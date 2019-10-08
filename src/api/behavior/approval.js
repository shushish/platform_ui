import fetch from '@/utils/fetch'
import qs from 'qs'

export function queryPage (pageNum,pageSize) {
  const params = {pageNum:pageNum,pageSize:pageSize};
  return fetch.post("/api/approval/queryPage",qs.stringify(params))
}

/*提交项目审批参数*/
/*export function approvalSubmit(flowType,typeDescription,objId,objType) {
  const params = {flowType:flowType,typeDescription:typeDescription,objId:objId,objType:objType};
  return fetch.post("/api/approval/approvalSubmit",qs.stringify(params));
}*/
/*提交项目审批参数*/
export function approvalSubmit(flowType,typeDescription,objId,objType,array) {
  let form = new FormData();
  form.append("flowType", flowType || "");
  form.append("typeDescription", typeDescription || "");
  form.append("objId", objId || "");
  form.append("objType",objType || "");
  array.forEach(file => {
    form.append("file", file);
  })
  return fetch.post("/api/approval/approvalSubmit",form);
}
/*提交特殊审批参数*/
export function approvalSpecialSubmit(ids,typeDescription,objId,objType,array) {
  let form = new FormData();
  form.append("ids", ids || "");
  form.append("typeDescription", typeDescription || "");
  form.append("objId", objId || "");
  form.append("objType",objType || "");
  array.forEach(file => {
    form.append("file", file);
  })
  return fetch.post("/api/approval/approvalSpecialSubmit",form);
}
/*审批*/
export function approval(appovals) {
   return fetch({method: 'POST',url: '/api/approval/approval',data: appovals,headers: {'content-type': 'application/json;charset=utf-8'}});
}
/* 待办流程的分页查询接口 **/
export function queryWaitFlowPage(pageNum,pageSize) {
  const params = {pageNum:pageNum,pageSize:pageSize,};
  return fetch.post("/api/approval/queryPage",qs.stringify(params));
}
/* 已办流程的分页查询接口 **/
export function queryDoneFlowPage(pageNum,pageSize) {
  const params = {pageNum:pageNum,pageSize:pageSize,};
  return fetch.post("/api/approval/getApprovaled",qs.stringify(params));
}
/* 已办流程的分页查询接口 **/
export function queryDoneFlow(pageNum, pageSize,timeRange,choosedProject,flowType) {
  let startTimeStr = '';
  let endTimeStr = '';
  if(null != timeRange && timeRange.length >1){
    startTimeStr = timeRange[0];
    endTimeStr = timeRange[1]
  }
  const params = {pageNum:pageNum,pageSize:pageSize,startTimeStr:startTimeStr,endTimeStr:endTimeStr,projectId:choosedProject,flowType:flowType}
  return fetch.post("/api/approval/getApprovaled",qs.stringify(params));
}
/* 个人提交的申请流程 **/
export function getSubmitApply(pageNum, pageSize,timeRange,choosedProject,flowType) {
  let startTimeStr = '';
  let endTimeStr = '';
  if(null != timeRange && timeRange.length >1){
    startTimeStr = timeRange[0];
    endTimeStr = timeRange[1]
  }
  const params = {pageNum:pageNum,pageSize:pageSize,startTimeStr:startTimeStr,endTimeStr:endTimeStr,projectId:choosedProject,flowType:flowType}
  return fetch.post("/api/approval/getSubmitApply",qs.stringify(params));
}

/* 根据流程编码查询从接口查流程审批详情列表 **/
export function getFlowDetail(approvalCode) {
  const params = {approvalCode:approvalCode};
  return fetch.post("/api/approval/getFlowDetail",qs.stringify(params));
}
/* 批量批准接口 **/
export function batchApproval(codes,comments) {
  const params = {codes:codes,comments:comments,};
  return fetch.post("/api/approval/approval",qs.stringify(params));
}
/* 批量拒绝接口 **/
export function batchReject(codes,comments,rejectType) {
  const params = {codes:codes,comments:comments,rejectType:rejectType};
  return fetch.post("/api/approval/batchReject",qs.stringify(params));
}
/* 批量转办接口 **/
export function batchChangeUser(approvalCodes,comments,changeUserId) {
  const params = {approvalCodes:approvalCodes,comments:comments,changeUserId:changeUserId};
  return fetch.post("/api/approval/batchChangeUser",qs.stringify(params));
}
/* 批量撤回接口(和批量拒绝到创建人接口后台逻辑一样) **/
export function batchCallBack(codes,comments,rejectType) {
  const params = {codes:codes,comments:comments,rejectType:rejectType};
  return fetch.post("/api/approval/batchReject",qs.stringify(params));
}


