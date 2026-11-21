<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElTag,
  ElEmpty,
  ElDrawer,
  ElInputNumber,
} from 'element-plus'
import { UiSectionCard as SectionCard } from '@jaedons/admin-ui'
const products = [
  { id: 'iphone', name: 'Apple iPhone', price: 699, category: 'Phones', image: 'iphone.jpg' },
  { id: 'samsung', name: 'Samsung Phone', price: 499, category: 'Phones', image: 'samsung.jpg' },
  { id: 'imac', name: 'Apple iMac', price: 1299, category: 'Computers', image: 'imac.jpg' },
  {
    id: 'macbook',
    name: 'Apple MacBook',
    price: 1599,
    category: 'Computers',
    image: 'macbook.jpg',
  },
  { id: 'lumia', name: 'Nokia Lumia', price: 299, category: 'Phones', image: 'lumia.jpg' },
]
const query = ref(''),
  category = ref('All'),
  sort = ref('name'),
  cartOpen = ref(false),
  cart = ref<Record<string, number>>({})
const filtered = computed(() =>
  products
    .filter(
      (item) =>
        item.name.toLowerCase().includes(query.value.toLowerCase()) &&
        (category.value === 'All' || category.value === item.category),
    )
    .sort((a, b) => (sort.value === 'price' ? a.price - b.price : a.name.localeCompare(b.name))),
)
const total = computed(() =>
  products.reduce((sum, p) => sum + p.price * (cart.value[p.id] || 0), 0),
)
</script>
<template>
  <SectionCard title="Product catalog" description="Browse and filter the original sample products."
    ><template #actions
      ><ElButton @click="cartOpen = true"
        >Preview basket ({{ Object.values(cart).reduce((a, b) => a + b, 0) }})</ElButton
      ></template
    >
    <div class="table-toolbar">
      <ElInput
        v-model="query"
        clearable
        placeholder="Search products…"
        aria-label="Search products"
      /><ElSelect v-model="category" aria-label="Product category"
        ><ElOption
          v-for="item in ['All', 'Phones', 'Computers']"
          :key="item"
          :value="item" /></ElSelect
      ><ElSelect v-model="sort" aria-label="Sort products"
        ><ElOption label="Name" value="name" /><ElOption
          label="Price: low to high"
          value="price" /></ElSelect
      ><RouterLink to="/ecommerce/product-detail"
        ><ElButton type="primary">Add product demo</ElButton></RouterLink
      >
    </div>
    <div class="product-grid">
      <article v-for="product in filtered" :key="product.id" class="product-card">
        <img
          :src="'/assets/images/products/' + product.image"
          :alt="product.name"
          loading="lazy"
        /><ElTag type="info">{{ product.category }}</ElTag>
        <h2>{{ product.name }}</h2>
        <strong>${{ product.price }}</strong
        ><ElButton @click="cart[product.id] = (cart[product.id] || 0) + 1"
          >Add to preview basket</ElButton
        >
      </article>
    </div>
    <ElEmpty v-if="!filtered.length" description="No matching products" /></SectionCard
  ><ElDrawer v-model="cartOpen" title="Preview basket" :size="400"
    ><p class="muted">Local preview only. No checkout or payment is processed.</p>
    <template v-for="product in products" :key="product.id"
      ><div v-if="cart[product.id]" class="basket-row">
        <span>{{ product.name }}</span><ElInputNumber
          v-model="cart[product.id]"
          :min="0"
          :max="99"
          size="small"
          :aria-label="product.name + ' quantity'"
        /></div></template
    ><ElEmpty v-if="!total" description="Your preview basket is empty" />
    <h2>Total: ${{ total.toLocaleString() }}</h2></ElDrawer
  >
</template>
