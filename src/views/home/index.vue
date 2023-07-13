<script setup>
</script>

<template>
    <div class="container">
        <div class="header">
            <Navbar />
        </div>
        <div class="content">
            <Generator />
        </div>
        <div class="footer">
            <Footer />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;

    .content {
        flex: 1;
    }
}
</style>
