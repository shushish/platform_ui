import fetch from '@/utils/fetch'
import qs from 'qs'

/** project列表的分页查询接口 **/
export function queryProjectPage(pageNum,pageSize,searchValue,selectCompany,projectStage,projectType,projectLevel,accountId,stage,province,city,advancingStageStartTime,advancingStageEndTime) {
	if(selectCompany == '' || selectCompany == undefined){
		selectCompany = [];//搜索公司
	}
	if(projectType == '' || projectType == undefined){
		projectType = [];//搜索项目类型
	}
	if(projectStage == '' || projectStage == undefined){
		projectStage = [];//搜索项目阶段
	}
	if(projectLevel == '' || projectLevel == undefined){
		projectLevel = [];//搜索项目级别
	}

	const params = {pageNum:pageNum,pageSize:pageSize,searchValue:searchValue,selectCompany:selectCompany,projectStage:projectStage,projectType:projectType,projectLevel:projectLevel,accountId:accountId,stage:stage,province:province,city:city,advancingStageStartTime:advancingStageStartTime,advancingStageEndTime:advancingStageEndTime};
	return fetch({method: 'POST',url: '/api/project/listPage',data:params,headers:{'Content-Type': 'application/json'}});
}

//根据客户id获取相关关联的项目
export function queryProjectPageByAccountId(pageNum,pageSize,accountId){
  const params = {pageNum:pageNum,pageSize:pageSize,accountId:accountId};
  return fetch.post("/api/project/queryProjectPageByAccountId", qs.stringify(params));
}

//查询项目列表，用于作为下拉选项
export function queryProjectList(name,type){
	const params = {name:name,type:type};
	return fetch.post("/api/project/queryProjectList", qs.stringify(params));
}

/** project页面的通过id删除项目 **/
export function removeProject (ids) {
	var id =ids.join(',')
	const params = {id:id};
  return fetch.post("/api/project/remove",qs.stringify(params))
}
/** **/
export function removeExpectProject (ids) {
	var id =ids.join(',');
  const params = {id:id};
  return fetch.post("/api/project/removeExpect",qs.stringify(params))
}

/** ExpectedProject列表的分页查询接口  **/
export function queryExpectProjectPage (pageNum,pageSize,searchValue,selectCompany,expectReason,projectType,expectMonth,isSure) {
  const params = {pageNum:pageNum,pageSize:pageSize,searchValue:seafrchValue,selectCompany:selectCompany,expectReason:expectReason,projectType:projectType,expectMonth:expectMonth,isSure:isSure};
  return fetch.post("/api/project/listExpectedPage",qs.stringify(params))
}
/** project页面的通过id查找具体的项目 **/
export function findProjectById (id) {
  const params = {id:id};
  return fetch.post("/api/project/findProjectById",qs.stringify(params))
}
/** project页面的通过id修改具体的项目 **/
export function updateProject (project) {
	if(project.profiled !=null && typeof project.profiled == 'object'){
	project.profiled = project.profiled.join(',');
	}
  return fetch({method: 'POST',url: '/api/project/updateProject',data:project,headers:{'Content-Type': 'application/json'}});
}
export function updateProjectStatus (project) {
	if(project.profiled !=null && typeof project.profiled == 'object'){
		project.profiled = project.profiled.join(',');
	}
  return fetch({method: 'POST',url: '/api/project/updateProjectStatus',data:project,headers:{'Content-Type': 'application/json'}});
}
/**ExpectedProject页面的通过id修改具体的项目 **/
export function updateExpectProject(project){
	if(project.profiled !=null && typeof project.profiled == 'object'){
		project.profiled = project.profiled.join(',');
	}
  return fetch({method: 'POST',url: '/api/project/updateExpectProject',data:project,headers:{'Content-Type': 'application/json'}});
}
/** expectedProject页面的通过预成交原因条件查询所有的项目**/
export function queryExpectedProjectData (pageNum,pageSize,expectReasonSpecific) {
	const params = {pageNum:pageNum,pageSize:pageSize,expectReasonSpecific:expectReasonSpecific};
  return fetch.post("/api/project/queryExpectedProjectData",qs.stringify(params))
}
/** salesProject页面的通过查询条件查询所有的销项项目**/
export function querySalesProjectData (pageNum,pageSize,searchValue,selectCompany,projectType,salesApprovalTime,salesApprovalState,key,order) {
	const params = {pageNum:pageNum,pageSize:pageSize,searchValue:searchValue,selectCompany:selectCompany,projectType:projectType,salesApprovalTime:salesApprovalTime,salesApprovalState:salesApprovalState,key:key,order:order};
  return fetch.post("/api/project/querySalesProjectData",qs.stringify(params))
}


