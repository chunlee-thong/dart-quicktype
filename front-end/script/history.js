import { onSelectHistory } from './app.js';
function initHistory() {
    let history = localStorage.getItem("history");
    history = JSON.parse(history || "{}");
    let app = Vue.createApp({
        data() {
            return { histories: Object.keys(history).map((key) => key).reverse() }
        },
        template: `<div class="list-group">
          <button type="button" v-for="history in histories" v-on:click="onSelectHistory(history)"
            class="list-group-item  list-group-item-action">{{
              history
            }}</button>
        </div>`,
        methods: {
            onSelectHistory,
        }
    }).mount("#history")
}
initHistory();
window.initHistory = initHistory;