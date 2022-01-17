<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <span> | </span>
    <template v-if="isAuthenticated">
      <router-link to="/dashboard">Dashboard</router-link>
      <span> | </span>
      <router-link to="/logout">Logout</router-link>
    </template>
    <template v-else>
      <router-link to="/login">Login</router-link>
    </template>
  </div>
  <router-view />
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();

const isAuthenticated = computed(() => store.getters.isAuthenticated);

</script>
