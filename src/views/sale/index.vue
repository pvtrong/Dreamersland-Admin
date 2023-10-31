<template>
  <div class="sale-container container" @keydown.enter="fetchData">
    <div class="sale__header container__header">Quản lý doanh số</div>
    <div class="sale__panel">
      <div class="sale__panel--name">Doanh số</div>
      <div class="sale__panel--total">{{ total }}</div>
      <div class="sale__panel--filter">
        <el-input
          placeholder="Tìm kiếm"
          v-model="keyword"
          :clearable="true"
          @clear="fetchData"
          style="max-width: 200px"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <!-- create select season -->
        <el-select
          v-model="filter.season_id"
          placeholder="Chọn mùa giải"
          style="width: 200px"
          :clearable="true"
          @clear="fetchData"
        >
          <el-option
            v-for="item in seasons"
            :key="item.id"
            :label="item.season_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <!-- filter date_time -->
        <el-date-picker
          v-model="filter.date_time"
          type="date"
          placeholder="Chọn ngày"
          style="width: 200px"
          :clearable="true"
          @clear="fetchData"
        ></el-date-picker>
      </div>
      <div class="course__panel--edit">
        <el-tooltip effect="dark" content="Tìm kiếm" placement="top">
          <el-button
            @click="fetchData"
            type="primary"
            icon="el-icon-search"
            :loading="loading"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          v-show="salesIds.length > 0"
          effect="dark"
          content="Sửa bản ghi đã chọn"
          placement="top"
        >
          <el-button
            @click="handleClickEdit"
            icon="el-icon-edit"
            :loading="loading"
          ></el-button>
        </el-tooltip>
      </div>
      <div class="sale__panel--search"></div>
      <!-- <div class="sale__panel--edit">
        <el-button type="default" icon="el-icon-edit">EDIT</el-button>
      </div> -->
      <!-- <div class="sale__panel--delete">
        <el-button type="default" icon="el-icon-delete">DELETE</el-button>
      </div> -->
      <div class="sale__panel--create">
        <el-button
          @click="openCreateDialog(false)"
          type="primary"
          icon="el-icon-plus"
          >Thêm doanh số</el-button
        >
      </div>
    </div>
    <el-table
      ref="multipleTableSales"
      :data="tableData"
      style="width: 100%"
      stripe
      class="table-content"
      scrollbar-always-on
      v-loading="loading"
      @selection-change="handleSelectionSalesChange"
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
            >{{ scope.row.user.first_name + " " + scope.row.user.last_name }}
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
            >{{
              scope.row.amount.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })
            }}
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
          <!-- <el-tooltip effect="dark" content="Sửa" placement="top">
            <el-button
              icon="el-icon-edit"
              @click="handleClickEdit(scope)"
              circle=""
            ></el-button>
          </el-tooltip> -->
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
      :title="modeForm === MODE_FORM.CREATE ? 'Thêm doanh số' : 'Sửa doanh số'"
      :visible.sync="dialogFormVisible"
      :width="modeForm === MODE_FORM.CREATE ? '60%' : '30%'"
      :before-close="handleClose"
    >
      <!-- input keyword -->
      <template v-if="modeForm === MODE_FORM.CREATE">
        <el-input
          placeholder="Tìm kiếm"
          v-model="search"
          :clearable="true"
          @clear="fetchUsers"
          style="max-width: 200px"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <!-- button search -->
        <el-button
          style="margin-left: 20px"
          @click="fetchUsers"
          type="primary"
          icon="el-icon-search"
          :loading="loadingUser"
        ></el-button>

        <el-table
          ref="multipleTable"
          :data="users"
          style="width: 100%; height: 50vh"
          @selection-change="handleSelectionChange"
          stripe
          class="table-user"
          scrollbar-always-on
          v-loading="loadingUser"
        >
          <template v-for="(item, index) in tableColumnsUser">
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
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalUser"
          :page-size="filterUser.limit"
          :current-page.sync="filterUser.currentPage"
          style="margin: 20px 0"
        >
        </el-pagination>
      </template>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="Doanh số" prop="amount">
          <el-input-number
            v-model="form.amount"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="Ngày" prop="date_time">
          <el-date-picker
            v-model="form.date_time"
            type="date"
            placeholder="Chọn ngày"
          ></el-date-picker>
        </el-form-item>
        <!-- select season -->
        <el-form-item v-if="modeForm === MODE_FORM.CREATE" label="Mùa giải" prop="season_id">
          <el-select v-model="form.season_id" placeholder="Chọn mùa giải">
            <el-option
              v-for="item in seasons"
              :key="item.id"
              :label="item.season_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Hủy</el-button>
        <el-button type="primary" @click="submit" :loading="loadingSubmit">Lưu</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSales, deleteSale, createSale, updateSale } from "@/api/sale";
import { getSeasons } from "@/api/season";
import { mapGetters } from "vuex";

// utils
import { formatDate } from "@/utils/index";
import { rules } from "@/utils/validate";

// constants
import { TYPE_DATA } from "@/commons/index.constant";
import { getUsers } from "@/api/user";
import { dateToString } from "@/utils/index";

const tableColumns = [
  {
    type: "selection",
  },
  {
    label: "ID",
    property: "id",
    width: "80",
  },
  {
    label: "Doanh số",
    property: "amount",
  },
  {
    label: "Số điểm nhận được",
    property: "point",
  },
  {
    label: "Ngày",
    property: "date_time",
    type: TYPE_DATA.DATE,
  },
  {
    label: "Họ tên nhân viên",
  },
  {
    label: "Số điện thoại",
    property: "user.phone_number",
  },
  {
    label: "Mùa giải",
    property: "season.season_name",
  },
];

