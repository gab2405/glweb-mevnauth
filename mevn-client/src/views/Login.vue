<template>
  <article class="v-login">
    <h1>Login</h1>
    <form
      @submit.prevent="submitLogin"
      class="v-login__form"
    >
      <input type="email" v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <div v-if="validationMessage" class="v-login__validation">
      {{ validationMessage }}
    </div>
  </article>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { useStore } from 'vuex';
import authService from '@/services/auth/authService';
import { localService } from '@/services/storageHandler';

const store = useStore();
const email = ref('john@doe.com');
const password = ref('');
const validationMessage = ref('');

const submitLogin = async () => {
  try {
    // TODO: add validation
    const body = {
      email: email.value,
      password: password.value,
    };
    const res = await authService.login(body);

    // handle successful login
    if (res && 'token' in res) {
      localService.set('jwt', res.token);
      await store.dispatch('setIsLoggedIn', true);
      return;
    }

    // handle unsuccessful login
    if (res.err?.status === 401) {
      validationMessage.value = 'Email and password do not match. Please try again.';
    }
  } catch (e) {
    console.error(e);
  }
};

</script>

<style lang="scss">
.v-login {
  //
}
</style>
