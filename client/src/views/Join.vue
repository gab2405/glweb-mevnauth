<template>
  <section class="form-section">
    <div class="form-card">
      <h1>Join our plattform</h1>
      <div class="message error" :class="{shown: msg}">{{msg}}</div>
      <div>
        <div class="message error" :class="{shown: errorMessage}">{{errorMessage}}</div>
        <div class="message success" :class="{shown: success}">
          Successfully submitted. You can now
          <router-link to="/login">login</router-link> with your new password.
        </div>
        <div class="form-wrap" :class="{loading: isLoading}">
          <form @submit.prevent="send()" :class="[{hidden: !valid}, {hidden: success}]">
            <label>
              Name
              <input type="text" id="name" v-model="user.name" />
              <span></span>
            </label>
            <label>
              Email
              <input type="email" v-model="user.local.email" />
              <span></span>
            </label>
            <label>
              Password
              <input v-model="user.password" type="password" id="password" required />
              <span></span>
            </label>
            <label>
              Confirm Password
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
const CheckJoinToken_URL = API_URL + "/auth/checkJoinToken";
const JOIN_URL = API_URL + "/auth/join";
export default {
  name: "Join",
  data: () => ({
    msg: "",
    errorMessage: "",
    success: false,
    valid: false,
    isLoading: false,
    user: {
      name: "",
      password: "",
      confirmPassword: "",
      local: {
        email: ""
      }
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
          CheckJoinToken_URL,
          body,
          config
        );
        this.msg = response.data.msg;
        this.valid = response.data.valid;
        this.isLoading = false;
        setTimeout(() => document.querySelector("#password").focus(), 400);
        this.user = response.data.findUser;
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
          .required(),
          emailConfirmed: Joi.optional(),
          local:Joi.optional(),
          userGroup:Joi.optional(),
          status:Joi.optional(),
          name:Joi.optional(),
          method:Joi.optional(),
          _id:Joi.optional(),
          __v:Joi.optional(),
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
          console.log(result.error.message)
        this.errorMessage = "Password is invalid.";
      }
      return false;
    },
    async send() {
      this.isLoading = true;
      if (this.validUser()) {
        const body = {
            id: this.user._id,
            name: this.user.name,
            email: this.user.local.email,
            password: this.user.password
        };
        const config = {
          headers: {
            "Content-Type": "application/json"
          }
        };
        try {
          const response = await this.$http.post(JOIN_URL, body, config);
          console.log(response);
          this.success = true;
          this.isLoading = false;
        } catch (error) {
          console.error(error.message);
          this.isLoading = false;
        }
      } else {
        this.isLoading = false;
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
