/**
 * 查找JS 节点值
 * option:
 * {
 *  jsonValue:JSON 数组
 *  nodeKey:  node 键
 *  nodeValue: node值 精确查询 只返回一个值
 *  nodeTest: 模糊查询 返回多个值
 *  childKey: 子节点键
 *  resultIsChild: false 返回值是否要Child  默认不带
 *  getHierarchy : 层级
 * }
 *
 * return 添加层级 hierarchy
 */
import axios from 'axios'

import fetch from '@/utils/fetch'
import qs from 'qs'

export function getNode(option){
  let result = [];
  let value;
  let hierarchy = (option.hierarchy+1) || 1;
  for (var i = 0; i < option.jsonValue.length; i++) {
      let obj = {};
      mergeJSON(option.jsonValue[i],obj);
      let childValue = []      //子节点value
      if(option.childKey){
        childValue = obj[option.childKey]
      }

      if(!option.getHierarchy || (option.getHierarchy && hierarchy == option.getHierarchy)){
        value = obj[option.nodeKey]
        if(option.nodeValue){
          if(value == option.nodeValue){
            if(!option.resultIsChild){
              delete obj[option.childKey]
            }
            obj.hierarchy = hierarchy;
            result.push(obj)
            break
          }
        }
        if(option.nodeTest){
          if(option.nodeTest.test(value)){
            if(!option.resultIsChild){
              delete obj[option.childKey]
            }
            obj.hierarchy = hierarchy;
            result.push(obj)
          }
        }
      }
      if(childValue && childValue.length > 0){      //递归子节点
        let temp = {}
        mergeJSON(option,temp)
        temp.jsonValue= childValue
        temp.hierarchy = hierarchy
        result = result.concat(getNode(temp))
        if(option.nodeValue && result.length > 0){
          break
        }
      }
  }
  return result;
}

// 遇到相同元素级属性，以后者（main）为准
// 不返还新Object，而是main改变
export function mergeJSON (minor, main) {
  for (var key in minor) {

    if (main[key] === undefined) {  // 不冲突的，直接赋值
      main[key] = minor[key]
      continue;
    }

    // 冲突了，如果是Object，看看有么有不冲突的属性
    // 不是Object 则以main为主，忽略即可。故不需要else
    if (isJSON(minor[key])) {
      // arguments.callee 递归调用，并且与函数名解耦
      arguments.callee(minor[key], main[key])
    }
  }
}
//导出
export const download = response =>{
    if (!response) {
        return
    }
    var disposition = response.headers['content-disposition'];
    var fileName = decodeURI(disposition.substring(disposition.indexOf('filename=') + 9, disposition.length))
    let url = window.URL.createObjectURL(new Blob([response.data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
}

export const downloadData = (data) =>{
  axios.get(data.url, {
    responseType: 'blob',//重要
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    //let fname = data.name+'.'+data.suffix;
    let fname = data.name;
    link.href = url;
    link.setAttribute('download', fname);
    document.body.appendChild(link);
    link.click();
  }).catch(res =>{
    console.log(res);
  })
}

//加水印下载
export const downloadByWaterMaker = (data,apiUrl,spin) =>{
  // const params = {contractAttachement:data};
  console.log(data)
  fetch({
    method: 'POST',
    url: apiUrl,
    data: data,
    responseType: 'blob',//重要
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    //let fname = data.name+'.'+data.suffix;
    var disposition = response.headers['content-disposition'];
    console.log(disposition)
    let fname = decodeURI(disposition.substring(disposition.indexOf('filename=') + 9, disposition.length));
    console.log(fname)
    link.href = url;
    link.setAttribute('download', fname);
    document.body.appendChild(link);
    link.click();
    if(spin){spin.hide();}

  }).catch(res =>{
    console.log(res);
  })
}