/** querySalesProjectPage获取所有的可销项项目**/
export function querySalesProjectPage (pageNum,pageSize,key,adminFlag) {
  const params = {pageNum:pageNum,pageSize:pageSize,key:key,adminFlag:adminFlag};
  return fetch.post("/api/project/querySalesProjectPage",qs.stringify(params))
}





/** salesProject页面通过项目id取消销项**/
export function cancelSalesProject(ids){
	var id =ids.join(',');
	const params = {id:id};
	return fetch.post("/api/project/cancelSalesProject",qs.stringify(params))
}
/**salesProject页面的通过id修改成销项 **/
export function updateSalesProject(project){
	if(project.profiled !=null && typeof project.profiled == 'object'){
	project.profiled = project.profiled.join(',');
	}
  return fetch({method: 'POST',url: '/api/project/updateSalesProject',data:project,headers:{'Content-Type': 'application/json'}});
}

/**修改成销项 (不提交流程)**/
export function updateSalesProjectNoSubmit(project){
  if(project.profiled !=null && typeof project.profiled == 'object'){
    project.profiled = project.profiled.join(',');
  }
  return fetch({method: 'POST',url: '/api/project/updateSalesProjectNoSubmit',data:project,headers:{'Content-Type': 'application/json'}});
}



/**projectInfo页面的通过项目id获取项目的所有项目详细信息(会扩展) **/
export function findProjectInfoByProjectId(id){
	const params = {id:id};
	return fetch.post("/api/project/findProjectInfoByProjectId",qs.stringify(params))
}
/**projectInfo页面的通过项目id获取工厂集合 **/
export function findFactoryListByProjectId(projectId){
	const params = {projectId:projectId};
	return fetch.post("/api/factory/findFactoryListByProjectId",qs.stringify(params))
}
/**projectInfo页面的修改第一个表格的数据**/
export function editProjectInfoOne(project){
	if(project.profiled !=null && typeof project.profiled == 'object'){
	project.profiled = project.profiled.join(',');
	}
  return fetch({method: 'POST',url: '/api/project/editProjectInfoOne',data:project,headers:{'Content-Type': 'application/json'}});
}
/**projectInfo页面的通过项目id获取跟踪字段列表 **/
export function findUpdateFootmarkList(pageNum,pageSize,projectId){
	const params = {pageNum:pageNum,pageSize:pageSize,projectId:projectId};
	return fetch.post("/api/project/findUpdateFootmarkList",qs.stringify(params))
}
/**projectInfo页面的通过项目id获取子项目列表 **/
export function findSonProjectList(pageNum,pageSize,projectId){
	const params = {pageNum:pageNum,pageSize:pageSize,projectId:projectId};
	return fetch.post("/api/project/findSonProjectList",qs.stringify(params))
}
/**projectInfo页面的通过项目id获取客户拜访列表 **/
export function findAccountVisitList(pageNum,pageSize,projectId){
	const params = {pageNum:pageNum,pageSize:pageSize,projectId:projectId};
	return fetch.post("/api/project/findAccountVisitList",qs.stringify(params))
}
/**projectAdd页面的通过用户id查询所属公司 **/
export function queryFactoryByCompany(){
	return fetch.post("/api/project/queryFactoryByCompany")
}
/**projectAdd页面的通过项目名称找到是否有项目**/
export function findProjectNameByCount(name){
	const params = {name:name};

	return fetch.post("/api/project/findProjectNameByCount",qs.stringify(params))
}

