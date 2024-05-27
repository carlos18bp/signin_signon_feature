<template>
    <div class="flex flex-col items-center m-12 space-y-4">
        <p class="font-bold text-9xl">Home</p>
        <button
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 rounded-lg w-full sm:w-auto px-5 py-2.5 text-center">
            <RouterLink :to="{ name: 'sign_in' }">
                Sign In & Sign On
            </RouterLink>
        </button>
    </div>
</template>

<script setup>
    import { RouterLink } from 'vue-router';
</script>