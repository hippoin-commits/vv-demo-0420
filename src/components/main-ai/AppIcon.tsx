import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface AppIconProps {
  imageSrc?: string;
  className?: string;
}

export function AppIcon({ imageSrc, className = '' }: AppIconProps) {
  // 严格遵守设计系统：所有图标均使用静态图片，不再支持SVG回退
  return (
    <div className={`relative shrink-0 rounded-[var(--radius-sm)] overflow-hidden ${className || 'size-[16px]'}`}>
      {imageSrc ? (
        <ImageWithFallback 
          src={imageSrc} 
          alt="app icon" 
          className="w-full h-full object-contain" 
        />
      ) : (
        <div className="w-full h-full bg-[var(--gray-alpha-11)]" />
      )}
    </div>
  );
}
