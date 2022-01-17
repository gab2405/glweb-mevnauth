<template>
  <article class="v-dashboard">
    <section>
      <div class="container">
        <h1>Dashboard</h1>
        <div v-if="profile" class="v-dashboard__profile">
          <p>Name: {{profile.name}}</p>
          <p>Email: {{profile.local.email}}</p>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { useStore } from 'vuex';
import authService from '../services/auth/authService';

const store = useStore();

const initProfile = async (): Promise<void> => {
  try {
    const res = await authService.getProfile();
    store.dispatch('setIsauthenticated', true);
    store.dispatch('setProfile', res);
  } catch (err) {
    console.error(err);
  }
};
initProfile();

const profile = computed(() => store.getters.profile);

</script>

<style lang="scss">
.v-dashboard {
  //
}
</style>
