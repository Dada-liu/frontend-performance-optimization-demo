import { useState, useRef, useEffect, useMemo } from 'react';
import useNetworkType from '../hooks/useNetworkType';

const IMAGE_SIZES = {
  small: { w: 200, h: 150 },
  medium: { w: 400, h: 300 },
  large: { w: 750, h: 563 },
};

function getImageUrl(seed, size) {
  const { w, h } = IMAGE_SIZES[size];
  return `https://picsum.photos/${w}/${h}?random=${seed}`;
}

export default function ResponsiveImage({ seed, alt, threshold = 200, isScrolling = false }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);
  const networkType = useNetworkType();
  const isScrollingRef = useRef(isScrolling);
  isScrollingRef.current = isScrolling;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isScrollingRef.current) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${threshold}px` }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  // 滚动停止后，重新检查未加载的图片
  useEffect(() => {
    if (!isScrolling && !inView && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight + threshold && rect.bottom > -threshold) {
        setInView(true);
      }
    }
  }, [isScrolling, inView, threshold]);

  // 根据网络类型决定加载的图片分辨率
  // fast (WiFi) → large, medium (4G) → medium, slow (2G/3G) → small
  // 已经加载的图片不能因为网速变化重新加载
  const quality = useMemo(() => {
    return networkType === 'fast' ? 'large' : networkType === 'medium' ? 'medium' : 'small';
  }, [inView])

  return (
    <div ref={containerRef} className={`responsive-image${loaded ? ' loaded' : ''}`}>
      {!loaded && <div className="image-placeholder" />}
      {inView && (
        <picture>
          {/* 移动端小屏 */}
          <source
            media="(max-width: 480px)"
            srcSet={`${getImageUrl(seed, 'small')} 1x, ${getImageUrl(seed, 'medium')} 2x`}
          />
          {/* 平板中屏 */}
          <source
            media="(max-width: 768px)"
            srcSet={`${getImageUrl(seed, 'medium')} 1x, ${getImageUrl(seed, 'large')} 2x`}
          />
          {/* 桌面大屏 */}
          <source
            media="(min-width: 769px)"
            srcSet={`${getImageUrl(seed, 'large')} 1x, ${getImageUrl(seed, quality === 'fast' ? 'large' : 'medium')} 2x`}
          />
          <img
            src={getImageUrl(seed, quality)}
            alt={alt}
            onLoad={() => setLoaded(true)}
          />
        </picture>
      )}
    </div>
  );
}
