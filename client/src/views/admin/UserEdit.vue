<template>
  <div>
    <div class="message-wrap">
      <div class="message error" v-if="errorMessage">{{errorMessage}}</div>
      <div class="message success" :class="{shown: success}">Successfully edited</div>
    </div>
    <h1>{{user.name}}</h1>
    <h3>Edit this user:</h3>
    <div class="form-wrap" :class="{loading: isLoading}">
      <button @click="$router.push({path: '/admin/users'})" class="sec close">X</button>
      <form @submit.prevent="edit">
        <label>
          <input type="text" id="name" v-model="user.name" placeholder="Name" />
          <span></span>
        </label>
        <label>
          <input type="email" v-model="user.local.email" placeholder="Email">
          <span></span>
        </label>
        <label class="custom-select">
          <p>Usergroup:</p>
          <select v-model="user.userGroup">
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
          <span></span>
        </label>
        <label class="custom-select">
          <p>Status:</p>
          <select v-model="user.status">
            <option value="active">active</option>
            <option value="blocked">blocked</option>
          </select>
          <span></span>
        </label>
        <button type="submit">Save</button>
        <button type="submit" @click="edit('saveandclose')">Save and Return</button>
      </form>
    </div>
  </div>
</template>

<script>
const { API_URL } = require("@/constants.js");
const FIND_SINGLE_URL = API_URL + "/auth/findsingle";
const EDIT_URL = API_URL + "/auth/edit";
export default {
  name: "UserEdit",
  data() {
    return {
      isLoading: false,
      success: false,
      errorMessage: "",
      user: {
        local: {}
      }
    };
  },
  methods: {
    async findUser() {
      this.isLoading = true;
      const body = {
        id: this.$route.params.id
      };
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      try {
        let response = await this.$http.post(FIND_SINGLE_URL, body, config);
        this.user = response.data.user;
        this.isLoading = false;
        document.querySelector("#name").focus();
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    },
    async edit(e) {
      this.isLoading = true;
      const body = {
        id: this.$route.params.id,
        user: this.user
      };
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      try {
        await this.$http.post(EDIT_URL, body, config);
        this.isLoading = false;
        this.success = true;
        if (e == "saveandclose") {
          this.$router.push({
            name: "AdminUsers",
            params: { setSuccess: "User edited" }
          });
          return;
        }
        setTimeout(() => (this.success = false), 2000);
      } catch (error) {
        console.log(error);
        this.errorMessage = error.response.data.error;
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.findUser();
  }
};
</script>