<template>
  <div class="course-container container">
    <div class="course__header container__header">{{ $route.name }}</div>
    <div class="course__body" v-loading="loadingAll">
      <el-form
        label-position="top"
        ref="formData"
        :rules="rules"
        :model="formData"
        hide-required-asterisk
      >
        <el-row :gutter="35">
          <el-col :span="15">
            <FormTitle text="Basic information"></FormTitle>
            <el-form-item label="CAMPAIGN TITLE" prop="airdropCampaign.title">
              <el-input
                v-model="formData.airdropCampaign.title"
                placeholder="Enter title"
              />
            </el-form-item>
            <el-form-item
              label="DESCRIPTION"
              prop="airdropCampaign.description"
              style="margin-top: 20px"
            >
              <quill-editor v-model="formData.airdropCampaign.description" />
              <div class="description-text">
                Shortly describe this campaign.
              </div>
            </el-form-item>
            <el-row :gutter="24">
              <el-col style="padding-left: 0" :span="12"
                ><el-form-item
                  label="TOKEN TICKER"
                  prop="airdropCampaign.airdropTokenId"
                  style="margin-top: 20px"
                >
                  <div style="display: flex; gap: 8px">
                    <el-select
                      v-model="formData.airdropCampaign.airdropTokenId"
                      default-first-option
                      placeholder="Select Token"
                      filterable
                      :loadingToken="loadingToken"
                    >
                      <el-option
                        v-for="item in tokenList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                    <el-button
                      v-if="formData.airdropCampaign.airdropTokenId"
                      type="danger"
                      icon="el-icon-edit-outline"
                      circle
                      @click="editAirdropTokenForm"
                    >
                    </el-button>
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      circle
                      @click="addAirdropTokenForm"
                    >
                    </el-button>
                  </div>

                  <div class="description-text">Select one token</div>
                </el-form-item></el-col
              >
              <el-col style="padding-right: 0" :span="12">
                <el-form-item
                  label="AIRDROP SUPPLY PER PERSON"
                  prop="airdropCampaign.amount"
                  style="margin-top: 20px"
                >
                  <el-input-number
                    v-model="formData.airdropCampaign.amount"
                    :controls="false"
                    :min="0"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <FormTitle text="Thumbnail"></FormTitle>
            <el-form-item prop="airdropCampaign.thumbnailUrl">
              <UploadImage
                :imageUrl="formData.airdropCampaign.thumbnailUrl"
                @updated="updateThumbnailUrl"
                @removed="removeThumbnailUrl"
                uploadPath="airdrop-campains/thumbnail"
              ></UploadImage>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="35">
          <el-col :span="15">
            <FormTitle
              text="CAMPAIGN DATES"
              style="margin-top: 20px"
            ></FormTitle>
            <el-row :gutter="40">
              <el-col :span="12" style="padding-left: 0">
                <el-row :gutter="16">
                  <el-col :span="12" style="padding-left: 0">
                    <el-form-item label="START DATE" prop="startedDate">
                      <el-date-picker
                        v-model="formData.startedDate"
                        placeholder="YYYY-MM-DD"
                        :editable="false"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="padding-right: 0"
                    ><el-form-item label="START TIME" prop="startedTime">
                      <el-time-picker
                        v-model="formData.startedTime"
                        placeholder="HH:mm"
                        :editable="false"
                        format="HH:mm"
                      /> </el-form-item
                  ></el-col>
                </el-row>
              </el-col>
              <el-col :span="12" style="padding-right: 0">
                <el-row :gutter="16">
                  <el-col :span="12" style="padding-left: 0"
                    ><el-form-item label="END DATE" prop="endedDate">
                      <el-date-picker
                        v-model="formData.endedDate"
                        placeholder="YYYY-MM-DD"
                        :editable="false"
                      /> </el-form-item
                  ></el-col>
                  <el-col :span="12" style="padding-right: 0">
                    <el-form-item label="END TIME" prop="endedTime">
                      <el-time-picker
                        v-model="formData.endedTime"
                        placeholder="HH:mm"
                        :editable="false"
                        format="HH:mm"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <FormTitle
              text="REQUIRED COURSE"
              style="margin-top: 20px"
            ></FormTitle>
            <el-form-item prop="watchConditionVideoCourseIds">
              <div
                v-show="
                  formData.watchConditionVideoCourseIds &&
                  formData.watchConditionVideoCourseIds.length
                "
                class="video-item"
                v-for="video in formData.watchConditionVideoCourseIds"
                :key="video.id"
              >
                <div class="video-item__content">
                  <el-card class="video-item__title box-card"
                    >{{ video.title }}
                    <el-tag
                      style="margin-left: auto"
                      v-if="
                        video.videoCourseStatus.id ===
                        StatusLessonEnum.Published
                      "
                      type="success"
                      >Public</el-tag
                    >
                    <el-tag style="margin-left: auto" v-else type="warning"
                      >Private</el-tag
                    >
                  </el-card>
                  <!-- <el-button
                    @click="showEditLesson(video.videoLessonId)"
                    class="video-item__edit"
                    type="primary"
                    icon="el-icon-edit"
                    circle
                  ></el-button> -->
                  <!-- <el-button
                    v-if="
                      !isEdit ||
                      (isEdit && !listLessonAdded.includes(video.videoLessonId))
                    "
                    @click="deleteLesson(video.id)"
                    class="video-item__delete"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                  ></el-button> -->
                </div>
              </div>
              <el-button style="margin-top: 20px" @click="showAddCourse"
                >ADD COURSE</el-button
              >
            </el-form-item>
            <FormTitle
              text="REQUIRED EXAMS"
              style="margin-top: 20px"
            ></FormTitle>
            <el-form-item prop="passConditionVideoCourseExamIds">
              <div
                v-show="
                  formData.passConditionVideoCourseExamIds &&
                  formData.passConditionVideoCourseExamIds.length
                "
                class="video-item"
                v-for="video in formData.passConditionVideoCourseExamIds"
                :key="video.id"
              >
                <div class="video-item__content">
                  <el-card class="video-item__title box-card">{{
                    video.title
                  }}</el-card>
                  <!-- <el-button
                    @click="showEditLesson(video.videoLessonId)"
                    class="video-item__edit"
                    type="primary"
                    icon="el-icon-edit"
                    circle
                  ></el-button> -->
                  <!-- <el-button
                    v-if="
                      !isEdit ||
                      (isEdit && !listLessonAdded.includes(video.videoLessonId))
                    "
                    @click="deleteLesson(video.id)"
                    class="video-item__delete"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                  ></el-button> -->
                </div>
              </div>
              <el-button style="margin-top: 20px" @click="showAddExam"
                >ADD EXAM</el-button
              >
            </el-form-item>
            <FormTitle
              text="CAMPAIGN STATUS"
              style="margin-top: 20px"
            ></FormTitle>
            <el-row :gutter="40">
              <el-col :span="8" style="padding-left: 0">
                <el-form-item
                  label="NUMBER OF PARTICIPANTS"
                  prop="airdropCampaign.maxRecipient"
                >
                  <el-input-number
                    v-model="formData.airdropCampaign.maxRecipient"
                    :controls="false"
                    :precision="0"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" style="padding-left: 0">
                <el-form-item
                  label="NUMBER OF APPLICATIONS"
                  prop="airdropCampaign.maxApplication"
                >
                  <el-input-number
                    v-model="formData.airdropCampaign.maxApplication"
                    :controls="false"
                    :precision="0"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" style="padding-right: 0">
                <el-form-item
                  class="roles"
                  prop="customerRoleIds"
                  label="CUSTOMER ROLES"
                >
                  <el-select
                    v-model="formData.customerRoleIds"
                    multiple
                    filterable
                    :reserve-keyword="false"
                    placeholder="Add customer roles..."
                    size="large"
                  >
                    <el-option
                      v-for="customerRole in CUSTOMER_ROLES"
                      :key="customerRole.id"
                      :value="customerRole.id"
                      :label="customerRole.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <FormTitle
              text="RANK CONDITIONS"
              style="margin-top: 20px"
            ></FormTitle>
            <el-form-item prop="rankConditionIds" style="margin-top: 20px">
              <el-select
                multiple
                clearable
                placeholder="Select Rank"
                v-model="formData.rankConditionIds"
                class="select-rank"
              >
                <el-option
                  style="text-transform: capitalize"
                  v-for="rank in ranks"
                  :key="rank.id"
                  :value="rank.id"
                  :label="rank.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button
        v-loading="loadingSubmit"
        id="btnSubmit"
        type="danger"
        @click.native.prevent="handleSubmit"
        >Save Changes</el-button
      >
    </div>
    <DialogAddExam
      :isShow="isShowAddExam"
      :close="handleCloseExam"
      @select="handleSelectExam"
      :selected="formData.passConditionVideoCourseExamIds"
    ></DialogAddExam>
    <dialog-add-course
      :isShow="isShowAddCourse"
      :close="handleClose"
      @select="handleSelectCourse"
      :selected="formData.watchConditionVideoCourseIds"
    ></dialog-add-course>
    <el-drawer
      v-if="airdropTokenForm.isShowAddAirdropToken"
      :visible="airdropTokenForm.isShowAddAirdropToken"
      ref="airdropTokenFormRef"
      size="calc(100% - 210px)"
      :before-close="hideAirdropTokenForm"
      :destroy-on-close="true"
    >
      <airdrop-token-form
        @submittedSuccessfully="handleSubmittedAirdropToken"
        :tokenId="airdropTokenForm.tokenIdForEdit"
      ></airdrop-token-form>
    </el-drawer>
  </div>
