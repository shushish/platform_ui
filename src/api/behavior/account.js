import fetch from '@/utils/fetch'
import qs from 'qs'


export function queryAccountPage(pageNum,pageSize,key,companyIds,types,grades,startTime,endTime,orderKey,order,seeShareFlag) {
	const params = {pageNum:pageNum,pageSize:pageSize,key:key,companyIds:companyIds,types:types,grades:grades,startTime:startTime,endTime:endTime,orderKey:orderKey,order:order,seeShareFlag:seeShareFlag};
	return fetch.post("/api/account/listPage", qs.stringify(params));
}


export function saveAccount(account,array,shareUserId,accountName) {
  let form = new FormData();
  for (var item in account) {
    if(account[item] != null){
      form.append(item, account[item] || "");
    }
  }
  array.forEach(file => {
    form.append("file", file);
  })
  if(shareUserId != null){
    form.append("shareUserId",shareUserId);
  }
  form.append("accountName",accountName);
  return fetch.post("/api/account/save", form);
}


export function updateAccount(account,array,shareUserId) {
  let form = new FormData();
  for (var item in account) {
    if(account[item] != null){
      form.append(item, account[item] || "");
    }
  }
  if(array != null){
    array.forEach(file => {
      form.append("file", file);
    })
  }
  if(shareUserId != null && shareUserId != ''){
    form.append("shareUserId",shareUserId)
  }
  return fetch.post("/api/account/update", form);
}

export function removeAccount(ids) {
  var idArray =ids.join(',');
	const params = {idArray:idArray};
  return fetch.post("/api/account/delete", qs.stringify(params));
}

export function getAccount(id) {
  const params = {id: id};
  return fetch.post("/api/account/getAccountById", qs.stringify(params));
}

  //下拉选获取用户
  export function queryUserList(userSearch) {
  const params = {key:userSearch}
    return fetch.post("/api/account/queryUserList", qs.stringify(params));
  }
  //分享客户
  export function shareAccount(id,userId) {
    const params = {id: id,userId: userId};
    return fetch.post("/api/account/shareAccount", qs.stringify(params));
  }
//获取客户被分享人集合
export function queryShareUserListByObjId(id) {
  const params = {id: id};
  return fetch.post("/api/account/queryShareUserListByObjId", qs.stringify(params));
}
//清除分享表中的该客户数据
export function deleteShareAccount(id,userId) {
  const params = {id: id,userId: userId};
  return fetch.post("/api/account/deleteShareAccount", qs.stringify(params));
}



  //下拉选获取公司
  export function queryCompanyList() {
    return fetch.post("/api/account/queryCompanyByUserId");
  }

  //下拉选获取数据字典数据
  export function findDictionaryByDictValue(dictValue) {
    const params = {dictValue: dictValue};
    return fetch.post("/api/dictionary/findDictionaryByDictValue",qs.stringify(params));
  }

//获取分页页面项目总计数据
export function findMaxProjectDataByUserId() {
  return fetch.post("/api/account/findMaxProjectDataByUserId");
}

//获取用户下的客户数量
export function findAccountTotalByUserId() {
  return fetch.post("/api/account/findAccountTotalByUserId");
}
//获取用户下的能看到的客户名称
export function queryAccountList(key) {
	const params = {key: key};
  return fetch.post("/api/account/queryAccountList1",qs.stringify(params));
}

//天眼查模糊查询客户下拉选
export function findAccountSelectListByEyes(key) {
  const params = {key: key};
  return fetch.post("/api/account/findAccountSelectListByEyes",qs.stringify(params));
}

//天眼查获取企业工商信息
export function findAccountInfo(name) {
  const params = {name: name};
  return fetch.post("/api/account/findAccountInfo",qs.stringify(params));
}

//获取客户综合数据（拜访次数、未联系天数、首次签约日期、最近合作日期、最近联系日期、成交项目个数、累计签约额、PC量、PC均价）
export function findDataBaseByAccountId(id) {
  const params = {id: id};
  return fetch.post("/api/account/findDataBaseByAccountId",qs.stringify(params));
}
//获取d3数据接口
export function d3AccountNetworkData(name) {
  const params = {name: name};
  return fetch.post("/api/account/d3AccountNetworkData", qs.stringify(params));
}

//删除客户附件
export function deleteAccountAttachement(id) {
  const params = {id: id};
  return fetch.post("/api/account/deleteAccountAttachement", qs.stringify(params));
}

//删除客户附件
export function deleteAccountAttachementById(id) {
  const params = {id: id};
  return fetch.post("/api/account/deleteAccountAttachementById", qs.stringify(params));
}



//获取附件分页列表
export function queryAccountAttachementPage(pageNum,pageSize,accountId) {
  const params = {pageNum:pageNum,pageSize:pageSize,accountId: accountId};
  return fetch.post("/api/account/queryAccountAttachementPage", qs.stringify(params));
}

/**attachmentDisplay页面通过附件对象和文件增加附件 **/
export function saveAccountAttachment(accountAttachment,array){
  let form = new FormData();
  for (var item in accountAttachment) {
    form.append(item, accountAttachment[item] || "");
  }
  array.forEach(file => {
    form.append("file", file);
  })
  return fetch.post("/api/account/saveAccountAttachment", form);
}

/**account页面导出数据**/
export function accountExport(key,companyIds,types,grades,startTime,endTime,seeShareFlag){
  const params = {key:key,companyIds:companyIds,types:types,grades:grades,startTime:startTime,endTime:endTime,seeShareFlag:seeShareFlag};
  return fetch({method: 'POST',url: '/api/account/accountExport',params: params,responseType: 'blob',});
}

//批量转入公海
export function shiftToSea(rowArray) {
  const params = {rowArray:rowArray};
  return fetch({method: 'POST',url: '/api/account/shiftToSea',data:params,headers:{'Content-Type': 'application/json'}});
}

//批量转移客户
export function moveAccount(rowArray,moveUserId) {
  const params = {targetId:moveUserId,rowArray:rowArray};
  return fetch({method: 'POST',url: '/api/account/moveAccount',data:params,headers:{'Content-Type': 'application/json'}});

}

//根据客户获取拜访记录集合
export function selectVisitListByAccountId(id) {
  const params = {id: id};
  return fetch.post("/api/visit/selectVisitListByAccountId",qs.stringify(params));
}
//通过客户名称查找id
export function findAccountNameById(accountName) {
  const params = {accountName: accountName};
  return fetch.post("/api/account/findAccountNameById",qs.stringify(params));
}
//获取全部客户
export function selectAllAccount() {
  return fetch.post("/api/account/selectAllAccount");
}

//获取全部客户
export function findAccountSelectList(key) {
  const params = {key: key};
  return fetch.post("/api/account/findAccountSelectList",qs.stringify(params));
}

//获取储备项目ids
export function selectProjectCBXMIdsByAccountId(id) {
  const params = {id: id};
  return fetch.post("/api/account/selectProjectCBXMIdsByAccountId",qs.stringify(params));
}






