/**project页面导出数据**/
export function projectExport(searchValue,selectCompany,projectStage,projectType,projectLevel,province,city,advancingStageStartTime,advancingStageEndTime,expectReason,expectMonth,isSure,salesApprovalTime,salesApprovalState,type,needExportAttr){
		if(selectCompany == '' || selectCompany == undefined){
		selectCompany = [];//搜索公司
	}
	if(projectType == '' || projectType == undefined){
		projectType = [];//搜索项目类型
	}
	if(projectStage == '' || projectStage == undefined){
		projectStage = [];//搜索项目阶段
	}
	if(projectLevel == '' || projectLevel == undefined){
		projectLevel = [];//搜索项目级别
	}
	const params = {searchValue:searchValue,selectCompany:selectCompany,projectStage:projectStage,projectType:projectType,projectLevel:projectLevel,province:province,city:city,advancingStageStartTime:advancingStageStartTime,advancingStageEndTime:advancingStageEndTime,expectReason:expectReason,expectMonth:expectMonth,isSure:isSure,salesApprovalTime:salesApprovalTime,salesApprovalState:salesApprovalState,type:type,needExportAttr:needExportAttr};
	return fetch({method: 'POST',url: '/api/project/projectExport',data:params,headers:{'Content-Type': 'application/json'},responseType: 'blob'});
}

/**首页统计数据导出**/
export function statisticsProjectExport(type,beginTime,endTime,deliveryStatus,companyId){
  const params = {type:type,beginTime:beginTime,endTime:endTime,deliveryStatus:deliveryStatus,companyId:companyId};
  return fetch({method: 'POST',url: '/api/statistics/statisticsProjectExport',params: params,responseType: 'blob',});
}
/**首页异常数据导出**/
export function abnormityExport(beginTime,endTime,companyId,type){
  const params = {beginTime:beginTime,endTime:endTime,companyId:companyId,type:type,};
  return fetch({method: 'POST',url: '/api/statistics/abnormityExport',params: params,responseType: 'blob',});
}
/**首页点检信息导出**/
export function checksExport(timeRange,userId,projectId,companyId){
  let startTime = '';
  let endTime = '';
  if(null != timeRange && timeRange.length >1){
    startTime = timeRange[0];
    endTime = timeRange[1]
  }
  const params = {startTime:startTime,endTime:endTime,userId:userId,projectId:projectId,companyId:companyId}
  return fetch({method: 'POST',url: '/api/statistics/checksExport',params: params,responseType: 'blob',});
}

/**projectAdd页面的删除附件 **/
export function deleteProjectAttachement(id){
	const params = {id:id};
	return fetch.get("/api/project/deleteProjectAttachement",qs.stringify(params))
}
/**查询主页统计信息 **/
export function queryStatisticsInfo(timeRange,companyId){
  var params = null;
    if(null != timeRange && timeRange.length >1){
      params = {startTime:timeRange[0],endTime:timeRange[1],companyId:companyId};
    }else{
      params = {startTime:"",endTime:"",companyId:companyId};
    }
  return fetch.post("/api/statistics/getGroupInfoByUserId",qs.stringify(params))
}
/**查询已成交项目信息 **/
export function querySinningProjectInfo(startTime,endTime){
  const params = {startTime:startTime,endTime:endTime};
  return fetch.post("/api/statistics/getSinningProjectInfo",qs.stringify(params))
}

/**查询交付项目信息 **/
export function queryDeliverProjectInfo(startTime,endTime,deliveryStatus,companyId){
  const params = {startTime:startTime,endTime:endTime,deliveryStatus:deliveryStatus,companyId:companyId};
  return fetch.post("/api/statistics/getStartProjectInfo",qs.stringify(params))
}

/**查询中标项目信息 **/
export function queryBiddingProjectInfo(startTime,endTime){
  const params = {startTime:startTime,endTime:endTime};
  return fetch.post("/api/statistics/getBiddingProjectInfo",qs.stringify(params))
}

