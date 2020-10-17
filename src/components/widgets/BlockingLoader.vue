<template>
  <div class="blocking-loader">
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style lang="scss">
.blocking-loader {
  position: fixed;
  top: 0;
  left:0;
  z-index: 1000000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  & > div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }
}
</style>
