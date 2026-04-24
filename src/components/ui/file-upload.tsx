import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "./utils"

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-[8px] items-center justify-center size-[100px] bg-[#fafbfc] rounded-[6px] border border-dashed border-[#dce0e8] cursor-pointer hover:bg-[#f0f1f3] transition-colors",
          className
        )}
        {...props}
      >
        <Plus className="w-[28px] h-[28px] text-[#858B9B]" />
        <p className="text-[14px] text-[#858b9b] font-['PingFang_SC:Regular',sans-serif]">
          上传图片
        </p>
      </div>
    )
  }
)
FileUpload.displayName = "FileUpload"

export { FileUpload }
