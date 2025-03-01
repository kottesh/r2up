import { defineStore } from "pinia"
import { ref } from "vue"

export const useUploadFilesStore = defineStore("uploadfiles", () => {
    const uploadFiles = ref([])

    const fileExists = (filename) => {
        return uploadFiles.value.some((file) => file.data.name === filename)
    }

    const addFiles = (newFiles) => {
        ;[...newFiles].forEach((file) => {
            if (!fileExists(file.name)) {
                uploadFiles.value.push({
                    data: file,
                    link: null,
                    status: "pending", // 'pending'(default), 'uploading', 'uploaded', 'error'
                    showError: false,
                })
            }
        })
    }
    const removeFile = (idx) => {
        uploadFiles.value.splice(idx, 1)
    }

    const updateFileStatus = (filename, status, link = null) => {
        const file = uploadFiles.value.find((f) => f.data.name == filename)

        if (file) {
            file.link = link
            file.status = status
        } else {
            console.error(`"${filename}" not found`)
        }
    }

    const clearQueue = () => {
        uploadFiles.value = []
    }

    return { uploadFiles, addFiles, fileExists, removeFile, updateFileStatus, clearQueue }
})
