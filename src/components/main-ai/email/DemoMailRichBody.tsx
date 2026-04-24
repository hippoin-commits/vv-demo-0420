import * as React from "react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { cn } from "../../ui/utils";
import type { DemoMailRow } from "./emailCuiData";
/** 矢量风高分辨率示意大图：按宽度适配、contain 展示，避免小图硬拉模糊 */
import demoFigureProcess from "../../../assets/demo-mail-rich-figure-process-flow.png";
import demoFigureTimetable from "../../../assets/demo-mail-rich-figure-business-timetable.png";

/** 0415 抽屉 / 0417 会话读信：模拟真实邮件的正文区（约 500px 视觉高度，无卡片内滚动条） */
export function DemoMailRichBody({
  mail,
  className,
}: {
  mail: DemoMailRow;
  className?: string;
}) {
  const senderLabel = mail.fromDisplayName?.trim() || mail.from;
  const tail = mail.id.charCodeAt(1) % 2 === 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-[var(--space-400)] text-[length:var(--font-size-sm)] leading-relaxed text-text",
        className
      )}
    >
      <div className="rounded-[var(--radius-md)] border border-border-divider bg-bg-secondary/50 px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-xs)] text-text-secondary">
        <p className="m-0">
          <span className="text-text-tertiary">收件人：</span>我
          <span className="mx-[var(--space-200)] text-border">|</span>
          <span className="text-text-tertiary">抄送：</span>
          {mail.kind === "business" ? "产品评审组" : "直属上级"}
        </p>
      </div>

      <p className="m-0">您好，</p>

      <p className="m-0">
        感谢查阅本邮件。关于「<span className="font-[var(--font-weight-medium)] text-text">{mail.subject}</span>
        」，发件方（{senderLabel}）已在内部系统完成初步核对。以下为说明摘要与附图，供您留存；若与贵侧记录不一致，请直接回复本邮件，我们会安排对口同事跟进。
      </p>

      <p className="m-0 text-text-secondary">{mail.preview}</p>

      <ul className="m-0 list-disc space-y-[var(--space-150)] pl-[var(--space-500)] text-text-secondary">
        <li>当前状态：{tail ? "待您确认" : "待补充材料"}（演示数据）</li>
        <li>
          建议反馈窗口：<strong className="text-text">本周五 18:00</strong>（UTC+8）前；逾期将自动顺延至下一迭代评审。
        </li>
        <li>涉及系统：企业邮箱 · 任务协同（演示命名）</li>
      </ul>

      <div className="flex flex-wrap gap-[var(--space-200)]">
        <span className="inline-flex items-center gap-[var(--space-100)] rounded-full border border-border bg-bg-secondary px-[var(--space-300)] py-[var(--space-100)] text-[length:var(--font-size-xs)] text-text-secondary">
          <span className="font-[var(--font-weight-medium)] text-text">PDF</span>
          会议纪要_{mail.id}.pdf
        </span>
        <span className="inline-flex items-center gap-[var(--space-100)] rounded-full border border-border bg-bg-secondary px-[var(--space-300)] py-[var(--space-100)] text-[length:var(--font-size-xs)] text-text-secondary">
          <span className="font-[var(--font-weight-medium)] text-text">XLSX</span>
          排期核对表.xlsx
        </span>
      </div>

      <div className="grid grid-cols-1 gap-[var(--space-300)] sm:grid-cols-2">
        <figure className="m-0 min-w-0">
          <div className="flex justify-center overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg-secondary p-[var(--space-100)]">
            <ImageWithFallback
              src={demoFigureProcess}
              alt="演示配图：从创意到落地的流程示意"
              className="h-auto w-full max-h-[min(52vh,520px)] max-w-full object-contain"
              decoding="async"
              loading="lazy"
            />
          </div>
          <figcaption className="mt-[var(--space-150)] text-[length:var(--font-size-xxs)] leading-snug text-text-tertiary">
            图 1 · 流程阶段示意（演示素材，非真实业务数据）
          </figcaption>
        </figure>
        <figure className="m-0 min-w-0">
          <div className="flex justify-center overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg-secondary p-[var(--space-100)]">
            <ImageWithFallback
              src={demoFigureTimetable}
              alt="演示配图：业务节点与时间轴示意"
              className="h-auto w-full max-h-[min(52vh,520px)] max-w-full object-contain"
              decoding="async"
              loading="lazy"
            />
          </div>
          <figcaption className="mt-[var(--space-150)] text-[length:var(--font-size-xxs)] leading-snug text-text-tertiary">
            图 2 · 节点与路径示意（演示素材）
          </figcaption>
        </figure>
      </div>

      <p className="m-0 text-text-secondary">
        以上为自动生成的演示正文，用于高保真预览排版与图片承载；正式环境可替换为 HTML 模板、内嵌表格与真实附件链接。
      </p>

      <div className="border-t border-border-divider pt-[var(--space-300)] text-[length:var(--font-size-sm)] text-text-secondary">
        <p className="m-0">此致</p>
        <p className="mt-[var(--space-150)] m-0 font-[var(--font-weight-medium)] text-text">{senderLabel}</p>
        <p className="mt-[var(--space-100)] m-0 text-[length:var(--font-size-xs)] text-text-tertiary">{mail.time}</p>
      </div>
    </div>
  );
}
