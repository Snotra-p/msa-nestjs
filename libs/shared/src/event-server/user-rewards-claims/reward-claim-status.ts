export const REWARDS_CLAIM_STATUS = {
  PENDING: 'pending', // 처리 대기
  PROCESSING: 'processing', // 처리 중
  SUCCESS: 'success', // 지급 성공
  FAILED: 'failed', // 지급 실패
  REJECTED: 'rejected', // 관리자가 거부
} as const;

export type RewardsClaimStatus =
  (typeof REWARDS_CLAIM_STATUS)[keyof typeof REWARDS_CLAIM_STATUS];
