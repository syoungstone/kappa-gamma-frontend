<template>
  <div class="narrow-wrapper">
    <b-modal
      id="hello-modal"
      ref="modal"
      title="Hello!"
      v-model="seeModal"
      hide-footer
    >
      <p>
        Hi everyone in CMSC 508! Register a password for one of the following
        email accounts to try out this website:
      </p>
      <h4>Officers</h4>
      <p>spectacledhimbo@webmail.net</p>
      <p>definitelynotspiderman@webmail.net</p>
      <p>xXxVampireCopxXx@webmail.net</p>
      <h4>Brothers</h4>
      <p>sexbobbomb@webmail.net</p>
      <p>syoungstone@gmail.com</p>
      <p>americasass@webmail.net</p>
      <h4>Pledges</h4>
      <p>definitelynotspiderman2@webmail.net</p>
      <p>tweetytweet@webmail.net</p>
      <p>honkhonk@honk.honk</p>
    </b-modal>

    <h1>Theta Tau at VCU</h1>
    <img alt="OT logo" src="../assets/ThetaTauLogo.png" />
  </div>
</template>

<script>
export default {
  created() {
    this.seeModal = true;
  },
  data() {
    return {
      seeModal: false,
    };
  },
};
</script>

<style scoped>
img {
  margin: auto;
  width: 100%;
}
</style>
