<template>
  <div class="season-container container" @keydown.enter="fetchData">
    <div class="season__header container__header">Quản lý mùa giải</div>
    <div class="season__panel">
      <div class="season__panel--name">Mùa giải</div>
      <div class="season__panel--total">{{ total }}</div>
      <div class="season__panel--filter">
        <el-input placeholder="Tìm kiếm" v-model="keyword" :clearable="true" @clear="fetchData">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="season__panel--edit">
        <el-button
          @click="fetchData"
          type="primary"
          icon="el-icon-search"
          :loading="loading"
        ></el-button>
      </div>
      <div class="season__panel--search">
        
      </div>
      <!-- <div class="season__panel--edit">
        <el-button type="default" icon="el-icon-edit">EDIT</el-button>
      </div> -->
      <!-- <div class="season__panel--delete">
        <el-button type="default" icon="el-icon-delete">DELETE</el-button>
      </div> -->
      <div class="season__panel--create">
        <el-button
          @click="openCreateDialog"
          type="primary"
          icon="el-icon-plus"
          >Thêm mùa giải</el-button
        >
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      stripe
      class="table-content"
      scrollbar-always-on
      v-loading="loading"
    >
      <template v-for="(item, index) in tableColumns">
        <el-table-column
          v-if="item.property === 'end_date'"
          :label="item.label"
          :type="item.type"
          :key="index"
          :width="item.width"
        >
          <template #default="scope"
            >{{ formatDate(scope.row.end_date) }}
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.property === 'start_date'"
          :label="item.label"
          :type="item.type"
          :key="index"
          :width="item.width"
        >
          <template #default="scope"
            >{{ formatDate(scope.row.start_date) }}
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.property === 'createdAt'"
          :label="item.label"
          :type="item.type"
          :key="index"
          :width="item.width"
        >
          <template #default="scope"
            >{{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :property="item.property"
          :label="item.label"
          :type="item.type"
          :width="item.width"
          :key="index"
        >
        </el-table-column>
      </template>
      <el-table-column label="Hành động" width="120">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="Sửa" placement="top">
            <el-button
              icon="el-icon-edit"
              @click="handleClickEdit(scope)"
              circle=""
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="Xoá" placement="top">
            <el-button
              icon="el-icon-delete"
              @click="handleClickDelete(scope)"
              circle=""
              type="danger"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="filter.limit"
      :current-page.sync="filter.currentPage"
    >
    </el-pagination>

    <!-- create dialog add season -->
    <el-dialog
      title="Thêm mùa giải"
      :visible.sync="dialogFormVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="140px">
        <el-form-item label="Tên mùa giải giải" prop="season_name">
          <el-input v-model="form.season_name" placeholder="Nhập tên mùa"></el-input>
        </el-form-item>
        <el-form-item label="Ngày bắt đầu" prop="start_date">
          <el-date-picker
            v-model="form.start_date"
            type="date"
            placeholder="Chọn ngày bắt đầu"
            :picker-options="{
              disabledDate(time) {
                return time < Date.now();
              },
            }"
            :disabled="new Date(form.start_date) < new Date() && form.id"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Ngày kết thúc" prop="end_date">
          <el-date-picker
            v-model="form.end_date"
            type="date"
            placeholder="Chọn ngày kết thúc"
            :picker-options="{
              disabledDate(time) {
                return time < Date.now() || time <= new Date(form.start_date);
              },
            }"
            :disabled="(new Date(form.end_date) < new Date(form.start_date) || new Date(form.end_date) < Date.now()) && form.id"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Hủy</el-button>
        <el-button type="primary" @click="submit"
          >Lưu</el-button
        >
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getSeasons, createSeason, deleteSeason, updateSeason } from '@/api/season'
import { mapGetters } from 'vuex'

// utils
import { formatDate } from '@/utils/index'
import { rules } from '@/utils/validate' 

// constants
import { TYPE_DATA } from "@/commons/index.constant"

