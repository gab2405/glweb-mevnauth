<template>
  <div id="app" class="wrapper">
    <header>
      <div class="container">
        <nav>
          <router-link to="/" exact>Home</router-link>
          <router-link to="/dashboard" v-if="auth">Dashboard</router-link>
          <router-link to="/admin/users" v-if="isAdmin">Admin</router-link>
          <div class="auth-links">
            <router-link to="/login" v-if="!auth">Login</router-link>
            <router-link to="/register" v-if="!auth">Register</router-link>
            <router-link to="/logout" v-if="auth">Logout</router-link>
          </div>
        </nav>
      </div>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <div class="container">
        <h5>
          &copy; {{new Date().getFullYear()}} mevn auth 24
          <span class="dash">|</span>
        </h5>
        <a href="https://www.gl-webentwicklung.de" target="_blank">
          <h5>glweb.de</h5>
        </a>
        <span class="last">
          view on
          <a href="https://github.com/gab2405/glweb-mevnauth" target="_blank">Github</a>
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
const { getSecret } = require("@/globalFunctions");
export default {
  name: "App",
  data() {
    return {
      isAdmin: false
    };
  },
  computed: {
    ...mapState(["auth"]),
    ...mapGetters({
      userFromStore: "user"
    }),
    user: {
      get() {
        return this.userFromStore;
      },
      set(newUser) {
        return newUser;
      }
    }
  },
  methods: {
    ...mapMutations(["getAuth", "getUser"]),
    async checkUser() {
      if (localStorage.token) {
        this.getAuth(true);
        let response = await getSecret();
        this.getUser(response);
        if (response.userGroup == "Admin") {
          this.isAdmin = true;
        }
        if (response) {
          return false;
        }
      } else {
        this.getAuth(false);
        return false;
      }
    }
  },
  mounted() {
    this.checkUser();
  },
  watch: {
    auth(newValue) {
      if (newValue) {
        let el = this;
        if (el.checkUser()) {
          return true;
        } else {
          setTimeout(function() {
            if (el.checkUser()) {
              return true;
            }
            return false;
          }, 200);
        }
      } else {
        this.user = {};
        this.isAdmin = false;
      }
    }
  }
};
</script>