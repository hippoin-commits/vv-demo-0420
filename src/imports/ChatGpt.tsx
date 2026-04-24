import svgPaths from "./svg-nn22u1wuv6";

function Gpt() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="GPT">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="GPT">
          <path d={svgPaths.p2abfb900} fill="var(--fill-0, #2A2F3C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

export default function ChatGpt() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative size-full" data-name="ChatGPT">
      <Gpt />
      <p className="font-['Avenir:Regular',sans-serif] leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#2a2f3c] text-[12px] text-center text-ellipsis whitespace-nowrap">ChatGPT</p>
      <div className="overflow-clip relative shrink-0 size-[12px]" data-name="箭头,三角箭头,展开,收起,arrow,triangular arrow,unfold,put away">
        <div className="absolute inset-[34.38%_13.54%_26.04%_13.54%]" data-name="Union">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.75 4.75">
            <path d={svgPaths.p18154430} fill="var(--fill-0, #858B9B)" id="Union" />
          </svg>
        </div>
      </div>
    </div>
  );
}