import React, { createContext, useContext, useState, useEffect } from "react";
import { $api, $publicApi } from "../../services/api";

interface LoaderContextType {
  setIsPageLoading: (value: boolean) => void;
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
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  useEffect(() => {
    const requestHandler = (config: any) => config;
    const responseHandler = (response: any) => response;
    const errorHandler = (error: any) => Promise.reject(error);

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

  const shouldShow = isPageLoading || isOffline;
  const currentText = isOffline
    ? "Internet bilan aloqa uzildi..."
    : "Sahifa yuklanmoqda...";

  return (
    <LoaderContext.Provider value={{ setIsPageLoading }}>
      {children}
      {shouldShow && (
        <div className="loader-wrap">
          <div className="loader-circle">
            {/* O'lchamlar 110px dan 180px ga kattalashtirildi, stroke qalinligi 8 bo'ldi */}
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r="80"
                fill="none"
                stroke="rgba(227,18,33,0.15)"
                strokeWidth="8"
              />
              <circle
                cx="90"
                cy="90"
                r="80"
                fill="none"
                stroke="#E31221"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="110 390"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 90 90"
                  to="360 90 90"
                  dur="1.1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            {/* Pizza o'lchami 42px dan 70px ga kattalashtirildi */}
            <svg
              className="pizza-slice"
              width="70"
              height="70"
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
            <p>{currentText}</p>
            <div className="dots">
              <span />
              <span />
              <span />
            </div>
          </div>
          <style>{`
            /* Orqa fon yarim shaffof (rgba) qilindi va backdrop-filter orqali 74px blur berildi */
            .loader-wrap { 
              position: fixed; 
              inset: 0; 
              width: 100vw; 
              height: 100vh; 
              z-index: 9999; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              gap: 2rem; 
              background: rgba(17, 17, 17, 0.4); 
              backdrop-filter: blur(74px); 
              -webkit-backdrop-filter: blur(74px);
              font-family: sans-serif; 
            }
            /* Aylana konteyneri ham yangi o'lchamga moslandi */
            .loader-circle { position: relative; width: 180px; height: 180px; display: flex; align-items: center; justify-content: center; }
            .loader-circle svg:first-child { position: absolute; top: 0; left: 0; }
            .pizza-slice { animation: spin-pizza 1.6s linear infinite; }
            .loader-text { display: flex; flex-direction: column; align-items: center; gap: 8px; }
            /* Text rangi oq, lekin orqa fon blur bo'lgani uchun oson o'qilishi uchun ozroq soyali qilindi */
            .loader-text p { font-size: 18px; font-weight: 600; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.2); margin: 0; }
            .dots { display: flex; gap: 6px; }
            .dots span { width: 7px; height: 7px; border-radius: 50%; background: #E31221; animation: pulse 1.2s ease-in-out infinite; }
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
