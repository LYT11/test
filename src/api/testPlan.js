import request from '@/utils/request'
const url = 'api/plan'

/**
* 获取列表页
* @param params
* @returns {*}
*/
export function getList(params) {
  return request ({
    url: `${url}/record/list/`,
    method: 'get',
    params
  })
}

/**
* 测试方案生成
* @param data
* @returns {*}
*/
export function generateTestPlan(data) {
  return request ({
    url: `${url}/schemes/generate/`,
    method: 'post',
    data
  })
}

/**
* 更新安全用例
* @param data
* @returns {*}
*/
export function updatesecureFile(data) {
  return request ({
    url: `${url}/secure/write/`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

/**
* 模板下载
* @param params
* @returns {*}
*/
export function downloadTemplateFile(params) {
	return request ({
		url: `${url}/model/download/`,
		method: 'get',
    responseType: 'blob',
    params
	})
}

/**
* 删除
* @param params
* @returns {*}
*/
export const deletePlan = (id) => {
	return request ({
		url: `${url}/record/delete/${id}`,
		method: 'post'
	})
}