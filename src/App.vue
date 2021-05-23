<template>
  <div id="app">
    <div class="content">
      <b-navbar id="navbar" toggleable="lg" type="dark">
        <b-navbar-brand to="/">
          <img
            id="nav-logo"
            src="./assets/ThetaTauLogo.png"
            class="d-inline-block align-top"
            alt="OT Shield"
          />
          ΘΤ @ VCU</b-navbar-brand
        >
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav v-if="$store.state.loggedIn">
            <b-nav-item to="/dashboard">Dashboard</b-nav-item>
            <b-nav-item-dropdown
              v-if="$store.state.isBrother"
              text="Membership"
            >
              <b-dropdown-item to="/directory">Directory</b-dropdown-item>
              <b-dropdown-item to="/pledgeclasses"
                >Pledge Classes</b-dropdown-item
              >
              <b-dropdown-item to="/lineages">Lineages</b-dropdown-item>
              <b-dropdown-item to="/officers">Officers</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item v-else to="/pledgedirectory">Directory</b-nav-item>
            <b-nav-item-dropdown
              v-if="$store.state.position != null"
              text="Actions"
            >
              <b-dropdown-item to="/update-officers"
                >Update Officers</b-dropdown-item
              >
              <b-dropdown-item to="/create">Create New Student</b-dropdown-item>
              <b-dropdown-item to="/initiate">Initiate Pledges</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
          <b-navbar-nav v-else>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item to="/about">About</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>Brother Portal</em>
              </template>
              <div v-if="$store.state.loggedIn">
                <b-dropdown-item to="/editprofile"
                  >Edit Profile</b-dropdown-item
                >
                <b-dropdown-item to="/settings">Settings</b-dropdown-item>
                <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
              </div>
              <div v-else>
                <b-dropdown-item to="/login">Log In</b-dropdown-item>
                <b-dropdown-item to="/register">Register</b-dropdown-item>
              </div>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <b-modal v-model="notifyModal" :title="notifyModalTitle" hide-footer>
        <p>{{ notifyModalMessage }}</p>
      </b-modal>
      <b-modal v-model="reportBugModal" title="Report a Bug" hide-footer>
        <b-form @submit.prevent="bugSubmit">
          <b-form-group label="Your email:" label-for="email-input">
            <b-form-input
              id="email-input"
              type="email"
              v-model="bugReport.email"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Please describe the bug you encountered:"
            label-for="bug-textarea"
          >
            <b-form-textarea
              id="bug-textarea"
              rows="3"
              no-resize
              v-model="bugReport.text"
              required
            ></b-form-textarea>
          </b-form-group>
          <p v-if="reportNotSent" id="report-not-sent">
            There was an error sending your bug report. Please send an email to
            <b-link id="bug-email-link" href="mailto:admin@vcuthetatau.org"
              >admin@vcuthetatau.org</b-link
            >
            describing your issue.
          </p>
          <b-button v-else type="submit" variant="primary">Submit</b-button>
        </b-form>
      </b-modal>
      <router-view />
    </div>
    <footer class="footer">
      <b-row>
        <b-col></b-col>
        <b-col id="icons-col">
          <b-link
            class="icon-link"
            href="https://www.facebook.com/KGOTatVCU/"
            target="_blank"
            ><b-icon icon="facebook"></b-icon
          ></b-link>
          <b-link
            class="icon-link"
            href="https://www.instagram.com/thetatauatvcu/"
            target="_blank"
            ><b-icon icon="instagram"></b-icon
          ></b-link>
          <b-link
            class="icon-link"
            href="https://twitter.com/thetatauvcu/"
            target="_blank"
            ><b-icon icon="twitter"></b-icon
          ></b-link>
        </b-col>
        <b-col id="bug-report-col">
          <b-link id="bug-report-link" @click="reportBug()">
            Report a bug
          </b-link>
        </b-col>
      </b-row>
    </footer>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      notifyModal: false,
      notifyModalMessage: null,
      notifyModalTitle: null,
      reportBugModal: false,
      reportNotSent: false,
      bugReport: {
        email: null,
        text: null,
      },
    };
  },
  beforeUpdate() {
    if (
      this.$store.state.loggedIn &&
      this.$store.state.jwtExpiration * 1000 <= Date.now()
    ) {
      this.timeout();
    }
  },
  methods: {
    timeout() {
      this.logout();
      this.showMessage(
        "Session Expired",
        "Your session has expired. Please log back in."
      );
    },
    logout() {
      this.$store.commit("logout");
      this.$router.push("/", () => {});
    },
    editSelf() {
      this.$router.push("/edit/" + this.$store.state.id, () => {});
    },
    showError(error) {
      this.notifyModalTitle = "Error";
      this.notifyModalMessage = error;
      this.notifyModal = true;
    },
    showSuccess(message) {
      this.notifyModalTitle = "Success";
      this.notifyModalMessage = message;
      this.notifyModal = true;
    },
    showMessage(title, message) {
      this.notifyModalTitle = title;
      this.notifyModalMessage = message;
      this.notifyModal = true;
    },
    reportBug() {
      if (this.$store.state.loggedIn && this.$store.state.email) {
        this.bugReport.email = this.$store.state.email;
      }
      this.bugReport.text = null;
      this.reportNotSent = false;
      this.reportBugModal = true;
    },
    bugSubmit() {
      axios
        .post(this.$store.state.apiURL + "report_bug.php", this.bugReport)
        .then((response) => {
          console.log(response);
          this.reportBugModal = false;
          this.showSuccess(response.data.message);
        })
        .catch(() => {
          this.reportNotSent = true;
        });
    },
  },
};
</script>

<style>
:root {
  --ot-dark-red: #8b0000;
  --ot-gold: #ffcc33;
  --ot-off-white: #edeab5;
}
html,
body,
#app {
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1 0 auto;
  margin-bottom: 100px;
}
#navbar {
  background-color: var(--ot-dark-red);
}
#nav-logo {
  max-height: 30px;
}
.narrow-wrapper {
  max-width: 500px;
  padding: 20px;
  margin: 50px auto;
}
.wide-wrapper {
  max-width: 1000px;
  padding: 20px;
  margin: 50px auto;
}
h1,
h2,
h3,
h4 {
  text-align: center;
}
h1 {
  margin-top: 30px;
  margin-bottom: 30px;
}
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
.card {
  margin-top: 20px;
  background-color: var(--ot-off-white) !important;
}
.footer {
  flex-shrink: 0;
  background-color: #4b4a4a;
  color: white;
  width: 100%;
  padding: 15px;
}
#bug-report-col {
  text-align: right;
}
#icons-col {
  text-align: center;
}
#bug-report-link,
.icon-link {
  color: white;
}
.icon-link {
  margin: 5px;
}
#report-not-sent {
  padding: 15px;
  color: white;
  background-color: var(--ot-dark-red);
  border-radius: 5px;
}
#bug-email-link {
  color: rgb(116, 223, 255);
}
</style>
