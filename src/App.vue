<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {useRoute, useRouter} from "vue-router";


const router = useRouter();
const route = useRoute();


</script>

<template>
<div class="wrapper" >
  <RouterView/>
</div>

</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
</style>
