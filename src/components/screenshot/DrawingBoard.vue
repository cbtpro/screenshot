<template>
  <div class="drawing-board">
    <div class="buttons">
      <button>&lt;</button>
      <button>></button>
      <button>x</button>
      <button>o</button>
    </div>
  </div>
</template>

<style scoped>
div.drawing-board {
    display: inline-block;
    min-width: 200px;
}
div.buttons {
  display: inline;
}
div.buttons button {
  width: 48px;
  height: 48px;
  font-size: 30px;
  border: 1px black solid;
}
</style>
