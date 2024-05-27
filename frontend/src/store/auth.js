import axios from 'axios';
import { defineStore } from 'pinia';

// Define the authentication store
export const useAuthStore = defineStore('auth', {
  // State properties
  state: () => ({
    token: localStorage.getItem('token') || null, // Get the token from localStorage or set to null
    userAuth: JSON.parse(localStorage.getItem('userAuth')) || {} // Get the user authentication details from localStorage or set to an empty object
  }),
  // Getter methods
  getters: {
    isAuthenticated: (state) => state.token !== null, // Check if the user is authenticated based on the presence of a token
  },
  // Action methods
  actions: {
    /**
     * Logs in the user by setting the token and user details.
     * @param {Object} data - The user data containing the access token and user details.
     */
    login(data) {
      this.token = data.access;
      if (this.token) {
        this.userAuth = data.user;
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        
        // Save to localStorage
        this.saveToLocalStorage();
      } else {
        this.clearAuthorizationHeader();
      }
    },
    /**
     * Logs out the user by clearing the token and user details.
     */
    logout() {
      this.token = null;
      this.userAuth = {};
      this.clearAuthorizationHeader();
      this.removeFromLocalStorage();
    },
    /**
     * Saves the token and user authentication details to localStorage.
     */
    saveToLocalStorage() {
      localStorage.setItem('token', this.token);
      localStorage.setItem('userAuth', JSON.stringify(this.userAuth));
    },
    /**
     * Removes the token and user authentication details from localStorage.
     */
    removeFromLocalStorage() {
      localStorage.removeItem('token');
      localStorage.removeItem('userAuth');
    },
    /**
     * Clears the authorization header from Axios.
     */
    clearAuthorizationHeader() {
      delete axios.defaults.headers.common['Authorization'];
    }
  }
});
