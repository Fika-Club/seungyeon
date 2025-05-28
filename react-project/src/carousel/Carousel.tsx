import {
  createContext,
  useContext,
  useState,
  Children,
  type ReactNode,
  isValidElement,
  cloneElement,
} from 'react';
import './Carousel.css';

type CarouselContextType = {
  index: number;
  setIndex: (i: number) => void;
  total: number;
};

/**
 * 캐러셀 컨텍스트
 * - 캐러셀의 현재 인덱스와 총 슬라이드 수를 저장
 * - 캐러셀 내부에서 사용되며, 캐러셀 컴포넌트의 자식 요소에서 접근 가능
 */
const CarouselContext = createContext<CarouselContextType | null>(null);

/**
 * 캐러셀 컴포넌트
 * - 캐러셀의 현재 인덱스와 총 슬라이드 수를 관리
 * - 캐러셀 내부에서 사용되며, 캐러셀 컴포넌트의 자식 요소에서 접근 가능
 */
export function Carousel({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  // Find the Slides child and count its children as slides
  let total = 0;
  Children.forEach(children, (child) => {
    if (
      isValidElement(child) &&
      (child.type === CarouselSlides || (typeof child.type === 'function' && child.type.name === 'CarouselSlides')) &&
      (child as { props: { children: ReactNode } }).props.children
    ) {
      total = Children.count((child as { props: { children: ReactNode } }).props.children);
    }
  });
  return (
    <CarouselContext.Provider value={{ index, setIndex, total }}>
      <div className="carousel">{children}</div>
    </CarouselContext.Provider>
  );
}

/**
 * 캐러셀 슬라이드 컴포넌트
 * - 캐러셀의 슬라이드 목록을 관리
 * - 캐러셀 내부에서 사용되며, 캐러셀 컴포넌트의 자식 요소에서 접근 가능
 */
function CarouselSlides({ children }: { children: ReactNode }) {
  const context = useContext(CarouselContext);
  if (!context) throw new Error('CarouselSlides must be used within Carousel');
  const { index } = context;
  const slides = Children.toArray(children);
  return (
    <div className="carousel-slides">
      {slides.map((child, i) =>
        isValidElement(child) && child.type === CarouselSlide
          ? cloneElement(child, { active: i === index } as { active?: boolean })
          : null
      )}
    </div>
  );
}

/**
 * 캐러셀 슬라이드 컴포넌트
 * - 캐러셀의 슬라이드 목록을 관리
 * - 캐러셀 내부에서 사용되며, 캐러셀 컴포넌트의 자식 요소에서 접근 가능
 */
function CarouselSlide({
  children,
  active,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className="carousel-slide"
      style={{ display: active ? 'block' : 'none' }}
    >
      {children}
    </div>
  );
}

/**
 * 캐러셀 이전 버튼 컴포넌트
 * - 캐러셀의 이전 슬라이드로 이동
 * - 캐러셀 내부에서 사용되며, 캐러셀 컴포넌트의 자식 요소에서 접근 가능
 */
function CarouselPrev() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error('CarouselPrev must be used within Carousel');
  const { index, setIndex, total } = context;
  return (
    <button
      className="nav prev"
      onClick={() => setIndex((index - 1 + total) % total)}
      aria-label="Previous Slide"
    >
      ‹
    </button>
  );
}

/**
 * 캐러셀 다음 버튼 컴포넌트
 * - 캐러셀의 다음 슬라이드로 이동
 * - 캐러셀 내부에서 사용되며, 캐러셀 컴포넌트의 자식 요소에서 접근 가능
 */
function CarouselNext() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error('CarouselNext must be used within Carousel');
  const { index, setIndex, total } = context;
  return (
    <button
      className="nav next"
      onClick={() => setIndex((index + 1) % total)}
      aria-label="Next Slide"
    >
      ›
    </button>
  );
}

/**
 * 캐러셀 인디케이터 컴포넌트
 * - 캐러셀의 슬라이드 인덱스를 표시
 * - 캐러셀 내부에서 사용되며, 캐러셀 컴포넌트의 자식 요소에서 접근 가능
 */
function CarouselIndicators() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error('CarouselIndicators must be used within Carousel');
  const { index, setIndex, total } = context;
  return (
    <div className="carousel-indicators">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={i === index ? 'dot active' : 'dot'}
          onClick={() => setIndex(i)}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

// Attach compound components
Carousel.Slides = CarouselSlides;
Carousel.Slide = CarouselSlide;
Carousel.Prev = CarouselPrev;
Carousel.Next = CarouselNext;
Carousel.Indicators = CarouselIndicators;

export default Carousel;