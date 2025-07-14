import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

export interface HeroBannerProps {
  slides: Array<{ imageUrl: string; link: string;}>;
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
          <div key={slide.imageUrl} className="w-full h-full" onClick={() => navigate(slide.link ?? '/')}>
            <img
              src={slide.imageUrl}
              alt={'이미지'}
              width={574}
              height={287}
              className="w-full h-full object-contain object-center"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

