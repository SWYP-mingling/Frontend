// 서버에서 보내는 데이터 형태를 정의한 타입
export interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  data: T;
}

// 모임 URL 조회 요청 타입
export interface MeetingLinkData {
  meetingUrl: string;
}

// 모임 URL 조회 API 조립
export type MeetingLinkResponse = ApiResponse<MeetingLinkData>;

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

// 출발지 등록 API 응답 데이터 타입
export interface SetDepartureData {
  userName: string;
  stationName: string;
  latitude: number;
  longitude: number;
}

// 출발지 등록 API 조립
export type SetDepartureResponse = ApiResponse<SetDepartureData>;

// 모임 참여 현황 조회 API 응답 데이터 타입
export interface MeetingStatusData {
  totalParticipantCount: number;
  currentParticipantCount: number;
  pendingParticipantCount: number;
  deadlineAt: string;
  // 출발지 등록한 참여자 리스트
  participants: SetDepartureData[];
}

// 모임 참여 현황 조회 API 조립
export type MeetingStatusResponse = ApiResponse<MeetingStatusData>;
