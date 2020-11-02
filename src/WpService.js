import axios from 'axios';

export default class WpService {
    constructor (url) {
        this.wpurl = url;
        this.endpoint = '/wp-json/wp/v2/';
        this.axios = axios.create({
            baseURL: this.wpurl
        });
    }

    getApiRoutes () {
        const url = this.wpurl + this.endpoint + 'types';
        return this.axios.get(url);
    }

    getApiRoute(route, store) {
        //console.log(route, JSON.stringify(store.state));
        if (!store.state.apiRoutes) {
            return false;
        }
        return store.state.apiRoutes.find(value => value.type == route );
    }

    getApiRouteId(route, store) {
        if (!store.state.apiRoutes) {
            return false;
        }
        return store.state.apiRoutes.findIndex(value => value.type == route );
    }

    getPosts (contentType, perPage, currentPage) {
        let url = this.wpurl + this.endpoint + contentType + '?per_page=' + perPage + '&page=' + currentPage;
        //console.log(url);
        return this.axios.get(url);
    }

    getPost (contentType, slug) {
        const url = this.wpurl + this.endpoint + contentType + '/?slug=' + slug + '&_fields=id,date,slug,link,title,content,acf,images';
        return this.axios.get(url);
    }
}
