import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import type { PictureImage } from '@/types/image';

interface Slide {
  imageUrl: PictureImage;
  link: string;
}

export interface HeroBannerProps {
  slides: Slide[];
  autoSlideInterval?: number;
}

export default function HeroBanner({
  slides,
  autoSlideInterval = 3000,
}: HeroBannerProps) {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: autoSlideInterval,
    arrows: true,
    pauseOnHover: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: false,
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-2 w-full pointer-events-none">
        <ul className="flex justify-center">{dots}</ul>
      </div>
    ),
  };

  return (
    <div className="relative w-full aspect-16/8 overflow-hidden">
      <Slider {...settings} className="h-full">
        {slides.map((slide) => (
          <div key={slide.imageUrl.toString()} className="w-full h-full cursor-pointer" onClick={() => navigate(slide.link ?? '/')}>
            <picture>
              <source srcSet={slide.imageUrl.sources.avif} type="image/avif" />
              <source srcSet={slide.imageUrl.sources.webp} type="image/webp" />
              <img
                src={slide.imageUrl.img.src}
                alt="이미지"
                width={slide.imageUrl.img.w}
                height={slide.imageUrl.img.h}
                className="w-full h-full object-contain object-center"
              />
            </picture>
          </div>
        ))}
      </Slider>
    </div>
  );
}

