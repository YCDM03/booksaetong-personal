'use client';

import Swiper from 'swiper';
import { SwiperSlide, Pagination, Navigation } from 'swiper/react';

function Slider({ postImage }) {
  return (
    <div>
      <Swiper
        slidesPerView={1}
        pagination={{
          clickable: true
        }}
        navigation={{
          prevEl: '.custom-prev',
          nextEl: '.custom-next'
        }}
        modules={[Pagination, Navigation]}
      >
        {postImage.map((image, i) => (
          <SwiperSlide key={i}>
            <img src={image} />
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="custom-prev" />
      <button className="custom-next" />
    </div>
  );
}

export default Slider;
