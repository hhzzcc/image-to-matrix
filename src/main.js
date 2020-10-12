import Vue from 'vue';
import App from './App.vue';
import router from './router';
import bemMixin from './mixins/bem';
import './styles/index.less';

Vue.config.productionTip = false;
Vue.mixin(bemMixin);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
