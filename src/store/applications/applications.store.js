import { defineStore } from "pinia";
import { ref } from "vue";
import { applicationServices } from "@/services/applicationServices";

export const useApplicationsStore = defineStore('applications', () => {
    const allApplications = ref([]);
    const userApplications = ref([]);
    const isLoading = ref(false);
    const errorMessage = ref(null);

    const setLoading = (val) => { isLoading.value = val; };
    const setError = (err) => { errorMessage.value = err ? (err.message || err) : null; };

    const fetchAllApplications = async (forceRefresh = false) => {
        if (allApplications.value.length > 0 && !forceRefresh) {
            console.log("Reading allApplications from cache...");
            return;
        }

        const data = await applicationServices().getAllApplications(setLoading, setError);
        
        if (data) {
            allApplications.value = data;
            console.log("Stored data in allApplications.value");
        } else {
            console.log("Failed to fetch applications or unexpected behavior");
        }
    };

    const fetchUserApplications = async (forceRefresh = false) => {
        if (userApplications.value.length > 0 && !forceRefresh) {
            console.log("Reading userApplications from cache...");
            return;
        }

        const data = await applicationServices().getAppsByUserId(setLoading, setError);
        
        if (data) {
            userApplications.value = data;
            console.log("Stored data in userApplications.value");
        } else {
            console.log("Failed to fetch user applications");
        }
    };

    return {
        allApplications,
        userApplications,
        isLoading,
        errorMessage,  
        fetchAllApplications,
        fetchUserApplications,
    };
});