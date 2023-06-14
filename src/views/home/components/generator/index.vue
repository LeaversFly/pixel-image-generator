<script setup>
import { ReloadOutlined } from '@vicons/antd'
</script>

<template>
    <div class="generator-background">
        <div class="generator generator-background">

        </div>
        <div class="btn">
            <n-icon :component="ReloadOutlined" />
        </div>
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
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        position: absolute;
        right: -30px;
        bottom: 0;

        font-size: 50px;
        border-radius: 50%;
        background-color: #808080;
    }
}
</style>