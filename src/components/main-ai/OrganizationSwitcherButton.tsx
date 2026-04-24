import * as React from "react";
import ArrowTriangularArrowUnfoldPutAway from "../../imports/箭头三角箭头展开收起ArrowTriangularArrowUnfoldPutAway";
import svgPathsFromApps from "../../imports/svg-xnt2pfgcjn";
import { cn } from "../ui/utils";
import { AppIcon } from "./AppIcon";

function AllAppsIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
      <div className="absolute inset-[13.54%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
          <g id="Union">
            <path clipRule="evenodd" d={svgPathsFromApps.p306b300} fill="currentColor" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPathsFromApps.p2c3c1870} fill="currentColor" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPathsFromApps.p3d0dec00} fill="currentColor" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPathsFromApps.p6218c80} fill="currentColor" fillRule="evenodd" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export type OrganizationSwitcherCurrentApp = {
  name: string;
  imageSrc: string;
};

interface OrganizationSwitcherButtonProps {
  onClick?: () => void;
  isOpen?: boolean;
  /** 在子应用底栏：与首页应用 pill 一致展示当前应用图标与标题，并保留展开箭头 */
  currentApp?: OrganizationSwitcherCurrentApp;
}

export function OrganizationSwitcherButton({
  onClick,
  isOpen = false,
  currentApp,
}: OrganizationSwitcherButtonProps) {
  const pillClass =
    "bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0 hover:bg-[var(--black-alpha-11)] transition-all duration-300 ease-out border border-border select-none";

  return (
    <button type="button" onClick={onClick} className={pillClass}>
      {currentApp ? (
        <>
          <AppIcon imageSrc={currentApp.imageSrc} className="size-[18px]" />
          <p className="min-w-0 max-w-[min(40vw,200px)] truncate text-[length:var(--font-size-xs)] leading-none text-[var(--color-text)] font-[var(--font-weight-medium)]">
            {currentApp.name}
          </p>
        </>
      ) : (
        <AllAppsIcon className="w-[var(--font-size-lg)] h-[var(--font-size-lg)] text-text-tertiary" />
      )}
      <div
        className={cn(
          "shrink-0 w-[var(--icon-2xs)] h-[var(--icon-2xs)] text-text-tertiary transition-transform duration-300",
          isOpen && "rotate-180"
        )}
      >
        <ArrowTriangularArrowUnfoldPutAway />
      </div>
    </button>
  );
}