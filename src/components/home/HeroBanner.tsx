import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export interface HeroBannerProps {
  slides: Array<{ imageUrl: string; }>;
  autoSlideInterval?: number;
}

export default function HeroBanner({
  slides,
  autoSlideInterval = 3000,
}: HeroBannerProps) {
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
        <ul className="flex justify-center pointer-events-auto">{dots}</ul>
      </div>
    ),
  };

  return (
    <div className="relative w-full aspect-16/8 overflow-hidden">
      <Slider {...settings} className="h-full">
        {slides.map((slide, idx) => (
          <div key={idx} className="w-full h-full">
            <img
              src={slide.imageUrl}
              alt={'이미지'}
              className="w-full h-full object-contain object-center"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
