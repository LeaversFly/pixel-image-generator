<script setup>
</script>

<template>
    <div class="container">
        <div class="header">
            <Navbar />
        </div>
        <div class="content">
            <div class="generator-container">
                <Generator />
            </div>
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

    .header {
        height: 52px;

        background-color: blue;
    }

    .content {
        flex: 1;

        .generator-container {
            width: 1080px;
            height: 428px;
            margin: 0 auto;
            padding: 6%;
        }
    }

    .footer {
        height: 52px;

        background-color: grey;
    }
}
</style>
