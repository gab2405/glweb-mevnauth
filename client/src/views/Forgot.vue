<template>
  <section class="form-section">
    <div class="form-card">
      <h1>Password reset</h1>
      <div class="message error" :class="{shown: errorMessage}">{{errorMessage}}</div>
      <div
        class="message success" :class="{shown: success}"
      >Successfully submitted. Check you Email to reset your password.</div>
      <div class="form-wrap" :class="{loading: isLoading}">
        <form @submit.prevent="sendForgot()" :class="{hidden : success}">
          <label>
            Email
            <input v-model="email" type="text" id="email" required />
            <span></span>
          </label>
          <button type="submit" class="btn btn-primary">Send</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
const { API_URL } = require("../constants.js");
const FORGOT_URL = API_URL + "/auth/forgot";
export default {
  name: "Forgot",
  data: () => ({
    errorMessage: "",
    success: false,
    email: "",
    isLoading: false
  }),
  methods: {
    async sendForgot() {
      this.isLoading = true;
      const body = {
        email: this.email
      };
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      try {
        const response = await this.$http.post(FORGOT_URL, body, config);
        console.log(response);
        this.success = true;
        this.isLoading = false;
      } catch (error) {
        console.error(error);
        this.errorMessage = error;
        this.isLoading = false;
      }
    }
  },
  mounted() {
    document.querySelector("#email").focus();
  }
};
</script>

<style>
</style>
