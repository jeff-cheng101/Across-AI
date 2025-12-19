"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { RingLoader } from 'react-spinners';

interface LoadingOverlayContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingOverlayContext = createContext<LoadingOverlayContextType | undefined>(undefined);

export const useLoadingOverlay = () => {
  const context = useContext(LoadingOverlayContext);
  if (!context) {
    throw new Error('useLoadingOverlay must be used within a LoadingOverlayProvider');
  }
  return context;
};

interface LoadingOverlayProviderProps {
  children: ReactNode;
}

export const LoadingOverlayProvider: React.FC<LoadingOverlayProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <LoadingOverlayContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isMounted && isLoading && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          style={{
            position: 'fixed',
            zIndex: 1050,
            inset: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            willChange: 'transform',
            contain: 'layout style paint'
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center space-y-4 shadow-xl">
            <RingLoader color="#17a260" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">請稍候</p>
          </div>
        </div>
      )}
    </LoadingOverlayContext.Provider>
  );
};

interface LoadingOverlayProps {
  active: boolean;
  spinner?: ReactNode;
  text?: string;
  styles?: {
    overlay?: (base: any) => any;
    content?: (base: any) => any;
  };
  children?: ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  active, 
  spinner = <RingLoader color="#17a2b8" size={60} />, 
  text = "請稍候", 
  styles,
  children
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 如果还没有挂载，只渲染children（避免hydration mismatch）
  if (!isMounted) {
    return <>{children}</>;
  }

  // 标准化样式处理，确保一致性
  const getOverlayStyle = () => {
    // 基础样式，确保类型一致性
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 1050,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      willChange: 'transform',
      contain: 'layout style paint'
    };
    
    // 如果有自定义样式，合并时确保类型安全
    if (styles?.overlay && typeof styles.overlay === 'function') {
      try {
        const customStyle = styles.overlay(baseStyle);
        // 确保关键属性保持正确类型
        return {
          ...baseStyle,
          ...customStyle,
          position: 'fixed' as const,
          zIndex: typeof customStyle?.zIndex === 'number' ? customStyle.zIndex : 1050,
        };
      } catch (error) {
        console.warn('LoadingOverlay: Error applying custom overlay styles:', error);
        return baseStyle;
      }
    }
    return baseStyle;
  };

  const getContentStyle = () => {
    const baseStyle: React.CSSProperties = {};
    
    if (styles?.content && typeof styles.content === 'function') {
      try {
        return { ...baseStyle, ...styles.content(baseStyle) };
      } catch (error) {
        console.warn('LoadingOverlay: Error applying custom content styles:', error);
        return baseStyle;
      }
    }
    return baseStyle;
  };

  return (
    <>
      {children}
      {active && (
        <div 
          style={getOverlayStyle()}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center space-y-4 shadow-xl"
            style={getContentStyle()}
          >
            {spinner}
            <p className="text-gray-700 dark:text-gray-300 font-medium">{text}</p>
          </div>
        </div>
      )}
    </>
  );
}; 