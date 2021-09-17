<template>
  <div>
    <div>{{ post.name }}</div>
    <div>{{ post.content }}</div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
