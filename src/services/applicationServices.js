import { useApi } from "@/utils/useApi";

const Base_url = import.meta.env.VITE_BACKEND_SERVER;

export const applicationServices = () => {
    // applications APIs
    const getAllApplications = (setLoading,setError) => {
        const apiOptions = {
            url : `${Base_url}/applications`,
            method : 'GET',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const postApplication = (applicationData,setLoading,setError) => {
        const apiOptions = {
            url : `${Base_url}/applications`,
            method : 'POST',
            data : applicationData,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const get_PendingAdmin_Apps = (setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/pending_admin`,
            method : 'GET',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const get_UnderReview_Apps = (setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/under_review`,
            method : 'GET',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const get_ApprovedByReviewer_Apps = (setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/approved_by_reviewer`,
            method : 'GET',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const get_AwaitingPayment_Apps = (setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/awaiting_payment`,
            method : 'GET',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const get_Approved_Apps = (setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/approved`,
            method : 'GET',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const get_Rejected_Apps = (setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/rejected`,
            method : 'GET',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const rejectApp = (appId,setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/reject/${appId}`,
            method : 'POST',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    //get user id from authentication
    const getAppsByUserId = (setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/student`,
            method : 'GET',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const getAppsByStudentId = (studentId,setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/student/${studentId}`,
            method : 'GET',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const getAppById = (appId,setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/${appId}`,
            method : 'GET',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    // DON'T FORGET TO CHECK AUTORIZATION IN BACKEND
    const patchAppById = (appId,appData,setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/${appId}`,
            method : 'PATCH',
            data : appData,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const toNextStage = (appId,setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/${appId}`,
            method : 'POST',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }


    /////////////////////////////////////////////////////
    // Documents Services ///////////////////////////////
    /////////////////////////////////////////////////////
    
    
    const getDocsByAppId = (appId,setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/applications/${appId}/Docs`,
            method : 'GET',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    const getDocById = (docId,setLoading,setError) =>{
        const apiOptions = {
            url : `${Base_url}/Documents/${docId}`,
            method : 'GET',
            data : null,
            setLoading,
            setError
        }
        return useApi(apiOptions)
    }

    return{getAllApplications,
        postApplication,
        get_PendingAdmin_Apps,
        get_UnderReview_Apps,
        get_ApprovedByReviewer_Apps,
        get_AwaitingPayment_Apps,
        get_Approved_Apps,
        get_Rejected_Apps,
        rejectApp,
        getAppsByUserId,
        getAppsByStudentId,
        getAppById,
        patchAppById,
        toNextStage,
        getDocsByAppId,
        getDocById,
    }
}