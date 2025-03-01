<script setup>
import Controller from "./components/Controller.vue"
import { RouterView } from "vue-router"
</script>

<template>
    <div class="container m-auto pt-12 pb-8 px-4">
        <Controller />
        <RouterView />
    </div>
</template>
