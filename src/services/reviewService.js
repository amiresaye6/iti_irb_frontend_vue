import { useApi } from '@/utils/useApi';

const Base_url = import.meta.env.VITE_BACKEND_SERVER;

export const reviewService = {
  // ─── REVIEWER ENDPOINTS ───

  getDashboardKPIs(setLoading, setError) {
    return useApi({ url: `${Base_url}/reviewer/dashboard`, method: 'GET', setLoading, setError });
  },

  getPendingResearches(setLoading, setError) {
    return useApi({ url: `${Base_url}/reviewer/pending-researches`, method: 'GET', setLoading, setError });
  },

  getPendingAssignments(setLoading, setError) {
    return useApi({ url: `${Base_url}/reviewer/pending-assignments`, method: 'GET', setLoading, setError });
  },

  getActiveAssignments(setLoading, setError) {
    return useApi({ url: `${Base_url}/reviewer/active-assignments`, method: 'GET', setLoading, setError });
  },

  getAssignmentHistory(setLoading, setError) {
    return useApi({ url: `${Base_url}/reviewer/history`, method: 'GET', setLoading, setError });
  },

  getReviewDetails(applicationId, setLoading, setError) {
    return useApi({ url: `${Base_url}/reviewer/reviews/${applicationId}`, method: 'GET', setLoading, setError });
  },

  acceptAssignment(reviewId, setLoading, setError) {
    return useApi({ url: `${Base_url}/reviewer/assignments/${reviewId}/accept`, method: 'POST', setLoading, setError });
  },

  refuseAssignment(reviewId, reason, setLoading, setError) {
    return useApi({ url: `${Base_url}/reviewer/assignments/${reviewId}/refuse`, method: 'POST', data: { reason }, setLoading, setError });
  },

  submitDecision(applicationId, data, setLoading, setError) {
    return useApi({ url: `${Base_url}/reviewer/reviews/${applicationId}/submit`, method: 'POST', data, setLoading, setError });
  },

  getAwaitingDecisionAssignments(setLoading, setError) {
    return useApi({ url: `${Base_url}/reviewer/awaiting-decision-assignments`, method: 'GET', setLoading, setError });
  },

  // ─── ADMIN/MANAGER ENDPOINTS ───

  getApplicationsUnderReview(setLoading, setError) {
    return useApi({ url: `${Base_url}/admin/reviews/under-review`, method: 'GET', setLoading, setError });
  },

  getAvailableReviewers(setLoading, setError) {
    return useApi({ url: `${Base_url}/admin/reviews/available-reviewers`, method: 'GET', setLoading, setError });
  },

  assignReviewer(applicationId, reviewerId, setLoading, setError) {
    return useApi({ url: `${Base_url}/admin/reviews/assign/${applicationId}`, method: 'POST', data: { reviewer_id: reviewerId }, setLoading, setError });
  },

  getAllSystemReviews(setLoading, setError) {
    return useApi({ url: `${Base_url}/admin/reviews/all`, method: 'GET', setLoading, setError });
  }
};
