
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
// import Vue from 'vue';
import VueChatScroll from 'vue-chat-scroll';
import Toaster from 'v-toaster';
import 'v-toaster/dist/v-toaster.css'
/**
 * for auto scroll
 */
Vue.use(VueChatScroll);
/**
 * for notifications
 */
Vue.use(Toaster, {timeout: 5000});

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example-component', require('./components/ExampleComponent.vue'));
Vue.component('message', require('./components/message.vue'));

const app = new Vue({
    el: '#app',
    data: {
      message: '',
      chat: {
        messages: [],
        user: [],
        color: [],
        time: []
      },
      typing: '',
      numberOfUsers: 0
    },
    watch: {
      message: function() {
        Echo.private('laravel-pusher-chat')
          .whisper('typing', {
            name: this.message
          });
      }
    },
    methods: {
      send: function() {
        if(this.message) {
          this.chat.messages.push(this.message);
          this.chat.color.push('success');
          this.chat.user.push('you');
          this.chat.time.push(this.getTime());
          axios.post('/send', {
            message: this.message
            })
            .then(response => {
                console.log(response);
                this.message = null;
            })
            .catch(error =>
                console.log(error)
            );
        }
      },
      getTime: function() {
        let time = new Date();
        return time.getHours()+':'+time.getMinutes();
      }
    },
    mounted() {
      Echo.private('laravel-pusher-chat')
        .listen('ChatEvent', (e) => {
            this.chat.messages.push(e.message);
            this.chat.color.push('warning');
            this.chat.user.push(e.user);
            this.chat.time.push(this.getTime());
        })
        .listenForWhisper('typing', (e) => {
          if(e.name) {
            this.typing = 'typing...';
          }else {
            this.typing = '';
          }
        })
      Echo.join(`laravel-pusher-chat`)
        .here((users) => {
            this.numberOfUsers = users.length;
        })
        .joining((user) => {
            this.numberOfUsers +=1;
            this.$toaster.success(user.name + ' is joined the chat room');
            // console.log(user);
        })
        .leaving((user) => {
            this.numberOfUsers -= 1;
            this.$toaster.warning(user.name + ' is leaved the chat room');
            // console.log(user.name);
        });
    }
});
