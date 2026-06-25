<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const open = ref(false)

const links = [
  [
    {
      label: 'Заявки',
      icon: 'i-lucide-house',
      to: '/admin/',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Клиенты',
      icon: 'i-lucide-users',
      to: '/admin/customers',
      onSelect: () => {
        open.value = false
      }
    },
  ],
] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar id="default" v-model:open="open" collapsible resizable class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }">

      <template #default="{ collapsed }">
        <div class="logo">
            <div class="site-logo">
              <NuxtLink to="/" class="js-logo-clone">Фарма</NuxtLink>
            </div>
          </div>
        <UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover />

        <UNavigationMenu :collapsed="collapsed" :items="links[1]" orientation="vertical" tooltip class="mt-auto" />
      </template>
    </UDashboardSidebar>

    <div class="flex-1 overflow-y-auto h-screen">
      <slot />
    </div>
  </UDashboardGroup>
</template>

<style>
@import '~/assets/css/main.css';

.site-logo a {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 22px;
  color: #000 !important;
  font-weight: 900;
}
.site-logo a:hover {
  text-decoration: none;
}
</style>