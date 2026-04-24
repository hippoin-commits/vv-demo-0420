import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-bg">
      <div className="text-center">
        <h1 className="text-[length:var(--font-size-4xl)] font-bold text-text mb-[var(--space-200)]">404</h1>
        <p className="text-[length:var(--font-size-md)] text-text-secondary mb-[var(--space-600)]">页面未找到</p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-button)] transition-colors disabled:pointer-events-none text-[var(--color-text)] bg-primary text-[var(--color-white)] hover:bg-primary-hover active:bg-primary-active h-[var(--space-800)] px-[var(--space-400)] gap-[var(--space-150)] text-[length:var(--font-size-base)]"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
