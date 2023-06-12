<script setup>

</script>

<template>
    <div class="navbar">
        <div class="navbar-container">
            <span class="logo">这里是logo</span>
            <span class="about">这里是关于</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.navbar {
    height: 100%;

    .navbar-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;
        width: 1380px;
        height: 100%;

        .logo {
            width: 100px;
        }

        .about {
            width: 100px;
        }
    }

}
</style>