<script setup lang="ts">
import { onMounted, ref } from 'vue';

const message = ref('')

onMounted(async () => {
	const url = 'http://localhost:3000/api'
	const res = await fetch(url)
	message.value = (await res.json()).message
})
</script>

<template>
	<h1>{{ message }}</h1>
</template>