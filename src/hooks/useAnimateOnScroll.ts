import { useEffect, useRef, useState } from 'react';

interface UseAnimateOnScrollOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useAnimateOnScroll(options: UseAnimateOnScrollOptions = {}) {
  const { triggerOnce = true, ...observerInit } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const currentElement = ref.current;
    if (!currentElement) return;

    // Use a conservative threshold so animations trigger as soon as the element starts entering the screen
    const defaultOptions: IntersectionObserverInit = {
      threshold: 0.05,
      rootMargin: '0px 0px -80px 0px',
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (triggerOnce) {
          observer.unobserve(currentElement);
        }
      } else if (!triggerOnce) {
        setIsInView(false);
      }
    }, { ...defaultOptions, ...observerInit });

    observer.observe(currentElement);

    return () => {
      if (currentElement && !triggerOnce) {
        observer.unobserve(currentElement);
      }
    };
  }, [triggerOnce, JSON.stringify(observerInit)]);

  return { ref, isInView };
}
