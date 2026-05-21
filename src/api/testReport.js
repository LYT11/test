import request from '@/utils/request'
const url = 'api/report'

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
* 测试报告生成
* @param data
* @returns {*}
*/
export function generateTestReport(data) {
  return request ({
    url: `${url}/schemes/generate/`,
    method: 'post',
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
export const deleteReport = (id) => {
	return request ({
		url: `${url}/record/delete/${id}`,
		method: 'post'
	})
}