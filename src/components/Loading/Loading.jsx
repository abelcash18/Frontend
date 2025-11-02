import React, { useEffect } from 'react';
import './loading.scss';
import image from '../../../public/Lottie Lego.gif';

// Ensure lottie-player script is loaded (from CDN) so <lottie-player> custom element works
function animation() {
  if (window.__lottiePlayerLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    if (document.querySelector('script[data-lottie-player]')) {
      window.__lottiePlayerLoaded = true;
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.setAttribute('data-lottie-player', 'true');
    // Use a specific, known stable version to avoid regressions in @latest
    s.src = 'https://unpkg.com/@lottiefiles/lottie-player@1.5.7/dist/lottie-player.js';
    s.async = true;
    s.onload = () => {
      window.__lottiePlayerLoaded = true; resolve();
    };
    s.onerror = () => {     
      window.__lottiePlayerLoaded = false;
      resolve();
    };
    document.head.appendChild(s);
  });
}

const Loading = ({ src, className, size = 24 }) => {
  useEffect(() => {
    animation();
  }, []);

  const style = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
  };

  // If src is not set, use default
  const defaultSrc =
    'https://lottie.host/7372562d-14ba-4033-8cc6-ae25e435f0a8/F1XCuE7sni.lottie';

  const [localSrc, setLocalSrc] = React.useState(image || defaultSrc);

  React.useEffect(() => {
    let cancelled = false;
    let objectUrl = null;
    const fetchSrc = async () => {
      const toFetch = src || defaultSrc;

      // If it's already a blob/data URL or starts with 'http' we'll fetch; if it's a blob we can use it directly
      if (!toFetch || toFetch.startsWith('blob:') || toFetch.startsWith('data:')) {
        setLocalSrc(toFetch);
        return;
      }

      try {
        const controller = new AbortController();
        const res = await fetch(toFetch, { signal: controller.signal });
        // Always read as text to avoid xhr.responseType issues in downstream code
        const text = await res.text();
        const blob = new Blob([text], { type: 'application/json' });
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) setLocalSrc(objectUrl);
      } catch (err) {
        console.error('Failed to fetch lottie animation, falling back to remote URL', err);
        if (!cancelled) setLocalSrc(toFetch);
      }
      return () => {
        cancelled = true;
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    };
    fetchSrc();
    return () => {
      cancelled = true;
      if (localSrc && localSrc.startsWith('blob:')) URL.revokeObjectURL(localSrc);
      if (animation && animation.__complete) {
        animation.__complete();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  return (
    <div className={className || 'loadingWrapper'} style={style}>
      {/* lottie-player is provided by the CDN script loaded by ensureLottiePlayer */}
      <lottie-player
        src={image}
        background="transparent"
        speed="1"
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      ></lottie-player>
    <div id="lottie-container"></div>
    </div>

  );
};

export default Loading;
