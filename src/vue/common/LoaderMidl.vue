<template>
  <div class="loader__app">
    <span>4&nbsp;</span>
    <span>+&nbsp;</span>
    <span>2</span>
  </div>
</template>

<script>
export default {
  name: 'loader',
  props: {
    messageId: { type: String, default: '' },
    positionCenter: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

$str: 'franklin gothic medium';

/* stylelint-disable no-descending-specificity */
.loader__app {
  display: flex;
  justify-content: center;
  perspective: 70rem;
}

.loader__app > span {
  font-size: 14rem;
  font-family: $str, sans-serif;
  display: inline-block;
  animation: flip 2.2s infinite linear;
  transform-origin: 0 70%;
  transform-style: preserve-3d;
}

@keyframes flip {
  35% {
    transform: rotateX(360deg);
  }

  100% {
    transform: rotateX(360deg);
  }
}

.loader__app > span:nth-child(2) {
  animation-delay: 0.3s;
}

.loader__app > span:nth-child(3) {
  animation-delay: 0.4s;
}
/* stylelint-enable no-descending-specificity */
</style>
