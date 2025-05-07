import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export interface HeroBannerProps {
  slides: Array<{ imageUrl: string; text: string }>;
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
    <div className="relative w-full h-48 md:h-64 overflow-hidden">
      <Slider {...settings}>
        {slides.map((slide, idx) => (
          <div key={idx} className="w-full h-48 md:h-64">
            <img
              src={slide.imageUrl}
              alt={slide.text}
              className="w-full h-full object-cover"
            />
            {/* 텍스트 오버레이 */}
            <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center">
              <p className="text-white text-lg md:text-2xl font-semibold text-center px-4">
                {slide.text}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

