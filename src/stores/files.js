import { defineStore } from "pinia"
import { ref } from "vue"
import { S3Client, ListObjectsV2Command, DeleteObjectCommand, } from "@aws-sdk/client-s3"

export const useFileStore = defineStore("files", () => {
    const files = ref([])
    const loading = ref(false)
    let r2 = null
    let R2_PUBLIC_URL = ""
    let R2_BUCKET_NAME = ""

    const initR2 = () => {
        if (!r2) {
            const config = JSON.parse(localStorage.getItem("config") || "{}")

            R2_PUBLIC_URL = config.publicURL
            R2_BUCKET_NAME = config.bucketName

            r2 = new S3Client({
                region: "auto",
                endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
                credentials: {
                    accessKeyId: config.accessKey,
                    secretAccessKey: config.secretAccessKey,
                },
            })
        }
    }

    const getFiles = async () => {
        initR2()

        try {
            loading.value = true
            const response = await r2.send(new ListObjectsV2Command({ Bucket: R2_BUCKET_NAME }))
            const objects = response.Contents

            if (objects) {
                objects.forEach((item) => {
                    files.value.push({
                        fileName: item.Key,
                        key: item.Key,
                        url: `${R2_PUBLIC_URL}/${item.Key}`,
                        isImage: /\.(jpg|jpeg|webp|png|svg|gif)$/i.test(item.Key),
                    })
                })
            }
        } catch (error) {
            console.error(error)
        } finally {
            loading.value = false
        }
    }

    const deleteFile = async (key) => {
        initR2()

        if (confirm(`Are you sure wanna delete "${key.split('/')[1]}" ?`)) {
          await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }))
          files.value = files.value.filter((file) => file.key !== key)
        }
    }

    return { getFiles, deleteFile, loading, files }
})
