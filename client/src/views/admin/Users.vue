<template>
  <div>
    <div class="message-wrap">
      <div class="message success" :class="{shown: successMessage}">{{successMessage}}</div>
      <div class="message error" :class="{shown: errorMessage}">{{errorMessage}}</div>
    </div>
    <div class="flex-row heading-row">
      <div class="flex-col">
        <h1>Users</h1>
        <button v-if="!showForm" @click="showInvite">Invite new user</button>
      </div>
      <div class="flex-col">
        <label>
          <input type="search" v-model="filterBy.search" placeholder="Search users" />
          <span></span>
        </label>
        <label class="custom-select">
          <p>Usergroup:</p>
          <select v-model="filterBy.userGroup">
            <option value>all</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
          </select>
          <span></span>
        </label>
        <label class="custom-select">
          <p>Status:</p>
          <select v-model="filterBy.status">
            <option value>all</option>
            <option value="active">active</option>
            <option value="eMailConfirmation">eMailConfirmation</option>
            <option value="invitation">invitation</option>
            <option value="blocked">blocked</option>
          </select>
          <span></span>
        </label>
        <p class="filterStatus">
          Show
          <span class="filter-block" v-if="!filterBy.search">all</span>
          <span class="filter-block" v-if="filterBy.search">
            Results for
            <strong>{{filterBy.search}}</strong>
            <button class="sec" @click="resetFilter('search')">x</button>
          </span>
          <span class="filter-block" v-if="filterBy.userGroup">
            Usergroup:
            <strong>{{filterBy.userGroup}}</strong>
            <button class="sec" @click="resetFilter('userGroup')">x</button>
          </span>
          <span class="filter-block" v-if="filterBy.status">
            status:
            <strong>{{filterBy.status}}</strong>
            <button class="sec" @click="resetFilter('status')">x</button>
          </span>
        </p>
      </div>
    </div>
    <div v-if="showForm">
      <h3>Invite new User</h3>
      <div class="form-wrap" :class="{loading: isLoading}">
        <button v-if="showForm" @click="showForm = false" class="sec close">X</button>
        <form @submit.prevent="invite()" :class="{hidden: successMessage}">
          <label>
            Name
            <input type="text" id="name" v-model="newUser.name" required />
            <span></span>
          </label>
          <label>
            Email
            <input type="email" v-model="newUser.email" required />
            <span></span>
          </label>
          <button type="submit">Invite</button>
        </form>
      </div>
    </div>
    <hr />
    <table>
      <tr>
        <th class="setSortBy" @click="setSortBy('name')">
          Name
          <span class="sortBy" :class="[{active: (sortBy == 'name')}, {reverse : sortReverse}]"></span>
        </th>
        <th class="setSortBy" @click="setSortBy('email')">
          Email
          <span class="sortBy" :class="[{active: (sortBy == 'email')}, {reverse : sortReverse}]"></span>
        </th>
        <th class="setSortBy" @click="setSortBy('userGroup')">
          Usergroup
          <span class="sortBy" :class="[{active: (sortBy == 'userGroup')}, {reverse : sortReverse}]"></span>
        </th>
        <th class="setSortBy" @click="setSortBy('status')">
          Status
          <span class="sortBy" :class="[{active: (sortBy == 'status')}, {reverse : sortReverse}]"></span>
        </th>
        <th class="setSortBy" @click="setSortBy('date')">
          Registered on
          <span class="sortBy" :class="[{active: (sortBy == 'date')}, {reverse : sortReverse}]"></span>
        </th>
      </tr>
      <tr v-for="u in filteredAndSortedUsers" :key="u._id">
        <td>{{u.name}}</td>
        <td>
          <a :href="`mailto:${u.local.email}`">{{u.local.email}}</a>
        </td>
        <td>{{u.userGroup}}</td>
        <td>{{u.status}}</td>
        <td><span v-if="u.dates">{{u.dates.registered.substring(0, 10)}}</span></td>
        <td>
          <router-link :to="`/admin/user/edit/${u._id}`">
            <button class="sec">edit</button>
          </router-link>
        </td>
        <td>
          <button class="sec" @click="deleteItem(u._id)">delete</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
