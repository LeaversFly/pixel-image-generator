<script setup>
import { CloudSyncOutlined, CloudUploadOutlined } from '@vicons/antd'
import { ref } from 'vue'
import { createPixelator } from '../../../../utils/pixelator'

// const AppState = {
//     Normal: 'Normal',
//     Loading: 'Loading',
//     Generating: 'Generating',
// }

// const imageData = ref(null)
// const appState = ref(AppState.Normal)
// const hasResult = ref(false)
// const canvasRef = ref(null)

// //useCallback的用法
// const onPixelatorUpdate = useCallback((finish) => {
//     canvasRef.current && pixelatorRef.value.current.toCanvas(canvasRef.current)
//     hasResult.value = true
//     finish && (appState.value = AppState.Normal)
// }, [])

// const pixelatorRef = ref(createPixelator(onPixelatorUpdate))
// pixelatorRef.value.current.onUpdate = onPixelatorUpdate

// //useEffect的用法
// useEffect(() => {
//     if (canvasRef.current) {
//         if (imageData.value) {
//             const canvas = canvasRef.value.current
//             const ctx = canvas.getContext('2d')
//             canvas.width = imageData.value.width
//             canvas.height = imageData.value.height
//             ctx.putImageData(imageData.value, 0, 0)
//         }
//     }
// }, [imageData])

// const { getLastedToken, comsumeToken } = useLastedToken()

// //useCallback的用法
// const tryLoadBlob = useCallback(
//     async (blob, token) => {
//         const url = URL.createObjectURL(blob)
//         try {
//             const imageData = await GetImageDataFromSrc(url)
//             comsumeToken(token, () => {
//                 imageData.value = imageData
//                 hasResult.value = false
//                 appState.value = AppState.Normal
//             })
//         } catch {
//             comsumeToken(token, () => {
//                 setAppState(AppState.Normal)
//             })
//             Toast.error('图片解析错误')
//         }
//         URL.revokeObjectURL(url)
//     },
//     [comsumeToken],
// )

// const importDropdownVisible = ref(false)

// //useCallback的用法
// const onClickImport = useCallback(() => {
//     importDropdownVisible.value = true
// }, [])
// const onClickImportOutside = useCallback(() => {
//     importDropdownVisible.value = false
// }, [])
// const onImportFromFile = useCallback(() => {
//     importDropdownVisible.value = false
//     const token = getLastedToken()
//     const input = document.createElement('input')
//     input.type = 'file'
//     input.accept = 'image/*'
//     input.click()
//     input.onchange = async () => {
//         if (input.files && input.files.length > 0) {
//             appState.value = AppState.Loading
//             await tryLoadBlob(input.files.item(0), token)
//         }
//     }
// }, [getLastedToken, tryLoadBlob])

// const onImportFromClipboard = useCallback(async () => {
//     importDropdownVisible.value = false
//     appState.value = AppState.Loading

//     const token = getLastedToken()
//     try {
//         const items = await navigator.clipboard.read()
//         if (items.length > 0) {
//             const item = items.at(0)
//             const blob = await item.getType(item.types[0])
//             await tryLoadBlob(blob, token)
//         } else {
//             Toast.error('未读取到内容')
//         }
//     } catch {
//         Toast.error('读取剪切板失败')
//     }
// }, [getLastedToken, tryLoadBlob])

// const onImportOk = useCallback(
//     async ({ url }) => {
//         setAppState(AppState.Loading)
//         const token = getLastedToken()
//         try {
//             const response = await fetch(url)
//             const blob = await response.blob()
//             await tryLoadBlob(blob, token)
//         } catch {
//             Toast.error('图片下载失败')
//         }
//     },
//     [getLastedToken, tryLoadBlob],
// )
// const { importModal, openImportModal } = useImportModal(onImportOk)
// const onImportFromUrl = useCallback(() => {
//     setImportDropdownVisible(false)
//     openImportModal()
// }, [openImportModal])
// const onGenerateOk = useCallback(
//     (config) => {
//         if (!imageData) return
//         pixelatorRef.current.generate(imageData, config)
//         setAppState(AppState.Generating)
//     },
//     [imageData],
// )
// const onClickStop = useCallback(() => {
//     pixelatorRef.current.stop()
//     setAppState(AppState.Normal)
// }, [])
// const { generateModal, openGenerateModal } = useGenerateModal(
//     imageData?.width ?? 0,
//     imageData?.height ?? 0,
//     onGenerateOk,
// )
// const onExportOk = useCallback((config) => {
//     pixelatorRef.current.export(config)
// }, [])
// const { openExportModal, exportModal } = useExportModal(onExportOk)
</script>

<template>
    <div class="generator-background">
        <div class="generator generator-background">
            <div class="generator-container">
                <n-upload multiple directory-dnd action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f" :max="5">
                    <n-upload-dragger>
                        <div style="margin-bottom: 12px">
                            <n-icon size="48" :depth="3" :component="CloudUploadOutlined" />
                        </div>
                        <n-text style="font-size: 16px">
                            点击或者拖动文件到该区域来上传
                        </n-text>
                        <n-p depth="3" style="margin: 8px 0 0 0">
                            请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
                        </n-p>
                    </n-upload-dragger>
                </n-upload>
                <n-slider v-model:value="value" :step="10" />
            </div>
        </div>
        <div class="btn">
            <n-icon :component="CloudSyncOutlined" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.generator-background {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    position: relative;

    border: 1px solid #808080;
    border-radius: 6px;
    background-color: #f3f3f3;

    .generator {
        display: flex;
        width: 100%;
        position: absolute;
        left: 30px;
        bottom: 30px;

        .generator-container {
            display: flex;
            padding: 0;
        }
    }

    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        position: absolute;
        right: -32px;
        bottom: 0;

        font-size: 50px;
        border-radius: 50%;
        background-color: #808080;
    }
}
</style>