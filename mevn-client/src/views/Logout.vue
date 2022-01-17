<template>
  <article class="v-logout">
    <section>
      <div class="container">
        <h1>Logged out</h1>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { localService } from '@/services/storageHandler';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

/**
 * log the user out and update store status
 */
const logout = ():void => {
  localService.remove('jwt');
  store.dispatch('setIsauthenticated', false);
  store.dispatch('setProfile', {});
};
logout();

</script>
