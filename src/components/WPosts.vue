<template>
  <div>
    <h2 v-if="endpointName">{{ endpointName }}</h2>

    <transition name="fade">
      <p v-if="totalPosts > 0">
        Total count of "{{ contentType }}" content: {{ totalPosts }}
      </p>
    </transition>

    <p v-if="info">{{ info }}</p>

    <div :class="{ posts: true, active: !loading }">
      <article v-for="(post, index) in data" class="post" :key="index" :ref="`post-${post.id}`">
        <h3 v-if="post.title && post.title.rendered">
          <a :href="post.link"><span v-html="post.title.rendered"></span></a>
        </h3>
        <a v-else :href="post.link">{{ post.link }}</a>

        <p v-if="post.date">{{ dateFormatted(post.date) }}</p>
        <div v-if="post.excerpt" class="excerpt" v-html="post.excerpt.rendered"></div>

        <p v-if="post.media_details && getSmallestImg(post.media_details.sizes)">
          <img :src="getSmallestImg(post.media_details.sizes)"/>
        </p>
      </article>
    </div>

    <transition name="grow">
      <p v-if="loading" class="loading-text">
        loading...
      </p>
    </transition>

    <button @click="loadMore" v-if="isPagerNeeded()" :disabled="loading">
      load more
    </button>
  </div>
</template>

<script>
import { dateFormatted, getSmallestImg } from '../shared.js';
import store from '../store';
import WpService from '../WpService.js';

export default {
  name: 'WPosts',
  store: store,
  props: {
    contentType: String,
  },
  data() {
    return {
      info: '',
      data: [],
      totalPosts: 0,
      currentPage: 1,
      endpointName: '',
      loading: false,
    }
  },
  created () {
    this.perPage = 6;
  },
  watch: {
    '$store.state.wpurl': function() {
      this.resetData();
      this.loadPosts();
    }
  },
  mounted() {
    this.resetData();
    this.loadPosts();
  },
  methods: {
    loadPosts() {
      this.info = '';

      if (!this.$store.state.wpurl) {
        return;
      }

      const service = new WpService(this.$store.state.wpurl);
      const currentApiRoute = service.getApiRoute(this.contentType, this.$store);

      if (!currentApiRoute) {
        return;
      }

      this.endpointName = currentApiRoute.name;

      this.loading = true;
      
      service
        .getPosts(this.contentType, this.perPage, this.currentPage)
        .then(response => {
          if (response.status != 200 ||
              !Array.isArray(response.data) ||
              !response.data.length) {
            this.info = `Data couldn't be retrieved`;
            return;
          }

          this.totalPosts = response.headers['x-wp-total'];

          if (!this.totalPosts) {
            this.info = `No ${this.contentType} found`;
            return;
          }

          store.dispatch('setApiRouteCount', { count: this.totalPosts, index: currentApiRoute.index });

          const oldData = JSON.parse(JSON.stringify(this.$data.data));
          this.data = [...oldData, ...response.data];

          if (this.currentPage > 1 && response.data[0]) {
            this.scrollToPost(response.data[0].id);
          }
        })
        .catch(() => {
          this.info = `Data couldn't be retrieved`;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    scrollToPost(id) {
      this.$nextTick(() => {
        const firstPost = this.$refs[`post-${id}`];
        window.scrollTo({
          top: firstPost.offsetTop - 100,
          left: 0,
          behavior: 'smooth'
        });
      })
    },
    resetData() {
      this.info = '';
      this.data = [];
      this.currentPage = 1;
      this.totalPosts = 0;
    },
    isPagerNeeded() {
      return this.currentPage < Math.ceil(this.totalPosts / this.perPage);
    },
    
    loadMore() {
      this.currentPage++;
      this.loadPosts();
    },
    dateFormatted,
    getSmallestImg,
  },
};
</script>