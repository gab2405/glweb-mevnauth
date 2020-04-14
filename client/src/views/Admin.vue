<template>
  <div class="admin-dashboard">
    <aside>
      <nav>
        <router-link to="/admin/users">Users</router-link>
      </nav>
    </aside>
    <article>
      <section class="content-section">
        <div class="container">
          <router-view></router-view>
        </div>
      </section>
    </article>
  </div>
</template>

<script>
// import testFunction from "./globalFunctions";
export default {
  name: "Admin",
}
</script>