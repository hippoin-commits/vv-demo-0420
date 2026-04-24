import * as React from "react";
import { attachmentSvgPaths } from "./attachment-icons";

function CameraItem() {
  return (
    <div className="relative rounded-[var(--radius-md)] shrink-0 w-full cursor-pointer hover:bg-[var(--black-alpha-11)] transition-colors group">
      <div className="flex flex-row items-center size-full">
        <div className="flex gap-[var(--space-200)] items-center p-[var(--space-200)] relative w-full">
          <div className="relative shrink-0 size-[var(--space-400)] text-text">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <g>
                <path d={attachmentSvgPaths.p2e877200} fill="currentColor" />
                <path d={attachmentSvgPaths.p1b817180} fill="currentColor" />
              </g>
            </svg>
          </div>
          <p className="font-sans leading-normal not-italic relative shrink-0 text-text text-[length:var(--font-size-xs)] text-nowrap">相机</p>
        </div>
      </div>
    </div>
  );
}

function PhotoItem() {
  return (
    <div className="relative rounded-[var(--radius-md)] shrink-0 w-full cursor-pointer hover:bg-[var(--black-alpha-11)] transition-colors group">
      <div className="flex flex-row items-center size-full">
        <div className="flex gap-[var(--space-200)] items-center p-[var(--space-200)] relative w-full">
          <div className="relative shrink-0 size-[var(--space-400)] text-text">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <g>
                <path clipRule="evenodd" d={attachmentSvgPaths.pb6a5e00} fill="currentColor" fillRule="evenodd" />
                <path clipRule="evenodd" d={attachmentSvgPaths.p1fbe1700} fill="currentColor" fillRule="evenodd" />
              </g>
            </svg>
          </div>
          <p className="font-sans leading-normal not-italic relative shrink-0 text-text text-[length:var(--font-size-xs)] text-nowrap">照片</p>
        </div>
      </div>
    </div>
  );
}

function FileItem() {
  return (
    <div className="relative rounded-[var(--radius-md)] shrink-0 w-full cursor-pointer hover:bg-[var(--black-alpha-11)] transition-colors group">
      <div className="flex flex-row items-center size-full">
        <div className="flex gap-[var(--space-200)] items-center p-[var(--space-200)] relative w-full">
          <div className="relative shrink-0 size-[var(--space-400)] text-text">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <g>
                <path clipRule="evenodd" d={attachmentSvgPaths.p24f02970} fill="currentColor" fillRule="evenodd" />
                <path clipRule="evenodd" d={attachmentSvgPaths.p266ecb00} fill="currentColor" fillRule="evenodd" />
                <path clipRule="evenodd" d={attachmentSvgPaths.p1688bf00} fill="currentColor" fillRule="evenodd" />
                <path clipRule="evenodd" d={attachmentSvgPaths.p3e8f700} fill="currentColor" fillRule="evenodd" />
              </g>
            </svg>
          </div>
          <p className="font-sans leading-normal not-italic relative shrink-0 text-text text-[length:var(--font-size-xs)] text-nowrap">本地文件</p>
        </div>
      </div>
    </div>
  );
}

export function AttachmentMenu() {
  return (
    <div className="bg-bg relative rounded-[var(--radius-card)] border border-border shadow-sm overflow-hidden">
      <div className="w-full">
        <div className="flex flex-col gap-[var(--space-50)] items-start p-[var(--space-150)] relative w-full">
          <CameraItem />
          <PhotoItem />
          <FileItem />
        </div>
      </div>
    </div>
  );
}
