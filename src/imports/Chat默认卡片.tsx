function Frame() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full">
      <div className="bg-[#5590f6] h-[12px] rounded-[8px] shrink-0 w-[3px]" data-name="矩形" />
      <p className="font-['PingFang_SC:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#2a2f3c] text-[14px] whitespace-nowrap">标题</p>
    </div>
  );
}

export default function Chat() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-start p-[14px] relative rounded-[12px] shadow-[0px_4px_16px_0px_rgba(22,24,30,0.06)] size-full" data-name="Chat 默认卡片">
      <Frame />
      <div className="bg-[#f6f7f8] content-stretch flex flex-col items-center justify-center py-[20px] relative shrink-0 w-[315px]" data-name=".内容容器">
        <div aria-hidden="true" className="absolute border border-[rgba(29,33,45,0.04)] border-solid inset-0 pointer-events-none" />
        <p className="font-['PingFang_SC:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#858b9b] text-[14px] text-center whitespace-nowrap">slot</p>
      </div>
    </div>
  );
}