<template>
  <div class="user-container container" @keydown.enter="fetchData">
    <div class="user__header container__header">Quản lý nhân viên</div>
    <div class="user__panel">
      <div class="user__panel--name">Nhân viên</div>
      <div class="user__panel--total">{{ total }}</div>
      <div class="user__panel--filter">
        <el-input
          placeholder="Tìm kiếm"
          v-model="keyword"
          :clearable="true"
          @clear="fetchData"
        >
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
      <div class="user__panel--search"></div>
      <!-- <div class="user__panel--edit">
        <el-button type="default" icon="el-icon-edit">EDIT</el-button>
      </div> -->
      <!-- <div class="user__panel--delete">
        <el-button type="default" icon="el-icon-delete">DELETE</el-button>
      </div> -->
      <div class="user__panel--create">
        <el-button @click="openCreateDialog()" type="primary" icon="el-icon-plus"
          >Thêm nhân viên</el-button
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
          v-else-if="item.label === 'Họ tên nhân viên'"
          :label="item.label"
          :type="item.type"
          :key="index"
          :width="item.width"
        >
          <template #default="scope"
            >{{ scope.row.first_name + ' ' + scope.row.last_name }}
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.property === 'all_season_sales'"
          :label="item.label"
          :type="item.type"
          :key="index"
          :width="item.width"
        >
          <template #default="scope"
            >{{ scope.row.all_season_sales.toLocaleString("it-IT", {
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
          <el-tooltip effect="dark" content="Cấp lại mật khẩu" placement="top">
            <el-button
              icon="el-icon-coordinate"
              @click="handleClickIssuePW(scope)"
              circle=""
              type="warning"
            ></el-button>
          </el-tooltip>
          <!-- <el-tooltip effect="dark" content="Xoá" placement="top">
            <el-button
              icon="el-icon-delete"
              @click="handleClickDelete(scope)"
              circle=""
              type="danger"
            ></el-button>
          </el-tooltip> -->
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

    <!-- create dialog add user -->
    <el-dialog
      :title="form.id ? 'Cập nhật nhân viên' : 'Thêm nhân viên'"
      :visible.sync="dialogFormVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="140px" label-position="left">
        <el-form-item label="Tên nhân viên" prop="first_name">
          <el-input v-model="form.first_name"></el-input>
        </el-form-item>
        <el-form-item label="Họ nhân viên" prop="last_name">
          <el-input v-model="form.last_name"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Số điện thoại" prop="phone_number">
          <el-input v-model="form.phone_number"></el-input>
        </el-form-item>
        <el-form-item label="Biệt hiệu" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="Mô tả" prop="bio">
          <el-input v-model="form.bio"></el-input>
        </el-form-item>
        <el-form-item v-if="!this.form.id" label="Mật khẩu" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Hủy</el-button>
        <el-button type="primary" @click="submit" :loading="loadingSubmit">Lưu</el-button>
      </div>
    </el-dialog>

    <!-- dialog issue password again have input password -->
    <el-dialog
      :title="'Cấp lại mật khẩu'"
      :visible.sync="dialogIssuePWVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="formIssue" :rules="rulesIssue" ref="formIssue" label-width="150px" label-position="left">
        <el-form-item label="Mật khẩu" prop="password">
          <el-input v-model="formIssue.password" type="password"></el-input>
        </el-form-item>
        <!-- confirm password again -->
        <!-- <el-form-item label="Nhập lại mật khẩu" prop="confirmPassword">
          <el-input v-model="formIssue.confirmPassword" type="password"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogIssuePWVisible = false">Hủy</el-button>
        <el-button type="primary" @click="submitIssue" :loading="loadingSubmit">Lưu</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, createUser, updateUser, deleteUser, resetPassword } from "@/api/user";
import { mapGetters } from "vuex";

// utils
import { formatDate } from "@/utils/index";
import { rules } from "@/utils/validate";

// constants
import { TYPE_DATA } from "@/commons/index.constant";

const tableColumns = [
  // {
  //   type: "selection",
  // },
  {
    label: "ID",
    property: "id",
    width: "80",
  },
  {
    label: "Họ tên nhân viên",
  },
  {
    label: "Email",
    property: "email",
  },
  {
    label: 'Số điện thoại',
    property: 'phone_number',
  },
  {
    label: 'Điểm mùa này',
    property: 'current_season_total_point',
  },
  {
    label: 'Doanh thu',
    property: 'all_season_sales',
  },
  {
    label: "Ngày tạo",
    property: "createdAt",
    type: TYPE_DATA.DATE,
  },

];

export default {
  name: "Users",
  computed: {
    ...mapGetters(["name"]),
  },
  created() {
    this.filter = {
      ...this.filter,
      ...this.$route.query,
    };
    this.filter.currentPage = Number(this.filter.currentPage);
    this.filter.limit = Number(this.filter.limit);
  },
  data() {
    var defaultForm = {
      id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
      bio: "",
      nickname: ""
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
      rules,
      defaultForm,
      loadingSubmit: false,
      // issue password dialog
      dialogIssuePWVisible: false,
      formIssue: {
        password: "",
        // confirmPassword: "",
        id: "",
      },
      rulesIssue: rules,
    };
  },

  methods: {
    async submitIssue() {
      this.$refs["formIssue"].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingSubmit = true;
            await resetPassword({
              new_password: this.formIssue.password,
              repeat_new_password: this.formIssue.password,
            }, this.formIssue.id);
            this.$message({
              message: "Cấp lại mật khẩu thành công",
              type: "success",
            });
            this.dialogIssuePWVisible = false;
            this.fetchData();
          } catch (error) {}
          finally {
            this.loadingSubmit = false;
          }
        } else {
          return false;
        }
      });
    },
    handleClickIssuePW(scope) {
      this.openCreateDialogIssue(scope);
    },
    openCreateDialogIssue(scope) {
      this.$nextTick(() => {
        this.$refs["formIssue"]?.resetFields();
      });
      this.dialogIssuePWVisible = true;
      this.formIssue = {
        password: "",
        // confirmPassword: "",
        id: scope.row.id,
      };
    },

    async handleClickDelete(scope) {
      this.$confirm("Bạn có chắc chắn muốn xoá?")
        .then(async (_) => {
          try {
            await deleteUser(scope.row.phone_number);
            this.$message({
              message: "Xoá thành công",
              type: "success",
            });
            this.fetchData();
          } catch (error) {}
        })
        .catch((_) => {});
    },
    submit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingSubmit = true;
            this.form.id
              ? await updateUser(this.form)
              : await createUser(this.form);
            this.$message({
              message: this.form.id ? "Cập nhật thành công" : "Tạo thành công",
              type: "success",
            });
            this.dialogFormVisible = false;
            this.fetchData();
          } catch (error) {}
          finally {
            this.loadingSubmit = false;
          }
        } else {
          return false;
        }
      });
    },
    openCreateDialog(record) {
      this.$nextTick(() => {
        this.$refs["form"]?.resetFields();
      });
      if (record) {
        this.form = {
          id: record.id,
          first_name: record.first_name,
          last_name: record.last_name,
          email: record.email,
          phone_number: record.phone_number,
          password: record.password,
          bio: record.bio,
          nickname: record.nickname
        };
      } else this.form = {...this.defaultForm};
      this.dialogFormVisible = true;
    },
    handleClose(done) {
      this.$confirm("Bạn có chắc chắn muốn thoát?")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async fetchData() {
      this.filter.keyword = this.keyword;
      try {
        this.loading = true;
        const { data } = await getUsers({
            ...this.filter,
            page: this.filter.currentPage,
            search: this.filter.keyword,
        })
        this.tableData =
          data?.data
        this.total = data?.total
        document
          .getElementsByClassName("el-table__body-wrapper")[0]
          .scrollTo(0, 0);
        if (!this.isFirstGetData)
          this.$router.push({
            path: this.$route.path,
            query: {
              ...this.filter,
            },
          });
        else this.isFirstGetData = false;
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    handleClickEdit(scope) {
      this.openCreateDialog(scope.row)
    },
  },

  watch: {
    filter: {
      handler: function () {
        this.fetchData();
      },
      deep: true,
    },
  },
};
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
      font-family: "Exo";
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
      font-family: "Exo";
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
  .el-table__row {
      height: 30px;
  }
}


</style>
