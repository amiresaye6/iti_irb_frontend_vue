import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginUser, logoutUser, getProfile } from '../../services/authService';
import { useApi } from '../../utils/useApi';
export const useAuthStore = defineStore('auth', () => {

    const user    = ref(JSON.parse(localStorage.getItem('user')) || null);
    const token   = ref(localStorage.getItem('token') || null);
    const loading = ref(false);
    const errorMessage   = ref(null);

    const isAuthenticated = computed(() => !!token.value);
    const userRole        = computed(() => user.value?.role || null);
    const isAdmin         = computed(() => userRole.value === 'admin');
    const isStudent       = computed(() => userRole.value === 'student');
    const isReviewer      = computed(() => userRole.value === 'reviewer');
    const isManager       = computed(() => userRole.value === 'manager');

    const setLoading = (val) => (loading.value = val);
    const setError   = (val) => (errorMessage.value = val?.message || null);

    const persistSession = (userData, tokenValue) => {
        user.value  = userData;
        token.value = tokenValue;
        localStorage.setItem('user',  JSON.stringify(userData));
        localStorage.setItem('token', tokenValue);
    };

    const clearSession = () => {
        user.value  = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const login = async (credentials) => {
        const res = await loginUser({
            data: credentials,
            setLoading,
            setError,
        });

        if (res) {
            persistSession(res.user, res.token);
            return res.user.role; 
        }
        return null;
    };

    const logout = async () => {
        await logoutUser({ setLoading, setError });
        clearSession();
    };

    const fetchProfile = async () => {
        const res = await getProfile({ setLoading, setError });
        if (res) {
            user.value = res.user ?? res; 
            localStorage.setItem('user', JSON.stringify(user.value));
        }
    };
    const register = async (payload) => {
    errorMessage.value = null;
    const res = await useApi({
        url: `${import.meta.env.VITE_BACKEND_SERVER}/register`,
        method: 'POST',
        data: payload,
        setLoading,
        setError,
    });
    return res;
};

    return {
        user, token, loading, errorMessage,
        isAuthenticated, userRole,
        isAdmin, isStudent, isReviewer, isManager,
        login, logout, fetchProfile, clearSession, register
    };
});