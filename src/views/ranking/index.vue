<template>
  <div class="user-container container" @keydown.enter="fetchData">
    <div class="user__header container__header">Quản lý danh hiệu</div>
    <div class="user__panel">
      <div class="user__panel--name">Danh hiệu</div>
      <div class="user__panel--total">{{ total }}</div>
      <div class="user__panel--filter">
        <el-input placeholder="Tìm kiếm" v-model="keyword">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
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
          @click="openCreateDialog()"
          type="primary"
          icon="el-icon-plus"
          >Thêm danh hiệu</el-button
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
          v-else-if="item.property === 'image_url'"
          :label="item.label"
          :type="item.type"
          :key="index"
          :width="item.width"
        >
          <template #default="scope"
            >
            <img
              :src="getImgSmall(scope.row.image_url)"
              style="width: 60px; height: 60px; object-fit: cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.property === 'target_day'"
          :label="item.label"
          :type="item.type"
          :key="index"
          :width="item.width"
        >
          <template #default="scope"
            >
            {{ scope.row.target_day.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              }) }}
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
      :title="this.form.id ? 'Cập nhật danh hiệu' : 'Thêm danh hiệu'"
      :visible.sync="dialogFormVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="170px" label-position="left">
        <el-form-item label="Tên danh hiệu" prop="rank_name">
          <el-input v-model="form.rank_name"></el-input>
        </el-form-item>
        <el-form-item label="Ảnh" prop="image_url">
          <!-- input submit image and use this file image to append to form -->
          <el-upload
            class="avatar-uploader"
            action="''"
            :auto-upload="false"
            :show-file-list="true"
            ref="upload"
            :thumbnail-mode="true"
            :limit="1"
            :list-type="'picture'"
            :on-change="handleChange"
          >
            <el-button slot="trigger" size="small" type="primary">Chọn ảnh</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="Mục tiêu ngày (Triệu)" prop="target_dayTemp">
          <el-input-number v-model="form.target_dayTemp" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="Thứ tự rank" prop="order">
          <el-input-number v-model="form.order" controls-position="right"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Hủy</el-button>
        <el-button type="primary" @click="submit" :loading="loadingSubmit"
          >Lưu</el-button
        >
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getRankings, createRanking, updateRanking, deleteRanking } from '@/api/ranking'
import { mapGetters } from 'vuex'

// utils
import { formatDate, getImgSmall } from '@/utils/index'
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
    label: 'Tên danh hiệu',
    property: 'rank_name',
  },
  {
    label: 'Ảnh',
    property: 'image_url',
  },
  {
    label: 'Mục tiêu ngày',
    property: 'target_day',
  },
  {
    label: 'Thứ tự rank',
    property: 'order',
  },
  {
    label: 'Ngày tạo',
    property: 'createdAt',
    type: TYPE_DATA.DATE,
  },
  ]

export default {
  name: 'Rankings',
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
      rank_name: "",
      image_url: "",
      target_day: 0,
      target_dayTemp: 0,
      order: 1,
      image: null,
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
      isFirstGetData: true,
      TYPE_DATA,
      // create dialog
      dialogFormVisible: false,
      form: defaultForm,
      rules,
      defaultForm,
      loadingSubmit: false,
      getImgSmall
    }
  },

  methods: {
    async handleClickDelete(record) {
      this.$confirm('Bạn có chắc chắn muốn xoá danh hiệu này?')
        .then(async _ => {
          try {
            await deleteRanking(record.row.id)
            this.$message({
              message: 'Xoá thành công',
              type: 'success',
            })
            this.fetchData()
          } catch (error) {
          }
        })
        .catch(_ => {});
    },
    handleChange(file) {
      this.form.image_url = file.url
      this.form.image = file.raw
    },
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingSubmit = true
            // create new form data
            const formData = new FormData()

            // append data to form data
            for (const key in this.form) {
              if (this.form.hasOwnProperty(key)) {
                const element = this.form[key]
                formData.append(key, element)
              }
            }
            // delete target_day 
            formData.delete('target_day')
            formData.append('target_day', this.form.target_dayTemp * 1000000)

            if(!this.form.id) 
            {
              formData.delete('id')
            }
            formData.delete('image_url')
            
            this.form.id ? await updateRanking(formData) : await createRanking(formData)
            this.$message({
              message: this.form.id ? 'Cập nhật thành công' : 'Tạo thành công' ,
              type: 'success',
            })
            this.dialogFormVisible = false
            this.fetchData()
          } catch (error) {
            // this.form.id ? this.$message.error('Cập nhật thất bại') : this.$message.error('Tạo thất bại')
          }
          finally {
            this.loadingSubmit = false
          }
        } else {
          return false
        }
      })
    },
    openCreateDialog(record) {
      this.$nextTick(() => {
        this.$refs['form']?.resetFields()
      })
      if(record) {
        this.form = {
          id: record.id,
          rank_name: record.rank_name,
          image_url: record.image_url,
          target_day: record.target_day,
          target_dayTemp: record.target_day/ 1000000,
          order: record.order,
          image: null,
        }
      }
      else this.form = {...this.defaultForm}
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
        this.$refs.multipleTable?.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async fetchData() {
      this.filter.keyword = this.keyword
      try {
        this.loading = true
        const { data } = await getRankings({
            ...this.filter,
            page: this.filter.currentPage,
            rank_name: this.filter.keyword
        })
        this.tableData =
          data?.data
        this.total = data?.total
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
