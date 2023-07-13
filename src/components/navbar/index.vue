<script setup>

</script>

<template>
    <div class="navbar">
        <div class="navbar-container">
            <span class="logo">像素生成器</span>
            <span class="about">切换白天/黑夜模式</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.navbar {
    border-bottom: 1px solid #E1E5ED;

    font-weight: 700;

    .navbar-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;
        width: 1380px;
        height: 51px;

        .logo {
            width: 100px;
        }

        .about {
            width: 100px;
        }
    }

}
</style>