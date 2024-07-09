import HeaderButton from './HeaderButton';

function Header() {
  return (
    <header className="flex flex-row w-full h-[70px] shadow-lg shadow-gray-100">
      <h1>북새통</h1>
      <nav>
        <ul className="flex">
          <li>전체도서목록</li>
          <li>내 근처 도서</li>
          <li>장르별 도서</li>
          <li>마이페이지</li>
        </ul>
      </nav>
      <div>
        <input type="text" />
        <HeaderButton intent="default">로그인</HeaderButton>
      </div>
    </header>
  );
}

export default Header;
