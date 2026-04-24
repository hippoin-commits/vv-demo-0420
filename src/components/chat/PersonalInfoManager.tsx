import * as React from "react"
import { BasicInfoCard } from "./BasicInfoCard"
import { RegionalInfoCard } from "./RegionalInfoCard"
import { GenericFormCard } from "../main-ai/GenericFormCard"
import { UserCircle } from "lucide-react"

export function PersonalInfoManager() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const initialBasicInfo = {
    avatar: "https://images.unsplash.com/photo-1599566147214-ce487862ea4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGZhY2UlMjBhdmF0YXJ8ZW58MXx8fHwxNzY0Njk5NzEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "You",
    gender: "male"
  }

  const handleSubmit = () => {
    setIsSubmitted(true);
    console.log('Submit Personal Info');
  }

  return (
    <GenericFormCard
      title="个人信息管理"
      icon={<UserCircle className="w-full h-full" />}
      submitText="完成"
      isSubmitted={isSubmitted}
      onReset={() => console.log('Reset Personal Info')}
      onSubmit={handleSubmit}
      className="animate-in slide-in-from-bottom-4 duration-500"
    >
      <div className="flex flex-col gap-4 w-full">
        <BasicInfoCard initialData={initialBasicInfo} />
        <div className="h-px bg-border-divider w-full" />
        <RegionalInfoCard />
      </div>
    </GenericFormCard>
  )
}
