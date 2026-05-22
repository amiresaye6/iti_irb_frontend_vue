<!-- this is a temp page, not a functional one, if you have to delete it , tell me first and do it  -->


<script setup>
import trackMount from '@/utils/mountTracker';

trackMount("About view")
</script>

<template>
  <div class="container mx-auto px-4 py-10">

    <!-- Header -->
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold">About This Project</h1>
      <p class="text-base-content/70 mt-2">
        A simple Vue.js e-commerce project built for learning purposes
      </p>
    </div>

    <!-- Main Card -->
    <div class="card bg-base-100 shadow-xl p-6 space-y-6">

      <!-- Student Info -->
      <div>
        <h2 class="text-2xl font-semibold mb-2">Student</h2>
        <p>
          This project was developed by <strong>Amir Alsayed</strong> as part of the 
          ITI Vue.js course.
        </p>
        <p class="mt-1">
          Under the guidance of <strong>Eng. Ahmed Ghoraba</strong>.
        </p>
      </div>

      <!-- Project Description -->
      <div>
        <h2 class="text-2xl font-semibold mb-2">Project Overview</h2>
        <p>
          This is a simple e-commerce web application focused on selling perfumes.
          It demonstrates core Vue.js concepts such as components, props, events (emit),
          and routing.
        </p>
      </div>

      <!-- About Perfumes -->
      <div>
        <h2 class="text-2xl font-semibold mb-2">About Perfumes</h2>
        <p>
          Perfumes are a blend of aromatic compounds, essential oils, and solvents
          used to give a pleasant scent to the human body, objects, or spaces.
        </p>
        <p class="mt-2">
          They are typically categorized into different fragrance families such as:
        </p>

        <ul class="list-disc list-inside mt-2 space-y-1">
          <li>Floral – soft and romantic scents</li>
          <li>Woody – warm and earthy tones</li>
          <li>Fresh – light and clean fragrances</li>
          <li>Oriental – rich and spicy aromas</li>
        </ul>
      </div>

      <!-- Goal -->
      <div>
        <h2 class="text-2xl font-semibold mb-2">Goal</h2>
        <p>
          The goal of this project is to build a solid understanding of Vue.js by
          creating a real-world style application with reusable components and
          interactive UI.
        </p>
      </div>

    </div>

  </div>
</template>

<style scoped>
</style>