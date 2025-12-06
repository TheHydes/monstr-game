<template>
  <transition name="slide-fade" mode="out-in">
    <slot></slot>
  </transition>
</template>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.25s ease-in;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
