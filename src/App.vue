<script setup>
import Controller from "./components/Controller.vue"
import { RouterView } from "vue-router"
</script>

<template>
    <div class="container m-auto pb-[4rem]">
        <Controller />
        <RouterView />
    </div>
</template>
