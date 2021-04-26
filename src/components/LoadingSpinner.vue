<template>
  <div>
    <b-spinner
      id="loading"
      style="width: 3rem; height: 3rem"
      variant="primary"
    ></b-spinner>
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner",
};
</script>

<style scoped>
#loading {
  margin: auto;
}
</style>
