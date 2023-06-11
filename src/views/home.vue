<script setup>
</script>

<template>
    <div class="container">
        <div class="header">确实，你说的对</div>
        <div class="content">
            平山道
        </div>
        <div class="footer">成府路</div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;

    .header {
        height: 7vh;

        background-color: #fafafc;
    }

    .content {
        flex: 1;
    }

    .footer {
        height: 6vh;
    }
}
</style>
