<template>
	<div class="container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h3>物料研判详情</h3>
    </div>

    <!-- 详情内容区域 -->
    <div class="detail-content">
      <el-card shadow="hover" class="detail-card">
        <!-- 项目名称 -->
        <div class="detail-item" style="margin-top: 0; padding-bottom: 24px; border-bottom: 1px solid #e6e6e6;">
          <span class="label">项目名称：</span>
          <span class="value">{{ detailData.name }}</span>
        </div>

        <!-- 委托单PDF文件 -->
        <div class="detail-item" v-if="detailData.entrust.entrust_pdf">
          <span class="label">委托单(PDF)：</span>
          <el-button
						link
            @click="handleDownloadFile(detailData.entrust.entrust_pdf, detailData.entrust.entrust_pdf_name)"
            class="file-link"
            :loading="downloadLoading[detailData.entrust.entrust_pdf]"
          >
            {{ detailData.entrust.entrust_pdf_name }}
          </el-button>

          <!-- <el-button 
            link
            class="file-link"
            icon="el-icon-view" 
            @click="previewFile('pdf', detailData.entrust.entrust_pdf)"
          >
            预览
          </el-button> -->
        </div>

        <!-- 委托单DOCX文件 -->
        <div class="detail-item" v-if="detailData.entrust.entrust_docx">
          <span class="label">委托单(DOCX)：</span>
          <el-button 
						link
            @click="handleDownloadFile(detailData.entrust.entrust_docx, detailData.entrust.entrust_docx_name)"
            class="file-link"
            :loading="downloadLoading[detailData.entrust.entrust_docx]"
          >
            {{ detailData.entrust.entrust_docx_name }}
          </el-button>
          <!-- <el-button 
            link
            class="file-link"
            icon="el-icon-view" 
            @click="previewFile('docx', detailData.entrust.entrust_docx)"
          >
            预览
          </el-button> -->
        </div>
        <div class="suggestion" v-if="detailData.entrust.entrust_pdf || detailData.entrust.entrust_docx">
          <span class="label">委托单建议：</span>
          <span class="value" v-if="detailData.entrust.entrust_suggest" v-html="detailData.entrust.entrust_suggest"></span>
					<span class="value" v-else>无</span>
        </div>

        <!-- 需求规格说明书(DOCX) -->
        <div class="detail-item" v-if="detailData.demandFileList.length > 0">
          <span class="label">需求规格说明书(DOCX)：</span>
          <div class="file-list">
            <div v-for="(file, index) in detailData.demandFileList" :key="index">
              <el-button 
								link
                @click="handleDownloadFile(file.fileId, file.fileName)"
                class="file-link"
                :loading="downloadLoading[file.fileId]"
              >
                {{ file.fileName }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 需求规格说明书(PDF) -->
        <div class="detail-item" v-if="detailData.demand.demand_pdf">
          <span class="label">需求规格说明书(PDF)：</span>
          <el-button
						link
            @click="handleDownloadFile(detailData.demand.demand_pdf, detailData.demand.demand_pdf_name)"
            class="file-link"
            :loading="downloadLoading[detailData.demand.demand_pdf]"
          >
            {{ detailData.demand.demand_pdf_name }}
          </el-button>
        </div>
        <div class="suggestion" v-if="detailData.demandFileList.length > 0 || detailData.demand.demand_pdf">
          <span class="label">需求规格说明书建议：</span>
          <span class="value" v-if="detailData.demand.demand_suggest" v-html="detailData.demand.demand_suggest"></span>
					<span class="value" v-else>无</span>
        </div>

				<!-- 资产收集表 -->
				<div class="detail-item" v-if="detailData.asset.asset_xlsx">
          <span class="label">资产收集表：</span>
          <el-button
						link
            @click="handleDownloadFile(detailData.asset.asset_xlsx, detailData.asset.asset_xlsx_name)"
            class="file-link"
            :loading="downloadLoading[detailData.asset.asset_xlsx]"
          >
            {{ detailData.asset.asset_xlsx_name }}
          </el-button>
        </div>
        <div class="suggestion" v-if="detailData.asset.asset_xlsx">
          <span class="label">资产收集表建议：</span>
          <span class="value" v-if="detailData.asset.asset_suggest" v-html="detailData.asset.asset_suggest"></span>
					<span class="value" v-else>无</span>
        </div>

				<!-- 功能测试用例 -->
				<div class="detail-item" v-if="detailData.case.case_xlsx">
          <span class="label">功能测试用例：</span>
          <el-button 
						link
            @click="handleDownloadFile(detailData.case.case_xlsx, detailData.case.case_xlsx_name)"
            class="file-link"
            :loading="downloadLoading[detailData.case.case_xlsx]"
          >
            {{ detailData.case.case_xlsx_name }}
          </el-button>
        </div>
        <div class="suggestion" v-if="detailData.case.case_xlsx">
          <span class="label">功能测试用例建议：</span>
          <span class="value" v-if="detailData.case.case_suggest" v-html="detailData.case.case_suggest"></span>
					<span class="value" v-else>无</span>
        </div>

				<!-- 性能测试清单 -->
				<div class="detail-item" v-if="detailData.perf.perf_xlsx">
          <span class="label">性能测试清单：</span>
          <el-button
						link
            @click="handleDownloadFile(detailData.perf.perf_xlsx, detailData.perf.perf_xlsx_name)"
            class="file-link"
            :loading="downloadLoading[detailData.perf.perf_xlsx]"
          >
            {{ detailData.perf.perf_xlsx_name }}
          </el-button>
        </div>
        <div class="suggestion" v-if="detailData.perf.perf_xlsx">
          <span class="label">性能测试清单建议：</span>
          <span class="value" v-if="detailData.perf.perf_suggest" v-html="detailData.perf.perf_suggest"></span>
					<span class="value" v-else>无</span>
        </div>

				<!-- 网络安全设计方案 -->
				<div class="detail-item" v-if="detailData.cybersecurity.cybersecurity">
          <span class="label">网络安全设计方案：</span>
          <el-button
						link
            @click="handleDownloadFile(detailData.cybersecurity.cybersecurity, detailData.cybersecurity.cybersecurity_name)"
            class="file-link"
            :loading="downloadLoading[detailData.cybersecurity.cybersecurity]"
          >
            {{ detailData.cybersecurity.cybersecurity_name }}
          </el-button>
        </div>
        <div class="suggestion" v-if="detailData.cybersecurity.cybersecurity">
          <span class="label">网络安全设计方案建议：</span>
          <span class="value" v-if="detailData.cybersecurity.cybersecurity_suggest" v-html="detailData.cybersecurity.cybersecurity_suggest"></span>
					<span class="value" v-else>无</span>
        </div>

				<!-- 概要设计说明书 -->
				<!-- <div class="detail-item">
          <span class="label">概要设计说明书：</span>
          <el-button
						link
            @click="handleDownloadFile(detailData.summary.summary, detailData.summary.summary_name)"
            class="file-link"
            :loading="downloadLoading[detailData.summary.summary]"
          >
            {{ detailData.summary.summary_name }}
          </el-button>
        </div>
        <div class="suggestion">
          <span class="label">概要设计说明书建议：</span>
          <span class="value" v-if="detailData.summary.summary_suggest" v-html="detailData.summary.summary_suggest"></span>
					<span class="value" v-else>无</span>
        </div> -->

				<!-- 详细设计说明书 -->
				<!-- <div class="detail-item">
          <span class="label">详细设计说明书：</span>
          <el-button
						link
            @click="handleDownloadFile(detailData.detailed.detailed, detailData.detailed.detailed_name)"
            class="file-link"
            :loading="downloadLoading[detailData.detailed.detailed]"
          >
            {{ detailData.detailed.detailed_name }}
          </el-button>

          <el-button 
            link
            class="file-link"
            icon="el-icon-view" 
            @click="previewFile('docx', detailData.detailed.detailed)"
          >
            预览
          </el-button>
        </div>
        <div class="suggestion">
          <span class="label">详细设计说明书建议：</span>
          <span class="value" v-if="detailData.detailed.detailed_suggest" v-html="detailData.detailed.detailed_suggest"></span>
					<span class="value" v-else>无</span>
        </div> -->

				<!-- 功能点清单 -->
				<!-- <div class="detail-item">
          <span class="label">功能点清单：</span>
          <el-button
						link
            @click="handleDownloadFile(detailData.feature.feature_list, detailData.feature.feature_list_name)"
            class="file-link"
            :loading="downloadLoading[detailData.feature.feature_list]"
          >
            {{ detailData.feature.feature_list_name }}
          </el-button>
        </div>
        <div class="suggestion">
          <span class="label">功能点清单建议：</span>
          <span class="value" v-if="detailData.feature.feature_suggest" v-html="detailData.feature.feature_suggest"></span>
					<span class="value" v-else>无</span>
        </div> -->
      </el-card>

      <!-- 返回按钮 -->
      <div class="btn-group">
        <el-button @click="goBack">返回列表</el-button>
      </div>
    </div>

    <el-dialog 
      v-model="previewVisible" 
      title="文档预览" 
      width="90%"
      append-to-body
      :close-on-click-modal="false"
      @opened="handlePreviewOpened"
    >
      <div style="height: 90vh; overflow: auto;">
        <template v-if="previewFileData">
          <vue-office-pdf :src="previewFileData" />
        </template>
        <template v-else>
          <vue-office-docx :src="previewFileDocxData" />
        </template>
        
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="pageone">
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted, nextTick } from 'vue';
import { getDetail } from '@/api/materialAnalysis';
import { downloadFile, getFileUrl } from '@/api/file';
import VueOfficePdf from '@vue-office/pdf'
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'

