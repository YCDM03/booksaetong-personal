import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';

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
        <SwiperSlide key={index} className="relative">
          <Image src={image} alt={`slide-${index}`} fill className="w-full h-full object-contain" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperSlider;
