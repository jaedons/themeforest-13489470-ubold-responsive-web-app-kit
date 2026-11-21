import { createRouter, createWebHistory } from 'vue-router'
import { pages } from '../catalog'
const views = {
  dashboard: () => import('../../features/dashboard/DashboardPage.vue'),
  calendar: () => import('../../features/calendar/CalendarPage.vue'),
  records: () => import('../../pages/RecordsPage.vue'),
  products: () => import('../../features/ecommerce/ProductsPage.vue'),
  productEditor: () => import('../../features/ecommerce/ProductEditorPage.vue'),
  contacts: () => import('../../features/crm/ContactsPage.vue'),
  mail: () => import('../../features/mail/MailPage.vue'),
  charts: () => import('../../pages/ChartsPage.vue'),
  forms: () => import('../../pages/FormsPage.vue'),
  ui: () => import('../../pages/UiPage.vue'),
  icons: () => import('../../pages/IconsPage.vue'),
  maps: () => import('../../pages/MapsPage.vue'),
  auth: () => import('../../pages/AccountPage.vue'),
  error: () => import('../../pages/ErrorPage.vue'),
  extra: () => import('../../pages/ExtrasPage.vue'),
  layout: () => import('../../pages/LayoutPage.vue'),
}
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (_to, _from, saved) => saved || { top: 0 },
  routes: [
    { path: '/', redirect: '/dashboard' },
    ...pages.map((page) => ({
      path: page.path,
      name: page.id,
      component: views[page.view as keyof typeof views],
      meta: {
        page,
        layout: page.view === 'auth' ? 'account' : page.view === 'error' ? 'blank' : 'admin',
      },
    })),
    ...pages.map((page) => ({ path: page.legacy, redirect: page.path })),
    { path: '/:pathMatch(.*)*', component: views.error, meta: { layout: 'blank' } },
  ],
})
router.afterEach((to) => {
  document.title = `${(to.meta.page as { title?: string })?.title || 'Page not found'} · Ubold`
})
