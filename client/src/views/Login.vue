<template>
  <section class="form-section">
    <div class="form-card">
      <h1>Login</h1>
      <div class="message error" :class="{shown: errorMessage}">{{errorMessage| filtermessage }}</div>
      <div class="form-wrap" :class="{loading: isLoading}">
        <form @submit.prevent="signin()">
          <label>
            Email
            <input v-model="user.email" type="text" id="email" required />
            <span></span>
          </label>
          <label for="password">
            Password
            <input
              v-model="user.password"
              type="password"
              class="form-control"
              id="password"
              aria-describedby="passwordHelp"
              required
            />
            <span></span>
          </label>
          <button type="submit" class="btn btn-primary">Login</button>
          <div>
            Don’t have an account?
            <router-link to="/register">Register</router-link>
          </div>
          <div>
            Forgot Password?
            <router-link to="/forgot">Reset</router-link>
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
const SIGNIN_URL = API_URL + "/auth/login";

const schema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(3)
    .max(30)
    .required()
});

export default {
  components: {},
  data: () => ({
    errorMessage: "",
    isLoading: false,
    user: {
      email: "admin@mail.com",
      password: "admin"
    }
  }),
  filters: {
    filtermessage: value => {
      if (value.includes("Unexpected token"))
        return "email and password do not match.";
      else return value;
    }
  },
  methods: {
    ...mapMutations(["getAuth"]),
    async signin() {
      this.errorMessage = "";
      if (this.validUser()) {
        this.isLoading = true;
        const body = {
          email: this.user.email,
          password: this.user.password
        };
        const config = {
          headers: {
            "Content-Type": "application/json"
          }
        };

        this.$http
          .post(SIGNIN_URL, body, config)
          .then(response => {
            this.getAuth(true);
            localStorage.token = response.data.token;
            this.isLoading = false;
            this.$router.push("/dashboard");
          })
          .catch(error => {
            console.log(error.response);
            this.isLoading = false;
            this.user.password = "";
            this.errorMessage = "Email and Password do not match";
          });
      }
    },
    validUser() {
      const result = Joi.validate(this.user, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes("email")) {
        this.errorMessage = "email is invalid.";
        return false;
      }

      this.errorMessage = "Password is invalid.";
      return false;
    }
  },
  mounted() {
    document.querySelector("#email").focus();
  }
};
</script>

<style>
</style>
