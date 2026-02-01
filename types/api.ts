

// 모임 생성 API 요청 타입
export interface MeetingCreateRequest {
  meetingName: string;
  purposes: string[];
  purposeCount: number;
  capacity: number;
  deadline: string; // "YYYY-MM-DDTHH:mm:ss" 형식
}

export interface MeetingCreateResponse {
  meetingUrl: string;
  meetingId?: string;
}



