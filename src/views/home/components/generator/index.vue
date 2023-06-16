<script setup>
import { CloudSyncOutlined, CloudUploadOutlined } from '@vicons/antd'
import { onMounted, ref } from 'vue'
import { createPixelator } from '../../../../utils/pixelator'
import useLastedToken from '../../../../hooks/useLasteToken'
import { useMessage } from 'naive-ui'

const message = useMessage()

const AppState = {
    Normal: 'Normal',
    Loading: 'Loading',
    Generating: 'Generating',
}

const imageData = ref(null)
const appState = ref(AppState.Normal)
const hasResult = ref(false)
const canvasRef = ref(null)
const pixelatorRef = ref(createPixelator(onPixelatorUpdate))

const onPixelatorUpdate = (finish) => {
    canvasRef.value && pixelatorRef.value.toCanvas(canvasRef.value)
    hasResult.value = true
    finish && (appState.value = AppState.Normal)
}

pixelatorRef.value.onUpdate = onPixelatorUpdate

onMounted(() => {
    if (canvasRef) {
        if (imageData.value) {
            const canvas = canvasRef.value
            const ctx = canvas.getContext('2d')
            canvas.width = imageData.value.width
            canvas.height = imageData.value.height
            ctx.putImageData(imageData.value, 0, 0)
        }
    }
})

const { getLastedToken, comsumeToken } = useLastedToken()

const tryLoadBlob = async (blob, token) => {
    const url = URL.createObjectURL(blob)
    try {
        const imageData = await GetImageDataFromSrc(url)
        comsumeToken(token, () => {
            imageData.value = imageData
            hasResult.value = false
            appState.value = AppState.Normal
        })
    } catch {
        comsumeToken(token, () => {
            appstate.value = AppState.Normal
        })
        message.error('图片解析错误!')
    }
    URL.revokeObjectURL(url)
}

const importDropdownVisible = ref(false)

const onClickImport = () => {
    importDropdownVisible.value = true
}
const onClickImportOutside = () => {
    importDropdownVisible.value = false
}
const onImportFromFile = () => {
    importDropdownVisible.value = false
    const token = getLastedToken()
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.click()
    input.onchange = async () => {
        if (input.files && input.files.length > 0) {
            appState.value = AppState.Loading
            await tryLoadBlob(input.files.item(0), token)
        }
    }
}

const onImportFromClipboard = async () => {
    importDropdownVisible.value = false
    appState.value = AppState.Loading

    const token = getLastedToken()
    try {
        const items = await navigator.clipboard.read()
        if (items.length > 0) {
            const item = items.at(0)
            const blob = await item.getType(item.types[0])
            await tryLoadBlob(blob, token)
        } else {
            message.error('未读取到内容!')
        }
    } catch {
        message.error('读取剪切板失败!')
    }
}

const onImportOk = async ({ url }) => {
    appState.value = AppState.Loading
    const token = getLastedToken()
    try {
        const response = await fetch(url)
        const blob = await response.blob()
        await tryLoadBlob(blob, token)
    } catch {
        message.error('图片下载失败!')
    }
}

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
                <n-upload multiple directory-dnd action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f" :max="5"
                    class="upload">
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
                <n-slider v-model:value="value" :step="10" class="slider" />
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

    border: 1px solid #808080;
    border-radius: 6px;
    background-color: #f3f3f3;
    transform: rotate(-6deg);
    transform-origin: right bottom;

    .generator {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;

        transform: rotate(6deg);

        .generator-container {
            display: flex;
            padding: 0;

            .upload {
                flex: 3;

                .n-upload-dragger {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    height: 428px;

                    border: none;
                }
            }

            .slider {
                flex: 1;
            }
        }
    }

    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        position: absolute;
        right: -10px;
        bottom: -10px;

        font-size: 50px;
        border-radius: 50%;
        background-color: #808080;
    }
}
</style>