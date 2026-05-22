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

        const obtions = {
            method,
            headers: { 'Content-Type': 'application/json' },
        }

        if (method !== "GET" && data) {
            obtions.body = JSON.stringify(data);
        }
        const res = await fetch(url, obtions)


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