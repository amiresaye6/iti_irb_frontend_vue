import { useApi } from "@/utils/useApi";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER;

export default {
  getDashboardStatistics(setLoading, setError) {
    return useApi({
      url: `${BASE_URL}/manager/reports-statistics`,
      method: "GET",
      setLoading,
      setError,
    });
  },

  getFinalApprovals(setLoading, setError) {
    return useApi({
      url: `${BASE_URL}/manager/dashboard`,
      method: "GET",
      setLoading,
      setError,
    });
  },
  getFinalApprovalsHistory(setLoading, setError) {
    return useApi({
      url: `${BASE_URL}/manager/final-approvals`,
      method: "GET",
      setLoading,
      setError,
    });
  },

  getDecisionDetails(id, setLoading, setError) {
    return useApi({
      url: `${BASE_URL}/manager/decisions/${id}`,
      method: "GET",
      setLoading,
      setError,
    });
  },

  processDecision(id, decisionData, setLoading, setError) {
    return useApi({
      url: `${BASE_URL}/manager/decisions/${id}/process`,
      method: "POST",
      data: decisionData,
      setLoading,
      setError,
    });
  },
};
