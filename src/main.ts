import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import { vuetify } from './plugins/vuetify'

import TableActions from './components/TableActions.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.component("TableActions",TableActions);

app.mount('#app')
