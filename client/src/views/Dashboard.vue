<template>
  <section class="content-section">
    <div class="container">
      <h1>Dashboard</h1>
      <h3>Hello, {{user.name}}.</h3>
      <p class="message success" :class="{shown: success}">You successfully edited your profile</p>
      <div v-if="!success">
        <p v-if="!edit">
          <a @click="initEdit">Edit profile</a>
        </p>
        <div class="form-wrap" :class="{loading: isLoading}" v-if="edit">
          <button @click="edit = false" class="sec close">X</button>
          <form @submit.prevent="sendEdit()">
            <label>
              Your name
              <input type="text" id="name" v-model="user.name" />
              <span></span>
            </label>
            <label>
              Your email address
              <input type="email" id="email" v-model="user.local.email" />
              <span></span>
            </label>
            <button type="submit">save changes</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
const { API_URL } = require("../constants.js");
const EDIT_URL = API_URL + "/auth/edit";
export default {
  name: "Dashboard",
  data() {
    return {
      edit: false,
      isLoading: false,
      success: false,
      errorMessage: ""
    };
  },
  methods: {
    ...mapMutations(["getAuth"]),
    initEdit() {
      this.edit = true;
      setTimeout(function() {
        document.querySelector("#name").focus();
      }, 200);
    },
    async sendEdit() {
      this.isLoading = true;
      const body = {
        id: this.user._id,
        user: this.user
      };
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      try {
        const response = await this.$http.post(EDIT_URL, body, config);
        console.log(response);
        this.isLoading = false;
        this.success = true;
        this.edit = false;
        setTimeout(() => (this.success = false), 2000);
      } catch (error) {
        console.error(error.message);
        this.isLoading = false;
        this.errorMessage = error;
      }
    }
  },
  computed: {
    ...mapState(["auth", "user"])
  }
};
</script>

<style>
</style>
