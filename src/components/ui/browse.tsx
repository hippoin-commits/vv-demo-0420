import * as React from "react"

const BrowseField = ({ label, value }: { label: string; value: React.ReactNode }) => {
  return (
    <div className="h-[44px] relative shrink-0 w-full flex flex-col justify-start">
      <p className="font-['PingFang_SC:Medium',sans-serif] leading-[18px] text-[#bfbfbf] text-[12px] mb-[4px]">
        {label}
      </p>
      <div className="font-['PingFang_SC:Regular',sans-serif] leading-[22px] text-[#262626] text-[14px]">
        {value}
      </div>
    </div>
  )
}

const BrowseImage = ({ src }: { src: string }) => {
  return (
    <div className="size-[104px] border border-[#dce0e8] rounded-[6px] p-[8px] bg-white">
      <img
        src={src}
        className="w-full h-full object-cover rounded-[2px]"
        alt="Uploaded"
      />
    </div>
  )
}

export { BrowseField, BrowseImage }
