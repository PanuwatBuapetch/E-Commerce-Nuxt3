<template>
    <v-container>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12" rounded="lg">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>สมัครสมาชิก</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="form">
                            <v-text-field
                                label="อีเมล"
                                prepend-inner-icon="mdi-email"
                                type="email"
                                variant="outlined"
                            ></v-text-field>

                            <v-text-field
                                label="ชื่อผู้ใช้"
                                prepend-inner-icon="mdi-account"
                                type="text"
                                variant="outlined"
                            ></v-text-field>

                            <v-text-field
                                label="รหัสผ่าน"
                                prepend-inner-icon="mdi-lock"
                                type="password"
                                variant="outlined"
                            ></v-text-field>

                            <v-text-field
                                label="ยืนยันรหัสผ่าน"
                                prepend-inner-icon="mdi-lock-check"
                                type="password"
                                variant="outlined"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" block size="large" variant="elevated">
                            สมัครสมาชิก
                        </v-btn>
                    </v-card-actions>
                    <v-card-text class="text-center">
                        มีบัญชีแล้ว? <NuxtLink to="/login">เข้าสู่ระบบ</NuxtLink>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
definePageMeta({
  layout: 'auth'
})

</script>

<style>

</style>