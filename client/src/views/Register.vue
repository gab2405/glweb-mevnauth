<template>
  <section class="form-section">
    <div class="form-card">
      <h1>Register</h1>
      <div class="message error" :class="{shown: errorMessage}">{{errorMessage}}</div>
      <div
        class="message success" :class="{shown: success}"
      >Registration successful. Please check your Email to confirm your registration.</div>
      <div class="form-wrap" :class="{loading: isLoading}">
        <form @submit.prevent="signup" :class="{hidden: success}">
          <label>
            Name
            <input v-model="user.name" type="text" id="name" required />
            <span></span>
          </label>
          <label>
            Email
            <input v-model="user.email" type="text" id="email" required />
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
              id="confirmPassword"
              required
            />
            <span></span>
          </label>
          <button type="submit" class="btn btn-primary">Register</button>
          <div>
            Already a member?
            <router-link to="/login">Login</router-link>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import Joi from "joi";
import { mapMutations } from "vuex";
const { API_URL } = require("../constants.js");
const REGISTER_URL = API_URL + "/auth/register";

export default {
  name: "Registration",
  data: () => ({
    isLoading: false,
    errorMessage: "",
    success: false,
    user: {
      email: "",
      password: "",
      confirmPassword: "",
      name: ""
    }
  }),
  //   watch: {
  //     user: {
  //       handler() {
  //         this.errorMessage = "";
  //       },
  //       deep: true
  //     }
  //   },
  methods: {
    ...mapMutations(["getAuth"]),
    signup() {
      this.errorMessage = "";
      this.isLoading = true;
      if (this.validUser()) {
        const body = {
          email: this.user.email,
          password: this.user.password,
          name: this.user.name
        };
        const config = {
          headers: {
            "Content-Type": "application/json"
          }
        };
        this.$http
          .post(REGISTER_URL, body, config)
          .then(response => {
            this.isLoading = false;
            this.success = true;
            console.log(response);
          })
          .catch(error => {
            this.isLoading = false;
            this.user.password = "";
            this.user.confirmPassword = "";
            this.errorMessage = error.response.data.error;
          });
      } else {
        this.isLoading = false;
      }
    },
    validUser() {
      const schema = Joi.object().keys({
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string()
          .min(3)
          .max(30)
          .required(),
        confirmPassword: Joi.string()
          .min(3)
          .max(30)
          .required(),
        name: Joi.string()
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

      if (result.error.message.includes("name")) {
        this.errorMessage = "bad length or format of a name";
        return false;
      }

      if (result.error.message.includes("email")) {
        this.errorMessage = "email is invalid.";
      } else {
        this.errorMessage = "Password is invalid.";
      }

      return false;
    }
  },
  mounted() {
    document.querySelector("#name").focus();
  }
};
</script>