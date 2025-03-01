<script setup>
import TrashIcon from "@/components/icons/TrashIcon.vue"
import ErrorIcon from "@/components/icons/ErrorIcon.vue"
import CopyIcon from "@/components/icons/CopyIcon.vue"
import { onMounted, reactive, ref } from "vue"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { useUploadFilesStore } from "@/stores/uploadfiles"

const files = useUploadFilesStore()
const config = reactive({})
const isUploading = ref(false)

let R2_BUCKET_NAME = ""
let R2_ENDPOINT = ""
let R2_ACCESS_KEY_ID = ""
let R2_SECRET_ACCESS_KEY = ""
let R2_PUBLIC_URL = ""
let r2

onMounted(() => {
    Object.assign(config, JSON.parse(localStorage.getItem("config") || "{}"))

    R2_BUCKET_NAME = config.bucketName
    R2_ENDPOINT = `https://${config.accountId}.r2.cloudflarestorage.com`
    R2_ACCESS_KEY_ID = config.accessKey
    R2_SECRET_ACCESS_KEY = config.secretAccessKey
    R2_PUBLIC_URL = config.publicURL

    r2 = new S3Client({
        region: "auto",
        endpoint: R2_ENDPOINT,
        credentials: {
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
    })
})

const uploadFiles = async () => {
    files.uploadFiles.forEach(async (file) => {
        const data = file.data
        const fileKey = `f/${crypto.randomUUID().replace(/-/g, "").substring(0, 12)}.${data.name.split(".").pop()}`

        const params = {
            Bucket: R2_BUCKET_NAME,
            Key: fileKey,
            Body: new Uint8Array(await data.arrayBuffer()), // convert file to byte array byte buffer
            ContentType: data.type || "application/octet-stream",
        }

        try {
            await r2.send(new PutObjectCommand(params))
            files.updateFileStatus(data.name, "uploaded", `${R2_PUBLIC_URL}/${fileKey}`)
        } catch (error) {
            files.updateFileStatus(data.name, error.toString())
        }
    })
}

const copyLink = (link) => {
    navigator.clipboard.writeText(link)
}

const handleDrop = (e) => {
    e.preventDefault()
    const newFiles = e.dataTransfer.files
    files.addFiles(newFiles)
}

const handleFileSelect = (e) => {
    e.preventDefault()
    const newFiles = e.target.files
    files.addFiles(newFiles)
}

const handleDragOver = (e) => {
    e.preventDefault()
}

const handleDragLeave = (e) => {
    e.preventDefault()
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
            <input type="file" class="hidden" id="files" @change="handleFileSelect" multiple />
        </div>
    </div>

    <div class="flex flex-col justify-center items-center mt-10 font-brico">
        <div v-if="files.uploadFiles.length != 0" class="max-w-3xl w-full p-6 rounded-lg shadow-lg">
            <p class="text-base text-gray-500 pb-4">In Queue</p>
            <ul class="p-2 max-h-128 space-y-2 overflow-scroll border-gray-400">
                <li
                    v-for="(file, index) in files.uploadFiles"
                    :key="file.data.name"
                    class="flex flex-col p-4 rounded-md shadow-md"
                >
                    <div class="flex justify-between items-center">
                        <p class="text-md/4 font-normal text-gray-700">{{ file.data.name }}</p>
                        <div class="flex items-center gap-2">
                            <button
                                v-if="file.status === 'uploaded' && file.link !== null"
                                type="button"
                                @click="copyLink(file.link)"
                            >
                                <CopyIcon
                                    class="w-5 y-5 fill-gray-500 hover:fill-blue-400 hover:cursor-pointer"
                                />
                            </button>
                            <button
                                v-if="file.status === 'pending'"
                                type="button"
                                class="font-bold"
                                @click="files.removeFile(index)"
                            >
                                <TrashIcon
                                    class="w-5 y-5 fill-gray-500 hover:fill-red-500 hover:cursor-pointer"
                                />
                            </button>
                            <button
                                v-if="file.status.toLowerCase().includes('error')"
                                @click="file.showError = !file.showError"
                            >
                                <ErrorIcon
                                    class="w-5 h-5 fill-red-600 hover:cursor-pointer hover:fill-red-500 hover:bg-red-200 rounded-full"
                                />
                            </button>
                        </div>
                    </div>
                    <div
                        v-if="file.showError"
                        class="font-inter mt-2 transition-all duration-300 text-red-500 rounded-md bg-gray-200 w-full p-4"
                    >
                        {{ file.status }}
                    </div>
                </li>
            </ul>

            <div v-if="!isUploading" class="flex justify-end mt-4 gap-2">
                <button
                    type="button"
                    :disabled="isUploading"
                    class="text-semibold hover:cursor-pointer hover:bg-emerald-400 bg-emerald-500 rounded-md px-4 py-2"
                    @click="uploadFiles"
                >
                    Upload
                </button>
                <button
                    class="text-semibold hover:cursor-pointer hover:bg-gray-200 rounded-md px-4 py-2"
                    :disabled="isUploading"
                    @click="files.clearQueue"
                >
                    Clear
                </button>
            </div>
        </div>
        <p v-else class="text-gray-500 text-sm font-brico">
            no files, drop some or select to upload
        </p>
    </div>
</template>
