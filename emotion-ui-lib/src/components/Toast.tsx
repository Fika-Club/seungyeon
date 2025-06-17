/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { colorPalette } from '../styles/colorPalette';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

type Variant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  variant?: Variant;
  onClose: () => void;
  duration?: number;
}

const ToastWrapper = styled.div<{ variant: Variant }>`
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  margin-bottom: 12px;
  font-weight: 500;
  animation: ${fadeIn} 0.3s ease;
  background-color: ${({ variant }) => {
    switch (variant) {
      case 'success':
        return colorPalette.success;
      case 'error':
        return colorPalette.error;
      case 'warning':
        return colorPalette.warning;
      default:
        return colorPalette.info;
    }
  }};
`;

export const Toast = ({ message, variant = 'info', onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  if (typeof window === 'undefined') return null;
  const root = document.getElementById('toast-root');
  if (!root) return null;

  return createPortal(
    <ToastWrapper variant={variant}>{message}</ToastWrapper>,
    root
  );
};