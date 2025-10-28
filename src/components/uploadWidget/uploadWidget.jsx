import { createContext, useEffect, useState } from 'react';
const CloudinaryScriptContext = createContext();

function UploadWidget ({ uwConfig, setPublicId, setAvatar}){
  const [loaded, setLoaded] = useState(false);

  useEffect(() =>{
    if (!loaded) {
      const existing = document.getElementById("cloudinary-upload-widget-script");
      if (existing){
      if (existing.getAttribute("data-loaded") === "true") {
          setLoaded(true);
        } else {
          existing.addEventListener("load", () => setLoaded(true));
        }
      } else {
      const script = document.createElement("script");
        script.id = "cloudinary-upload-widget-script";
        script.async = true;
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => {
          script.setAttribute("data-loaded", "true");
          setLoaded(true);
        });
        document.body.appendChild(script);
      }
    }
  }, [loaded]);

      const initializeUploadWidget = () => { 
        if (!loaded) return;
        if (!window?.cloudinary) {
          console.error("Cloudinary upload widget not available");
          return;
        }
        const myWidget = window.cloudinary.createUploadWidget(
          uwConfig,
          (error, result) => {
            if (!error && result && result.event === 'success') {
              console.log('Upload successful:', result.info);
              setPublicId && setPublicId(result.info.public_id);
              setAvatar && setAvatar(result.info.secure_url);
            }
          }
        );
          myWidget.open();
      };

  return (
    <CloudinaryScriptContext.Provider value ={{ loaded }}>
    <button
      id="upload_widget"
      className="cloudinary-button"
        onClick ={ initializeUploadWidget}>
      Upload
    </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
 export{ CloudinaryScriptContext};
