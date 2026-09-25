export const ROADMAP_LOCK_DAYS = 14;

export const daysSince = (date) =>
  Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));

// Whole days remaining on the lock; 0 when unlocked or when there is no roadmap.
export const roadmapLockRemaining = (roadmap) => {
  if (!roadmap || !roadmap.generatedAt) return 0;
  return Math.max(0, ROADMAP_LOCK_DAYS - daysSince(roadmap.generatedAt));
};
