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

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        // 모바일에서는 꽉 차게, 데스크탑에서는 적절한 너비로 설정
        // max-h-[80vh]로 높이 제한을 두어 스크롤 영역 확보
        className="flex max-h-[85vh] w-[calc(100%-40px)] max-w-lg flex-col gap-6 rounded bg-white px-6 py-5 md:max-w-xl"
      >
        <DialogHeader className="shrink-0 text-left">
          <DialogTitle className="text-[20px] font-bold text-black md:text-[22px]">
            서비스 이용약관
          </DialogTitle>
          <DialogDescription className="sr-only">
            밍글링 서비스 이용약관 전문입니다.
          </DialogDescription>
        </DialogHeader>

        {/* 약관 본문 영역 (스크롤 적용) */}
        <div className="flex-1 overflow-y-auto border-y border-gray-100 py-4 pr-2 text-sm leading-relaxed text-gray-600">
          <div className="space-y-6">
            <section>
              <h3 className="mb-2 text-base font-bold text-black">제 1장 총칙</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800">제1조(목적)</h4>
                  <p>
                    이 약관은 밍글링(이하 “회사”라 함)이 제공하는 서비스와 관련하여 회사와 이용 고객
                    간의 서비스 이용 조건 및 절차, 권리, 의무 및 책임사항, 기타 필요한 사항을
                    규정함을 목적으로 합니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">제 2조 (약관의 효력 및 변경)</h4>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>
                      회사는 이 약관의 내용을 이용자가 쉽게 열람할 수 있도록 서비스 내 화면에
                      게시합니다.
                    </li>
                    <li>
                      본 약관은 이용자가 쉽게 알 수 있도록 서비스 내 또는 연결화면을 통하여
                      게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
                    </li>
                    <li>본 약관은 서비스 이용기간 동안만 유효합니다.</li>
                    <li>
                      회사는 약관의 규제에 관한 법률, 정보통신망 이용촉진 및 정보보호 등에 관한 법률
                      등 관계법령에 위배되지 않는 범위 내에서 본 약관을 개정할 수 있습니다.
                    </li>
                    <li>
                      회사가 제3항에 따라 개정약관을 공지 또는 통지하였음에도 불구하고 이용자가
                      명시적으로 거부의사를 표시하지 아니하는 경우, 이용자가 개정약관에 동의한
                      것으로 봅니다.
                    </li>
                    <li>
                      본 약관에 동의하는 것은 서비스를 정기적으로 방문하여 약관의 변경사항을
                      확인하는 것에 동의함을 의미합니다. 변경된 약관에 대한 정보를 알지 못하여
                      발생하는 이용자의 피해에 대하여 회사는 책임을 지지 않습니다.
                    </li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">제3조(용어의 정의)</h4>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>
                      본 약관에서 사용하는 용어의 정의는 다음과 같습니다. 정의되지 않은 용어에 대한
                      해석은 관계법령 및 서비스 별 안내에서 정하는 바에 따릅니다.
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        <li>
                          밍글링 서비스(이하 “서비스”라 함) : 회사가 제공하는 ‘밍글링’ 웹
                          어플리케이션을 통하여 여러 사람들의 중간위치를 찾아 조율에 도움을 주는
                          회사가 제공하는 웹 서비스를 말합니다.
                        </li>
                        <li>
                          이용자 : 본 약관에 동의하고 서비스에 접속하여 서비스를 이용하는 자를
                          말합니다.
                        </li>
                        <li>
                          이용자 이름 : 이용자의 식별과 본 서비스 이용을 위하여 이용자가 선정하고,
                          서비스가 승인하는 문자와 숫자, 또는 특수 문자의 조합을 의미합니다.
                        </li>
                        <li>
                          이용자 비밀번호 : 이용자의 확인과 본 서비스 이용을 위하여 이용자가
                          선정하고, 서비스가 승인하는 숫자4자리의 조합을 의미합니다.
                        </li>
                        <li>모임 이름 : 이용자가 입력 및 선정한 모임의 이름을 의미합니다.</li>
                        <li>모임 목적 : 서비스에서 제공하는 모임의 목적 선택지를 의미합니다.</li>
                        <li>
                          출발역 : 정보 확인이 이루어진 이용자에 한해, 검색 및 등록할 수 있는 지하철
                          역을 의미합니다.
                        </li>
                        <li>
                          중간 위치 : 이용자가 입력한 출발 역이 2개 이상일 때, 서비스에서 제공하는
                          중간 지하철 역을 의미합니다.
                        </li>
                      </ul>
                    </li>
                    <li>
                      본 조 제1항에서 정의되지 않은 이 약관상의 용어는 일반적인 거래관행에 의합니다.
                    </li>
                    <li>
                      본 약관의 내용 해석 상의 이견이 있을 경우에는 일반상관습에서 따르기로 합니다.
                    </li>
                  </ol>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-black">제 2장 서비스 이용계약</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800">제 4조 (이용계약의 성립)</h4>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>
                      이용계약은 이용자가 이 약관에 동의하고, 회사가 정한 방법(예: 이용자 이름,
                      이용자 비밀번호 입력, 모임 이름, 모임 목적 등)에 따라 정보를 기입하는 방식으로
                      이루어집니다.
                    </li>
                    <li>
                      회사는 이용자의 정보 기입에 대하여 서비스 이용을 승낙함을 원칙으로 합니다.
                      다만, 회사는 다음 각 호에 해당하는 사례에 대하여는 승낙을 하지 않거나 사후에
                      이용계약을 해지할 수 있습니다.
                      <ul className="mt-1 list-disc pl-5">
                        <li>
                          형법에서 규정한 범죄 행위 혹은 미풍양속을 저해하는 부적절한 행위를 할
                          우려가 있는 등 서비스를 정상적으로 이용할 수 없다고 합리적으로 판단되는
                          경우
                        </li>
                        <li>기타 회사의 사정으로 이용 승낙이 곤란한 경우</li>
                      </ul>
                    </li>
                    <li>
                      회사는 서비스 설비 여유, 기술상·업무상 사정 등에 따라 서비스 이용을 유보할 수
                      있습니다.
                    </li>
                  </ol>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-black">제 3장 서비스 이용</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800">제 5조 (서비스 내용)</h4>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>
                      회사는 이용자에게 다음과 같은 서비스를 제공합니다.
                      <ul className="mt-1 list-disc pl-5">
                        <li>
                          전용 모임 웹페이지 : 이용자가 모임 이름, 모임 목적을 등록한 웹페이지를
                          다른 이용자에게 공유할 수 있는 온라인 상의 페이지
                        </li>
                        <li>이용자 이름, 비밀번호 등록 기능</li>
                        <li>출발역 등록 기능</li>
                        <li>중간지점 산출 기능</li>
                        <li>그 외 서비스가 제공하는 부가 기능</li>
                      </ul>
                    </li>
                    <li>
                      회사는 서비스의 운영상, 기술상 필요에 따라 서비스의 내용을 변경하거나 추가 및
                      삭제 할 수 있습니다. 이 경우 변경 내용과 적용 일시는 사전에 공지합니다. 다만,
                      버그 수정, 보안 패치 등 긴급한 경우에는 사후에 통지할 수 있습니다.
                    </li>
                    <li>
                      서비스의 이용은 연중무휴 1일 24시간을 원칙으로 합니다. 다만, 회사의 업무상,
                      기술상 또는 서비스 운영정책상 서비스가 일시 중지될 수 있습니다. 이러한 경우
                      회사는 사전 또는 사후에 이를 공지합니다.
                    </li>
                    <li>
                      회사의 서비스를 통해 취득한 이용자 구분이 가능한 개인정보는 사전에 고지한
                      목적으로만 사용하고, 고지한 목적이 달성 되면 사전 고지한 보유 기간 내
                      파기합니다.
                    </li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">제 6조 (서비스의 변경 및 중단)</h4>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>
                      회사는 경영상, 운영상 또는 기술상의 필요에 따라 서비스의 전부 또는 일부를
                      수정·변경할 수 있습니다.
                    </li>
                    <li>
                      회사는 다음 각 호 중 어느 하나에 해당하는 사유가 발생하는 경우, 서비스의 전부
                      또는 일부를 제한하거나 중지할 수 있습니다.
                      <ul className="mt-1 list-disc pl-5">
                        <li>
                          서비스 제공을 위한 제휴 업체(클라우드 등)와의 계약 종료, 기술적 지원 중단
                          등으로 기존과 동일한 서비스를 유지하기 어려운 경우
                        </li>
                        <li>
                          기타 천재지변, 국가비상사태 등 원할한 서비스 제공이 어려운 불가항력적
                          사유가 있는 경우
                        </li>
                        <li>
                          정전, 제반 설비의 장애 또는 이용량의 폭주 등으로 정상적인 서비스 이용에
                          지장이 있는 경우
                        </li>
                        <li>
                          관련 법령의 제/개정, 행정 사법 당국의 명령, 권고 등으로 서비스의 전부 또는
                          일부를 제공할 수 없게 된 경우
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-base font-bold text-black">
                제 4장 서비스 이용의 책임과 의무
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800">제 7조 (회사의 의무)</h4>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>
                      회사는 제공하는 서비스가 안정적이고 원활히 제공될 수 있도록 시스템 운영 및
                      관리에 최선을 다하며, 장애가 발생한 경우 지체 없이 이를 수리 복구할 수 있도록
                      노력합니다.
                    </li>
                    <li>
                      회사는 이용자의 정보를 보호하기 위해 “개인정보처리방침”을 공지하고 준수합니다.
                      또한, “개인정보처리방침”에 따라 이용자 정보를 처리함에 있어 안정성 확보에
                      필요한 기술적 및 관리적 대책을 수립ㆍ운영합니다.
                    </li>
                    <li>
                      회사는 이용자로부터 제기된 의견이나 불만이 정당하다고 판단되는 경우, 이를
                      신속하게 처리하기 위해 노력합니다. 즉시 처리가 곤란한 경우에는 처리 일정 및
                      사유를 이용자에게 안내합니다.
                    </li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">제 8조 (이용자의 의무)</h4>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>
                      이용자는 본 약관 및 관계 법령, 회사가 서비스 이용과 관련하여 이용자에게
                      통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를
                      하여서는 아니 됩니다.
                    </li>
                    <li>
                      이용자는 다음 각 호에 해당하는 행위를 해서는 안 되며, 위반 시 회사는 서비스
                      이용 제한, 데이터 삭제 등의 조치를 취할 수 있습니다.
                      <ul className="mt-1 list-disc pl-5">
                        <li>회사 또는 제3자의 지식재산권, 개인정보, 기타 권리 침해</li>
                        <li>회사 또는 제3자의 명예 훼손 및 업무방해</li>
                        <li>
                          서비스 운영을 방해하는 행위(과도한 트래픽 유발, 비정상적 접근 시도 등)
                        </li>
                        <li>회사의 동의 없는 영리 목적의 서비스 이용</li>
                        <li>기타 불법하고 부당한 행위</li>
                        <li>기타 서비스의 운영정책에 위배되는 모든 행위</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">제 9조 (지식재산권)</h4>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>
                      서비스와 관련된 소프트웨어, 디자인, UI/UX, 문서, 로고, 상표, 회사가 제작한
                      콘텐츠 등에 대한 지식재산권은 회사에 귀속됩니다.
                    </li>
                    <li>
                      이용자는 회사의 사전 서면 동의 없이 서비스의 일부분 또는 전부를 복제, 수정,
                      배포, 판매, 공개, 2차적 저작물 작성 등으로 이용할 수 없습니다.
                    </li>
                    <li>
                      이용자가 서비스 내에 업로드한 데이터에 대한 권리는 원칙적으로 이용자에게
                      귀속되나, 서비스 제공 및 품질 개선, 기술 연구를 위해 필요한 범위 내에서 회사가
                      비식별화, 통계화하여 활용할 수 있습니다.
                    </li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    제 10조 (개인정보의 수집과 보호 및 이용)
                  </h4>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>
                      회사는 적법하고 공정한 수단에 의하여 이용계약의 성립 및 이행에 필요한 최소한의
                      범위 내에서 개인정보처리방침에 따라 이용자의 정보를 수집하며 보호하기 위해
                      노력합니다.
                    </li>
                    <li>
                      회사는 회사가 수집한 이용자 정보를 수집 목적 외의 용도로 사용하거나 당해
                      이용자의 동의 없이 3자에게 제공하지 않습니다. 다만, 통신비밀보호법, 정보통신망
                      이용촉진 및 정보보호 등에 관한 법률 등 관계법령에 따라 행정기관이나 수사기관
                      등에서 이용자의 데이터 열람이나 제출을 요청하는 경우에는 이를 제공할 수
                      있습니다.
                    </li>
                    <li>
                      회사는 이용자의 귀책사유로 인해 노출된 이용자 정보에 대해서 일체의 책임을
                      부담하지 않습니다.
                    </li>
                    <li>
                      회사는 이용자 정보의 보호와 관리에 관한 개인정보처리방침을 서비스 이용자가 알
                      수 있도록 회사가 운영하는 서비스에 “개인정보처리방침”이라는 이름으로
                      공개합니다.
                    </li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">제 11조 (데이터의 보존 및 삭제)</h4>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>
                      회사는 서비스 제공 및 법령 준수를 위해 필요한 범위에서 이용자의 데이터를
                      보관합니다.
                    </li>
                    <li>
                      이용자가 데이터 삭제를 요청하는 경우, 회사는 관련 법령 및 개인정보처리방침에
                      따라 데이터 삭제를 진행합니다.
                    </li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    제 12조 (웹 페이지의 관리 및 귀속)
                  </h4>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>
                      이용자가 서비스에서 생성한 모임 웹페이지에 관한 권리와 책임은 웹 페이지를
                      생성한 이용자에게 있습니다. 회사는 이용자가 생성한 웹 페이지에 대하여 서비스
                      내의 생성권을 가지며, 이용자 동의 없이 이를 영리적인 목적으로 사용하지
                      않습니다.
                    </li>
                    <li>
                      회사는 제8조의 의무를 위반하는 내용을 담고 있는 웹 페이지에 대하여 수정 또는
                      삭제할 권한을 갖습니다.
                    </li>
                    <li>
                      본 약관을 통해 회사는 이용자에게 서비스에 대한 사용권만을 부여하며, 회사가
                      제공하는 서비스에 관한 소유권 및 지식재산권은 회사에 귀속됩니다.
                    </li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">제 13조 (서비스의 면책)</h4>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>
                      회사는 천재지변, 전쟁, 테러, 화재, 정전, 통신망 장애, 클라우드 서비스 장애 등
                      불가항력적인 사유로 인하여 서비스를 제공할 수 없는 경우 그 책임을 부담하지
                      않습니다.
                    </li>
                    <li>
                      회사는 이용자의 웹페이지를 생성하기 전에 사전심사 하거나 상시적으로 웹페이지의
                      내용을 확인 또는 검토하여야 할 의무가 없으며, 그 결과에 대한 책임을 지지
                      않습니다.
                    </li>
                    <li>
                      회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지
                      않습니다.
                    </li>
                    <li>
                      이용자가 자신의 개인정보를 타인에게 유출 또는 제공함으로써, 발생하는 피해에
                      대해서 회사는 일절 책임을 지지 않습니다.
                    </li>
                    <li>
                      회사는 이용자 상호 간 또는 이용자와 제3자(외부 서비스 제공자 등) 간에 발생한
                      분쟁에 개입하지 않으며, 이로 인한 손해에 대하여 책임을 지지 않습니다.
                    </li>
                    <li>
                      회사는 서비스에서 제공되는 정보의 정확성, 신뢰성, 완전성을 확보하기 위해
                      노력하지만, 이용자가 이를 신뢰하여 발생한 손해에 대하여 법령이 허용하는 범위
                      내에서 책임이 제한될 수 있습니다.
                    </li>
                  </ol>
                </div>
              </div>
            </section>

            <section className="border-t border-gray-100 pt-4">
              <h3 className="mb-2 text-base font-bold text-black">부칙</h3>
              <p>본 약관은 2026년 2월 8일부터 시행합니다.</p>
              <ul className="mt-1 list-disc pl-5">
                <li>공고일자 : 2026년 2월 1일</li>
                <li>시행일자 : 2026년 2월 8일</li>
              </ul>
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
