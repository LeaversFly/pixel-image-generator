<script setup>
import { CloudSyncOutlined } from '@vicons/antd'
import { reactive, ref, watch } from 'vue'
import { createPixelator } from '../../../../utils/pixelator'
import useLastedToken from '../../../../hooks/useLasteToken'
import { useMessage } from 'naive-ui'
import { getImageDataFromSrc } from '../../../../utils/image-data'

const message = useMessage()

const AppState = {
    Normal: 'Normal',
    Loading: 'Loading',
    Generating: 'Generating',
}

const imageData = reactive({
    data: new Image()
})
const appState = ref(AppState.Normal)
const hasResult = ref(false)
const canvasRef = ref(null)

const onPixelatorUpdate = (finish) => {
    canvasRef.value && pixelatorRef.value.toCanvas(canvasRef.value)
    hasResult.value = true
    finish && (appState.value = AppState.Normal)
}

const pixelatorRef = ref(createPixelator(onPixelatorUpdate))

pixelatorRef.value['onUpdate'] = onPixelatorUpdate

watch(imageData, () => {
    if (canvasRef.value) {
        if (imageData.data) {
            const canvas = canvasRef.value
            const ctx = canvas.getContext('2d')
            canvas.setAttribute('width', imageData.data.width)
            canvas.setAttribute('height', imageData.data.height)
            ctx.putImageData(imageData.data, 0, 0)
        }
    }
}, { immediate: true })

const { getLastedToken, comsumeToken } = useLastedToken()

const tryLoadBlob = async (blob, token) => {
    const url = URL.createObjectURL(blob)
    try {
        const image = await getImageDataFromSrc(url)
        comsumeToken(token, () => {
            imageData.data = image
            hasResult.value = false
            appState.value = AppState.Normal
        })
    } catch (err) {
        comsumeToken(token, () => {
            appState.value = AppState.Normal
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
const onImportFromFile = ({ file }) => {
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
const submitUpload = (config) => {
    if (!imageData.data) return
    pixelatorRef.value.generate(imageData.data, formApiRef.value)
    appState.value = AppState.Generating
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

// 生成选项表单
const imageWidth = 100
const imageHeight = 100
const modes = ['rgba', 'hsva']
const sizeValid = ref(imageWidth % 16 === 0 && imageHeight % 16 === 0)
const kSafe = ref(true)
const formApiRef = ref({
    size: 16,
    k: 8,
    mode: 'rgba'
})

const onSizeChange = (value) => {
    sizeValid.value = imageWidth % value === 0 && imageHeight % value === 0
}
const onKChange = (value) => {
    kSafe.value = value <= 64
}
const onModalOk = async () => {
    if (formApiRef.value) {
        const config = await formApiRef.value.validate()
        onOk?.({ ...config })
    }
}
</script>

<template>
    <div class="generator-background">
        <div class="generator generator-background">
            <div class="container">
                <div class="left">
                    <n-button type="info" @click="onImportFromFile" class="import">
                        导入
                    </n-button>
                    <!-- 画布 -->
                    <canvas ref='canvasRef' />
                </div>
                <div class="right">
                    <n-form ref="formRef" inline :label-width="80" :model="formApiRef">
                        <n-form-item label="颜色大小" path="formApiRef.size">
                            <n-slider v-model:value="formApiRef.size" :step="5" />
                        </n-form-item>
                        <n-form-item label="像素数量" path="formApiRef.k">
                            <n-slider v-model:value="formApiRef.k" :step="5" />
                        </n-form-item>
                        <n-form-item label="模式" path="formApiRef.mode">
                            <n-radio-group v-model:value="formApiRef.mode" name="radiogroup">
                                <n-space>
                                    <n-radio v-for="mode in modes" :key="mode" :value="mode">
                                        {{ mode }}
                                    </n-radio>
                                </n-space>
                            </n-radio-group>
                        </n-form-item>
                    </n-form>
                </div>
            </div>
        </div>
        <div class="btn">
            <n-icon :component="CloudSyncOutlined" @click="submitUpload" />
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

        .container {
            display: flex;
            width: 100%;
            padding: 0;

            .left {
                display: flex;
                width: 70%;

                .import {
                    position: absolute;
                    top: -100px;
                }
            }

            .right {
                display: flex;
                width: 30%;
            }

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