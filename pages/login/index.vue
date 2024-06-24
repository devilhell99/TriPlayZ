<template>
  <div class="h-full">
    <div class="flex items-center justify-center h-full">
      <div class="form-login p-1 w-[496px]">
        <div class="bg-white px-1 pt-[45px] pb-[30px]">
          <div class="text-center font-bold mb-12 text-[32px]">
            株式会社日本料金保証
          </div>
          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            label-position="top"
            :rules="rules"
            label-width="170px"
            :hide-required-asterisk="false"
            require-asterisk-position="right"
            :scroll-to-error="true"
            @click.prevent
          >
            <div>
              <el-form-item prop="email" label="メールアドレス">
                <el-input
                  v-model="ruleForm.email"
                  class="font-sans"
                  placeholder="メールアドレス"
                />
              </el-form-item>
              <el-form-item prop="password" label="パスワード">
                <el-input
                  v-model="ruleForm.password"
                  class="font-sans"
                  type="password"
                  placeholder="パスワード"
                  show-password
                />
              </el-form-item>
              <div class="pt-6 pb-3">
                <el-button
                  style="background-color: #0871e1; color: #ffffff"
                  class="w-full"
                  @click="handleLogin(ruleFormRef)"
                  >ログイン</el-button
                >
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '~~/stores/auth'
import { ICredential } from '~~/utils/interface'

definePageMeta({ layout: 'system-un-auth', middleware: ['page-top'] })

const authStore = useAuthStore()

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  ...useValidateEmail('email'),
  ...useValidateString('password', 'パスワード', {
    min: 8,
    max: 100,
    required: true,
  }),
})

const ruleForm = ref<ICredential>({
  email: '',
  password: '',
})

/**
 * methods
 */
function handleLogin(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) return

    const data = await authStore.systemLogin({ ...ruleForm.value })

    if (data?.statusCode === 400) return
    if (authStore.role === ERole.AGENCY_ADMIN)
      return navigateTo('/agency/top', {
        external: true,
      })
    if (authStore.role === ERole.SYSTEM_ADMIN)
      return navigateTo('/admin', {
        external: true,
      })
  })
}
</script>

<style scoped></style>
