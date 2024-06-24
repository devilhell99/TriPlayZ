<template>
  <div
    class="header sticky z-10 top-0 flex justify-center items-center py-6 w-full bg-layout-slot-color dark:bg-layout-slot-dark-color"
  >
    <div class="bg-white dark:bg-dark-bg-color w-full h-16 rounded-lg px-6">
      <div class="flex justify-between items-center w-full h-full">
        <div class="hover:cursor-pointer" @click="dialogVisible = true">
          <Icon
            name="material-symbols:search"
            width="28"
            height="28"
            class="rounded-[50%] hover:bg-bd-color hover:text-main-color"
          />
          <span class="pl-1 text-gray-400">{{ $t('search') }}</span>
        </div>
        <div class="flex justify-around items-center">
          <client-only>
            <el-dropdown trigger="click" @command="handleCommand">
              <div>
                <Icon
                  name="material-symbols:dashboard-customize-outline"
                  width="50"
                  height="24"
                  class="hover:cursor-pointer hover:text-main-color"
                />
              </div>
              <template #dropdown>
                <div
                  class="flex justify-between items-center p-4 dark:bg-dark-bg-color"
                >
                  <p class="text-xl font-medium pr-40">
                    {{ $t('shortcut') }}
                  </p>
                  <Icon
                    name="material-symbols:dashboard-customize-outline"
                    width="50"
                    height="24"
                    class="hover:cursor-pointer hover:text-main-color"
                  />
                </div>
                <el-dropdown-menu>
                  <div
                    class="flex justify-between items-center border-solid border-bd-color border-t-2 dark:border-dark-bd-color"
                  >
                    <div
                      class="w-1/2 border-solid border-bd-color border-r-[1px] dark:border-dark-bd-color"
                    >
                      <el-dropdown-item command="/apps/calendar">
                        <div class="py-[17px] text-center w-full">
                          <Icon
                            name="material-symbols:calendar-month"
                            width="36"
                            height="24"
                          />
                          <p class="font-semibold">
                            {{ $t('calendar') }}
                          </p>
                          <p class="text-sm text-light-text-color">
                            {{ $t('appointments') }}
                          </p>
                        </div>
                      </el-dropdown-item>
                    </div>
                    <div
                      class="w-1/2 border-solid border-bd-color border-l-[1px] dark:border-dark-bd-color"
                    >
                      <el-dropdown-item command="/apps/invoice/list">
                        <div class="py-4 text-center w-full">
                          <Icon
                            name="fluent-mdl2:page-solid"
                            width="36"
                            height="24"
                          />
                          <p class="font-semibold">{{ $t('invoice') }}</p>
                          <p class="text-sm text-light-text-color">
                            {{ $t('manageAccounts') }}
                          </p>
                        </div>
                      </el-dropdown-item>
                    </div>
                  </div>
                  <div
                    class="flex justify-between items-center border-solid border-bd-color border-t-2 dark:border-dark-bd-color"
                  >
                    <div
                      class="w-1/2 border-solid border-bd-color border-r-[1px] dark:border-dark-bd-color"
                    >
                      <el-dropdown-item command="/apps/user/list">
                        <div class="py-4 text-center w-full">
                          <Icon name="mdi:user" width="36" height="24" />
                          <p class="font-semibold">{{ $t('user') }}</p>
                          <p class="text-sm text-light-text-color">
                            {{ $t('manageUsers') }}
                          </p>
                        </div>
                      </el-dropdown-item>
                    </div>
                    <div
                      class="w-1/2 border-solid border-bd-color border-l-[1px] dark:border-dark-bd-color"
                    >
                      <el-dropdown-item command="/dashboards/analytics">
                        <div class="py-4 text-center w-full">
                          <Icon
                            name="material-symbols:dashboard-rounded"
                            width="36"
                            height="24"
                          />
                          <p class="font-semibold">
                            {{ $t('dashboards') }}
                          </p>
                          <p class="text-sm text-light-text-color">
                            {{ $t('dashboardAnalytics') }}
                          </p>
                        </div>
                      </el-dropdown-item>
                    </div>
                  </div>
                  <div
                    class="flex justify-between items-center border-solid border-bd-color border-t-2 dark:border-dark-bd-color"
                  >
                    <div
                      class="w-1/2 border-solid border-bd-color border-r-[1px] dark:border-dark-bd-color"
                    >
                      <el-dropdown-item command="/pages/account-settings">
                        <div class="py-4 text-center w-full">
                          <Icon name="uiw:setting-o" width="36" height="24" />
                          <p class="font-semibold">
                            {{ $t('settings') }}
                          </p>
                          <p class="text-sm text-light-text-color">
                            {{ $t('accountSettings') }}
                          </p>
                        </div>
                      </el-dropdown-item>
                    </div>
                    <div
                      class="w-1/2 border-solid border-bd-color border-l-[1px] dark:border-dark-bd-color"
                    >
                      <el-dropdown-item command="/pages/help-center">
                        <div class="py-4 text-center w-full">
                          <Icon
                            name="mdi:question-mark-circle-outline"
                            width="36"
                            height="24"
                          />
                          <p class="font-semibold">
                            {{ $t('helpCenter') }}
                          </p>
                          <p class="text-sm text-light-text-color">
                            {{ $t('faq') }}
                          </p>
                        </div>
                      </el-dropdown-item>
                    </div>
                  </div>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </client-only>
          <div class="relative hover:cursor-pointer hover:text-main-color">
            <Icon name="mdi:bell-notification-outline" width="50" height="24" />
            <!-- notification -->
            <div
              class="absolute h-4 w-4 rounded-[50%] bg-red-500 text-[0.8rem] text-white text-center bottom-3 right-2"
            >
              <span>4</span>
            </div>
          </div>
          <client-only>
            <el-dropdown trigger="click">
              <div class="relative">
                <img
                  class="h-10 w-10 rounded-[50%]"
                  src="~/assets/images/img_avatar.png"
                />
                <div
                  class="absolute h-3 w-3 rounded-[50%] bg-active-color bottom-0 right-0 border-solid border-[1px] border-white"
                ></div>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <div class="flex justify-center pt-2 pr-16 pl-8">
                    <div class="relative">
                      <img
                        class="h-10 w-10 rounded-[50%]"
                        src="~/assets/images/img_avatar.png"
                      />
                      <div
                        class="absolute h-3 w-3 rounded-[50%] bg-active-color bottom-[1.5px] right-[1.5px]"
                      ></div>
                    </div>
                    <div class="pl-4">
                      <span
                        class="text-dark-text-color dark:text-light-text-color font-semibold text-base"
                        >John Doe</span
                      >
                      <span
                        class="block text-light-text-color dark:text-dark-text-color text-[14px]"
                        >admin</span
                      >
                    </div>
                  </div>
                  <div
                    class="p-2 my-2 mx-0 border-solid border-bd-color border-y-2 dark:border-dark-bd-color"
                  >
                    <el-dropdown-item>
                      <Icon name="gg:profile" width="50" height="28" />
                      <span>{{ $t('profile') }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <Icon name="uiw:setting-o" width="50" height="28" />
                      <span>{{ $t('settings') }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <Icon name="uil:usd-circle" width="50" height="28" />
                      <span>{{ $t('pricing') }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <Icon
                        name="mdi:question-mark-circle-outline"
                        width="50"
                        height="28"
                      />
                      <span>{{ $t('faq') }}</span>
                    </el-dropdown-item>
                  </div>
                  <div class="p-2">
                    <el-dropdown-item @click="logOut()">
                      <Icon
                        name="material-symbols:exit-to-app"
                        width="50"
                        height="28"
                      />
                      <span>{{ $t('logOut') }}</span>
                    </el-dropdown-item>
                  </div>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </client-only>
        </div>
      </div>
      <client-only>
        <el-dialog v-model="dialogVisible" width="42%" draggable>
          <template #header>
            <div class="flex items-center pb-2">
              <Icon
                name="material-symbols:search"
                width="28"
                height="28"
                class="rounded-[50%] hover:bg-bd-color hover:cursor-pointer hover:text-main-color"
              />
              <el-input v-model="searchContent" placeholder="Type to search" />
              <Icon
                name="material-symbols:close-rounded"
                width="30"
                height="30"
                class="rounded-[50%] hover:bg-bd-color hover:cursor-pointer hover:text-main-color"
                @click="dialogVisible = false"
              />
            </div>
          </template>
          <span>It's modal search </span>
          <!-- <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="dialogVisible = false">Cancel</el-button>
                      <el-button type="primary" @click="dialogVisible = false">
                        Confirm
                      </el-button>
                    </span>
                  </template> -->
        </el-dialog>
      </client-only>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const dialogVisible = ref(false)
const searchContent = ref('')

onMounted(() => {})
const handleCommand = (command: string) => {
  router.push(`${command}`)
}
const logOut = () => {
  handleLogout()
}
</script>

<style lang="scss" scoped></style>
