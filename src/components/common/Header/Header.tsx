import HeaderButton from './HeaderButton';

function Header() {
  return (
    <header className="flex flex-row items-center justify-between w-full h-[70px] px-60 shadow-lg shadow-gray-100">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold cursor-pointer">북새통</h1>
        <nav>
          <ul className="flex ml-20 cursor-pointer text-sm text-gray-600 gap-8">
            <li>전체도서목록</li>
            <li>내 근처 도서</li>
            <li>장르별 도서</li>
            <li>마이페이지</li>
          </ul>
        </nav>
      </div>
      <div className="flex gap-x-3">
        <input
          type="text"
          placeholder="지역 or 책 이름을 검색해보세요"
          className="w-[300px] h-fit py-2 px-4 rounded-md border text-sm focus:outline-none"
        />
        <HeaderButton intent="signUp">회원가입</HeaderButton>
        <HeaderButton intent="login">로그인</HeaderButton>
      </div>
    </header>
  );
}

export default Header;