</template>

<script>
import FormTitle from '@/components/FormTitle'
import { NAME_ROUTE_EDIT_CAMPAIGN, CUSTOMER_ROLES } from '@/commons/constants'
import UploadImage from '@/components/UploadImage/index.vue'
import { putAirdropCampaign, getAirdrop, getRanks } from '@/api/airdrop'
import { getAirdropTokens } from '@/api/token'
import DialogAddCourse from '@/components/Airdrop/Campaign/Add/DialogAddCourse.vue'
import DialogAddExam from '@/components/Airdrop/Campaign/Add/DialogAddExam.vue'
import AirdropTokenForm from '@/views/airdrop/token/put'

import { StatusLessonEnum } from '@/commons/enums'

// rules
import { rules } from '@/utils/validate'

// apis
import { uuidv4, formatDate, formatTimeV3 } from '@/utils'

export default {
  components: {
    FormTitle,
    UploadImage,
    DialogAddCourse,
    DialogAddExam,
    AirdropTokenForm,
  },
  computed: {
    isEdit: function () {
      return this.$route.name === NAME_ROUTE_EDIT_CAMPAIGN
    },
    startedAt: {
      get: function () {
        return (
          formatDate(this.formData.startedDate) +
          ' ' +
          formatTimeV3(this.formData.startedTime)
        )
      },
      set: function (datetime) {
        this.formData.startedDate = new Date(datetime)
        this.formData.startedTime = new Date(datetime)
      },
    },
    endedAt: {
      get: function () {
        return (
          formatDate(this.formData.endedDate) +
          ' ' +
          formatTimeV3(this.formData.endedTime)
        )
      },
      set: function (datetime) {
        this.formData.endedDate = new Date(datetime)
        this.formData.endedTime = new Date(datetime)
      },
    },
  },
  data() {
    const validateEndedAt = (rule, value, callback) => {
      if (this.startedAt > this.endedAt) {
        callback(new Error('End datetime must be greater than start datetime'))
      } else {
        callback()
      }
    }

    const validateMaxApplication = (rule, value, callback) => {
      if (value < this.formData.airdropCampaign.maxRecipient) {
        callback(
          new Error(
            'Max application must be greater than number of participants'
          )
        )
      } else {
        callback()
      }
    }

    return {
      StatusLessonEnum,
      CUSTOMER_ROLES,
      tokenList: [],
      loadingToken: false,
      loadingAll: false,
      formData: {
        airdropCampaign: {
          title: '',
          description: '',
          thumbnailUrl: '',
          maxRecipient: 1,
          maxApplication: 1,
          id: '',
          airdropTokenId: '',
          amount: '',
        },
        watchConditionVideoCourseIds: [],
        passConditionVideoCourseExamIds: [],
        customerRoleIds: [],
        startedDate: '',
        startedTime: '',
        endedDate: '',
        endedTime: '',
        rankConditionIds: [],
      },
      rules: {
        'airdropCampaign.title': rules.title,
        'airdropCampaign.description': rules.description,
        'airdropCampaign.thumbnailUrl': rules.thumbnail,
        'airdropCampaign.maxRecipient': [rules.maxRecipient, rules.min_1],
        'airdropCampaign.maxApplication': [
          rules.maxApplication,
          rules.min_1,
          {
            validator: validateMaxApplication,
          },
        ],
        'airdropCampaign.amount': rules.amount,
        'airdropCampaign.airdropTokenId': rules.airdropTokenId,
        startedTime: rules.time,
        endedDate: [rules.date],
        endedTime: [
          rules.time,
          {
            // validate endedAt > startedAt
            validator: validateEndedAt,
          },
        ],
        startedDate: rules.date,
        customerRoleIds: rules.customerRoles,
      },
      loadingSubmit: false,
      isShowAddExam: false,
      isShowAddCourse: false,
      ranks: [],
      airdropTokenForm: {
        isShowAddAirdropToken: false,
        isSubmittedAirdropTokenForm: false,
        tokenIdForEdit: '',
      },
    }
  },

  created() {
    this.fetchTokens()
    this.fetchRanks()
    if (this.isEdit) {
      this.fetchAirdropCampaign(true)
    }
  },
  watch: {
    'formData.airdropCampaign.description': function () {
      this.$refs['formData'].validateField('airdropCampaign.description')
    },
    'formData.airdropCampaign.thumbnailUrl': function () {
      this.$refs['formData'].validateField('airdropCampaign.thumbnailUrl')
    },
    'formData.watchConditionVideoCourseIds': function () {
      this.$refs['formData'].validateField('watchConditionVideoCourseIds')
    },
    'formData.passConditionVideoCourseExamIds': function () {
      this.$refs['formData'].validateField('passConditionVideoCourseExamIds')
    },
  },
  methods: {
    handleSelectExam(exams) {
      this.formData.passConditionVideoCourseExamIds = exams
      this.isShowAddExam = false
    },
    handleSelectCourse(videos) {
      this.formData.watchConditionVideoCourseIds = videos
      this.isShowAddCourse = false
    },
    handleClose() {
      this.$confirm('Are you sure you want to close this?')
        .then(() => {
          this.isShowAddCourse = false
        })
        .catch(() => {
          // catch error
        })
    },
    showAddCourse() {
      this.isShowAddCourse = true
    },
    handleCloseExam() {
      this.$confirm('Are you sure you want to close this?')
        .then(() => {
          this.isShowAddExam = false
        })
        .catch(() => {
          // catch error
        })
    },
    showAddExam() {
      this.isShowAddExam = true
    },
    changeToken() {},
    async fetchTokens() {
      return new Promise(async (resolve, reject) => {
        try {
          this.loadingToken = true
          const { data } = await getAirdropTokens({
            pagination: {
              limit: 1000,
              offset: 0,
            },
          })
          this.tokenList =
            data && data.airdropTokens && data.airdropTokens.airdropTokens
              ? data.airdropTokens.airdropTokens
              : []
          resolve()
        } catch (error) {
          reject()
        } finally {
          this.loadingToken = false
        }
      })
    },
    async fetchAirdropCampaign(isLoading = true) {
      try {
        if (isLoading) this.loadingAll = true
        const { id } = this.$route.params
        const res = await getAirdrop({ airdropCampaignId: parseInt(id) })
        this.formData.airdropCampaign.id =
          res.data.airdropCampaign.airdropCampaign.id
        this.formData.airdropCampaign.title =
          res.data.airdropCampaign.airdropCampaign.title
        this.formData.airdropCampaign.description =
          res.data.airdropCampaign.airdropCampaign.description
        // this.$set(
        //   this.formData.airdropCampaign,
        //   "thumbnailUrl",
        //   res.data.videoCourse.videoCourse.thumbnailUrl
        // );
        this.formData.airdropCampaign.thumbnailUrl =
          res.data.airdropCampaign.airdropCampaign.thumbnailUrl
        this.startedAt = res.data.airdropCampaign.airdropCampaign.startedAt
        this.endedAt = res.data.airdropCampaign.airdropCampaign.endedAt
        this.formData.airdropCampaign.maxRecipient =
          res.data.airdropCampaign.airdropCampaign.maxRecipient
        this.formData.airdropCampaign.maxApplication =
          res.data.airdropCampaign.airdropCampaign.maxApplication
        this.formData.airdropCampaign.airdropTokenId =
          res.data.airdropCampaign.airdropCampaign.airdropToken.id
        this.formData.airdropCampaign.amount =
          res.data.airdropCampaign.airdropCampaign.amount
        this.formData.watchConditionVideoCourseIds =
          res.data.airdropCampaign.watchVideoCourseConditions
        this.formData.passConditionVideoCourseExamIds =
          res.data.airdropCampaign.passVideoCourseExamConditions
        this.formData.customerRoleIds =
          res.data.airdropCampaign.eligibleCustomerRoles.map((item) => item.id)
        this.formData.rankConditionIds =
          res.data.airdropCampaign.rankConditions.map((rank) => rank.id)
      } catch (error) {
        console.error(error)
      } finally {
        this.loadingAll = false
      }
    },
    removeThumbnailUrl() {
      this.$set(this.formData.airdropCampaign, 'thumbnailUrl', '')
    },
    updateThumbnailUrl(thumbnailUrl) {
      this.$set(this.formData.airdropCampaign, 'thumbnailUrl', thumbnailUrl)
    },

    async handlePutAirdropCampaign() {
      let vm = this
      // put video content
      try {
        vm.loadingSubmit = true
        // change type of amount to string
        this.formData.airdropCampaign.amount = String(
          this.formData.airdropCampaign.amount
        )
        let request = {
          airdropCampaign: {
            ...this.formData.airdropCampaign,
            startedAt: new Date(this.startedAt).toISOString(),
            endedAt: new Date(this.endedAt).toISOString(),
          },
          watchConditionVideoCourseIds:
            this.formData.watchConditionVideoCourseIds.map((item) => item.id),
          passConditionVideoCourseExamIds:
            this.formData.passConditionVideoCourseExamIds.map(
              (item) => item.id
            ),
          customerRoleIds: this.formData.customerRoleIds,
          rankConditionIds: this.formData.rankConditionIds,
        }
        if (!vm.isEdit) delete request.airdropCampaign.id
        const resVideo = await putAirdropCampaign(request)

        // const courseId = resVideo.data.putVideoCourse.id;

        // let listExamNew = this.videoCourseExams.filter((exam) => exam.isNew);
        // if (listExamNew.length) {
        //   let requestArr = listExamNew.map((exam) => {
        //     let cloneData = JSON.parse(JSON.stringify(exam));
        //     cloneData = this.refactorDataExam(cloneData);
        //     cloneData.videoCourseId = courseId;
        //     return putVideoCourseExam(cloneData);
        //   });
        //   await Promise.all(requestArr);
        // }

        vm.$message({
          message: !vm.isEdit ? 'Add course success' : 'Update course success',
          type: 'success',
        })
        vm.$router.push({
          path: '/airdrop',
        })
      } catch (error) {
      } finally {
        vm.loadingSubmit = false
      }
    },
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.handlePutAirdropCampaign()
        } else {
          return false
        }
      })
    },
    showAirdropTokenForm() {
      this.airdropTokenForm.isShowAddAirdropToken = true
    },
    addAirdropTokenForm() {
      this.airdropTokenForm.tokenIdForEdit = ''
      this.showAirdropTokenForm()
    },
    editAirdropTokenForm() {
      this.airdropTokenForm.tokenIdForEdit =
        this.formData.airdropCampaign.airdropTokenId
      this.showAirdropTokenForm()
    },
    hideAirdropTokenForm(close) {
      if (this.isSubmittedAirdropTokenForm === true) {
        this.airdropTokenForm.isShowAddAirdropToken = false
        close()
        this.airdropTokenForm.isSubmittedAirdropTokenForm = false
        return
      }
      this.airdropTokenForm.isShowAddAirdropToken = false
    },
    handleSubmittedAirdropToken(token) {
      this.airdropTokenForm.isSubmittedAirdropTokenForm = true

      const existingTokenIndex = this.tokenList.findIndex(
        (tokenItem) => tokenItem.id === token.id
      )
      if (existingTokenIndex !== -1) {
        this.tokenList[existingTokenIndex] = token
      } else {
        this.tokenList.push(token)
      }

      this.formData.airdropCampaign.airdropTokenId = token.id

      this.$refs['airdropTokenFormRef'].closeDrawer()
    },
    async fetchRanks() {
      try {
        const { data } = await getRanks()
        if (data && data.ranks && data.ranks.ranks) {
          this.ranks = data.ranks.ranks
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.course__body {
  display: flex;
  flex-direction: column;
}
::v-deep .el-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

::v-deep .el-upload {
  .upload-file {
    width: 80px;
    height: 80px;
  }
}

::v-deep {
  .el-form-item {
    margin-bottom: 0;
    flex-grow: 1;

    .el-form-item__content {
      width: 100%;

      .el-input {
        width: 100%;

        .el-input__inner {
          width: 100%;
        }
      }

      .el-select {
        width: 100%;

        .el-input__inner {
          width: 100%;
        }
      }
    }
  }
}
#btnSubmit {
  width: fit-content;
  height: fit-content;
  margin: 0 auto;
  margin-top: 20px;
}

::v-deep .video-item {
  height: 48px;
  margin-top: 12px;
  box-sizing: border-box;
  .el-card__body {
    height: 100%;
    padding: 0 24px;
    display: flex;
    align-items: center;
  }
  .video-item__content {
    display: flex;
    align-items: center;
    height: 100%;
    .video-item__title {
      height: 100%;
      font-size: 14px;
      line-height: 24px;
      flex-grow: 1;
      color: #1a202c;
    }
    .video-item__edit {
      margin: 0 12px;
    }
  }
}

::v-deep .el-button + .el-button {
  margin-left: unset;
}

.select-rank {
  width: 48% !important;
}
</style>
