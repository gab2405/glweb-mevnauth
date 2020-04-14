<template>
  <section class="form-section">
    <div class="form-card">
      <h1>Password reset</h1>
      <div class="message error" :class="{shown: msg}">{{msg}}</div>
      <div>
        <div class="message error" :class="{shown: errorMessage}">{{errorMessage}}</div>
        <div class="message success" :class="{shown: success}">
          Successfully submitted. You can now
          <router-link to="/login">login</router-link> with your new password.
        </div>
        <div class="form-wrap" :class="{loading: isLoading}">
          <form @submit.prevent="sendReset()" :class="[{hidden: !valid}, {hidden: success}]">
            <label>
              New Password
              <input v-model="user.password" type="password" id="password" required />
              <span></span>
            </label>
            <label>
              Confirm new Password
              <input
                v-model="user.confirmPassword"
                type="password"
                id="passwordConfirm"
                required
              />
              <span></span>
            </label>
            <button v-if="valid" type="submit" class="btn btn-primary">Reset</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Joi from "joi";
const { API_URL } = require("../constants.js");
const CheckResetToken_URL = API_URL + "/auth/checkresettoken";
const Reset_URL = API_URL + "/auth/reset";
export default {
  name: "Reset",
  data: () => ({
    msg: "",
    errorMessage: "",
    success: false,
    valid: false,
    isLoading: false,
    user: {
      password: "",
      confirmPassword: ""
    }
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = "";
      },
      deep: true
    }
  },
  methods: {
    async checkToken() {
      this.isLoading = true;
      const body = {
        token: this.$route.params.token
      };
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      try {
        const response = await this.$http.post(
          CheckResetToken_URL,
          body,
          config
        );
        this.msg = response.data.msg;
        this.valid = response.data.valid;
        this.isLoading = false;
        document.querySelector("#password").focus();
      } catch (error) {
        console.error(error);
        this.errorMessage = error;
        this.isLoading = false;
      }
    },
    validUser() {
      const schema = Joi.object().keys({
        password: Joi.string()
          .min(3)
          .max(30)
          .required(),
        confirmPassword: Joi.string()
          .min(3)
          .max(30)
          .required()
      });
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = "Passwords must match.";
        return false;
      }

      const result = Joi.validate(this.user, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes("password")) {
        this.errorMessage = "Password needs at least 3 characters";
        return false;
      } else {
        this.errorMessage = "Password is invalid.";
      }
      return false;
    },
    async sendReset() {
      this.isLoading = true;
      if (this.validUser()) {
        const body = {
          token: this.$route.params.token,
          password: this.user.password
        };
        const config = {
          headers: {
            "Content-Type": "application/json"
          }
        };
        try {
          const response = await this.$http.post(Reset_URL, body, config);
          console.log(response);
          this.success = true;
          this.isLoading = false;
        } catch (error) {
          console.error(error.message);
          this.isLoading = false;
        }
      }
    }
  },
  mounted() {
    this.checkToken();
  }
};
</script>

<style>
</style>
