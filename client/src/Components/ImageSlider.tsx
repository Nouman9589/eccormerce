import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80',
    title: 'Fashion Collection',
    subtitle: 'New Arrivals for Spring 2024'
  },
  {
    url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80',
    title: 'Lifestyle Essentials',
    subtitle: 'Curated Selection of Premium Products'
  },
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80',
    title: 'Accessories Collection',
    subtitle: 'Complete Your Look'
  }
];

function ImageSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
    const goToNext = useCallback(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, []);
  
    const goToPrevious = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
      );
    };
  
    const goToSlide = (index: number) => {
      setCurrentIndex(index);
    };
  
    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isAutoPlaying) {
        interval = setInterval(goToNext, 5000);
      }
      return () => clearInterval(interval);
    }, [isAutoPlaying, goToNext]);
  
    return (
      <div className="w-full min-h-auto my-6 flex items-center justify-center px-4 relative z-10">
        <div className="w-full relative z-20">
          <div
            className="h-[600px] w-full relative overflow-hidden shadow-2xl rounded-2xl z-30"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div
              className="flex w-full h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0 relative bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.url})`,
                    width: '100%',
                    flexBasis: '100%',
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4 z-10">
                    <h2 className="text-5xl font-bold mb-4 tracking-wider drop-shadow-lg">{slide.title}</h2>
                    <p className="text-xl opacity-90 drop-shadow-md">{slide.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Navigation Buttons with High Z-Index */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg z-50"
              style={{ zIndex: 9999 }}
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg z-50"
              style={{ zIndex: 9999 }}
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
  
            {/* Dot Navigation with High Z-Index */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50" style={{ zIndex: 9999 }}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-white scale-125 shadow-lg'
                      : 'bg-white/50 hover:bg-white/75 hover:scale-110'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default ImageSlider;
  