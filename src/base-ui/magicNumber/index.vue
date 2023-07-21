<template>
  <div>{{ d.num.toFixed(0) }}</div>
</template>

<script setup name="magicNumber" lang="ts">
import gsap from 'gsap';
import { watch, reactive } from 'vue';

const props = defineProps({
  targetNumber: {
    type: Number,
    default: 0
  }
});

const d = reactive({ num: 0 });

const AnimationToValue = () => {
  gsap.to(d, { duration: 0.5, num: props.targetNumber });
};

AnimationToValue();
watch(
  () => props.targetNumber,
  () => AnimationToValue()
);
</script>

<style lang="scss" scoped></style>
