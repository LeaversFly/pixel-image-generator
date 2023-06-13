<script setup>
import { ReloadOutlined } from '@vicons/antd'
</script>

<template>
    <div class="generator-background">
        <div class="generator generator-background">

        </div>
        <n-button circle size="large" class="btn">
            <n-icon :component="ReloadOutlined" />
        </n-button>
    </div>
</template>


<style lang="scss" scoped>
.generator-background {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    position: relative;

    border: 1px solid #f3f3f3;
    border-radius: 6px;
    background-color: #e5cbff;

    .generator {
        width: 100%;
        position: absolute;
        left: 30px;
        bottom: 30px;
    }

    .btn {
        position: absolute;
        right: -60px;
        bottom: -20px;
    }
}
</style>