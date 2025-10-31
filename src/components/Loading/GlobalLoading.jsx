import  { useEffect, useState } from 'react';
import Loading from './Loading';
import './loading.scss';
import image from '../../../public/Lottie Lego.gif';

const GlobalLoading = ({ src = image, size = 160 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      const val = e?.detail?.loading;
      setVisible(Boolean(val));
    };
    window.addEventListener('globalLoading', handler);
    return () => window.removeEventListener('globalLoading', handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="global-loading-overlay">
      <div className="global-loading-inner">
        <Loading src={src} size={size} />
      </div>
    </div>
  );
};

export default GlobalLoading;