/**查询项目异常信息 **/
export function queryAbnormityInfo(startTime,endTime,companyId,type){
  const params = {startTime:startTime,endTime:endTime,companyId:companyId,type:type};
  return fetch.post("/api/statistics/getAbnormityInfo",qs.stringify(params))
}
/**查询项目点检信息 **/
export function queryCheckInfo(startTime,endTime){
  const params = {startTime:startTime,endTime:endTime};
  return fetch.post("/api/statistics/getCheckInfo",qs.stringify(params))
}
//获取所有异形率超过15的项目详情
export function getAbnormityProject(startTime,endTime){
  const params = {startTime:startTime,endTime:endTime};
  return fetch.post("/api/statistics/getAbnormityProject",qs.stringify(params))
}

/** 任务列表的分页查询接口 **/
export function queryMissionPage(pageNum,pageSize) {
  const params = {pageNum:pageNum,pageSize:pageSize};
  return fetch.post("/api/statistics/getMissionInfo",qs.stringify(params));
}

/** 查询用户已反馈内容接口 **/
export function getMailBoxListById(pageNum,pageSize) {
  const params = {pageNum:pageNum,pageSize:pageSize};
  return fetch.post("/api/statistics/getMailById",qs.stringify(params));
}

/* 新建任务列表的分页查询接口 **/
export function queryCreatedMissionPage(pageNum,pageSize) {
  const params = {pageNum:pageNum,pageSize:pageSize,};
  return fetch.post("/api/statistics/getCreatedMission",qs.stringify(params));
}

/**查询最新通知/公告消息 **/
export function queryNoticeInfo(){
  return fetch.post("/api/statistics/getNoticeInfo")
}
/**查询所有通知/公告消息 **/
export function queryNoticePage(pageNum,pageSize) {
  const params = {pageNum:pageNum,pageSize:pageSize};
  return fetch.post("/api/release/getNoticeInfo",qs.stringify(params));
}
/**新建公告**/
export function saveNotice(content) {
  const params = {content:content};
  return fetch.post("/api/release/saveNotice",qs.stringify(params));
}
/**查询未读反馈条数**/
export function queryUnreadCount(){
  return fetch.post("/api/statistics/getUnreadCount");
}

/**查询当前季度销售排名信息 **/
export function querySalesRankInfo(quarter){
  const params = {quarter:quarter};
  return fetch.post("/api/statistics/getSalseRankInfo",qs.stringify(params));
}
/**查询当前季度小组销售排名信息 **/
export function queryGroupRankInfo(quarter){
  const params = {quarter:quarter};
  return fetch.post("/api/statistics/getGroupRankInfo",qs.stringify(params));
}
/**查询当前季度团队销售排名信息 **/
export function queryTeamRankInfo(quarter){
  const params = {quarter:quarter};
  return fetch.post("/api/statistics/getTeamRankInfo",qs.stringify(params));
}

/**查询当前季度质量排名信息 **/
export function queryScoreRankInfo(quarter){
  const params = {quarter:quarter};
  return fetch.post("/api/statistics/getScoreRankInfo",qs.stringify(params));
}
/**查询当前季度小组质量排名信息 **/
export function queryGroupScoreRankInfo(quarter){
  const params = {quarter:quarter};
  return fetch.post("/api/statistics/getGroupScoreRankInfo",qs.stringify(params));
}
/**查询当前季度团队质量排名信息 **/
export function queryTeamScoreRankInfo(quarter){
  const params = {quarter:quarter};
  return fetch.post("/api/statistics/getTeamScoreRankingInfo",qs.stringify(params));
}
/**查询操作员排行信息(现已更改为根据图表选择公司查询排行榜信息) **/
export function queryOperatorRankInfo(companyId){
  const params = {companyId:companyId};
  return fetch.post("/api/statistics/queryOperatorRankInfo",qs.stringify(params));
}
/**处理异常提醒(受理或者不受理异常) **/
export function acceptMissionInfo(missionId,isProxyed,proxyedReason,projectId,array) {
  let form = new FormData();
  form.append("id",missionId);
  form.append("isProxyed",isProxyed);
  form.append("proxyedReason",proxyedReason);
  form.append("projectId",projectId);
  array.forEach(file => {
    form.append("file", file);
  });
  return fetch.post("/api/statistics/acceptMission",form);
}
/**(副总)划分异常归属部门 **/
export function dividedMission(missionId,department,projectId) {
  const params = {missionId:missionId,department:department,projectId:projectId};
  return fetch.post("/api/statistics/dividedMission",qs.stringify(params));
}
/**(副总或总经理)划分异常责任归属部门 **/
export function dividedDuty(missionId,department,projectId) {
  const params = {missionId:missionId,department:department,projectId:projectId};
  return fetch.post("/api/statistics/dividedDuty",qs.stringify(params));
}
/*查询所有项目信息*/
export function queryAllProjects(){
  return fetch.post("/api/statistics/getAllProjects")
}
/**projectAdd页面的删除附件 **/
export function deleteProjectAttachementPost(id){
	const params = {id:id};
	return fetch.post("/api/project/deleteProjectAttachement",qs.stringify(params))
}

