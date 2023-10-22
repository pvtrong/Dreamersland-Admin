<template>
  <div class="season-container container">
    <div class="season__header container__header">Quản lý mùa</div>
    <div class="season__panel">
      <div class="season__panel--name">Mùa</div>
      <div class="season__panel--total">{{ total }}</div>
      <div class="season__panel--filter">
        <el-input placeholder="Tìm kiếm" v-model="keyword">
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
          >Thêm mùa</el-button
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
          v-if="item.type === TYPE_DATA.DATE"
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
      title="Thêm nhân viên"
      :visible.sync="dialogFormVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="Tên nhân viên" prop="first_name">
          <el-input v-model="form.first_name"></el-input>
        </el-form-item>
        <el-form-item label="Họ nhân viên" prop="last_name">
          <el-input v-model="form.last_name"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Số điện thoại" prop="phone">
          <el-input v-model="form.phone"></el-input>
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
import { getSeasons, createSeason } from '@/api/season'
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
    label: 'Tên mùa',
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
  name: 'Users',
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
      firs_name: "",
      last_name: "",
      email: "",
      phone: "",
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
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.form.id ? await updateUser(this.form) : await createSeason(this.form)
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
      if(record) {
        this.form = {
          id: record.id,
          firs_name: record.first_name,
          last_name: record.last_name,
          email: record.email,
          phone: record.phone,
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
          pagination: {
            limit: this.filter.limit,
            offset: (this.filter.currentPage - 1) * this.filter.limit,
          },
        })
        this.tableData =
          data &&
          data.airdropCampaigns &&
          data.airdropCampaigns.airdropCampaigns
            ? data.airdropCampaigns.airdropCampaigns
            : []
        this.total = data.airdropCampaigns.pagination.totalRecords
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
      this.$router.push({
        path: `user/put/${scope.row.id}`,
      })
    },
  },

  watch: {
    filter: {
      handler: function () {
        this.fetchData()
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.user {
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
