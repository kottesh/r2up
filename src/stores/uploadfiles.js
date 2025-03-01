import { defineStore } from "pinia"

export const useUploadFilesStore = defineStore("uploadfiles", {
    state: () => {
        return {
            uploadFiles: [],
        }
    },
    actions: {
        fileExists(filename) {
            return this.uploadFiles.some((file) => file.data.name === filename)
        },
        addFiles(newFiles) {
            ;[...newFiles].forEach((file) => {
                if (!this.fileExists(file.name)) {
                    this.uploadFiles.push({
                        data: file,
                        link: null,
                        status: "pending", // 'pending', 'uploading', 'uploaded', 'error'
                        showError: false,
                    })
                }
            })
        },
        removeFile(idx) {
            this.uploadFiles.splice(idx, 1)
        },
        updateFileStatus(filename, status, link = null) {
            const file = this.uploadFiles.find((f) => f.data.name == filename)

            if (file) {
                file.link = link
                file.status = status
            } else {
                console.error(`"${filename}" not found`)
            }
        },
        clearQueue() {
            this.uploadFiles = []
        },
    },
})
