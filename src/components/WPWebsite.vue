<template>
  <div>

    <div class="mt1 mb1">
      <form @submit.prevent="processForm">
        <label for="url">
          Wordpress website:
          <input type="text" name="url" id="url" placeholder="address" v-model="url">
          <input type="submit" value="check and save" :disabled="!url">
        </label>
      </form>
    </div>

    <transition name="fade">
      <p v-if="info">{{ info }}</p>
    </transition>

  </div>
</template>

<script>
import store from '../store';
import WpService from '../WpService.js';
import { processUrl } from '../shared.js';

export default {
  name: 'WPWebsite',
  store: store,
  data() {
    return {
      url: '',
      wpurl: '',
      info: '',
    }
  },
  props: {
    reusedUrl: String,
  },
  watch: {
    url: function() {
      if (!this.url) {
        this.wpurl = '';
        this.reset();
      }
    },
    wpurl: function() {
      if (!this.wpurl) {
        store.dispatch('setWpUrl', this.wpurl);
      }
    },
    reusedUrl: function() {
      if (this.reusedUrl) {
        this.url = this.reusedUrl;
      }
    },
  },
  methods: {
    processForm() {
      this.reset();

      const url = processUrl(this.url);

      if (url) {
        this.wpurl = url;
        this.getRoutes();
      }
      else {
        this.wpurl = '';
        this.info = 'invalid url';
      }
    },
    getRoutes() {
      store.dispatch('setLoading', true);

      const service = new WpService(this.wpurl);
      
      service
        .getApiRoutes()
        .then(response => {
          if (response.status != 200) {
            this.info = `Data couldn't be retrieved`;
            this.wpurl = '';
            return;
          }
          
          if (Object.keys(response.data).length == 0) {
            this.info = `No api's found`;
            this.wpurl = '';
            return;
          }

          store.dispatch('setApiRoutes', response.data);
          store.dispatch('setWpUrl', this.wpurl);
          store.dispatch('setCheckedUrls', this.wpurl);
        })
        .catch(() => {
          this.info = this.wpurl + ' is not a frontpage URL of Wordpress site with enabled REST API';
          this.wpurl = '';
        })
        .finally(() => {
          store.dispatch('setLoading', false);
        });
    },
    reset() {
      this.info = '';
      store.dispatch('setApiRoutes', []);
    },
  },
};
</script>

<style lang="scss" scoped>
  input[type=text] {
    width: 100%;
    @media (min-width: 600px) {
      width: 50%;
    }
  }
</style>