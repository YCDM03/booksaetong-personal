import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

interface SliderProps {
  images: string[];
}

const SwiperSlider: React.FC<SliderProps> = ({ images }) => {
  return (
    <Swiper
      pagination={{ clickable: true }}
      modules={[Pagination]}
      slidesPerView={1}
      className="w-full h-full flex justify-center items-center rounded-md"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={image} alt={`slide-${index}`} className="w-full h-full object-cover" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperSlider;
