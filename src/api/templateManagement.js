import request from '@/utils/request'
const url = 'api/document/model'

/**
* 获取列表页
* @param params
* @returns {*}
*/
export const getDocumentList = (params) => {
	return request ({
		url: `${url}/list/`,
		method: 'get',
		params
	})
}

/**
* 文件上传
* @param params
* @returns {*}
*/
export function uploadTemplateFile(data, config = {}) {
	return request ({
		url: `api/file/upload/`,
		method: 'post',
		headers: { 'Content-Type': 'multipart/form-data' },
		data,
		...config
	})
}

/**
* 新增
* @param data
* @returns {*}
*/
export function addTemplate(data, config = {}) {
  return request ({
    url: `${url}/create/`,
    method: 'post',
		data,
		config
  })
}

/**
* 更新
* @param data
* @returns {*}
*/
export function updateTemplate(data) {
  return request ({
    url: `${url}/update/`,
    method: 'post',
    data
  })
}
