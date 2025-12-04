import App from '@/App.vue'
import { supabase } from '@/libs/supabase'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

// Setup Supabase auth state listener
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        // Clear any app-specific state when user signs out
        console.log('User signed out')
    } else if (event === 'SIGNED_IN') {
        console.log('User signed in')
    } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed')
    }
})

// Mount vue app
app.mount('#app')
