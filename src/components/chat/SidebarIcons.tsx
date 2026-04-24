import * as React from "react";
import { svgPaths } from "./chat-icons";

function SecMenuCatalogue() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <path d={svgPaths.p8cb6080} fill="var(--color-text)" />
        <path d={svgPaths.p1ed38600} fill="var(--color-text)" />
      </svg>
    </div>
  );
}

export function SidebarIcon() {
  return (
    <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[10px] items-center overflow-clip p-[2px] relative rounded-[4px] shrink-0 cursor-pointer">
      <SecMenuCatalogue />
    </div>
  );
}

function AddNew() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <path d={svgPaths.p25eb1000} fill="var(--fill-0, #2A2F3C)" />
        <path d={svgPaths.p1cd208f0} fill="var(--fill-0, #2A2F3C)" />
      </svg>
    </div>
  );
}

export function AddIcon() {
    return (
        <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[10px] items-center overflow-clip p-[2px] relative rounded-[4px] shrink-0 cursor-pointer">
            <AddNew />
        </div>
    )
}
