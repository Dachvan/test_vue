<template>
  <div class="app">
    <search-user></search-user>
    <tank-list :posts="posts"></tank-list>
  </div>
</template>

<script>
import SearchUser from "@/components/SearchUser.vue";
import TankList from "@/components/TankList.vue";
export default {
  data: () => ({
    posts: [
      { id: 1, name: "test", content: "статистика" },
      { id: 2, name: "test 2", content: "статистика 2" },
    ],
  }),
  components: {
    SearchUser,
    TankList,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
input {
  width: 100%;
  height: 50px;
  border: 0px;
  outline: none;
  border-bottom: 1px solid #cacaca;
  padding: 0px 15px;
  margin: 15px 0px;
}
.app {
  padding: 30px;
}
</style>
