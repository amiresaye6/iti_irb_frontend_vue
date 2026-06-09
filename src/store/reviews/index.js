import { defineStore } from 'pinia';
import { reviewService } from '@/services/reviewService';

export const useReviewStore = defineStore('reviews', {
  state: () => ({
    dashboardData: null,
    pendingResearches: [],
    pendingAssignments: [],
    activeAssignments: [],
    assignmentHistory: [],
    awaitingDecisionAssignments: [],
    currentReviewDetails: null,
    
    // Admin
    applicationsUnderReview: [],
    availableReviewers: [],
    allSystemReviews: [],
    
    loading: false,
    error: null
  }),

  actions: {
    async fetchDashboardKPIs() {
      this.loading = true;
      this.error = null;
      const data = await reviewService.getDashboardKPIs(
        (v) => { this.loading = v; },
        (e) => { this.error = e?.message || null; }
      );
      if (data) this.dashboardData = data;
    },

    async fetchPendingResearches() {
      this.loading = true;
      const data = await reviewService.getPendingResearches(
        (v) => { this.loading = v; },
        (e) => { this.error = e?.message || null; }
      );
      if (data) this.pendingResearches = data;
    },

    async fetchPendingAssignments() {
      this.loading = true;
      const data = await reviewService.getPendingAssignments(
        (v) => { this.loading = v; },
        (e) => { this.error = e?.message || null; }
      );
      if (data) this.pendingAssignments = data;
    },

    async fetchActiveAssignments() {
      this.loading = true;
      const data = await reviewService.getActiveAssignments(
        (v) => { this.loading = v; },
        (e) => { this.error = e?.message || null; }
      );
      if (data) this.activeAssignments = data;
    },

    async fetchAssignmentHistory() {
      this.loading = true;
      const data = await reviewService.getAssignmentHistory(
        (v) => { this.loading = v; },
        (e) => { this.error = e?.message || null; }
      );
      if (data) this.assignmentHistory = data;
    },

    async fetchReviewDetails(applicationId) {
      this.loading = true;
      const data = await reviewService.getReviewDetails(
        applicationId,
        (v) => { this.loading = v; },
        (e) => { this.error = e?.message || null; }
      );
      if (data) this.currentReviewDetails = data;
    },

    async acceptAssignment(reviewId) {
      const data = await reviewService.acceptAssignment(reviewId);
      if (data) {
        await this.fetchPendingAssignments();
        await this.fetchActiveAssignments();
        return { success: true };
      }
      return { success: false, message: 'حدث خطأ' };
    },

    async refuseAssignment(reviewId, reason) {
      const data = await reviewService.refuseAssignment(reviewId, reason);
      if (data) {
        await this.fetchPendingAssignments();
        return { success: true };
      }
      return { success: false, message: 'حدث خطأ' };
    },

    async submitDecision(applicationId, payload) {
      const data = await reviewService.submitDecision(applicationId, payload);
      if (data) {
        await this.fetchActiveAssignments();
        return { success: true };
      }
      return { success: false, message: 'حدث خطأ' };
    },

    async fetchAwaitingDecisionAssignments() {
      this.loading = true;
      const data = await reviewService.getAwaitingDecisionAssignments(
        (v) => { this.loading = v; },
        (e) => { this.error = e?.message || null; }
      );
      if (data) this.awaitingDecisionAssignments = data;
    },

    // ─── ADMIN ACTIONS ───

    async fetchApplicationsUnderReview() {
      this.loading = true;
      const data = await reviewService.getApplicationsUnderReview(
        (v) => { this.loading = v; },
        (e) => { this.error = e?.message || null; }
      );
      if (data) this.applicationsUnderReview = data;
    },

    async fetchAvailableReviewers(applicationId = null) {
      this.loading = true;
      const data = await reviewService.getAvailableReviewers(
        applicationId,
        (v) => { this.loading = v; },
        (e) => { this.error = e?.message || null; }
      );
      if (data) this.availableReviewers = data;
    },

    async assignReviewer(applicationId, reviewerId) {
      let errMessage = null;
      const data = await reviewService.assignReviewer(
        applicationId, 
        reviewerId,
        () => {},
        (e) => { errMessage = e?.message; }
      );
      if (data) return { success: true, message: data.message || 'تم الإسناد بنجاح' };
      return { success: false, message: errMessage || 'حدث خطأ' };
    },

    async fetchAllSystemReviews() {
      this.loading = true;
      const data = await reviewService.getAllSystemReviews(
        (v) => { this.loading = v; },
        (e) => { this.error = e?.message || null; }
      );
      if (data) this.allSystemReviews = data;
    },

    async fetchApplicationAssignmentHistory(applicationId) {
      let result = null;
      let errMsg = null;
      const data = await reviewService.getApplicationAssignmentHistory(
        applicationId,
        () => {},
        (e) => { errMsg = e?.message || 'حدث خطأ'; }
      );
      if (data) return { success: true, data };
      return { success: false, message: errMsg };
    }
  }
});

