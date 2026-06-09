import { useApi } from "@/utils/useApi";

const Base_url = import.meta.env.VITE_BACKEND_SERVER;

export const paymentServices = () => {

    const filterParams = (params) => {
        return Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined));
    };

    const getPendingPayments = (queryParams = {}, setLoading, setError) => {
        const queryStr = new URLSearchParams(filterParams(queryParams)).toString();
        const apiOptions = {
            url: `${Base_url}/payments/pending${queryStr ? '?' + queryStr : ''}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const getPaymentHistory = (queryParams = {}, setLoading, setError) => {
        const queryStr = new URLSearchParams(filterParams(queryParams)).toString();
        const apiOptions = {
            url: `${Base_url}/payments/history${queryStr ? '?' + queryStr : ''}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const getPaymentReceipt = (paymentId, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/payments/${paymentId}/receipt`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const initiateCheckout = (appId, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/payments/checkout/${appId}`,
            method: 'POST',
            data: null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const verifyPaymentStatus = (clientSecret, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/payments/verify/${clientSecret}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    // --- Admin / Manager endpoints ---

    const getAdminDashboard = (queryParams = {}, setLoading, setError) => {
        const queryStr = new URLSearchParams(filterParams(queryParams)).toString();
        const apiOptions = {
            url: `${Base_url}/payments/admin${queryStr ? '?' + queryStr : ''}`,
            method: 'GET',
            data: null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const setPaymentFee = (applicationId, amount, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/payments/set-fee/${applicationId}`,
            method: 'POST',
            data: { amount },
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    return {
        getPendingPayments,
        getPaymentHistory,
        getPaymentReceipt,
        initiateCheckout,
        verifyPaymentStatus,
        getAdminDashboard,
        setPaymentFee
    }
}
