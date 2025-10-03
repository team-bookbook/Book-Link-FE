function TermsOfService() {
  return (
    <div className='flex-col gap-[4rem] px-[2.6rem] py-[4rem] text-left'>
      <h1 className='title4'>서비스 이용약관</h1>
      <p className='body4 whitespace-pre-line text-gray-900'>
        {`
본 이용약관은 BookLink 서비스의 이용과 관련하여 사용자와 BookLink 간의 권리, 의무 및 책임사항을 규정합니다.

1. 서비스 목적: 사용자의 전시 감상 경험 향상 및 정보 제공
2. 이용 조건: 회원가입 후 본 서비스 이용 가능
3. 금지 사항: 타인의 권리 침해, 서비스 악용, 불법 콘텐츠 업로드 등
4. 책임 제한: 서비스 오류로 인한 손해에 대해 Team 북북은 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.
5. 약관 변경: Team 북북은 필요 시 본 약관을 수정할 수 있으며, 변경사항은 공지 후 적용됩니다.

보다 나은 서비스를 위해 항상 노력하겠습니다.
        `}
      </p>
    </div>
  );
}

export default TermsOfService;
