'use client';

import React, { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

type NotificationProps = {
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
};

export default function Notification({
  message,
  type,
  onClose,
  autoClose = true,
  duration = 5000,
}: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div 
        className={`flex items-center p-4 rounded-lg shadow-lg ${
          type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 
          'bg-red-50 text-red-800 border-l-4 border-red-500'
        }`}
      >
        <div className="flex-shrink-0 mr-3">
          {type === 'success' ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          ) : (
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="flex-1 mr-2">
          {message}
        </div>
        <button 
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="flex-shrink-0 ml-auto text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 