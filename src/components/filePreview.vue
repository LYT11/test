<template>
  <el-dialog
    v-model="dialogVisible"
    title="文档预览"
    width="90%"
    :close-on-click-modal="false"
    append-to-body
    @close="handleClose"
    class="file-preview-dialog"
  >
    <div v-loading="loading" :element-loading-text="loadingText" class="preview-container">
      <!-- Excel -->
      <vue-office-excel
        v-if="fileType === 'xlsx' && blobUrl"
        :src="blobUrl"
        @rendered="onRendered"
        @error="handlePreviewError"
        class="xlsx-container"
      />

      <!-- PDF -->
      <vue-office-pdf
        v-if="fileType === 'pdf' && blobUrl"
        :src="blobUrl"
        class="pdf-container"
        @rendered="onRendered"
        @error="handlePreviewError"
      />

      <!-- DOCX -->
      <div v-if="fileType === 'docx'" ref="docxContainerRef" class="docx-container"></div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { TYPE_MAP } from '@/constants/common'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import VueOfficePdf from '@vue-office/pdf'
import { renderAsync } from 'docx-preview'
import { getFileUrl } from '@/api/file'

// 组件暴露的方法
const dialogVisible = ref(false)
const loading = ref(false)
const loadingText = ref('文档加载中，请稍候...')
const fileType = ref('') // 'xlsx', 'pdf', 'docx'
const blobUrl = ref(null)
const blobData = ref(null)
const docxContainerRef = ref(null)

let originalConsoleError = null

const patchConsoleError = () => {
  if (originalConsoleError) return

  originalConsoleError = console.error

  console.error = (...args) => {
    const err = args[0]

    if (err && err.type === 'error' && err.target instanceof HTMLImageElement) {
      return
    }

    originalConsoleError.apply(console, args)
  }
}

const restoreConsoleError = () => {
  if (originalConsoleError) {
    console.error = originalConsoleError
    originalConsoleError = null
  }
}

const cleanup = () => {
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = null
  }
  if (blobData.value) {
    blobData.value = null
  }
  if (docxContainerRef.value) {
    docxContainerRef.value.innerHTML = ''
  }
}

// 关闭弹窗
const handleClose = () => {
  restoreConsoleError()
  cleanup()
  loading.value = false
  loadingText.value = ''
  fileType.value = ''
  dialogVisible.value = false
}

const handlePreviewError = (error) => {
  debugger
  console.error('预览出错:', error)
  ElMessage.error('文档预览失败，请检查文件是否损坏')
  handleClose()
}

// 关闭 loading 的通用函数
const closeLoading = () => {
  loading.value = false
}

// 渲染完成回调（用于 Excel / PDF）
const onRendered = () => {
  closeLoading()
  console.log('文档渲染完成')
}

// 渲染 DOCX 文件
const renderDocx = async () => {
  if (!blobData.value || !docxContainerRef.value) return
  try {
    await renderAsync(blobData.value, docxContainerRef.value, null, {
      className: 'docx-custom', // 自定义类名，用于精准控制样式
      inWrapper: true, // 必须开启，这样才能包裹在 wrapper 里方便控制缩放
      ignoreWidth: false, // 绝对不能忽略宽度，否则表格会无限宽
      ignoreHeight: false,
      breakPages: true, // 保持分页
    })
    // await nextTick()
    fixDocxStyles()
    closeLoading()
  } catch (error) {
    console.error('docx-preview 渲染失败:', error)
  }
}

// 预览
const openFilePreview = async (fileId) => {
  patchConsoleError()
  if (!fileId) {
    ElMessage.warning('文件标识无效')
    return
  }

  if (dialogVisible.value) {
    handleClose()
  }

  loading.value = true
  loadingText.value = '正在获取文件...'
  dialogVisible.value = true

  try {
    const res = await getFileUrl(fileId)
    const contentType = res.headers['content-type'] || res.headers['Content-Type'] || ''
    const typeKey = contentType.toLowerCase()
    const determinedType = TYPE_MAP[typeKey]
    console.log('determinedType', determinedType)

    if (!determinedType) {
      throw new Error(`不支持${contentType}文件类型`)
    }

    fileType.value = determinedType
    const blob = new Blob([res.data], { type: contentType })
    loadingText.value = '正在渲染文档...'
    if (determinedType === 'docx') {
      // DOCX
      blobData.value = blob
      console.log('docx')
      await nextTick()
      await renderDocx()
    } else {
      // Excel / PDF
      blobUrl.value = URL.createObjectURL(blob)
      await nextTick()
      console.log('blobUrl', blobUrl.value)
    }
    console.log('预览准备就绪')
  } catch (error) {
    console.error('预览失败:', error)
    ElMessage.error(error.message || '文件加载失败，请重试')
    handleClose()
  }
}

