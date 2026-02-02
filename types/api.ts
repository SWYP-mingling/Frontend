// 서버에서 보내는 데이터 형태를 정의한 타입
export interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  data: T;
}

// 모임 생성 API 요청 타입
export interface MeetingCreateRequest {
  meetingName: string;
  purposes: string[];
  purposeCount: number;
  capacity: number;
  deadline: string; // "YYYY-MM-DDTHH:mm:ss" 형식
}

export interface MeetingCreateData {
  meetingUrl: string;
  meetingId: string;
}

// 모임 생성 API 조립 (ApiResponse에 MeetingCreateData를 담기)
export type MeetingCreateResponse = ApiResponse<MeetingCreateData>;

// 참여자 입장 API 요청 타입
export interface ParticipantEnterRequest {
  userId: string;
  password: string;
}

// 참여자 입장 API 응답 데이터 타입 (데이터 없음, success만 확인)
export type ParticipantEnterData = Record<string, never>;

// 참여자 입장 API 조립
export type ParticipantEnterResponse = ApiResponse<ParticipantEnterData>;
