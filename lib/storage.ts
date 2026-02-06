// lib/storage.ts
export const getMeetingUserId = (meetingId: string): string | null => {
  if (typeof window === 'undefined') return null;

  // ⭐ 모임별로 분리된 키
  return (
    localStorage.getItem(`meeting_${meetingId}_userId`) ||
    sessionStorage.getItem(`meeting_${meetingId}_userId`)
  );
};

export const setMeetingUserId = (meetingId: string, userId: string, remember: boolean) => {
  if (typeof window === 'undefined') return;

  if (remember) {
    localStorage.setItem(`meeting_${meetingId}_userId`, userId);
  } else {
    sessionStorage.setItem(`meeting_${meetingId}_userId`, userId);
  }
};

export const removeMeetingUserId = (meetingId: string) => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(`meeting_${meetingId}_userId`);
  sessionStorage.removeItem(`meeting_${meetingId}_userId`);
};
