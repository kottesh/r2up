<script setup>
import TrashIcon from "@/components/icons/TrashIcon.vue"
import { onMounted, reactive, ref } from "vue"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const files = ref([])
const config = reactive({})

let R2_BUCKET_NAME = ""
let R2_ENDPOINT = ""
let R2_ACCESS_KEY_ID = ""
let R2_SECRET_ACCESS_KEY = ""
let R2_PUBLIC_URL = ""

onMounted(() => {
    Object.assign(config, JSON.parse(localStorage.getItem("config") || "{}"))

    R2_BUCKET_NAME = config.bucketName
    R2_ENDPOINT = `https://${config.accountId}.r2.cloudflarestorage.com`;
    R2_ACCESS_KEY_ID = config.accessKey
    R2_SECRET_ACCESS_KEY = config.secretAccessKey
    R2_PUBLIC_URL = config.publicURL
})

const r2 = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
})

const uploadFiles = async () => {
    files.value.forEach(async (file) => {
        const fileKey = 'f/${Date.now()}.${file.name.split(".").pop()}'

        const params = {
            Bucket: R2_BUCKET_NAME,
            Key: fileKey,
            Body: file,
            ContentType: file.type || "application/octet-stream",
        }

        try {
            const response = await r2.send(new PutObjectCommand(params))
            console.log(`${R2_PUBLIC_URL}/${fileKey}`);
        } catch (error) {
            console.log(R2_BUCKET_NAME)
            console.log(R2_ENDPOINT)
            console.log(R2_ACCESS_KEY_ID)
            console.log(R2_SECRET_ACCESS_KEY)
            console.log(R2_PUBLIC_URL)
            console.error(`ERROR: ${error}`)
        }
    })
}

const fileExists = (filename) => {
    return files.value.some((file) => file.name === filename)
}

const addFiles = (newFiles) => {
    files.value = [...files.value, ...[...newFiles].filter((file) => !fileExists(file.name))]
}

const handleDrop = (e) => {
    e.preventDefault()
    const newFiles = e.dataTransfer.files
    addFiles(newFiles)
}

const handleFileSelect = (e) => {
    e.preventDefault()
    const newFiles = e.target.files
    addFiles(newFiles)
}

const handleDragOver = (e) => {
    e.preventDefault()
}

const handleDragLeave = (e) => {
    e.preventDefault()
}

const removeFile = (idx) => {
    files.value.splice(idx, 1)
}
</script>

<template>
    <h1 class="pt-6 font-lora text-3xl font-semibold text-gray-600">Upload.</h1>

    <div class="flex-grow flex flex-col items-center mt-[4rem] font-brico">
        <div
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
            class="p-6 flex flex-col max-w-md w-full border-dashed border-2 rounded-md shadow-lg border-emerald-400 gap-2"
        >
            <p class="text-center font-semibold text-2xl text-gray-700">Drag & Drop</p>
            <p class="text-center italic text-xl text-gray-600">or</p>
            <label
                class="text-center px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 hover:text-gray-600 hover:cursor-pointer text-gray-800 hover:shadow-md transition-all duration-300"
                for="files"
                >Select</label
            >
            <input class="hidden" id="files" type="file" @change="handleFileSelect" multiple />
        </div>
    </div>

    <div class="flex flex-col justify-center items-center mt-10 font-brico">
        <div v-if="files.length != 0" class="max-w-md w-full">
            <ul class="max-h-128 space-y-2 overflow-auto border-gray-400">
                <li
                    v-for="(file, index) in files"
                    :key="file.name"
                    class="flex items-center justify-between px-4 py-2 rounded-md shadow-md"
                >
                    <p class="text-md font-normal text-gray-700">{{ file.name }}</p>
                    <button type="text" class="font-bold" @click="removeFile(index)">
                        <TrashIcon
                            class="w-5 y-5 fill-gray-500 hover:fill-red-500 hover:cursor-pointer"
                        />
                    </button>
                </li>
            </ul>

            <div class="flex justify-end mt-4 gap-2">
                <button
                    type="button"
                    class="text-semibold hover:cursor-pointer hover:bg-emerald-400 bg-emerald-500 rounded-md px-4 py-2"
                    @click="uploadFiles"
                >
                    Upload
                </button>
                <button
                    class="text-semibold hover:cursor-pointer hover:bg-gray-200 rounded-md px-4 py-2"
                    @click="files.value = files.splice(0, files.length)"
                >
                    Clear
                </button>
            </div>
        </div>
        <p v-else class="text-gray-500 text-sm font-inter">
            no files, drop some or select to upload
        </p>
    </div>
</template>
