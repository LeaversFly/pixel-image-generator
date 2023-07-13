<script setup>
import { NMessageProvider } from 'naive-ui'
import themeOverrides from './config/theme'
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<style></style>
