<script setup>
import { onMounted } from "vue"
import { useFileStore } from "@/stores/files"
import TrashIcon from "@/components/icons/TrashIcon.vue"
import FileIcon from "@/components/icons/FileIcon.vue"
import CopyIcon from "@/components/icons/CopyIcon.vue"

const fileStore = useFileStore()

onMounted(() => {
    if (fileStore.files.length == 0) {
        fileStore.getFiles()
    }
})

const copyLink = (link) => {
    navigator.clipboard.writeText(link)
}
</script>
<template>
    <div>
        <h1 class="font-lora text-3xl font-semibold text-gray-600 pb-8">Home.</h1>
    </div>
    <div
        v-if="fileStore.loading"
        class="font-lora text-2xl text-gray-500 font-bold min-h-screen flex items-center justify-center"
    >
        Loading...
    </div>
    <div v-else-if="fileStore.files.length != 0" class="columns-2 lg:columns-3">
        <div
            v-for="file in fileStore.files"
            :key="file.key"
            class="mb-4 overflow-hidden relative group shadow-xl rounded-2xl"
        >
            <img
                v-if="file.isImage"
                :src="file.url"
                class="scale-105 group-hover:scale-100 transition duration-700"
            />
            <div v-else class="bg-zinc-300 rounded-lg">
                <div class="h-70 flex flex-col gap-4 items-center justify-center">
                    <FileIcon class="group-hover:scale-110 w-16 h-16 transition-all duration-500 fill-gray-500" />
                    <p class="text-base font-inter text-gray-600">{{ file.key.split("/")[1] }}</p>
                </div>
            </div>
            <div
                class="absolute bottom-2 right-2 flex gap-4 justify-end items-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
                <button
                    type="button"
                    class="p-2 rounded-md shadow-lg bg-white hover:cursor-pointer border-2 border-emerald-200 transition-all duration-900 group"
                    @click="fileStore.deleteFile(file.key)"
                >
                    <TrashIcon class="w-6 h-6 group-hover:fill-red-400" />
                </button>
                <button
                    type="button"
                    class="p-2 rounded-md shadow-lg bg-white hover:cursor-pointer border-2 border-emerald-200 transition-all duration-300 group"
                    @click="copyLink(file.url)"
                >
                    <CopyIcon class="w-6 h-6 group-hover:fill-zinc-400" />
                </button>
            </div>
        </div>
    </div>
    <p v-else class="h-screen flex items-center justify-center font-lora text-gray-500 font-semibold text-2xl">No files found :)</p>
</template>
