<script setup>
import { ref, reactive, onMounted } from "vue"
import Eyes from "@/components/icons/Eyes.vue"
import XEyes from "@/components/icons/XEyes.vue"

const config = reactive({
    accountId: "",
    bucketName: "",
    accessKey: "",
    secretAccessKey: "",
    publicURL: "",
})

const showSecretKey = ref(false)

onMounted(() => {
    const storedConfig = JSON.parse(localStorage.getItem("config")) || {}
    Object.assign(config, storedConfig)
})

const saveConfig = () => {
    localStorage.setItem("config", JSON.stringify(config))
}

const removeConfig = () => {
    const localConfig = localStorage.getItem("config")

    if (localConfig === null) {
        alert("No config found. First add it.")
        return
    }
    console.log("hellow")
    localStorage.removeItem("config")
    Object.assign(config, { bucketName: "", accessKey: "", secretAccessKey: "", publicURL: "" })
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center font-brico gap-12">
        <h1 class="font-lora text-3xl text-zinc-600 font-semibold">Config.</h1>
        <form
            class="p-2 flex flex-col gap-3 max-w-lg h-auto w-full ring-1 ring-zinc-400 shadow-lg rounded-lg p-12 bg-white-200"
            @submit.prevent="saveConfig"
        >
            <div class="space-y-1">
                <label class="text-sm font-semibold block text-gray-600" for="accountId"
                    >Account ID</label
                >
                <input
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                    id="accountId"
                    v-model="config.accountId"
                    placeholder="my-account-id"
                />
            </div>

            <div class="space-y-1">
                <label class="text-sm font-semibold block text-gray-600" for="accessKey"
                    >Accesss Key</label
                >
                <input
                    type="text"
                    class="w-full border border-gray-300 px-4 py-2 rounded-md"
                    required
                    id="accessKey"
                    placeholder="your acccess key"
                    v-model="config.accessKey"
                />
            </div>

            <div class="space-y-1">
                <label class="text-sm font-semibold block text-gray-600" for="secretAccessKey"
                    >Secret Access Key</label
                >
                <div class="relative">
                    <input
                        :type="showSecretKey ? 'text' : 'password'"
                        class="w-full border border-gray-300 rounded-md pr-8 pl-4 py-2"
                        required
                        id="secretAccessKey"
                        v-model="config.secretAccessKey"
                        placeholder="your secret access key"
                    />
                    <div
                        @click="showSecretKey = !showSecretKey"
                        class="absolute hover:cursor-pointer hover:bg-zinc-200 rounded-full right-2 top-1/2 -translate-y-1/2 bg-white"
                    >
                        <XEyes v-if="!showSecretKey" class="w-6 h-6 fill-zinc-600" />
                        <Eyes v-else class="w-6 h-6 fill-red-600" />
                    </div>
                </div>
            </div>

            <div class="space-y-1">
                <label class="text-sm font-semibold block text-gray-600" for="bucketName"
                    >Bucket Name</label
                >
                <input
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                    id="bucketName"
                    v-model="config.bucketName"
                    placeholder="my-bucket"
                />
            </div>

            <div class="space-y-1">
                <label class="text-sm font-semibold block text-gray-600" for="publicUrl"
                    >Public URL</label
                >
                <input
                    type="text"
                    id="publicUrl"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                    placeholder="https://cdn.mydomain.com"
                    v-model="config.publicURL"
                />
            </div>

            <div class="flex flex-col gap-4">
                <button
                    class="font-brico font-bold text-normal px-4 py-2 hover:cursor-pointer hover:text-gray-600 bg-emerald-400 hover:bg-emerald-300 rounded-md shadow-md transitioan-all duration-300 focus:ring-1 focus:ring-emerald-600"
                    type="submit"
                >
                    Save
                </button>
                <button
                    type="button"
                    @click="removeConfig"
                    class="font-brico text-normal px-4 py-2 hover:cursor-pointer hover:bg-zinc-100 rounded-md transition-all duraiton-100"
                >
                    Clear
                </button>
            </div>
        </form>
    </div>
</template>
