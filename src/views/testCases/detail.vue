<template>
	<div class="container">
    <div class="titleContent">
      <div class="title">{{projectName}} -> 用例详情</div>
      <el-button type="primary" @click="handleReturn">返回列表页</el-button>
    </div>

    <!-- 列表 -->
    <div class="detail-table">
      <el-table v-loading="loading"
        element-loading-text="拼命加载中"
        :data="detailData"
        size="small"
        border
        style="width: 100%"
        :height="detailTableHeight">
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="case_name"
          label="用例名称"
          min-width="100"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="module"
          label="模块"
          width="130"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="precondition"
          label="前置条件"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
          width="60"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="requirement_tracking"
          label="需求追踪"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="test_explain"
          label="测试说明"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="testing_procedure"
          label="测试步骤"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="expected_result"
          label="预期结果"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="prepared_by"
          label="编制人"
          width="100"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间"
          align='center'
          :formatter="timeFormatter"
          width="140">
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="pagination.pageNum"
			:page-sizes="[20, 30, 40, 50, 100]"
			:total="pagination.total"
			:page-size="pagination.pageSize"
			:firstPage="1"
			:layout="pagination.layout"
			style="margin-top:20px; text-align:right;">
		</el-pagination>
  </div>
</template>

<script setup name="testCasesDetail">
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted, onUnmounted, watchEffect  } from 'vue';
import dayjs from 'dayjs';
import { getDetail } from '@/api/testCases';

const router = useRouter()
const route = useRoute()

const projectId = ref('')
const projectName = ref('')

const loading = ref(false)
const detailTableHeight = ref(null)
const detailData = ref([])
const pagination = reactive({
	total: 0,
	pageNum: 1,
	pageSize: 20,
	lastPage: 0,
	background: true,
	layout: 'total, sizes, prev, pager, next, ->, jumper'
})

const getDetails = async() => {
  try {
    let params = {
      page: pagination.pageNum,
      per_page: pagination.pageSize,
      project_id: projectId.value
    }
    let res = await getDetail(params)
    if (res.code === 200) {
      detailData.value = res.data
    }
    pagination.total = res.total
  } catch (error) {
    loading.value = false
    ElMessage.error('服务异常！');
  }
}

const timeFormatter = (row) => {
	return dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
}

const handleReturn = () => {
  router.push({
    path: '/testCases'
  })
}

// 处理页数改变
const handleCurrentChange = (val) => {
	pagination.pageNum = val
	getDeatil()
}

const handleSizeChange = (val) => {
	pagination.pageSize = val
	pagination.pageNum = 1
	getDeatil()
}

// 计算表格高度
const calculateDetailTableHeight = () => {
  const tableEl = document.querySelector('.detail-table')
  if (!tableEl) return // 防报错

  const windowHeight = window.innerHeight
  const tableTop = tableEl.getBoundingClientRect().top
  const paddingBottom = 80

  detailTableHeight.value = windowHeight - tableTop - paddingBottom
}

watchEffect(() => {
  projectId.value = route.query.projectId || ''
  projectName.value = route.query.projectName || ''
  if (projectId.value) {
    getDetails()
  }
  calculateDetailTableHeight();
})

onMounted(() => {
  window.addEventListener('resize', calculateDetailTableHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateDetailTableHeight)
})

</script>

<style lang="scss" scoped>
  .titleContent {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .title {
    text-align: left;
    font-size: 22px;
    font-weight: 500;
  }
  .el-table {
    :v-deep(.tableHeaderStyle) {
      background: #f5f5f5;
      font-size: 12px;
      color: #606266;
    }
  }
.detail-table {
  height: 90%;
}
</style>