const router = useRouter()
const route = useRoute()

const nameId = ref('')
const downloadLoading = ref({});

// 详情数据
const detailData = ref({
  name: '',
  entrust: {},
  demand: {},
  asset: {},
  case: {},
  perf: {},
  cybersecurity: {},
  summary: {},
  detailed: {},
	feature: {},
	demandFileList: [],
  functionFileUrl: '',
  functionSuggestion: ''
})

const loading = ref(false)

const previewVisible = ref(false)
// 预览的文件数据
const previewFileData = ref(null)
const previewFileDocxData = ref(null)
const isPreviewReady = ref(false)

onMounted(() => {
	nameId.value = route.query.id
	if (nameId.value) {
    getDeatil(nameId.value)
  }
})

const handlePreviewOpened = async () => {
  await nextTick()
  isPreviewReady.value = true
}

const previewFile = async (type, id) => {
  console.log('id', id)
	const res = await getFileUrl(id)
	const contentType = res.headers['content-type'] || res.headers['Content-Type']
	const blob = new Blob([res.data], { type: contentType })
	const link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
  console.log('link.href', link.href)
  if (type === 'pdf') {
    previewFileData.value = link.href
    if (!previewFileData.value) {
      return ElMessage.error('预览失败')
    }
  } else {
    previewFileDocxData.value = link.href
    if (!previewFileDocxData.value) {
      return ElMessage.error('预览失败')
    }
  }

  previewVisible.value = true
}

