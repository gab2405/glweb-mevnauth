<template>
  <section class="content-section">
    <div class="container">
      <h1>Signed Out</h1>
    </div>
  </section>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  components: {},
  methods: {
    ...mapMutations(["getAuth"]),
    signout() {
      localStorage.removeItem("token");
      this.getAuth(false);
    }
  },
  beforeMount() {
    this.signout();
  }
};
</script>

<style>
</style>
