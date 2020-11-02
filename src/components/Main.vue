<template>
  <div id="wrapper">

    <aside>
      <section id="api-routes">
        <span v-if="$store.state.apiRoutes.length">
          <header>
            Detected content types
            <span @click.prevent="toggleDetails">
              <a href="#" class="open">&cudarrr;</a>
              <a href="#" class="close hide">x</a>
            </span>
          </header>
          <div class="content">
            <div v-for="(route, index) in $store.state.apiRoutes" :key="index">
              <a href="#" @click.prevent="scrollToSection(route.type)">
                {{ route.name }}
                <span v-if="route.count">({{ route.count }})</span>
              </a>
            </div>
          </div>
        </span>
      </section>

      <section id="recent-urls">
        <span v-if="$store.state.checkedUrls.length">
          <header>
            Recently checked addresses
            <span @click.prevent="toggleDetails">
              <a href="#" class="open">&cudarrr;</a>
              <a href="#" class="close hide">x</a>
            </span>
          </header> 
          <div class="content">
            <div v-for="(url, index) in $store.state.checkedUrls" :key="index">
              <a :href="url" @click.prevent="reuseUrl">
                {{ removeHttp(url) }}
              </a>
            </div>
          </div>
        </span>
      </section>
    </aside>
    
    <main>
      <header class="mb1">
        <span v-if="$store.state.wpurl">{{ removeHttp($store.state.wpurl) }}</span>
        <span v-else>Wordpress content loader</span>
      </header>
      
      <span ref="urlForm"></span>
      <WPWebsite :reusedUrl="url"/>

      <div v-if="$store.state.apiRoutes.length">
      <section v-for="(route, index) in $store.state.apiRoutes" :key="index" :ref="route.type">
        <WPosts :contentType="route.type"/>
      </section>
      </div>
    </main>

    <teleport to="body">
      <div v-if="$store.state.loading" id="loading"><span>Loading...</span></div>
    </teleport>
  </div>
</template>

<script>
import store from '../store';
import WPWebsite from './WPWebsite.vue';
import WPosts from './WPosts.vue';
import { removeHttp } from '../shared.js';

export default {
  name: 'Main',
  store: store,
  data() {
    return {
      url: '',
    }
  },
  components: {
    WPWebsite,
    WPosts,
  },
  created() {
    document.title = 'Wordpress content loader';
  },
  methods: {
    toggleDetails(e, element = null) {
      let target;
      if (!element) {
        target = e.target.parentNode;
      }
      else {
        target = document.querySelector(element + ' header span');
      }
      target.parentNode.nextSibling.classList.toggle('active');
      target.firstChild.classList.toggle('hide');
      target.lastChild.classList.toggle('hide');
    },
    reuseUrl(e) {
      this.url = e.target.getAttribute('href');
      this.$nextTick(() => {
        this.toggleDetails(null, '#recent-urls');
        const urlForm = this.$refs.urlForm;   
        window.scrollTo({
          top: urlForm.offsetTop - 70,
          left: 0,
          behavior: 'smooth'
        });
      })
    },
    scrollToSection(name) {
      this.$nextTick(() => {
        this.toggleDetails(null, '#api-routes');
        const section = this.$refs[name];
        window.scrollTo({
          top: section.offsetTop - 100,
          left: 0,
          behavior: 'smooth'
        });
      })
    },
    removeHttp,
  }
}
</script>