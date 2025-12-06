import { createRouter, createWebHistory } from 'vue-router'
import { PATHS, SHOP, ROUTE } from './routes.js'

const HuntPage      = () => import('@/views/HuntPage.vue')
const ShopPage      = () => import('@/views/ShopPage.vue')
const WeaponShop    = () => import('@/views/shop/WeaponShop.vue')
const ArmorShop     = () => import('@/views/shop/ArmorShop.vue')
const PotionShop    = () => import('@/views/shop/PotionShop.vue')
const CheckoutView  = () => import('@/views/shop/CheckoutView.vue')
const SaveLoadPage  = () => import('@/views/SaveLoadPage.vue')
const NotFoundPage  = () => import('@/views/NotFoundPage.vue')
const QuestPage = () => import('@/views/QuestPage.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: PATHS.ROOT, name: ROUTE.HUNT, component: HuntPage, meta: { title: 'Hunt' } },
    {
      path: PATHS.SHOP,
      name: ROUTE.SHOP.ROOT,
      component: ShopPage,
      meta: { title: 'Shop' },
      redirect: { name: ROUTE.SHOP.WEAPON },
      children: [
        { path: SHOP.WEAPON,   name: ROUTE.SHOP.WEAPON,   component: WeaponShop,   meta: { title: 'Weapon Shop' } },
        { path: SHOP.ARMOR,    name: ROUTE.SHOP.ARMOR,    component: ArmorShop,    meta: { title: 'Armor Shop' } },
        { path: SHOP.POTION,   name: ROUTE.SHOP.POTION,   component: PotionShop,   meta: { title: 'Potion Shop' } },
        { path: SHOP.CHECKOUT, name: ROUTE.SHOP.CHECKOUT, component: CheckoutView, meta: { title: 'Checkout' } },
      ],
    },
    { path: PATHS.SAVE, name: ROUTE.SAVE, component: SaveLoadPage, meta: { title: 'Save / Load' } },
    { path: PATHS.QUESTS, name: ROUTE.QUESTS, component: QuestPage, meta: { title: 'Quests' } },
    { path: PATHS.NOTFOUND, name: ROUTE.NOTFOUND, component: NotFoundPage, meta: { title: 'Page Not Found' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
