import fetch from '@/utils/fetch'
import qs from 'qs'


export function queryDictionary(searchValue) {
    const params = {searchValue:searchValue};
    return fetch.post("/api/dictionary/query",qs.stringify(params))
  }

  export function saveDictionary(params) {
    return fetch.post( "/api/dictionary/save",qs.stringify(params))
  }

export function deleteDictionary(id) {
  const params = {id:id};
  return fetch.post("/api/dictionary/delete",qs.stringify(params))
}

export function updateDictionary({id,dictName,dictValue,sort}) {
  const params = {id:id,dictName:dictName,dictValue:dictValue,sort:sort};
  return fetch.post( "/api/dictionary/update",qs.stringify(params))
}

export function findDictionaryByDictValue(dictValue) {
  const params = {dictValue:dictValue};
  return fetch.post("/api/dictionary/findDictionaryByDictValue",qs.stringify(params))
}
