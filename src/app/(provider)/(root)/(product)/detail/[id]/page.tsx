import React from 'react';

function DetailPage() {
  // const data =

  return (
    <>
      <div className="flex justify-center my-20">
        <div className="rounded-md w-[1440px] h-[480px] border-transparent flex items-center place-content-around shadow-detail">
          <div className="rounded-md w-[500px] h-[400px] border-2 border-black">
            <img className="flex place-self-center" src={''} alt="이미지영역" />
          </div>
          <div className="w-[500px] h-[400px]  items-start border-2 border-black">
            <p className="font-bold text-2xl">제목</p>
            <p className="">판매중</p>
            <p className="font text-[#aaaaaa]">주소</p>
            <p className="my-5">3,500원</p>
            <p>설명을 넣는 곳입니다. 선물 받은 책을 다 읽어서 팝니다. 재미있습니다. 약간 헤짐 있음.</p>
            <p>좋아요</p>
            <p>공유</p>

            <div>
              <img src="" alt="" />
              <p>user.id</p>
              <p>user.address</p>
              <button>글 수정하기</button>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div>소개</div>
        <div>책의 소개글이 들어가는 영역입니다.</div>
      </div>

      <div>
        <div>거래장소</div>
        <div>안양역</div>
        <div>map api 불러오기</div>
      </div>

      <div>
        <div>내 근처 도서</div>
        <div>카드가 들어가는 영역입니다 (swiper)</div>
      </div>

      <div>
        <div>댓글</div>
        <div>입력창</div>
        <div>입력한 창을 보여줍니다.</div>
      </div>
    </>
  );
}

export default DetailPage;
