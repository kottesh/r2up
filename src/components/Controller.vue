<script setup>
import AddIcon from "./icons/AddIcon.vue"
import HomeIcon from "./icons/HomeIcon.vue"
import ConfigIcon from "./icons/ConfigIcon.vue"
import { useRoute, RouterLink } from "vue-router"

const route = useRoute()
</script>

<template>
    <div class="fixed bottom-8 right-1/2 transform translate-x-1/2 z-200">
        <div
            class="p-2 bg-white flex gap-2 rounded-lg border border-green-400 shadow-lg transition-all duration-200"
        >
            <RouterLink to="/">
                <div
                    class="rounded-lg p-2 hover:bg-emerald-100 transition-all duration-200"
                    :class="{ 'bg-emerald-200': route.path === '/' }"
                >
                    <HomeIcon class="lg:w-8 lg:h-8 w-6 h-6" />
                </div>
            </RouterLink>
            <RouterLink to="/upload">
                <div
                    class="rounded-lg p-2 hover:bg-emerald-100 transition-all duration-300"
                    :class="{ 'bg-emerald-200': route.path === '/upload' }"
                >
                    <AddIcon class="lg:w-8 lg:h-8 w-6 h-6" />
                </div>
            </RouterLink>
            <RouterLink to="/config">
                <div
                    class="rounded-lg p-2 hover:bg-emerald-100 transition-all duration-300"
                    :class="{ 'bg-emerald-200': route.path === '/config' }"
                >
                    <ConfigIcon class="lg:w-8 lg:h-8 w-6 h-6" />
                </div>
            </RouterLink>
        </div>
    </div>
</template>
