"use client"
import { toast } from 'react-toastify';

// 解析消息的輔助函數
const parseMessage = (message: any): string => {
  if (typeof message === 'string') {
    return message;
  }
  
  if (message instanceof Error) {
    return message.message;
  }
  
  if (message && typeof message === 'object') {
    // 如果是 API 錯誤響應
    if (message.message) {
      return message.message;
    }
    if (message.error) {
      return message.error;
    }
    if (message.data && message.data.message) {
      return message.data.message;
    }
    // 嘗試轉換為字符串
    try {
      return JSON.stringify(message);
    } catch {
      return '未知錯誤';
    }
  }
  
  return '未知錯誤';
}

// 錯誤通知函數
export const notifyError = (message: any, options = {}) => {
  const parsedMessage = parseMessage(message);
  
  try {
    const result = toast.error(parsedMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
    return result;
  } catch (error) {
    return null;
  }
}

export const notifySuccess = (message: any, options = {}) => {
  const parsedMessage = parseMessage(message);
  
  return toast.success(parsedMessage, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options,
  })
}