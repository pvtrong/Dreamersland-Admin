<template>
  <div class="user-container container">
    <div class="user__header container__header">Quản lý doanh số</div>
    <div class="user__panel">
      <div class="user__panel--name">Doanh số</div>
      <div class="user__panel--total">{{ total }}</div>
      <div class="user__panel--filter">
        <!-- <el-input placeholder="Tìm kiếm" v-model="keyword">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input> -->
      </div>
      <div class="course__panel--edit">
        <el-button
          @click="fetchData"
          type="primary"
          icon="el-icon-search"
          :loading="loading"
        ></el-button>
      </div>
      <div class="user__panel--search">
        
      </div>
      <!-- <div class="user__panel--edit">
        <el-button type="default" icon="el-icon-edit">EDIT</el-button>
      </div> -->
      <!-- <div class="user__panel--delete">
        <el-button type="default" icon="el-icon-delete">DELETE</el-button>
      </div> -->
      <div class="user__panel--create">
        <el-button
          @click="openCreateDialog"
          type="primary"
          icon="el-icon-plus"
          >Thêm doanh số</el-button
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
            >{{ formatDate(scope.row.date_time) }}
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.label === 'Họ tên nhân viên'"
          :label="item.label"
          :type="item.type"
          :key="index"
          :width="item.width"
        >
          <template #default="scope"
            >{{ scope.row.user.first_name + ' ' + scope.row.user.last_name }}
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.label === 'Doanh số'"
          :label="item.label"
          :type="item.type"
          :key="index"
          :width="item.width"
        >
          <template #default="scope"
            >{{ scope.row.amount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}) }}
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

    <!-- create dialog add ranking -->
    <el-dialog
      title="Thêm doanh số"
      :visible.sync="dialogFormVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="Tên danh hiệu" prop="rank_name">
          <el-input v-model="form.rank_name"></el-input>
        </el-form-item>
        <el-form-item label="Ảnh" prop="img_url">
          <el-input v-model="form.img_url"></el-input>
        </el-form-item>
        <el-form-item label="Điểm tối thiểu" prop="min_point">
          <el-input v-model="form.min_point"></el-input>
        </el-form-item>
        <el-form-item label="Điểm tối đa" prop="max_point">
          <el-input v-model="form.max_point"></el-input>
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
import { getSales } from '@/api/sale'
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
    label: 'Doanh số',
    property: 'amount',
  },
  {
    label: 'Số điểm nhận được',
    property: 'point',
  },
  {
    label: 'Ngày',
    property: 'date_time',
    type: TYPE_DATA.DATE,
  },
  {
    label: 'Họ tên nhân viên',
  },
  {
    label: 'Số điện thoại',
    property: 'user.phone_number',
  },
  {
    label: 'Mùa',
    property: 'season.season_name',
  },
  ]

export default {
  name: 'Sales',
  computed: {
    ...mapGetters(['name']),
  },
  async created() {
    this.filter = {
      ...this.filter,
      ...this.$route.query,
    }
    this.filter.currentPage = Number(this.filter.currentPage)
    this.filter.limit = Number(this.filter.limit)
    
    await Promise.all([this.fetchUsers(), this.fetchSeasons()])
  },
  data() {
    var defaultForm = {
      id: "",
      rank_name: "",
      img_url: "",
      min_point: "",
      max_point: "",
    }
    return {
      formatDate,
      tableColumns,
      tableData: [],
      multipleSelection: [],
      keyword: "",
      total: 0,
      filter: {
        limit: 10,
        currentPage: 1,
        session_id: null,
        user_id: null,
        date_time: null,
      },
      loading: false,
      isFirstGetData: true,
      TYPE_DATA,
      // create dialog
      dialogFormVisible: false,
      form: defaultForm,
      rules
    }
  },

  methods: {
    async fetchUsers() {
      try {
        const { data } = await getUsers({
          limit: 10000,
          page: 1,
        })
        this.users = data.data
      } catch (error) {
        this.$message.error('Lỗi lấy danh sách nhân viên')
      }
    },
    async fetchSeasons() {
      try {
        const { data } = await getSeasons({
          limit: 10000,
          page: 1,
        })
        this.seasons = data.data
      } catch (error) {
        this.$message.error('Lỗi lấy danh sách mùa')
      }
    },
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.form.id ? await updateRanking(this.form) : await createRanking(this.form)
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
          rank_name: record.rank_name,
          img_url: record.img_url,
          min_point: record.min_point,
          max_point: record.max_point,
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
      try {
        this.loading = true
        const { data } = await getSales({
            ...this.filter,
            page: this.filter.currentPage
        })
        this.tableData = data.data
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