/**projectAdd页面添加项目**/
export function insertProject(project,fileData){
	let form = new FormData();
	for (var item in project) {
	  form.append(item, project[item] || "");
	}
	fileData.forEach(file => {
	  form.append("file", file);
	})
	return fetch.post("/api/project/addProject", form)
}
/**projectInfo页面通过项目id查询所有的附件列表 **/
export function queryProjectAttachementList(pageNum,pageSize,id,type){
  const params = {pageNum:pageNum,pageSize:pageSize,id:id,type:type};
  return fetch.post("/api/project/queryProjectAttachementList",qs.stringify(params))
}

/**projectInfo页面通过项目id查询所有的附件列表不分页 **/
export function queryProjectAttachementByProjectIdNopage(id,type){
  const params = {id:id,type:type};
  return fetch.post("/api/project/queryProjectAttachementListNopage",qs.stringify(params))
}




/**attachmentDisplay页面通过附件对象和文件增加附件 **/
export function saveProjectAttachment(projectAttachment,array){
	let form = new FormData();
	for (var item in projectAttachment) {
	  form.append(item, projectAttachment[item] || "");
	}
	array.forEach(file => {
	  form.append("file", file);
	})
	return fetch.post("/api/project/saveProjectAttachment", form);
}
/**projectInfo页面通过项目id查询所有的附件列表 **/
export function findFactoryByCode(facode){
	const params = {facode:facode};
	return fetch.post("/api/factory/findFactoryByCode",qs.stringify(params))
}
export function findApprovalByProjectId(id,type){
	const params = {id:id,type:type};
	return fetch.post("/api/project/findApprovalByProjectId",qs.stringify(params))
}
export function findApprovalByProjectIds(id,types){
	const params = {id:id,types:types};
	return fetch({method: 'POST',url: '/api/project/findApprovalByProjectIds',data:params,headers:{'Content-Type': 'application/json'}});
}//获取公海项目
export function getPublicSea(pageNum,pageSize,searchValue,projectStage,projectType,province,city){
	const params = {pageNum:pageNum,pageSize:pageSize,searchValue:searchValue,projectStage:projectStage,projectType:projectType,province:province,city:city};
	return fetch.post("/api/project/getPublicSea",qs.stringify(params))
}
//领用项目
export function obtainProject(projectId,citycode){
	const params = {projectId:projectId,citycode:citycode};
	return fetch.post("/api/project/obtainProject",qs.stringify(params))
}
//删除项目公海的项目
export function deleteProject(projectIds){
	  const params = {projectIds:projectIds};
		return fetch.post("/api/project/deleteProject",qs.stringify(params));
}
export function queryAbnormalFeedbackList(pageNum,pageSize,projectId){
	const params = {pageNum:pageNum,pageSize:pageSize,projectId:projectId};
	return fetch.post("/api/project/queryAbnormalFeedbackList",qs.stringify(params))
}
export function findFactoryByUserId(){
	return fetch.post("/api/project/findFactoryByUserId")
}

