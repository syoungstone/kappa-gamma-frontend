<template>
  <div class="home" id="narrow-wrapper">
    <h1>
      Welcome {{ $store.state.isBrother ? "Brother" : "Pledge" }}
      {{ $store.state.lastName }}!
    </h1>
  </div>
</template>
