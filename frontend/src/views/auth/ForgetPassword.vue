<template>
    <section class="flex bg-slate-100 h-screen items-center justify-center">
        <form 
            class="space-y-5 rounded-lg border-2 border-gray-700 p-4 w-1/3"
            @submit.prevent="handleResetPassword">
            <h2 class="font-bold">Recovery Password</h2>

            <div class="flex space-x-2">
                <div class="w-2/3">
                    <label 
                    for="email" 
                    class="block mb-2 text-sm font-medium text-gray-900">
                    Your email
                    </label>
                    <input
                        v-model="email"
                        type="email" 
                        id="email" 
                        aria-describedby="helper-text-explanation" 
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        placeholder="name@example.com">
                </div>
                <div class="w-1/3 flex items-end">
                    <button
                        @click.prevent="handleRequestPasswordReset"
                        :disabled="isButtonDisabled"
                        type="submit" 
                        :class="{ 'opacity-50 cursor-not-allowed': isButtonDisabled }"
                        class="w-full text-white bg-indigo-500 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Send Email
                    </button>
                </div>
            </div>

            <div>
                <label 
                    for="text" 
                    class="block mb-2 text-sm font-medium text-gray-900">
                    Your Passcode
                </label>
                <input
                    v-model="passcode"
                    type="number" 
                    id="code-text" 
                    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Type the passcode sent to your email"/>
            </div>
            <div>
                <label 
                    for="password" 
                    class="block mb-2 text-sm font-medium text-gray-900">
                    Your password
                </label>
                <input
                    v-model="newPassword"
                    type="password" 
                    id="password" 
                    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="Type your new password"/>
            </div>
            <div>
                <label 
                    for="repeat-password" 
                    class="block mb-2 text-sm font-medium text-gray-900">
                    Confirm password
                </label>
                <input
                    v-model="confirmPassword"
                    type="password" 
                    id="repeat-password" 
                    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="Type again your new password to confirm it"/>
            </div>

            <div class="flex space-x-2">
                <button 
                    type="submit" 
                    class="w-2/3 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Set New Password
                </button>
                <button
                    class="w-1/3 text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    <RouterLink :to="{ name: 'sign_in' }">
                        Go Back
                    </RouterLink>    
                </button>
            </div>

            <div v-if="timer > 0" class="text-center mt-2 text-gray-600">
                Please wait <span class="font-bold">{{ timer }}</span> seconds before requesting another code.
            </div>
        </form>

    </section>
</template>

<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { showNotification } from '@/shared/notification_message';

    const router = useRouter(); // Get the router instance
    const email = ref(''); // A ref to store the email input
    const passcode = ref(''); // A ref to store the passcode input
    const newPassword = ref(''); // A ref to store the new password input
    const confirmPassword = ref(''); // A ref to store the confirm password input
    const timer = ref(0); // A ref to manage the countdown timer
    const isButtonDisabled = ref(false); // A ref to manage the button disabled state

    /**
     * Handles the request to send a password reset passcode to the user's email
     */
    const handleRequestPasswordReset = async () => {
        if (!email.value) {
            showNotification("Email is required!", "warning");
            return;
        }

        try {
            const response = await axios.post('/api/send_passcode/', {
                email: email.value
            });

            if (response.status === 200) {
                showNotification("Password reset code sent to your email", "info");
                startTimer(); // Start the countdown timer
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

    /**
     * Handles the password reset process
     */
    const handleResetPassword = async () => {
        if (!passcode.value) {
            showNotification("Passcode is required!", "warning");
            return;
        }
        if (!newPassword.value) {
            showNotification("New Password is required!", "warning");
            return;
        }
        if (!confirmPassword.value) {
            showNotification("Confirm Password is required!", "warning");
            return;
        }

        if (newPassword.value !== confirmPassword.value) {
            showNotification("Passwords do not match!", "warning");
            return;
        }

        try {
            await axios.post('/api/verify_passcode_and_reset_password/', {
                passcode: passcode.value,
                new_password: newPassword.value
            });

            showNotification("Password reset successful!", "success");
            router.push({ name: 'sign_in' });
        } catch (error) {
            showNotification(error.response.data.error, "error");
        }
    };
</script>