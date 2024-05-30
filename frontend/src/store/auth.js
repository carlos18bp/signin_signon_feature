import axios from 'axios';
import { defineStore } from 'pinia';

// Define the authentication store
export const useAuthStore = defineStore('auth', {
  // State properties
  state: () => ({
    token: localStorage.getItem('token') || null, // Get the token from localStorage or set to null
    userAuth: JSON.parse(localStorage.getItem('userAuth')) || {}, // Get the user authentication details from localStorage or set to an empty object
    signInTries: localStorage.getItem('signInTries') || 0, // Get the Sign In attempts
    secondsAcumulated: localStorage.getItem('secondsAcumulated') || 0,
    secondsRemaining: localStorage.getItem('secondsRemaining') || 0, // Get remaining seconds only because user exceeds allowed attempts
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
        this.saveToLocalStorageAuth();
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
    saveToLocalStorageAuth() {
      localStorage.setItem('token', this.token);
      localStorage.setItem('userAuth', JSON.stringify(this.userAuth));
    },
    /**
     * Removes the token and user authentication details from localStorage.
     */
    removeFromLocalStorage() {
      localStorage.removeItem('token');
      localStorage.removeItem('userAuth');
      localStorage.removeItem('signInTries');
      localStorage.removeItem('secondsAcumulated');
      localStorage.removeItem('secondsRemaining');
    },
    /**
     * Clears the authorization header from Axios.
     */
    clearAuthorizationHeader() {
      delete axios.defaults.headers.common['Authorization'];
    },
     /**
     * Saves the Sign In Attemps and Second Remaining to localStorage
     */
    saveToLocalStorageSignIn() {
      localStorage.setItem('signInTries', this.signInTries);
      localStorage.setItem('secondsRemaining', this.secondsRemaining);
      localStorage.setItem('secondsAcumulated', this.secondsAcumulated);
    },
     /**
     * Verficate the attemps to Sign In and incrementate the seconds for wait the next 3 attemps
     */
    attempsSignIn(action) {
      if (action != 'initial'){
        this.signInTries += 1;
      }
      console.log(this.signInTries)
  
      if (this.signInTries % 3 === 0) {
        if (action != 'initial'){
          if (this.signInTries === 3) {
            this.secondsRemaining = 60;
            this.secondsAcumulated = this.secondsRemaining
          } else {
            this.secondsAcumulated *= 2;
            this.secondsRemaining = this.secondsAcumulated
          }
        }
        
        const interval = setInterval(() => {
          this.secondsRemaining--;
          this.saveToLocalStorageSignIn();
          if (this.secondsRemaining <= 0) {
              clearInterval(interval);
          }
      }, 1000);
      }
      this.saveToLocalStorageSignIn();
    }
  }
});
