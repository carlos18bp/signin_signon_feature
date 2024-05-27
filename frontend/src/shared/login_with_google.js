import axios from 'axios';
import { showNotification } from '@/shared/notification_message';

/**
 * Handles the login process with Google.
 * @param {Object} response - The response object from Google login.
 * @param {Object} router - The router instance to handle navigation.
 * @param {Object} authStore - The authentication store instance.
 */
export const loginWithGoogle = async (response, router, authStore) => {
    try {
        // Send the Google credential to the backend for verification
        const res = await axios.post('/api/google_login/', new URLSearchParams({
            token: response.credential,
        }));

        // Log in the user and save the authentication data
        authStore.login(res.data);
        showNotification("Sign In successful!", "success");
        router.push({ name: 'profile' }); // Redirect to the profile page
    } catch (error) {
        handleLoginError(error);
    }
};

/**
 * Handles errors during the login process.
 * @param {Object} error - The error object caught during login.
 */
const handleLoginError = (error) => {
    console.error('Error during login:', error);
    showNotification("Error during login", "error"); // Show error notification
};
