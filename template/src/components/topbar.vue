<template>
  <header class="text-white topbar bg-primary">
    <div class="container-fluid clearfix">
      <div class="float-left">
        <router-link class="logo text-white clearfix" :to="{path: '/'}">
          <img src="../assets/logo.png" alt="logo" class="logo-img float-left">
          <span class="text-title align-middle float-left">测试文字</span>
        </router-link>
      </div>
      <div class="user-info float-right" v-if="user.id">
        <hg-dropdown trigger="click">
            <span class="el-dropdown-link" v-if="user.name">
              欢迎你，{{user.name}}
            </span>
          <hg-dropdown-menu slot="dropdown">
            <hg-dropdown-item @click.native="logout">注销</hg-dropdown-item>
          </hg-dropdown-menu>
        </hg-dropdown>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    name: "topbar",
    data() {
      return {
        user: {
          id: 1,
          name: 'admin'
        }
      }
    },
    methods: {
      logout() {
        this.$message.success('登出成功');
      }
    }
  }
</script>

<style lang="scss">
  $logo-size: 2rem;
  .topbar{
    .logo{
      font-size: $logo-size;
      .logo-img{
        height: 1.5 * $logo-size;
      }
    }
  }
</style>