const tableColumns = [
  // {
  //   type: "selection",
  // },
  {
    label: 'ID',
    property: 'id',
    width: '80',
  },
  {
    label: 'Tên mùa giải',
    property: 'season_name',
  },
  {
    label: 'Ngày bắt đầu',
    property: 'start_date',
  },
  {
    label: 'Ngày kết thúc',
    property: 'end_date',
  },
  {
    label: 'Ngày tạo',
    property: 'createdAt',
    type: TYPE_DATA.DATE,
  },
  ]

export default {
  name: 'Seasons',
  computed: {
    ...mapGetters(['name']),
  },
  created() {
    this.filter = {
      ...this.filter,
      ...this.$route.query,
    }
    this.filter.currentPage = Number(this.filter.currentPage)
    this.filter.limit = Number(this.filter.limit)
  },
  data() {
    var defaultForm = {
      id: "",
      season_name: "",
      start_date: new Date(),
      end_date: new Date(),
    }
    return {
      formatDate,
      tableColumns,
      tableData: [],
      multipleSelection: [],
      keyword: "",
      total: 0,
      filter: {
        keyword: "",
        limit: 10,
        currentPage: 1,
      },
      loading: false,
      isEditLesson: false,
      isFirstGetData: true,
      TYPE_DATA,
      // create dialog
      dialogFormVisible: false,
      form: defaultForm,
      rules
    }
  },

  methods: {
    async handleClickDelete(record) {
      try {
        this.$confirm('Bạn có chắc chắn muốn xoá?')
          .then(async () => {
            await deleteSeason(record.row.id)
            this.$message({
              message: 'Xoá thành công',
              type: 'success',
            })
            this.fetchData()
          })
          .catch(() => {})
      } catch (error) {
      }
    },
    submit() {
      debugger
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.form.id ? await updateSeason(this.form) : await createSeason(this.form)
            this.$message({
              message: this.form.id ? 'Cập nhật thành công' : 'Tạo thành công' ,
              type: 'success',
            })
            this.dialogFormVisible = false
            this.fetchData()
          } catch (error) {
            this.form.id ? this.$message.error('Cập nhật thất bại') : this.$message.error('Tạo thất bại')
          }
        } else {
          return false
        }
      })
    },
    openCreateDialog(record) {
      this.$nextTick(() => {
        this.$refs['form']?.clearValidate()
      })
      if(record) {
        this.form = {
          id: record.id,
          season_name: record.season_name,
          start_date: new Date(record.start_date),
          end_date: new Date(record.end_date),
        }
      }
      else this.form = defaultForm
      this.dialogFormVisible = true
    },
    handleClose(done) {
      this.$confirm('Bạn có chắc chắn muốn thoát?')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async fetchData() {
      this.filter.keyword = this.keyword
      try {
        this.loading = true
        const { data } = await getSeasons({
            ...this.filter,
            page: this.filter.currentPage,
        })
        this.tableData =
        data?.data
          
        this.total = data.total
        document
          .getElementsByClassName('el-table__body-wrapper')[0]
          .scrollTo(0, 0)
        if (!this.isFirstGetData)
          this.$router.push({
            path: this.$route.path,
            query: {
              ...this.filter,
            },
          })
        else this.isFirstGetData = false
      } catch (error) {
      } finally {
        this.loading = false
      }
    },
    handleClickEdit(scope) {
      this.openCreateDialog(scope.row)
    },
  },

  watch: {
    filter: {
      handler: function () {
        this.fetchData()
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.season {
  &__panel {
    display: flex;
    padding-bottom: 12px;
    width: 100%;
    border-bottom: 1px solid #000000;
    align-items: center;
    gap: 20px;
    &--name {
      font-family: 'Exo';
      font-style: normal;
      font-weight: 600;
      font-size: 15px;
      line-height: 22px;
      display: flex;
      align-items: center;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    &--total {
      font-family: 'Exo';
      font-style: normal;
      font-weight: 600;
      font-size: 13px;
      line-height: 20px;
      display: flex;
      align-items: center;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(0, 0, 0, 0.5);
    }
    &--create {
      margin-left: auto;
    }
  }
}
::v-deep .el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

::v-deep tr {
  height: 100px;
}
.table-content {
  flex-grow: 1;
}

::v-deep .el-table__body-wrapper {
  height: calc(100vh - 445px) !important;
  overflow-y: auto;
}
</style>
