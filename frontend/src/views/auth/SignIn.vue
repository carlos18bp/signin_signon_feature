<template>
    <section class="flex bg-slate-100 h-screen items-center justify-center">
        <form 
            class="space-y-5 rounded-lg border-2 border-gray-700 p-4 bg-white w-1/3">
            <h2 class="font-bold">Sign In</h2>
            <div>
                <label 
                    for="email" 
                    class="block mb-2 text-sm font-medium text-gray-900">
                    Your email
                </label>
                <input
                    v-model="userForm.email"
                    type="email" 
                    id="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="name@example.com" 
                    required />
            </div>
            <div>
                <label 
                    for="passcode" 
                    class="block mb-2 text-sm font-medium text-gray-900">
                    Your Passcode
                </label>
                <input
                    v-model="userForm.passcode"
                    type="number" 
                    id="passcode"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="type your submitted passcode (optional)"/>
            </div>
            <div>
                <label 
                    for="password" 
                    class="block mb-2 text-sm font-medium text-gray-900">
                    Your password
                </label>
                <input
                    v-model="userForm.password"
                    type="password" 
                    id="password"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="type your password (optional)"/>
            </div>

            <div class="flex flex-col space-y-2">
                <a 
                    href="#" 
                    class="text-sm font-medium text-blue-800 hover:underline">
                    <RouterLink :to="{ name: 'forget_password' }">
                        Forget my password
                    </RouterLink>                    
                </a>

                <div class="flex space-x-4">
                    <button
                        @click.prevent="signInUser"
                        type="submit"
                        class="w-1/3 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">
                        Submit
                    </button>
                    <button
                        @click.prevent="handleSendPassword"
                        type="submit"
                        :disabled="isButtonDisabled"
                        :class="{ 'opacity-50 cursor-not-allowed': isButtonDisabled }"
                        class="w-2/3 text-white bg-indigo-400 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Send Passcode by Email
                    </button>
                </div>
                <div v-if="timer > 0" class="text-center mt-2 text-gray-600">
                    Please wait <span class="font-bold">{{ timer }}</span> seconds before requesting another code.
                </div>                
            </div>

            <div class="flex flex-col items-center justify-center text-center space-y-2">               
                <p>¿No tienes cuenta? 
                    <a href="#" class="text-sky-700">
                        <RouterLink :to="{ name: 'sign_on' }">
                            Regístrate
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
    import { useAuthStore } from '@/store/auth';
    import { onMounted , reactive, ref } from 'vue';    
    import { useRouter, RouterLink } from 'vue-router';
    import { loginWithGoogle } from '@/shared/login_with_google';
    import { showNotification } from '@/shared/notification_message';

    const timer = ref(0); // A ref to manage the countdown timer
    const router = useRouter(); // Get the router instance
    const authStore = useAuthStore(); // Get the authentication store instance    
    const isButtonDisabled = ref(false); // A ref to manage the button disabled state

    // Reactive form data object
    const userForm = reactive({
        email: '',
        passcode: '',
        password: '',
    });

    // Run on component mount
    onMounted(() => {
        if (authStore.isAuthenticated) {
            router.push({ name: 'profile' }); // Redirect to profile if already authenticated
        }
    });

    /**
     * Handles user sign in process
     */
    const signInUser = async () => {
        if (!userForm.email) {
            showNotification("Email is required!", "warning");
            return;
        }

        try {
            const response = await axios.post('/api/sign_in/', userForm);            
            authStore.login(response.data); // Log in the user

            showNotification("Sign In successful!", "success");
            router.push({ name: 'profile' }); // Redirect to profile
        } catch (error) {
            if (error.response && error.response.status === 401) {
                showNotification("Invalid credentials!", "warning");
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

    /**
     * Handles sending password reset passcode to the user's email
     */
    const handleSendPassword = async () => {
        if (!userForm.email) {
            showNotification("Email is required!", "warning");
            return;
        }
        
        startTimer(); // Start the countdown timer

        try {
            const response = await axios.post('/api/send_passcode/', {
                email: userForm.email
            });

            if (response.status === 200) {
                showNotification("Password code sent to your email", "info");                
            } else {
                showNotification("Error sending email", "error");
            }
        } catch (error) {
            showNotification("User not found", "warning");
        }
    };

    /**
     * Starts the countdown timer for the resend button
     */
    const startTimer = () => {
        isButtonDisabled.value = true;
        timer.value = 60;

        const interval = setInterval(() => {
            timer.value--;
            if (timer.value <= 0) {
                clearInterval(interval);
                isButtonDisabled.value = false;
            }
        }, 1000);
    };
</script>