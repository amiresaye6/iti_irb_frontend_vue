<script setup>
import trackMount from '@/utils/mountTracker';

const props = defineProps({
    links: {
        type: Array,
        required: true,
    },
    current: {
        type: String,
        required: true,
    },
});

trackMount("breadk crumbs");


</script>

<template>
    <div class="breadcrumbs text-sm">
        <ul>
            <li v-for="link in links" :key="link.id">
                <RouterLink :to="link.path">{{ link.title }}</RouterLink>
            </li>
            <li>{{ current }}</li>
        </ul>
    </div>
</template>
