import { useApi } from '../utils/useApi';

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER;

export const loginUser = ({ data, setLoading, setError }) =>
    useApi({
        url: `${BASE_URL}/login`,
        method: 'POST',
        data,
        setLoading,
        setError,
    });
export const logoutUser = ({ setLoading, setError }) =>
    useApi({
        url: `${BASE_URL}/auth/logout`,
        method: 'POST',
        setLoading,
        setError,
    });


export const forgotPassword = ({ data, setLoading, setError }) =>
    useApi({
        url: `${BASE_URL}/forgot-password`,
        method: 'POST',
        data,
        setLoading,
        setError,
    });

export const resetPassword = ({ data, setLoading, setError }) =>
    useApi({
        url: `${BASE_URL}/reset-password`,
        method: 'POST',
        data,
        setLoading,
        setError,
    });

export const getProfile = ({ setLoading, setError }) =>
    useApi({
        url: `${BASE_URL}/auth/profile`,
        method: 'GET',
        setLoading,
        setError,
    });

export const updateProfile = ({ data, setLoading, setError }) =>
    useApi({
        url: `${BASE_URL}/profile`,
        method: 'PUT',
        data,
        setLoading,
        setError,
    });

export const getPendingUsers = ({ setLoading, setError }) =>
    useApi({
        url: `${BASE_URL}/pending_users`,
        method: 'GET',
        setLoading,
        setError,
    });


export const getAllUsers = ({ setLoading, setError }) =>
    useApi({
        url: `${BASE_URL}/users`,
        method: 'GET',
        setLoading,
        setError,
    });

export const activateUser = ({ id, setLoading, setError }) =>
    useApi({
        url: `${BASE_URL}/users/${id}/activate`,
        method: 'POST',
        setLoading,
        setError,
    });

export const deleteUser = ({ id, setLoading, setError }) =>
    useApi({
        url: `${BASE_URL}/users/${id}`,
        method: 'DELETE',
        setLoading,
        setError,
    });

export const addStaff = ({ data, setLoading, setError }) =>
    useApi({
        url: `${BASE_URL}/admin/add_staff`,
        method: 'POST',
        data,
        setLoading,
        setError,
    });