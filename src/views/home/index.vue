<script setup>
import Generator from './components/generator/index.vue'
</script>

<template>
    <div class="container">
        <div class="header">
            <Navbar />
        </div>
        <div class="content">
            <Generator />
        </div>
        <div class="footer">成府路</div>
    </div>
</template>

<style lang="scss">
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;

    .header {
        height: 52px;

        background-color: blue;
    }

    .content {
        flex: 1;

        background-color: orange;
    }

    .footer {
        height: 52px;

        background-color: grey;
    }
}
</style>
