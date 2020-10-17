<template>
  <div id="PaymentUserProfile" class="cv-modal normal">
    <div
      style="
        display: flex;
        flex-direction: column;
        max-width: 1000px;
        width: 55%;
        height: 55%;
        overflow: auto;
      "
    >
      <div class="row m-0 p-2 bg-primary text-white">
        <div class="active d-inline-block">
          <h5>Update {{ name }}'s Profile</h5>
        </div>
        <i class="flex-fill"></i>
        <span
          onclick="hideModal('PaymentUserProfile')"
          class="d-inline-block mr-4"
        >
          <i class="fas fa-times"></i>
        </span>
      </div>
      <div class="single-page">
        <div class="">
          <div class="wrapper wrapper2 h-100">
            <form id="Register" tabindex="500" class="card-body h-100">
              <div id="user-email" class="username col-sm-12 mb-3">
                <div id="trainer_names" class="col-sm-12 dropdown-contents">
                  <input
                    type="email"
                    placeholder="Enter Your Email address"
                    id="email"
                    v-model="email"
                  />
                  <small
                    v-if="registerButtonClicked && !validateEmail(email)"
                    class="cv-error"
                  >
                    <i class="fas fa-exclamation-circle"></i>
                    Enter Valid Email ID.
                  </small>
                  <!---->
                  <label>Email</label>
                </div>
              </div>
              <div id="user-contact" class="username col-sm-12 mb-3">
                <div id="user-contact" class="col-sm-12 dropdown-contents mt-3">
                  <vue-tel-input
                    v-model="phone"
                    id="contact"
                    :valid-characters-only="true"
                    @input="onInput"
                    placeholder="Enter 10 digit mobile number"
                    style="color: #000;"
                  ></vue-tel-input>
                  <small
                    v-if="!validPhoneNumber && registerButtonClicked"
                    class="cv-error"
                  >
                    <i class="fas fa-exclamation-circle"></i>
                    Enter valid Mobile Number.
                  </small>
                  <label>Contact</label>
                </div>
              </div>
              <div
                class="form-footer col-xl-12 text-center mt-4 pl-4"
                style="bottom: 0px;"
              >
                <center>
                  <button
                    id="register-btn"
                    class="btn btn-primary btn-block col-xl-2"
                    @click="updateUserProfile"
                  >
                    Submit
                  </button>
                </center>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Loader v-if="processing" />
  </div>
</template>
<script>
import { VueTelInput } from 'vue-tel-input'
import AuthMixin from '@/mixins/AuthMixin.js'
import Loader from '@/components/widgets/BlockingLoader.vue'
import axios from 'axios'
export default {
  components: { VueTelInput, Loader },
  mixins: [AuthMixin],
  data() {
    return {
      email: '',
      validPhoneNumber: false,
      phone: '',
      name: '',
      processing: false,
      registerButtonClicked: false,
    }
  },
  mounted() {
    cvAuth.getUserId(
      function (userId) {
        if (userId) {
          this.userId = userId
          this.name = this.$store.getters.getAuthData.auth_user_full_name
          this.email = this.$store.getters.getAuthData.auth_user_email
          this.phone = this.$store.getters.getAuthData.auth_user_contact
        }
      }.bind(this),
    )
  },
  methods: {
    onInput(formattedNumber, { number, valid, country }) {
      this.validPhoneNumber = valid
      this.phone = number.international
    },
    validateEmail(email) {
      return validateEmail(email)
    },
    validatePhone(phone) {
      return validatePhone(phone)
    },
    updateUserProfile(e) {
      e.preventDefault()
      this.registerButtonClicked = true
      var canSubmit = true
      if (!this.validateEmail(this.email)) {
        canSubmit = false
      }
      if (!this.validPhoneNumber) {
        canSubmit = false
      }
      if (!canSubmit) return
      this.updateFinalProfile()
    },
    updateFinalProfile() {
      this.processing = true
      axios
        .post('/api/user/UdateUserData', {
          user_id: this.userId,
          email: this.email,
          phone: this.phone,
        })
        .then((res) => {
          if (res.data.status == 200) {
            if (res.data.data == 0) {
              window.cvNotify('Email already exists', 'warning')
               this.processing = false
            } else {
              cvNotify('Succesful udated', 'success')

              let email = this.email,
                phone = this.phone
              this.processing = false
              this.$emit('updationComplete', { email, phone })
            }
          }
        })
    },
  },
}
</script>