// 专门用于修复 docx-preview 样式的函数
const fixDocxStyles = () => {
  // 1. 找到 docx-preview 生成的 wrapper 根节点
  const wrapper = docxContainerRef.value.querySelector('.docx-wrapper')
  if (wrapper) {
    // 移除可能导致布局问题的 transform
    wrapper.style.transform = 'none'
    wrapper.style.transformOrigin = 'unset'
    wrapper.style.width = '100% !important'
    wrapper.style.maxWidth = '100% !important'
  }

  // 2. 找到所有的表格并进行强制修正
  const tables = docxContainerRef.value.querySelectorAll('.docx-wrapper table')
  tables.forEach((table, index) => {
    // 【关键修改】表格不撑满，自适应内容宽度
    table.style.cssText = `
      width: auto !important;          /* 宽度自适应内容 */
      max-width: 100% !important;      /* 最大宽度不超过容器 */
      border-collapse: collapse !important;
      table-layout: auto !important;   /* 自动列宽，不强制均分 */
      margin: 1em auto !important;     /* 【新增】上下1em，左右自动（居中） */
      box-sizing: border-box !important;
    `

    // 强制表格边框
    table.style.border = '1px solid #333 !important'

    // 强制表格内的单元格边框和换行
    const cells = table.querySelectorAll('td, th')
    cells.forEach((cell) => {
      cell.style.cssText = `
        border: 1px solid #333 !important;
        padding: 8px !important;
        word-break: break-word !important; /* 改为 break-word，更适合中文 */
        overflow-wrap: break-word !important;
        font-size: 14px !important;
        box-sizing: border-box !important;
        vertical-align: top !important;
      `

      // 确保单元格内容不会撑破单元格
      const divs = cell.querySelectorAll('div')
      divs.forEach((div) => {
        div.style.wordBreak = 'break-word !important'
        div.style.overflowWrap = 'break-word !important'
      })
    })
  })

  // 3. 修复文本不换行导致的溢出 (针对表格外的长文本或超长单词)
  const body = docxContainerRef.value.querySelector('.docx-body')
  if (body) {
    // 将所有连续的英文字母或数字打散换行
    body.style.wordBreak = 'break-word'
    body.style.overflowWrap = 'break-word'
    body.style.width = '100% !important'
    body.style.maxWidth = '100% !important'
  }

  // 4. 强制所有图片自适应，并在图片下方添加间隔
  const images = docxContainerRef.value.querySelectorAll('img')

  if (images.length > 0) {
    // 第一张图片作为Logo
    const logo = images[0]

    // 设置Logo样式
    logo.style.cssText = `
      max-width: 850px !important;      /* Logo 最大宽度 */
      height: auto !important;
      display: block !important;
      margin: 0 auto !important;         /* 居中显示 */
      box-shadow: none !important;
      border: none !important;
    `

    const findFirstTextParagraph = () => {
      const wrapper = docxContainerRef.value.querySelector('.docx-custom-wrapper')
      if (!wrapper) return null

      // 查找所有 p 标签
      const paragraphs = wrapper.querySelectorAll('p')

      for (const p of paragraphs) {
        // 检查 p 标签是否在 header 标签内
        const isInHeader = p.closest('header')

        // 如果在 header 标签内，则跳过这个 p 标签
        if (isInHeader) {
          console.log('跳过 header 内的 p 标签:', p)
          continue
        }

        // 检查 p 标签是否有文本内容（去除空格后不为空）
        const textContent = p.textContent?.trim()
        if (textContent && textContent.length > 0) {
          // 找到第一个不在 header 内的有文本的 p 标签
          console.log('找到第一行文本 p 标签（非 header）:', p)
          return p
        }
      }
      return null
    }

    const firstTextParagraph = findFirstTextParagraph()
    if (firstTextParagraph) {
      // 给第一行文本所在的 p 标签添加 margin-top: 20%
      firstTextParagraph.style.marginTop = '20%'

      // 确保 p 标签是块级元素
      firstTextParagraph.style.display = 'block'

      console.log('第一行文本元素:', firstTextParagraph, '已添加 margin-top: 20%')
    } else {
      console.log('未找到第一行文本元素')
    }

    // 处理其他图片
    for (let i = 1; i < images.length; i++) {
      images[i].style.cssText = `
        max-width: 100% !important;
        height: auto !important;
        display: block !important;
        padding: 10px 0 !important;
      `
    }
  }
}

defineExpose({ openFilePreview })
</script>

<style lang="scss">
.file-preview-dialog {
  display: flex;
  flex-direction: column;
  height: 96vh;
  margin: 2vh auto !important;

  .el-dialog__body {
    flex: 1;
    overflow: hidden;
    min-height: 0;
    padding: 0;
  }
}

.preview-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.xlsx-container,
.pdf-container,
.docx-container {
  height: 100%;
  width: 100%;
  overflow: auto;
  background: #f5f5f5;
}

.xlsx-container {
  overflow-x: hidden;
}

/* 这里的深度选择器主要用于防止 docx-preview 默认样式干扰 */
.docx-container :deep(.docx-custom) {
  font-family: 'SimSun', 'Microsoft YaHei', serif !important;
  line-height: 1.6 !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* 图片样式优化 */
.docx-container img {
  max-width: 100% !important;
  height: auto !important;
  display: block !important;
  // padding: 10px 0 !important;
}

/* 表格不撑满，自适应内容宽度并居中 */
.docx-container table {
  width: auto !important;
  max-width: 99% !important;
  border-collapse: collapse !important;
  table-layout: auto !important;
  margin: 1em auto !important;
  box-sizing: border-box !important;
}

.docx-container td,
.docx-container th {
  border: 1px solid #333 !important;
  padding: 4px !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  box-sizing: border-box !important;
  vertical-align: top !important;
}

.docx-container img {
  max-width: 100% !important;
  height: auto !important;
  display: block !important;
}
</style>
