// Performance optimization utilities

export const lazyLoadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

export const preloadCriticalAssets = async () => {
  // Add preload links for critical assets
  const criticalAssets = [
    { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
    // Add other critical assets here
  ];

  criticalAssets.forEach(({ href, as, type }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  });
};

export const measureCWV = () => {
  if ('web-vital' in window) {
    // @ts-ignore
    webVitals.onCLS(console.log);
    // @ts-ignore
    webVitals.onFID(console.log);
    // @ts-ignore
    webVitals.onLCP(console.log);
  }
};

// Utility to defer non-critical resources
export const deferNonCriticalResources = () => {
  const deferredScripts = document.querySelectorAll('script[data-defer]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const script = entry.target as HTMLScriptElement;
        script.src = script.dataset.src || '';
        observer.unobserve(script);
      }
    });
  });

  deferredScripts.forEach(script => observer.observe(script));
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'production') {
    preloadCriticalAssets();
    measureCWV();
    deferNonCriticalResources();
  }
};
