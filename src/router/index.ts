import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    // // AUTH ROUTES
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
            requiresNoAuth: true,
        },
    },

    // {
    //     path: '/teams',
    //     name: 'teams',
    //     component: () => import('../views/Teams.vue'),
    //     beforeEnter: (to: any, from: any, next: any) => {
    //         canViewTeams() ? next() : next({ path: '/' })
    //     },
    //     meta: {
    //         requiresNoAuth: false,
    //         requiresBusinessAccount: true,
    //     },
    // },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})


export default router
