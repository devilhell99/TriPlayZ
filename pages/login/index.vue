<template>
  <div class="px-5">
    <el-form :model="form" label-width="auto">
      <el-row class="border-form p-4">
        <el-col el-col :span="12">
          <div class="h-14">
            <p>Edit campaign</p>
            <h2 class="font-bold">Campaign ID: campaign_23272</h2>
          </div>
          <el-form-item label="Campaign name">
            <el-input v-model="form.name" placeholder="Campaign name" />
          </el-form-item>
          <el-form-item label="Owner">
            <el-input v-model="form.region" placeholder="Customer name" />
          </el-form-item>

          <el-form-item label="Stat time" class="dateTime-custom">
            <el-date-picker
              v-model="form.startDate"
              type="date"
              placeholder="Pick a date"
            />
          </el-form-item>
          <el-form-item label="End time" class="dateTime-custom">
            <el-date-picker
              v-model="form.endDate"
              type="date"
              placeholder="Pick a date"
            />
          </el-form-item>

          <el-form-item label="Instant delivery">
            <el-switch v-model="form.delivery" />
          </el-form-item>
        </el-col>
        <el-col el-col :span="12" class="">
          <div class="h-14 flex items-center ml-[49px]">
            <h2 class="font-bold">Campaign’s pool setting</h2>
          </div>
          <el-form-item
            v-for="(domain, index) in form.domains"
            :key="domain.key"
            :label="'Domain' + index"
            :prop="'domains.' + index + '.value'"
          >
            <div class="flex justify-between items-center gap-4">
              <el-input v-model="domain.value" />
              <img
                src="~/assets/images/Vector.png"
                @click.prevent="removeDomain(domain)"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="btn-custom mt-2">
        <el-button>Cancel</el-button>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="tableRef" :data="tableData" style="width: 100%">
      <el-table-column prop="poolID" label="Pool ID" sortable>
        <template #header="{ column }">
          <el-input placeholder="Filter Pool ID" />
          <span>{{ column.label }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Pool Name" sortable>
        <template #header="{ column }">
          <el-input placeholder="All" /> <span>{{ column.label }} </span>
        </template></el-table-column
      >
      <el-table-column prop="region" label="Pool SlotsID" sortable>
        <template #header="{ column }">
          <el-input placeholder="All" /> <span>{{ column.label }} </span>
        </template></el-table-column
      >
      <el-table-column prop="startDate" label="Start Date" sortable>
        <template #header="{ column }">
          <el-input placeholder="All" /> <span>{{ column.label }} </span>
        </template></el-table-column
      >
      <el-table-column prop="endDate" label="End date" sortable>
        <template #header="{ column }">
          <el-input placeholder="All" />
          <span>{{ column.label }} </span></template
        ></el-table-column
      >
      <el-table-column prop="delivery" label="Sequence" sortable>
        <template #default="scope">
          <el-button :type="scope.row.delivery ? 'success' : 'info'">{{
            scope.row.delivery ? 'Active' : 'Disabled'
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="delivery">
        <template #default="scope">
          <div class="flex justify-center items-center gap-2">
            <el-switch v-model="scope.row.delivery" />
            <img src="~/assets/images/edit.png" />
            <img
              src="~/assets/images/Icons.png"
              @click.prevent="deleteRow(scope.$index)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end py-4">
      <el-pagination
        v-model:current-page="currentPage1"
        :page-size="100"
        :size="size"
        :background="background"
        layout="total, prev, pager, next"
        :total="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
// do not use same name with ref
interface DomainItem {
  key: number
  value: string
}

const currentPage1 = ref(5)
const form = reactive({
  name: '',
  region: '',
  poolID: '',
  startDate: '',
  endDate: '',
  delivery: false,
  domains: [
    {
      key: 1,
      value: '',
    },
    {
      key: 2,
      value: '',
    },
  ],
})
const tableData = ref([
  {
    name: 'Tom',
    region: 'âf',
    poolID: '#100',
    startDate: '2016-05-03',
    endDate: '2016-05-03',
    delivery: true,
  },
  {
    name: 'Tom1',
    region: 'âf',
    poolID: '#101',
    startDate: '2016-05-03',
    endDate: '2016-05-03',
    delivery: true,
  },
  {
    name: 'Tom2',
    region: 'âf',
    poolID: '#102',
    startDate: '2016-05-03',
    endDate: '2016-05-03',
    delivery: false,
  },
  {
    name: 'Tom3',
    region: 'âf',
    poolID: '#103',
    startDate: '2016-05-03',
    endDate: '2016-05-03',
    delivery: false,
  },
  {
    name: 'Tom4',
    region: 'âf',
    poolID: '#104',
    startDate: '2016-05-03',
    endDate: '2016-05-03',
    delivery: false,
  },
])

const removeDomain = (item: DomainItem) => {
  const index = form.domains.indexOf(item)
  if (index !== -1) {
    form.domains.splice(index, 1)
  }
}
const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}
const onSubmit = () => {
  form.startDate = formatDate(form.startDate, FORMAT_TYPE.YEAR_MONTH_DAY) ?? ''
  form.endDate = formatDate(form.endDate, FORMAT_TYPE.YEAR_MONTH_DAY) ?? ''
  tableData.value.push({ ...form })
  form.name = ''
  form.region = ''
  form.poolID = ''
  form.startDate = ''
  form.endDate = ''
  form.delivery = false
}
</script>

<style>
.btn-custom .el-form-item__content {
  justify-content: end;
}
.dateTime-custom .el-input--suffix {
  width: 100% !important;
}
.dateTime-custom .el-input__wrapper {
  width: 100% !important;
}
.border-form {
  border: 1px solid rgba(224, 226, 231, 1);
}
</style>
