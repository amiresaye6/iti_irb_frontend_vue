import { useApi } from "@/utils/useApi";

const Base_url = import.meta.env.VITE_BACKEND_SERVER;

export const authServices = () => {
    const login = (credentials, setLoading, setError) => {
        const apiOptions = {
            url: `${Base_url}/login`,
            method: 'POST',
            data: credentials,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    return {
        login
    }
}
