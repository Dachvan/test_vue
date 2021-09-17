<template>
  <div>
    <tank-item v-for="post in posts" :post="post" :key="post.id" />
  </div>
</template>

<script>
import TankItem from "./TankItem.vue";
export default {
  components: { TankItem },
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped></style>
