function PrivacyPage() {
  return (
    <div className='flex-col gap-[4rem] px-[2.6rem] py-[4rem] text-left'>
      <h1 className='title4'>개인정보 처리방침</h1>
      <p className='body4 whitespace-pre-line text-gray-900'>
        {`
BookLink는 이용자의 개인정보를 소중히 여기며, 관련 법령에 따라 아래와 같이 처리하고 있습니다.

1. 수집 항목: 이름, 이메일, 서비스 이용기록 등
2. 수집 목적: 서비스 제공, 문의 응대, 통계 분석 등
3. 보관 기간: 회원 탈퇴 시까지 또는 법령이 정한 보관 기간
4. 제3자 제공: 없음
5. 개인정보 보호책임자: booklink@gmail.com

자세한 사항은 고객센터를 통해 문의 바랍니다.
        `}
      </p>
    </div>
  );
}

export default PrivacyPage;