const tableColumnsUser = [
  {
    type: "selection",
  },
  {
    label: "ID",
    property: "id",
    width: "80",
  },
  {
    label: "Tên nhân viên",
    property: "first_name",
  },
  {
    label: "Họ nhân viên",
    property: "last_name",
  },
  {
    label: "Email",
    property: "email",
  },
  {
    label: "Số điện thoại",
    property: "phone_number",
  },
  {
    label: "Ngày tạo",
    property: "createdAt",
    type: TYPE_DATA.DATE,
  },
];

const MODE_FORM = {
  CREATE: "create",
  EDIT: "edit",
};

export default {
  name: "Sales",
  computed: {
    ...mapGetters(["name"]),
  },
  async created() {
    await Promise.all([this.fetchSeasons()]);
    this.filter = {
      ...this.filter,
      ...this.$route.query,
    };
    this.filter.currentPage = Number(this.filter.currentPage);
    this.filter.limit = Number(this.filter.limit);
    const current_season = this.seasons.find(
      (season) => season.is_current_season === true
    );
    this.filter.season_id = this.filter?.season_id
      ? Number(this.filter?.season_id)
      : current_season?.id;
  },
  data() {
    var defaultForm = {
      id: "",
      amount: "",
      date_time: "",
      season_id: "",
      users: "",
    };
    return {
      formatDate,
      tableColumns,
      tableData: [],
      keyword: "",
      total: 0,
      filter: {
        limit: 10,
        currentPage: 1,
        season_id: null,
        users: null,
        date_time: null,
        keyword: "",
      },
      loading: false,
      isFirstGetData: true,
      TYPE_DATA,
      // create dialog
      dialogFormVisible: false,
      form: defaultForm,
      rules,
      users: [],
      search: "",
      tableColumnsUser,
      seasons: [],
      filterUser: {
        limit: 10,
        currentPage: 1,
        keyword: "",
      },
      totalUser: 0,
      loadingUser: false,
      defaultForm,
      salesIds: [],
      modeForm: MODE_FORM.CREATE,
      MODE_FORM,
      loadingSubmit: false
    };
  },

  methods: {
    async handleClickEdit() {
      this.openCreateDialog(true);
    },
    handleSelectionSalesChange(val) {
      this.salesIds = val.map((item) => item.id);
    },
    async handleClickDelete(scope) {
      // alert delete
      this.$confirm("Bạn có chắc chắn muốn xoá?")
        .then(async () => {
          try {
            await deleteSale(scope.row.id);
            this.$message({
              message: "Xoá thành công",
              type: "success",
            });
            this.fetchData();
          } catch (error) {
            this.$message.error("Xoá thất bại");
          }
        })
        .catch(() => {});
    },
    async fetchUsers() {
      this.filterUser.keyword = this.search;
      try {
        this.loadingUser = true;
        const { data } = await getUsers({
          ...this.filterUser,
          page: this.filterUser.currentPage,
          search: this.filterUser.keyword,
        });
        this.users = data?.data ? data?.data : [];
        this.totalUser = data?.total;
      } catch (error) {
      } finally {
        this.loadingUser = false;
      }
    },
    async fetchSeasons() {
      try {
        const { data } = await getSeasons({
          limit: 10000,
          page: 1,
        });
        this.seasons = data?.data;
      } catch (error) {
        this.$message.error("Lỗi lấy danh sách mùa giải");
      }
    },
    submit() {
      let me = this;
      if (this.modeForm === MODE_FORM.CREATE && this.form.users.length === 0) {
        this.$message.error("Vui lòng chọn nhân viên");
        return;
      }
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          try {
            this.loadingSubmit = true;
            // ? await updateSale({ids: me.salesIds, amount: me.form.amount, date_time: dateToString(me.form.date_time)})
            me.modeForm === MODE_FORM.EDIT
              ? await updateSale({ids: me.salesIds, amount: me.form.amount, date_time: dateToString(me.form.date_time)})
              : await createSale({...me.form, date_time: dateToString(me.form.date_time)});
            // form me.form.date_time to "yyyy-MM-dd"

            me.$message({
              message: me.modeForm === MODE_FORM.EDIT ? "Cập nhật thành công" : "Thêm thành công",
              type: "success",
            });
            me.dialogFormVisible = false;
            me.fetchData();
          } catch (error) {
            console.log(error);
          } finally {
            this.loadingSubmit = false;
          }
        } else {
          return false;
        }
      });
    },
    openCreateDialog(isEdit = false) {
      this.modeForm = isEdit ? MODE_FORM.EDIT : MODE_FORM.CREATE;
      // this.selected user reset
      
      if (this.users.length === 0) this.fetchUsers();
      this.$nextTick(() => {
        this.$refs["form"]?.resetFields();
        this.$refs.multipleTable.clearSelection();
      });
      this.form = { ...this.defaultForm };
      const current_season = this.seasons.find(
        (season) => season.is_current_season === true
      );
      this.$set(this.form, "season_id", current_season?.id);
      this.form.date_time = new Date();
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
      this.form.users = val ? val.map((item) => item.id) : [];
    },
    async fetchData() {
      this.filter.keyword = this.keyword;
      try {
        this.loading = true;
        const { data } = await getSales({
          ...this.filter,
          page: this.filter.currentPage,
        });
        this.tableData = data?.data;
        this.total = data?.total;

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
  },

  watch: {
    filter: {
      handler: function () {
        this.fetchData();
      },
      deep: true,
    },
    filterUser: {
      handler: function () {
        this.fetchUsers();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.sale {
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
    &--filter {
      display: flex;
      gap: 20px;
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
::v-deep {
  .table-user {
    .el-table__row {
      height: 30px;
    }
  }
}
</style>
