<template>
    <div class="absolute ">
        <div class="flex justify-center p-4">
            <h2 class="font-bold text-xl">Project<br>App.</h2>
        </div>
    </div>
    <section class="flex h-screen items-center">
        <form 
            class="space-y-5 px-32 xl:w-1/2 2xl:w-1/3">
            <h1 class="font-bold text-center xl:text-3xl 2xl:text-4xl">We welcome you :)</h1>
            <div>
                <label 
                    for="email" 
                    class="block mb-2 text-sm font-medium text-gray-900">
                    Email Address
                </label>
                <input
                    v-model="userForm.email"
                    type="email" 
                    id="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    required />
            </div>

            <div>
                <label 
                    for="password" 
                    class="block mb-2 text-sm font-medium text-gray-900">
                    Password
                </label>
                <input
                    v-model="userForm.password"
                    type="password" 
                    id="password"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
            </div>

            <div>
                <label 
                    for="password" 
                    class="block mb-2 text-sm font-medium text-gray-900">
                    Confirm Password
                </label>
                <input
                    v-model="userForm.confirmPassword"
                    type="password" 
                    id="password"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
            </div>

            <div class="grid md:grid-cols-2 md:gap-6">
                <div>
                    <label 
                        for="password" 
                        class="block mb-2 text-sm font-medium text-gray-900">
                        First Name
                    </label>
                    <input
                        v-model="userForm.firstName"
                        type="password" 
                        id="password"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                </div>
                <div>
                    <label 
                        for="password" 
                        class="block mb-2 text-sm font-medium text-gray-900">
                        Last Name
                    </label>
                    <input
                        v-model="userForm.lastName"
                        type="password" 
                        id="password"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                </div>
            </div>

            <button
                @click.prevent="signOnUser"
                type="submit" 
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">
                Sign On
            </button>

            <div class="flex flex-col">               
                <p class="font-regular">Have Account? 
                    <a class="font-regular text-blue-800">
                        <RouterLink :to="{ name: 'sign_in' }">
                            Sign In
                        </RouterLink>                   
                    </a>
                </p>
                <div class="flex items-center w-full max-w-lg mx-4 mt-4">
                    <div class="flex-grow border-t border-gray-300"></div>
                    <span class="mx-4 text-gray-500">Or Continue With</span>
                    <div class="flex-grow border-t border-gray-300"></div>
                </div>
                <div class="flex justify-center">
                    <GoogleLogin class="mt-6" :callback="handleLoginWithGoogle" prompt/>
                </div>
            </div>
        </form>
        <div class="h-screen xl:w-1/2 2xl:w-2/3 overflow-hidden">
            <img src="@/assets/images/signIn/signIn.jpg" alt="illustration" class="w-full h-full object-cover">
        </div> 
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