const previewFileDocx = async (id) => {
  console.log('previewFileDocx', id)
	const res = await getFileUrl(id)
	const contentType = res.headers['content-type'] || res.headers['Content-Type']
	const blob = new Blob([res.data], { type: contentType })
	const link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	console.log('link.href', link.href)
	previewFileData.value = link.href
	if (!previewFileData.value) {
		return ElMessage.error('预览失败')
	}
  previewVisible.value = true
}

const getDeatil = async (id) => {
	try {
    // 调用接口获取数据
		const res = await getDetail(id)
		if (res.code === 200) {
			detailData.value = res.data
			const demandFileList = [];
			const fileIdList = (res.data.demand.demand_docx?.split(',') || []).filter(id => id.trim());
			const fileNameList = Array.isArray(res.data.demand.demand_docx_name) ? res.data.demand.demand_docx_name : [res.data.demand.demand_docx_name];
			const maxLength = Math.max(fileIdList.length, fileNameList.length);
			for (let i = 0; i < maxLength; i++) {
				const fileName = fileNameList[i] || '';
				const fileId = fileIdList[i] || '';
				if (fileName || fileId) {
					demandFileList.push({
						fileName,
						fileId
					});
				}
			}
			detailData.value.demandFileList = demandFileList
		}
  } catch (error) {
    console.error('error:', error)
  }
}

const handleDownloadFile = async (fileId, fileName) => {
  if (!fileId) {
    ElMessage.warning('文件链接不存在！')
    return
	}
  downloadLoading.value[fileId] = true;
  ElMessage.info(`文件「${fileName}」正在下载中，请稍候！`);

  try {
    const response = await downloadFile(fileId);
    const contentType = response.headers['content-type'];
    if (contentType.includes('application/json')) {
			const reader = new FileReader();
			reader.onload = () => {
				try {
					const jsonResponse = JSON.parse(reader.result);
					if (jsonResponse.code === 404) {
						ElMessage.warning(jsonResponse.message || '下载失败')
					} else {
						ElMessage.error(jsonResponse.message || '下载失败')
					}
				} catch (e) {
					ElMessage.error('解析响应失败')
				} finally {
          downloadLoading.value[fileId] = false;
        }
			};
			reader.readAsText(response.data);
		} else {
			const blob = new Blob([response.data]);
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = fileName;
			link.click();
			URL.revokeObjectURL(link.href);
      ElMessage.success(`文件「${fileName}」下载已触发，请在浏览器下载列表查看！`);
      downloadLoading.value[fileId] = false;
		}
  } catch (error) {
    console.log('error:', error);
    downloadLoading.value[fileId] = false;
  }
}

const goBack = () => {
  router.push('/materialAnalysis')
}

</script>

<style lang="scss" scoped>
.page-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e6e6e6;
}
.detail-content {
  // max-width: 800px;
}

.detail-card {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-top: 16px;
  line-height: 1.6;
}

.label {
  font-weight: bold;
  width: 186px;
  flex-shrink: 0;
	color: #303133;
	// text-align: end;
}

.value {
  color: #606266;
}

.file-link {
  color: #409eff;
  padding: 0;
  height: auto;
}

.file-link:hover {
  color: #66b1ff;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion {
  display: flex;
  align-items: flex-start;
  padding-bottom: 24px;
	color: #606266;
	margin-top: 16px;
	border-bottom: 1px solid #e6e6e6;
}

.btn-group {
  text-align: center;
  margin-top: 20px;
}
</style>
