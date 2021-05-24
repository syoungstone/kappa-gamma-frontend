<template>
  <div class="thumbnail">
    <img v-if="photo != null" :src="photo" alt="Profile photo" />
    <img v-else src="../assets/nophoto.jpg" alt="Photo placeholder" />
    <div v-if="editable" class="overlay">
      <div class="overlay-text">Change Photo</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfilePhoto",
  props: {
    photo: {
      required: true,
    },
    watch: {
      photo: function () {
        console.log("Photo changed");
        console.log(this.photo);
      },
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.thumbnail {
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
}
.thumbnail img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.thumbnail img.portrait {
  width: 100%;
  height: auto;
}
.thumbnail:hover .overlay {
  opacity: 0.5;
}
.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  background-color: black;
}
.overlay-text {
  color: white;
  font-size: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>
