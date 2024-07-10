import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';

interface SliderProps {
  images: string[];
}

const SwiperSlider: React.FC<SliderProps> = ({ images }) => {
  return (
    <Swiper pagination={{ clickable: true }} navigation={true} modules={[Pagination, Navigation]} slidesPerView={1}>
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={image} alt={`slide-${index}`} className="w-full h-full object-fit" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperSlider;
