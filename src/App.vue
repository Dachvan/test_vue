<template>
  <header-page/>
  <router-view/>
  <footer-page/>
</template>

<script>
import HeaderPage from '@/components/HeaderPage.vue';
import FooterPage from '@/components/FooterPage.vue';
export default {
  components: {
    HeaderPage,
    FooterPage,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: 'Montserrat', sans-serif;
}
</style>
