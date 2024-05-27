<template>
    <section class="flex bg-slate-100 h-screen items-center justify-center">
        <form 
            class="space-y-5 rounded-lg border-2 border-gray-700 p-4 bg-white w-1/3">
            <h2 class="font-bold">Sign On</h2>

            <div class="relative z-0 w-full group">
                <input 
                    v-model="userForm.email"
                    type="email" 
                    name="floating_email" 
                    id="floating_email" 
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                    placeholder=" "/>
                <label 
                    for="floating_email" 
                    class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Email address
                </label>
            </div>

            <div class="relative z-0 w-full group">
                <input 
                    v-model="userForm.password"
                    type="password" 
                    name="floating_password" 
                    id="floating_password" 
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                    placeholder=" "/>
                <label 
                    for="floating_password" 
                    class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Password
                </label>
            </div>

            <div class="relative z-0 w-full group">
                <input 
                    v-model="userForm.confirmPassword"
                    type="password" 
                    name="repeat_password" 
                    id="floating_repeat_password" 
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                    placeholder=" "/>
                <label 
                    for="floating_repeat_password" 
                    class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Confirm password
                </label>
            </div>

            <div class="grid md:grid-cols-2 md:gap-6">
                <div class="relative z-0 w-full group">
                    <input
                        v-model="userForm.firstName"
                        type="text" 
                        name="floating_first_name" 
                        id="floating_first_name" 
                        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                        placeholder=" "/>
                    <label 
                        for="floating_first_name" 
                        class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        First name
                    </label>
                </div>
                <div class="relative z-0 w-full group">
                    <input
                        v-model="userForm.lastName"
                        type="text" 
                        name="floating_last_name" 
                        id="floating_last_name" 
                        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                        placeholder=" "/>
                    <label 
                        for="floating_last_name" 
                        class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Last name
                    </label>
                </div>
            </div>

            <button
                @click.prevent="signOnUser"
                type="submit" 
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">
                Submit
            </button>

            <div class="flex flex-col items-center justify-center text-center space-y-2">               
                <p>¿Tienes una cuenta? 
                    <a href="#" class="text-sky-700">
                        <RouterLink :to="{ name: 'sign_in' }">
                            Inicia sesion
                        </RouterLink>                   
                    </a>
                </p>
                <div class="flex items-center w-full max-w-lg mx-4">
                    <div class="flex-grow border-t border-gray-300"></div>
                    <span class="mx-4 text-gray-500">o</span>
                    <div class="flex-grow border-t border-gray-300"></div>
                </div>
                
                <GoogleLogin :callback="handleLoginWithGoogle" prompt/>
            </div>
        </form>
    </section>
</template>

<script setup>
    import axios from 'axios';
    import router from '@/router';
    import { onMounted, reactive } from 'vue';
    import { useAuthStore } from '@/store/auth';
    import { loginWithGoogle } from '@/shared/login_with_google';
    import { showNotification } from '@/shared/notification_message';

    const authStore = useAuthStore(); // Get the authentication store instance

    // Reactive form data object
    const userForm = reactive({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    });

    // Run on component mount
    onMounted(() => {
        if (authStore.isAuthenticated) {
            router.push({ name: 'profile' }); // Redirect to profile if already authenticated
        }
    });

    /**
     * Handles user sign on process
     */
    const signOnUser = async () => {
        if (!userForm.email) {
            showNotification("Email is required", "warning");
            return;
        }
        if (!userForm.password) {
            showNotification("Passwords is required", "warning");
            return;
        }
        if (!userForm.confirmPassword) {
            showNotification("Confirm Passwords is required", "warning");
            return;
        }
        if (userForm.password !== userForm.confirmPassword) {
            showNotification("Passwords do not match!", "warning");
            return;
        }

        try {
            const response = await axios.post('/api/sign_on/', {
                email: userForm.email,
                password: userForm.password,
                first_name: userForm.firstName,
                last_name: userForm.lastName
            });
            authStore.login(response.data); // Log in the user

            showNotification("Sign On successful!", "success");
            router.push({ name: 'profile' }); // Redirect to profile
        } catch (error) {
            if (error.response && error.response.status === 409) {
                showNotification("The email is already registered", "error");
            } else {
                showNotification("Sign On failed!", "error");
            }
        }
    };

    /**
     * Handles login with Google response
     */
    const handleLoginWithGoogle = (response) => {
        loginWithGoogle(response, router, authStore);
    };
</script>