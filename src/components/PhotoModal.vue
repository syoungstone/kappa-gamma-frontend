<template>
  <b-modal
    v-model="show"
    title="Change Photo"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group
        label="Please upload photo"
        label-for="upload"
        invalid-feedback="Invalid filetype"
        :state="photoState"
      >
        <b-form-file
          accept="image/*"
          id="upload"
          v-model="photoFile"
          :state="photoState"
          required
        ></b-form-file>
      </b-form-group>
    </form>
  </b-modal>
</template>

<script>
export default {
  name: "PhotoModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      photoFile: null,
    };
  },
  computed: {
    photoState() {
      return this.photoFile == null
        ? true
        : this.photoFile.type && this.photoFile.type.startsWith("image/");
    },
  },
  methods: {
    resetModal() {
      this.photoFile = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      if (this.photoState) {
        this.getPhotoUrl();
      }
    },
    getPhotoUrl() {
      if (this.photoFile != null) {
        let reader = new FileReader();
        reader.addEventListener("load", (event) => {
          this.$emit("update-photo", event.target.result);
        });
        reader.readAsDataURL(this.photoFile);
      } else {
        this.$emit("update-photo", null);
      }
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
