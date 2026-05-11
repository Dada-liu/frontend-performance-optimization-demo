import { useState, useRef, useEffect } from 'react';
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

export default function ResponsiveImage({ seed, alt, threshold = 200 }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);
  const networkType = useNetworkType();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${threshold}px` }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  // 根据网络类型决定加载的图片分辨率
  // fast (WiFi) → large, medium (4G) → medium, slow (2G/3G) → small
  const quality = networkType === 'fast' ? 'large' : networkType === 'medium' ? 'medium' : 'small';

  return (
    <div ref={containerRef} className={`responsive-image${loaded ? ' loaded' : ''}`}>
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
      {!loaded && <div className="image-placeholder" />}
    </div>
  );
}
