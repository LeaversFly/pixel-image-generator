<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
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
const showDropdown = ref(false)
const options = [
    {
        label: '本地导入',
        key: 0
    },
    {
        label: '剪切板导入',
        key: 1
    },
    {
        label: 'URL导入',
        key: 2
    }
]

const handleSelect = (key) => {
    if (key === 0) {
        onImportFromFile({})
    } else {
        message.info(key)
    }
}

const onPixelatorUpdate = (finish) => {
    canvasRef.value && pixelatorRef.value.toCanvas(canvasRef.value)
    hasResult.value = true
    finish && (appState.value = AppState.Normal)
}

const pixelatorRef = ref(createPixelator(onPixelatorUpdate))

pixelatorRef.value['onUpdate'] = onPixelatorUpdate

onMounted(() => {
    onImportOk({ url: './0.jpg' })
})

const onImportOk = async ({ url }) => {
    appState.value = AppState.Loading
    const token = getLastedToken()
    try {
        const response = await fetch(url)
        const blob = await response.blob()
        await tryLoadBlob(blob, token)
    } catch {
        message.error('图片加载失败!')
    }
}

watch(imageData, () => {
    if (canvasRef.value) {
        if (imageData.data) {
            const canvas = canvasRef.value
            const ctx = canvas.getContext('2d')
            canvas.width = imageData.data.width
            canvas.height = imageData.data.height
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

// const onClickImport = () => {
//     importDropdownVisible.value = true
// }
// const onClickImportOutside = () => {
//     importDropdownVisible.value = false
// }
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

// const onImportFromClipboard = async () => {
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
//             message.error('未读取到内容!')
//         }
//     } catch {
//         message.error('读取剪切板失败!')
//     }
// }

// 生成选项表单
// const imageWidth = 100
// const imageHeight = 100
const modes = ['rgba', 'hsva']
// const sizeValid = ref(imageWidth % 16 === 0 && imageHeight % 16 === 0)
// const kSafe = ref(true)
const formApiRef = ref({
    size: 16,
    k: 8,
    mode: 'rgba'
})

// const onSizeChange = (value) => {
//     sizeValid.value = imageWidth % value === 0 && imageHeight % value === 0
// }
// const onKChange = (value) => {
//     kSafe.value = value <= 64
// }
// const onModalOk = async () => {
//     if (formApiRef.value) {
//         const config = await formApiRef.value.validate()
//         onOk?.({ ...config })
//     }
// }
</script>

<template>
    <div class="generator">
        <n-layout has-sider sider-placement="right">
            <!-- 主区域 -->
            <n-layout-content>
                <!-- 画布 -->
                <div class="canvas-box">
                    <canvas ref='canvasRef' class="canvas" />
                </div>
            </n-layout-content>
            <!-- 侧边栏 -->
            <n-layout-sider collapse-mode="transform" :collapsed-width="0" show-trigger="arrow-circle"
                :show-collapsed-content="false" bordered>
                <div class="sider">
                    <n-space>
                        <n-dropdown trigger="hover" size="large" :options="options" @select="handleSelect" class="dropdown">
                            <n-button ghost>导入</n-button>
                        </n-dropdown>
                        <n-button color="#e66162" @click="submitUpload">
                            生成
                        </n-button>
                        <n-button dashed color="#e66162">
                            导出
                        </n-button>
                    </n-space>
                    <n-divider dashed />
                    <n-form ref="formRef" inline :model="formApiRef">
                        <n-form-item :label="'像素大小：' + formApiRef.size" path="formApiRef.size">
                            <n-slider v-model:value="formApiRef.size" :max="16" :min="2" color="#e66162" />
                        </n-form-item>
                        <n-form-item :label="'颜色数量：' + formApiRef.k" path="formApiRef.k">
                            <n-slider v-model:value="formApiRef.k" :max="32" :min="8" />
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
            </n-layout-sider>
        </n-layout>
    </div>
</template>

<style lang="scss" scoped>
.generator {
    height: 100%;

    .n-layout-content {
        min-height: calc(100vh - 104px);
        background-color: #f5f5f5;

        .canvas-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;

            .canvas {
                max-height: calc(100vh - 116px);

                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 1rem;
            }
        }
    }

    .n-layout-sider {
        padding: 24px;

        .sider {
            padding-right: 24px;

            .n-form {
                flex-direction: column;
                align-items: normal;
                margin: 12px 0;
            }
        }
    }
}
</style>