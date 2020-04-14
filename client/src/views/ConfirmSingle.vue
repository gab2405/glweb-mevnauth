<template>
  <section class="form-section">
    <div class="form-card">
      <h1>Your email address needs to be confirmed.</h1>
      <div class="message error" :class="{shown: errorMessage}">{{errorMessage}}</div>
      <div
        class="message success" :class="{shown: success}"
      >Email sent. Please check your email inbox to confirm your registration.</div>
      <div class="form-wrap" :class="{loading: isLoading}">
        <form @submit.prevent="resend()" :class={hidden:success}>
          <p>Please check your inbox for the confirmation email.</p>
          <button type="submit">Resend Email</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
const { API_URL } = require("../constants.js");
const RESEND_URL = API_URL + "/auth/resend";

export default {
  name: "Resend",
  data: () => ({
    isLoading: false,
    errorMessage: "",
    success: false,
    id: ""
  }),
  methods: {
    async resend() {
      this.isLoading = true;
      const body = {
        id: this.id
      };
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      this.$http
        .post(RESEND_URL, body, config)
        .then(response => {
          console.log(response);
          this.success = true;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error.response);
          this.errorMessage = error.response;
          this.isLoading = false;
        });
    }
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {
    user(newValue) {
      if (newValue) {
        this.id = newValue._id
      }
    }
  }
};
</script>

<style>
</style>
