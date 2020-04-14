<template>
  <section class="form-section">
    <div class="form-card">
      <div class="message error" :class="{shown: errorMessage}">{{errorMessage}}</div>
      <div class="message success" :class="{shown: success}">Email Confirmed</div>
      <p>
        Go to
        <router-link to="/dashboard">Dashboard</router-link>
      </p>
    </div>
  </section>
</template>

<script>
import { mapMutations } from "vuex";
const { API_URL } = require("../constants.js");
const CONFIRM_URL = API_URL + "/auth/confirm";

export default {
  name: "Confirm",
  data: () => ({
    id: "",
    success: false,
    errorMessage: ""
  }),
  methods: {
    ...mapMutations(["getAuth"]),
    async confirm() {
      const body = {
        id: this.$route.params.id
      };
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      this.$http
        .post(CONFIRM_URL, body, config)
        .then(response => {
          console.log(response);
          this.getAuth(true);
          localStorage.token = response.data.token;
          this.success = true;
        })
        .catch(error => {
          console.log(error.response);
          this.errorMessage = "The link is not valid";
        });
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.confirm();
  }
};
</script>
