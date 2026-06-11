<template>
  <div 
    class="relative group bg-white  text-gray-900  shadow-lg rounded-xl p-5 transition-all duration-300 ease-in-out transform hover:-translate-y-1 w-full h-35 flex flex-col justify-between"
    :class="`hover:border-b-4 ${borderColorClass}`"
  >
    <div class="flex items-start justify-between">
      <div class="text-right">
        <p class="text-base font-medium text-gray-500 dark:text-gray-400 group-hover:font-bold" :class="`group-hover:${textColorClass}`">{{ title }}</p>
        <p class="text-4xl font-bold" :class="`${textColorClass}`">{{ value }}</p>
      </div>
      <div 
        class="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-gray-100  text-gray-500 "
      >
        <slot name="icon"></slot>
      </div>
    </div>
    <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400 mt-2 text-right">{{ description }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'primary', // primary, secondary, success, warning, error, info
  },
});

const colorMap = {
  primary: {
    border: 'border-blue-500',
    text: 'text-blue-400',
  },
  secondary: {
    border: 'border-purple-500',
    text: 'text-purple-400',
  },
  success: {
    border: 'border-green-500',
    text: 'text-green-400',
  },
  warning: {
    border: 'border-yellow-500',
    text: 'text-yellow-400',
  },
  error: {
    border: 'border-red-500',
    text: 'text-red-400',
  },
  info: {
    border: 'border-teal-500',
    text: 'text-teal-400',
  },
};

const borderColorClass = computed(() => colorMap[props.color]?.border || colorMap.primary.border);
const textColorClass = computed(() => colorMap[props.color]?.text || colorMap.primary.text);

</script>

<style scoped>
/* You can add additional styles here if needed */
</style>
