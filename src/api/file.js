import request from '@/utils/request'

/**
* 文件上传
* @param params
* @returns {*}
*/
export function uploadFile(data) {
	return request ({
		url: `api/file/upload/`,
		method: 'post',
		headers: { 'Content-Type': 'multipart/form-data' },
		data
	})
}

/**
* 文件下载
* @param params
* @returns {*}
*/
export function downloadFile(id) {
	return request ({
		url: `api/file/download/${id}`,
		method: 'get',
		responseType: 'blob'
	})
}

/**
* 文件删除
* @param params
* @returns {*}
*/
export function deleteFile(data) {
	return request ({
		url: `api/file/delete/`,
		method: 'delete',
		data
	})
}

/**
* 获取文件地址
* @param params
* @returns {*}
*/
export function getFileUrl(id) {
	return request ({
		url: `api/file/preview/${id}`,
		method: 'get',
		responseType: 'blob'
	})
}