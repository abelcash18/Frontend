import './loading.scss';
import image from '../../../public/Lottie Lego.gif';

const Loading = ({ src, className, size = 24 }) => {
  const style = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    animation: 'spin 1s linear infinite', 
  };

  return (
    <div className={className || 'loadingWrapper'} style={style}>
      <img src={src || image} alt="loading" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default Loading;
