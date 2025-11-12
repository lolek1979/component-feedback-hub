'use client';

import { useEffect, useRef } from 'react';

import { TGroupedData } from './utils';

export const useSyncScroll = (suklDataRows: TGroupedData) => {
  const isSyncingScroll = useRef(false);

  useEffect(() => {
    const scrollContainers = document.querySelectorAll<HTMLElement>('[id^="scroll-table-"]');
    if (scrollContainers.length === 0) return;

    const updateScrollbar = (container: HTMLElement, customScrollbar: HTMLElement) => {
      const { scrollWidth, clientWidth, scrollLeft } = container;
      if (scrollWidth <= clientWidth) {
        customScrollbar.style.width = '0px';
        customScrollbar.style.display = 'none';

        return;
      }
      const scrollbarWidth = (clientWidth / scrollWidth) * clientWidth;
      const scrollbarLeft = (scrollLeft / scrollWidth) * clientWidth;
      customScrollbar.style.width = `${scrollbarWidth}px`;
      customScrollbar.style.transform = `translateX(${scrollbarLeft}px)`;
      customScrollbar.style.display = 'block';
    };

    const syncScroll = (target: HTMLElement) => {
      const idSuffix = target.id.replace('scroll-table-', '');
      const customScrollbar = document.getElementById(`custom-scrollbar-${idSuffix}`);
      if (!customScrollbar) return;

      updateScrollbar(target, customScrollbar);

      scrollContainers.forEach((container) => {
        if (container !== target) {
          container.scrollLeft = target.scrollLeft;
          const otherSuffix = container.id.replace('scroll-table-', '');
          const otherScrollbar = document.getElementById(`custom-scrollbar-${otherSuffix}`);
          if (otherScrollbar) updateScrollbar(container, otherScrollbar);
        }
      });
    };
    const initializeScrollbars = () => {
      scrollContainers.forEach((container) => {
        const idSuffix = container.id.replace('scroll-table-', '');
        const customScrollbar = document.getElementById(`custom-scrollbar-${idSuffix}`);
        if (customScrollbar) {
          updateScrollbar(container, customScrollbar);
        }
      });
    };

    const initializeWithDelay = () => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          initializeScrollbars();
        }, 10);
      });
    };

    initializeWithDelay();

    const onScroll = (e: Event) => {
      if (isSyncingScroll.current) return;
      isSyncingScroll.current = true;

      const target = e.target as HTMLElement;
      syncScroll(target);

      isSyncingScroll.current = false;
    };

    scrollContainers.forEach((container) =>
      container.addEventListener('scroll', onScroll, { passive: true }),
    );

    const dragHandlers: Array<{
      customScrollbar: HTMLElement;
      onMouseDown: (e: MouseEvent) => void;
    }> = [];

    scrollContainers.forEach((container) => {
      const idSuffix = container.id.replace('scroll-table-', '');
      const customScrollbar = document.getElementById(`custom-scrollbar-${idSuffix}`);
      if (!customScrollbar) return;

      let isDragging = false;
      let dragStartX = 0;
      let scrollStartLeft = 0;

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStartX;
        const scrollRatio = container.scrollWidth / container.clientWidth;
        container.scrollLeft = scrollStartLeft + deltaX * scrollRatio;
      };

      const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        dragStartX = e.clientX;
        scrollStartLeft = container.scrollLeft;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
      };

      customScrollbar.addEventListener('mousedown', onMouseDown);
      dragHandlers.push({ customScrollbar, onMouseDown });
    });
    const handleResize = () => {
      initializeWithDelay();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      scrollContainers.forEach((container) => container.removeEventListener('scroll', onScroll));
      dragHandlers.forEach(({ customScrollbar, onMouseDown }) => {
        customScrollbar.removeEventListener('mousedown', onMouseDown);
      });
      window.removeEventListener('resize', handleResize);
    };
  }, [suklDataRows]);
};
