import { defineStore } from "pinia";
import {
  get_request,
  create_request,
  update_request,
} from "./services/request_http";
import { useAuthStore } from "./auth";

export const useUserStore = defineStore("user", {
  /**
   * Store state.
   * @returns {object} State object.
   */
  state: () => ({
    users: [],
    dataLoaded: false,
    currentUser: null,
  }),

  getters: {
    /**
     * Get user by ID.
     * @param {object} state - State.
     * @returns {function} - Function to find user by ID.
     */
    userById: (state) => (userId) => {
      return state.users.find((user) => user.id == userId);
    },

    /**
     * Get current authenticated user.
     * @param {object} state - State.
     * @returns {object|null} - Current user object or null.
     */
    getCurrentUser: (state) => state.currentUser,
  },

  actions: {
    /**
     * Initialize store by fetching data if not already loaded.
     */
    async init() {
      if (!this.dataLoaded) await this.fetchUsersData();
    },

    /**
     * Fetch users data from backend.
     */
    async fetchUsersData() {
      if (this.dataLoaded) return;

      try {
        let response = await get_request("users/");
        let jsonData = response.data;

        if (jsonData && typeof jsonData === "string") {
          try {
            jsonData = JSON.parse(jsonData);
          } catch (error) {
            console.error("JSON parse error:", error.message);
            jsonData = [];
          }
        }

        this.users = jsonData ?? [];
        this.dataLoaded = true;
        this.setCurrentUser();
      } catch (error) {
        console.error("Error fetching users data:", error.message);
        this.users = [];
        this.dataLoaded = false;
      }
    },

    /**
     * Set the current user based on authenticated user's ID.
     */
    setCurrentUser() {
      const authStore = useAuthStore();
      this.currentUser = this.userById(authStore.userAuth.id) || null;
    },

    /**
     * Creates a new user profile.
     *
     * This function sends a request to the backend to create a new user profile
     * using the provided form data. Upon success, it reloads the user data
     * to reflect the newly created profile.
     *
     * @param {Object} formData - The form data used to create the new profile.
     * @returns {number|null} The status code of the response if successful, or null if an error occurred.
     */
    async createUser(formData) {
      try {
        // Send a request to create a new profile
        let response = await create_request("create_profile/", formData);

        // Set dataLoaded to false to indicate the data needs to be reloaded
        this.dataLoaded = false;

        // Fetch updated users data after creation
        await this.fetchUsersData();

        // Return the response status code
        return response.status;
      } catch (error) {
        // Log the error message if an error occurs
        console.error("Error updating user:", error.message);

        // Return null if an error occurred
        return null;
      }
    },

    /**
     * Updates an existing user profile.
     *
     * This function sends a request to the backend to update an existing user profile
     * based on the provided form data. It reloads the user data upon success.
     *
     * @param {Object} formData - The form data used to update the profile, including the user ID.
     * @returns {number|null} The status code of the response if successful, or null if an error occurred.
     */
    async updateUser(formData) {
      try {
        // Send a request to update the profile using the user ID and form data
        let response = await update_request(
          `update_profile/${formData.id}/`,
          formData
        );

        // Set dataLoaded to false to indicate the data needs to be reloaded
        this.dataLoaded = false;

        // Fetch updated users data after the update
        await this.fetchUsersData();

        // Return the response status code
        return response.status;
      } catch (error) {
        // Log the error message if an error occurs
        console.error("Error updating user:", error.message);

        // Return null if an error occurred
        return null;
      }
    },
  },
});
