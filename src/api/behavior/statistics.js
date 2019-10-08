import fetch from '@/utils/fetch'
import qs from 'qs'


export function saveCheck(check,array) {
  let form = new FormData();
  for (var item in check) {
    form.append(item, check[item] || "");
  }
  array.forEach(file => {
    form.append("file", file);
  })
  return fetch.post("/api/release/save", form);
}

export function saveEditCheck(editRow,array) {
  let form = new FormData();
  for (var item in editRow) {
    form.append(item, editRow[item] || "");
  }
  array.forEach(file => {
    form.append("file", file);
  })
  return fetch.post("/api/release/update", form);
}

export function getCheckInfos(pageNum,pageSize,timeRange,userId,projectId,companyId) {
  let startTime = '';
  let endTime = '';
  if(null != timeRange && timeRange.length >1){
    startTime = timeRange[0];
    endTime = timeRange[1]
  }
  const params = {pageNum:pageNum,pageSize:pageSize,startTime:startTime,endTime:endTime,userId:userId,projectId:projectId,companyId:companyId}
  return fetch.post("/api/statistics/getCheckInfo", qs.stringify(params));
}

export function getAccount(id) {
  const params = {id: id};
  return fetch.post("/api/account/getAccountById", qs.stringify(params));
}

//删除点检记录
export function deleteCheck(ids) {
  var idArray =ids.join(',');
  const params = {idArray:idArray};
  return fetch.post("/api/release/delete",qs.stringify(params));
}
//获取所有公司信息
export function getAllCompanys() {
  return fetch.post("/api/release/getAllCompanys");
}
//删除点检附件
export function deleteCheckAttachement(id) {
  const params = {id:id};
  return fetch.post("/api/release/deleteCheckAttachement",qs.stringify(params));
}

//删除信箱反馈附件
export function deleteMailAttachement(id) {
  const params = {id:id};
  return fetch.post("/api/release/deleteMailAttachement",qs.stringify(params));
}

/**新建信箱反馈内容 **/
/*export function saveMail(tittle,content) {
  const params = {tittle:tittle,content:content,};
  return fetch.post("/api/statistics/saveMail",qs.stringify(params));
}*/

export function saveMail(mail,array) {
  let form = new FormData();
  for (var item in mail) {
    form.append(item, mail[item] || "");
  }
  array.forEach(file => {
    form.append("file", file);
  })
  return fetch.post("/api/release/saveMail", form);
}

export function saveEditMail(editRow,array) {
  let form = new FormData();
  for (var item in editRow) {
    form.append(item, editRow[item] || "");
  }
  array.forEach(file => {
    form.append("file", file);
  })
  return fetch.post("/api/release/updateMail", form);
}

export function mailReply(id,replyContent) {
  const params = {id:id,replyContent:replyContent};
  return fetch.post("/api/release/mailReply",qs.stringify(params));
}
//首页排行榜所有待筛选的季度
export function getQuatersOfLatestThreeYear(){
  return fetch.post("/api/statistics/getQuatersOfLatestThreeYear")
}