const { API_URL } = require("@/constants.js");
const GET_URL = API_URL + "/auth/get";
const INVITE_URL = API_URL + "/auth/invite";
const DELETE_URL = API_URL + "/auth/delete";
export default {
  name: "Users",
  props: ["setSuccess", "setError"],
  data() {
    return {
      showForm: false,
      errorMessage: "",
      successMessage: "",
      isLoading: false,
      users: [],
      newUser: {
        name: "",
        email: ""
      },
      sortBy: "name",
      sortReverse: false,
      filterBy: {
        search: "",
        userGroup: "",
        status: ""
      }
    };
  },
  methods: {
    showInvite() {
      this.showForm = true;
      setTimeout(function() {
        document.querySelector("#name").focus();
      }, 200);
    },
    async getUsers() {
      try {
        const response = await this.$http.get(GET_URL);
        this.users = response.data.users;
      } catch (error) {
        console.log(error);
      }
    },
    async invite() {
      this.isLoading = true;
      const body = this.newUser;
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      try {
        await this.$http.post(INVITE_URL, body, config);
        this.isLoading = false;
        this.showForm = false;
        this.newUser = { name: "", email: "" };
        this.getUsers();
        this.successMessage = "User invited";
        setTimeout(() => (this.success = ""), 2000);
      } catch (error) {
        this.errorMessage = error.response.data.msg;
        setTimeout(() => (this.errorMessage = ""), 2000);
        this.isLoading = false;
      }
    },
    async deleteItem(id) {
      const body = {
        id
      };
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      try {
        await this.$http.post(DELETE_URL, body, config);
        this.getUsers();
        this.successMessage = "User removed";
        setTimeout(() => (this.successMessage = ""), 2000);
      } catch (error) {
        this.errorMessage = error.response.data.msg;
        console.log(error);
        setTimeout(() => (this.errorMessage = ""), 2000);
      }
    },
    resetFilter(key) {
      this.filterBy[key] = "";
    },
    setSortBy(key) {
      if (this.sortBy == key) {
        this.sortReverse = !this.sortReverse;
      } else {
        this.sortBy = key;
        this.sortReverse = false;
      }
    }
  },
  mounted() {
    this.getUsers();
    if (this.setError) {
      this.errorMessage = this.setError;
    }
    if (this.setSuccess) {
      this.successMessage = this.setSuccess;
      setTimeout(() => (this.successMessage = ""), 2000);
    }
  },
  computed: {
    filteredAndSortedUsers: function() {
      //Filter by Search
      let result = this.users.filter(el => {
        return el.name.toLowerCase().match(this.filterBy.search.toLowerCase());
      });
      //Filter by Filter
      result = result.filter(el => {
        return (
          el.userGroup.match(this.filterBy.userGroup) &&
          el.status.match(this.filterBy.status)
        );
      });

      //Sort
      let compare = Boolean;
      if (this.sortBy == "name") {
        compare = (a, b) => (a.name > b.name ? 1 : -1);
      }
      if (this.sortBy == "email") {
        compare = (a, b) => (a.local.email > b.local.email ? 1 : -1);
      }
      if (this.sortBy == "userGroup") {
        compare = (a, b) => (a.userGroup > b.userGroup ? 1 : -1);
      }
      if (this.sortBy == "status") {
        compare = (a, b) => (a.status > b.status ? 1 : -1);
      }
      if (this.sortBy == "date") {
        compare = (a, b) => (a.dates.registered > b.dates.registered ? 1 : -1);
      }
      //Reverse
      if(this.sortReverse){
        return result.sort(compare).reverse();
      }
      return result.sort(compare);
    }
  }
};
</script>