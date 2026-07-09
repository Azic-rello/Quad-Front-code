import React, { createContext, useContext, useState, useEffect } from "react";
import { $api, $publicApi } from "../../services/api"; // Loyihangizdagi API yo'lini tekshirib oling

interface LoaderContextType {
  showLoader: (text?: string) => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context)
    throw new Error(
      "useLoader faqat LoaderProvider ichida ishlatilishi kerak!",
    );
  return context;
};

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("Tayyorlanmoqda");

  const showLoader = (text = "Tayyorlanmoqda") => {
    setLoaderText(text);
    setIsLoading(true);
  };

  const hideLoader = () => setIsLoading(false);

  // 🌐 INTERNET O'CHIB QOLISHINI NAZORAT QILISH
  useEffect(() => {
    const handleOffline = () => showLoader("Internet bilan aloqa uzildi...");
    const handleOnline = () => hideLoader();

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if (!navigator.onLine) {
      showLoader("Internet bilan aloqa uzildi...");
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // 🔒 AXIOS INTERCEPTOR - API SO'ROVLARI UCHUN DARHOL ISHLAYDI
  useEffect(() => {
    let activeRequests = 0;

    const requestHandler = (config: any) => {
      activeRequests++;
      showLoader("Ma'lumotlar yuklanmoqda");
      return config;
    };

    const responseHandler = (response: any) => {
      activeRequests--;
      if (activeRequests <= 0) {
        activeRequests = 0;
        hideLoader();
      }
      return response;
    };

    const errorHandler = (error: any) => {
      activeRequests--;
      if (activeRequests <= 0) {
        activeRequests = 0;
        hideLoader();
      }
      return Promise.reject(error);
    };

    const interceptorReq = $api.interceptors.request.use(
      requestHandler,
      errorHandler,
    );
    const interceptorRes = $api.interceptors.response.use(
      responseHandler,
      errorHandler,
    );

    const pubInterceptorReq = $publicApi.interceptors.request.use(
      requestHandler,
      errorHandler,
    );
    const pubInterceptorRes = $publicApi.interceptors.response.use(
      responseHandler,
      errorHandler,
    );

    return () => {
      $api.interceptors.request.eject(interceptorReq);
      $api.interceptors.response.eject(interceptorRes);
      $publicApi.interceptors.request.eject(pubInterceptorReq);
      $publicApi.interceptors.response.eject(pubInterceptorRes);
    };
  }, []);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {isLoading && (
        <div className="loader-wrap">
          <div className="loader-circle">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle
                cx="55"
                cy="55"
                r="48"
                fill="none"
                stroke="rgba(227,18,33,0.15)"
                strokeWidth="6"
              />
              <circle
                cx="55"
                cy="55"
                r="48"
                fill="none"
                stroke="#E31221"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="70 231"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 55 55"
                  to="360 55 55"
                  dur="1.1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            <svg
              className="pizza-slice"
              width="42"
              height="42"
              viewBox="0 0 64 64"
            >
              <path
                d="M32 6 C34 6 35.5 7.5 36.5 10 L53 47 C56.5 54.5 53.5 58 47 58 L17 58 C10.5 58 7.5 54.5 11 47 L27.5 10 C28.5 7.5 30 6 32 6 Z"
                fill="#E31221"
              />
              <path
                d="M32 6 C34 6 35.5 7.5 36.5 10 L53 47 C56.5 54.5 53.5 58 47 58 L17 58 C10.5 58 7.5 54.5 11 47 L27.5 10 C28.5 7.5 30 6 32 6 Z"
                fill="none"
                stroke="#8a0c17"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M13 49 Q32 39 51 49"
                fill="none"
                stroke="#8a0c17"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="25" cy="32" r="3.2" fill="#8a0c17" />
              <circle cx="38" cy="28" r="3.2" fill="#8a0c17" />
              <circle cx="31" cy="40" r="3.2" fill="#8a0c17" />
            </svg>
          </div>
          <div className="loader-text">
            <p>{loaderText}</p>
            <div className="dots">
              <span />
              <span />
              <span />
            </div>
          </div>
          <style>{`
            .loader-wrap { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; background: #111111; font-family: sans-serif; }
            .loader-circle { position: relative; width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; }
            .loader-circle svg:first-child { position: absolute; top: 0; left: 0; }
            .pizza-slice { animation: spin-pizza 1.6s linear infinite; }
            .loader-text { display: flex; flex-direction: column; align-items: center; gap: 6px; }
            .loader-text p { font-size: 16px; font-weight: 500; color: #ffffff; margin: 0; }
            .dots { display: flex; gap: 6px; }
            .dots span { width: 6px; height: 6px; border-radius: 50%; background: #E31221; animation: pulse 1.2s ease-in-out infinite; }
            .dots span:nth-child(2) { animation-delay: 0.2s; }
            .dots span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes spin-pizza { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
          `}</style>
        </div>
      )}
    </LoaderContext.Provider>
  );
};
