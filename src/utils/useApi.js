export const useApi = async (
    {
        url,
        method = 'GET',
        data = null,
        setLoading = () => { },
        setError = () => { }
    }) => {
    try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const isFormData = data instanceof FormData;
        const options = {
            method,
            headers: 
            { 
                // 'Content-Type': 'application/json'
                'Accept': 'application/json'
            },
        }
        if (!isFormData) {
            options.headers['Content-Type'] = 'application/json';
        }
        if (token) {
            options.headers.Authorization = `Bearer ${token}`;
        }

        if (method !== "GET" && data) {
            // options.body = JSON.stringify(data);
            options.body = isFormData ? data : JSON.stringify(data);
        }
        const res = await fetch(url, options)


        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || `error ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        setError(error);
        return null;
    } finally {
        setLoading(false);
    }
}