'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PolicyModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        // 모바일에서는 꽉 차게, 데스크탑에서는 적절한 너비로 설정
        // max-h-[85vh]로 높이 제한을 두어 스크롤 영역 확보
        className="flex max-h-[85vh] w-[calc(100%-40px)] max-w-lg flex-col gap-6 rounded bg-white px-6 py-5 md:max-w-xl"
      >
        <DialogHeader className="shrink-0 text-left">
          <DialogTitle className="text-[20px] font-bold text-black md:text-[22px]">
            개인정보처리방침
          </DialogTitle>
          <DialogDescription className="sr-only">
            밍글링 개인정보처리방침 전문입니다.
          </DialogDescription>
        </DialogHeader>

        {/* 약관 본문 영역 (스크롤 적용) */}
        <div className="flex-1 overflow-y-auto border-y border-gray-100 py-4 pr-2 text-sm leading-relaxed text-gray-600">
          <div className="space-y-6">
            <section>
              <h3 className="mb-2 text-base font-bold text-black">1. 총칙</h3>
              <div className="space-y-2">
                <p>
                  밍글링(이하 “회사”라 함)는 회원의 개인정보보호를 매우 중요시하며, 이용자가 회사의
                  밍글링 서비스(이하 “서비스”라 함)를 이용함과 동시에 온라인상에서 회사에 제공한
                  개인정보가 보호 받을 수 있도록 최선을 다하고 있습니다.
                </p>
                <p>
                  회사의 서비스 개인정보처리방침은 정부의 법률 및 지침의 변경과 당사의 약관 및 내부
                  정책에 따라 변경될 수 있으며 이를 개정하는 경우 회사는 변경사항에 대하여 즉시
                  서비스 화면에 게시합니다.
                </p>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-black">
                2. 개인정보의 수집 및 이용목적
              </h3>
              <div className="space-y-2">
                <p>
                  회사는 서비스를 원활하게 제공하고 더욱 향상된 사용자 경험을 드리기 위해 필요한
                  최소한의 개인정보를 수집합니다. 다음의 목적 이외의 용도로는 이용하지 않습니다.
                </p>
                <ul className="list-disc pl-5">
                  <li>서비스 이용지원</li>
                  <li>이용자 식별 및 인증 기능 제공</li>
                  <li>서비스 개선 및 통계 분석</li>
                  <li>사용성 분석 및 기능 개선</li>
                  <li>오류해결</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-black">
                3. 수집하는 개인정보 항목과 수집방법
              </h3>
              <div className="space-y-3">
                <p>
                  서비스 이용과정에서 회사는 아래와 같이 서비스 제공을 위해 이용자의 동의를 받아
                  입력받은 개인정보를 수집하고 있습니다.
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    <span className="font-semibold text-gray-800">수집 시점 :</span> 출발 역 등록 시
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800">수집 항목 :</span> [필수]이용자
                    이름 및 비밀번호(숫자4자)
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800">수집 및 이용목적 :</span> 이용자
                    구분 및 출발역 수정 권한을 확인
                  </li>
                </ul>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-800">
                    서비스 이용 중 자동 수집 항목
                  </h4>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>
                      <span className="font-semibold">기기 및 접속 환경 정보</span>
                      <ul className="mt-1 list-[circle] pl-5 text-gray-500">
                        <li>기기 정보 : 이용 기기 식별 정보</li>
                        <li>브라우저 및 OS 정보 : 웹 브라우저 종류 및 운영체제 정보</li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-semibold">접속 및 서비스 이용 정보</span>
                      <ul className="mt-1 list-[circle] pl-5 text-gray-500">
                        <li>접속 기록 : 접속 일시, 접속 로그</li>
                        <li>이용 행태 : 서비스 이용 기록</li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-semibold">통계 및 서비스 관리 정보</span>
                      <ul className="mt-1 list-[circle] pl-5 text-gray-500">
                        <li>서비스 이용 정보 : 간단한 사용 통계 정보(방문 페이지, 클릭 기록 등)</li>
                        <li>오류 로그</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-black">
                4. 수집정보의 처리 및 보유기간
              </h3>
              <div className="space-y-3">
                <p>
                  회사는 정보주체로부터 개인정보를 수집할 때 동의 받은 개인정보 보유/이용기간 또는
                  법령에 따른 개인정보 보유/이용기간 내에서 개인정보를 처리/보유합니다. 구체적인
                  개인정보 처리 및 보유 기간은 다음과 같으며, 내부 정책에 따라 필요 기간 동안 보관
                  후 안전하게 파기합니다. (예: 서비스 운영 및 분쟁 대응을 위해 1~3년 범위 내에서
                  설정)
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[300px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="p-2 font-semibold">보유정보</th>
                        <th className="p-2 font-semibold">보유기간</th>
                        <th className="p-2 font-semibold">보유근거</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="p-2">접속에 관한 기록 보존</td>
                        <td className="p-2">최소 3개월</td>
                        <td className="p-2">통신비밀보호법</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-2">소비자의 불만, 분쟁처리에 관한 기록</td>
                        <td className="p-2">3년</td>
                        <td className="p-2">전자상거래 등에서의 소비자보호에 관한 법률</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-black">5. 수집정보의 파기 방법</h3>
              <div className="space-y-3">
                <p>회사는 목적이 달성되었거나 보유 기간이 끝난 개인정보는 지체 없이 파기합니다.</p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[200px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="p-2 font-semibold">종류</th>
                        <th className="p-2 font-semibold">파기 방법</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="p-2">전자적 파일</td>
                        <td className="p-2">복원 불가능한 방식으로 영구 삭제</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-2">종이 문서</td>
                        <td className="p-2">분쇄 또는 소각</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-black">6. 개인정보 제3자 제공</h3>
              <p>
                회사는 원칙적으로 이용자의 개인정보를 제3자에게 판매하거나 무단 제공하지 않습니다.
                다만, 통신비밀보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관계법령에
                따라 행정기관이나 수사기관 등에서 이용자의 데이터 열람이나 제출을 요청하는 경우에는
                이를 제공할 수 있습니다.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-black">
                7. 개인정보의 안전성 확보 조치
              </h3>
              <div className="space-y-2">
                <p>
                  회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적
                  조치를 취하고 있습니다.
                </p>
                <ul className="list-disc pl-5">
                  <li>개인 정보의 암호화</li>
                  <li>정기적 보안 점검</li>
                  <li>접근 통제 및 내부 보안 시스템 운영</li>
                  <li>데이터 최소 수집 및 분리 보관</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-black">
                8. 이용자의 권리(열람, 정정, 삭제 등)와 행사 방법
              </h3>
              <div className="space-y-3">
                <p>
                  정보주체(만 14세 미만인 경우 법정 대리인)는 개인정보 보호법 제35조에 따른
                  개인정보의 열람 청구를 할 수 있습니다.
                </p>
                <p>
                  이용자는 이메일(team.mingling@gmail.com) 통하여 권리행사를 할 수 있으며,
                  개인정보보호법 시행규칙 별지 제8호 서식에 따라 개인정보 열람·정정·삭제·처리정지
                  요구서를 서면, 전자우편을 통해 제출할 수 있습니다.
                </p>
                <div>
                  <p className="mb-1 font-semibold text-gray-800">
                    단, 다음과 같은 경우에는 요청이 제한될 수 있습니다.
                  </p>
                  <ul className="list-disc pl-5">
                    <li>법률에서 보관을 명시적으로 요구하는 정보</li>
                    <li>다른 사람의 권리를 침해할 우려가 있는 경우</li>
                    <li>
                      서비스를 제공하기 위해 꼭 필요한 최소한의 정보로서, 삭제 시 서비스 이용에
                      중대한 장애가 발생하는 경우 등
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-black">9. 쿠키(Cookie) 사용</h3>
              <div className="space-y-3">
                <p>회사는 서비스 이용 편의 및 서비스 개선을 위해 쿠키를 사용할 수 있습니다.</p>
                <p>
                  쿠키에는 이름, 전화번호 등 개인을 식별하는 정보를 저장하지 않으며, 이용자는 쿠키
                  설치에 대한 선택권을 가지고 있습니다. 따라서, 이용자는 웹 브라우저에서 옵션을
                  설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든
                  쿠키의 저장을 거부할 수도 있습니다. 다만, 쿠키 저장을 거부할 경우 맞춤형 서비스
                  이용에 어려움이 발생할 수 있습니다.
                </p>
                <ul className="list-disc pl-5">
                  <li>
                    <span className="font-semibold">Internet Explorer의 경우 :</span> 웹 브라우저
                    상단의 도구 메뉴 &gt; 인터넷 옵션 &gt; 개인정보 &gt; 설정
                  </li>
                  <li>
                    <span className="font-semibold">Chrome의 경우 :</span> 웹 브라우저 우측의 설정
                    메뉴 &gt; 화면 하단의 고급 설정 표시 &gt; 개인정보의 콘텐츠 설정 버튼 &gt; 쿠키
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-black">
                10. 개인정보 보호책임자 및 연락처
              </h3>
              <div className="space-y-2">
                <p>개인정보와 관련된 문의, 불만, 권리 행사는 아래로 연락해주세요.</p>
                <ul className="list-disc pl-5">
                  <li>담당자 : 조민아</li>
                  <li>이메일 : team.mingling@gmail.com</li>
                </ul>
              </div>
            </section>

            <section className="border-t border-gray-100 pt-4">
              <h3 className="mb-2 text-base font-bold text-black">
                11. 개인정보처리방침 변경 안내
              </h3>
              <div className="space-y-2">
                <p>
                  법률이나 서비스의 변경사항을 반영하기 위한 목적 등으로 개인정보처리방침을 수정할
                  수 있습니다. 개인정보처리방침이 변경되는 경우 회사는 변경 사항을 사이트 내
                  게시하며, 변경된 개인정보처리방침은 게시한 날로부터 7일 후부터 효력이 발생합니다.
                  다만, 수집하는 개인정보의 항목, 이용 목적의 변경 등과 같이 이용자 권리의 중대한
                  변경이 발생할 때에는 최소 30일 전에 미리 알려드리겠습니다.
                </p>
                <ul className="mt-2 list-disc pl-5">
                  <li>공고일자 : 2026년 2월 1일</li>
                  <li>시행일자 : 2026년 2월 8일</li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        <DialogFooter className="shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="bg-blue-5 hover:bg-blue-8 w-full cursor-pointer rounded-sm py-3 text-sm font-semibold text-white transition-colors md:w-auto md:px-6"
          >
            확인
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
