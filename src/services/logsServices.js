import { useApi } from "@/utils/useApi";

const Base_url = import.meta.env.VITE_BACKEND_SERVER;

export const logServices = () => {
    
    const getAllLogs = (page = 1, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/logs?page=${page}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        };
        return useApi(apiOptions);
    };

    const getLogsByAppId = (appId, page = 1, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/logs/application/${appId}?page=${page}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        };
        return useApi(apiOptions);
    };

    const getLogsByUserId = (userId, page = 1, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/logs/user/${userId}?page=${page}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        };
        return useApi(apiOptions);
    };

    const getLogsByType = (type, page = 1, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/logs/type/${type}?page=${page}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        };
        return useApi(apiOptions);
    };

    const getSubmissionLogs = (page = 1, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/logs/submission?page=${page}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        };
        return useApi(apiOptions);
    };

    const getAssignmentLogs = (page = 1, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/logs/assignment?page=${page}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        };
        return useApi(apiOptions);
    };

    const getDecisionLogs = (page = 1, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/logs/decision?page=${page}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        };
        return useApi(apiOptions);
    };

    const getStatusChangeLogs = (page = 1, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/logs/status-change?page=${page}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        };
        return useApi(apiOptions);
    };

    const getAuthLogs = (page = 1, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/logs/auth?page=${page}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        };
        return useApi(apiOptions);
    };

    const getLogsBySerialNumber = (serialNumber, page = 1, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/logs/serial-number/${serialNumber}?page=${page}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        };
        return useApi(apiOptions);
    };

    return {
        getAllLogs,
        getLogsByAppId,
        getLogsByUserId,
        getLogsByType,
        getSubmissionLogs,
        getAssignmentLogs,
        getDecisionLogs,
        getStatusChangeLogs,
        getAuthLogs,
        getLogsBySerialNumber
    };
};