export function saveProjectPng(projectId,data){
	const params = {projectId:projectId,data:data};
	return fetch.post("/api/project/saveProjectPng",qs.stringify(params))
}export function initProjectName(id){
	const params = {id:id};
	return fetch.post("/api/project/findProjectById",qs.stringify(params))
}
export function saveAnbormalFeedback(anbormalFeedback){
	return fetch.post("/api/project/saveAnbormalFeedback",qs.stringify(anbormalFeedback))
}

export function initProjectStage(id){
	const params = {id:id};
	return fetch.post("/api/project/initProjectStage",qs.stringify(params))
}
//通过项目id查询该项目是否有设计图纸
export function initProjectDrawing(id){
	const params = {id:id};
	return fetch.post("/api/project/initProjectDrawing",qs.stringify(params))
}
export function pecialTheProject(id,num){
	const params = {id:id,num:num};
	return fetch.post("/api/project/pecialTheProject",qs.stringify(params))
}

export function initPlan(id){
	const params = {id:id};
	return fetch.post("/api/project/initPlan",qs.stringify(params))
}
//通过项目id获取项目信息
export function getProjectInfoById(projectId){
  const params = {id:projectId};
  return fetch.post("/api/project/getProjectInfoById",qs.stringify(params))
}
export function findContractSignedSaveTime(projectId){
  const params = {projectId:projectId};
  return fetch.post("/api/project/findContractSignedSaveTime",qs.stringify(params))
}
export function updateSignedStatusByProjectId(projectId,type){
  const params = {projectId:projectId,type:type};
  return fetch.post("/api/project/updateSignedStatusByProjectId",qs.stringify(params))
}
export function initContractSignedApprovalStatusFlag1(projectId){
  const params = {projectId:projectId};
  return fetch.post("/api/project/initContractSignedApprovalStatusFlag1",qs.stringify(params))
}
//获取Echarts图标数据
export function queryEchartsData(companyId,dataType,gap){
  const params = {companyId:companyId,dataType:dataType,gap:gap};
  return fetch.post("/api/statistics/queryEchartsDataPlus",qs.stringify(params))
}
export function findParentProjectByProjectId(projectId){
  const params = {projectId:projectId};
  return fetch.post("/api/project/findParentProjectByProjectId",qs.stringify(params))
}

export function projectMove(projectIds,userId){
  const params = {projectIds:projectIds,userId:userId};
  return fetch.post("/api/project/projectMove",qs.stringify(params,{indices: false}))
}
export function initQuoteApprovalStatusFlag(projectId){
	const params = {projectId:projectId};
	return fetch.post("/api/project/initQuoteApprovalStatusFlag",qs.stringify(params))
}

export function updateHaulDistanceById(projectId,haulDistance){
	const params = {projectId:projectId,haulDistance:haulDistance};
	return fetch.post("/api/project/updateHaulDistanceById",qs.stringify(params))
}

//领用项目获取项目客户列表
export function getAccountListByReceive(projectId,citycode){
  const params = {projectId:projectId,citycode:citycode};
  return fetch.post("/api/project/getAccountListByReceive",qs.stringify(params))
}

//领用项目获取项目客户列表
export function receiveProject(accountRows,projectId,citycode){
  const params = {targetId:projectId,rowArray:accountRows,citycode:citycode};
  return fetch({method: 'POST',url: '/api/project/receiveProject',data:params,headers:{'Content-Type': 'application/json'}});
}

//置空项目的字段
export function setNullInProject(column,projectId){
  const params = {column:column,projectId:projectId};
  return fetch.post("/api/project/setNullInProject",qs.stringify(params))
}
//获取项目施工方案内容
export function getProjectConstructionSchemeContent(id){
  const params = {id:id};
  return fetch.post("/api/project/getProjectConstructionSchemeContent",qs.stringify(params))
}

//保存施工方案内容
export function saveConstruction(project){
  return fetch({method: 'POST',url: '/api/project/saveConstruction',data:project,headers:{'Content-Type': 'application/json'}});
}





