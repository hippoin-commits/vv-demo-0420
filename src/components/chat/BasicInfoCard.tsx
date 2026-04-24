import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { cn } from "../ui/utils"

interface BasicInfo {
  avatar: string
  name: string
  gender: string
}

interface BasicInfoCardProps {
  initialData: BasicInfo
  className?: string
}

export function BasicInfoCard({ initialData, className }: BasicInfoCardProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [data, setData] = React.useState(initialData)
  const [tempData, setTempData] = React.useState(initialData)

  const handleEdit = () => {
    setTempData(data)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setTempData(data)
  }

  const handleSave = () => {
    setData(tempData)
    setIsEditing(false)
    // In a real app, this would trigger an API call
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-row items-center justify-between pb-[var(--space-200)]">
        <h4 className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text">基本信息</h4>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={handleEdit} className="text-primary hover:text-primary-hover hover:bg-transparent h-auto p-0">
            编辑
          </Button>
        )}
      </div>
      <div className="pt-[var(--space-200)]">
        {isEditing ? (
          <div className="flex flex-col gap-[var(--space-400)]">
            <div className="flex items-center gap-[var(--space-400)]">
              <Avatar className="h-[var(--space-1600)] w-[var(--space-1600)] rounded-md">
                <AvatarImage src={tempData.avatar} />
                <AvatarFallback>{tempData.name[0]}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="h-[var(--space-800)] px-[var(--space-300)] text-[length:var(--font-size-xs)] rounded-[var(--radius-button)]">更换头像</Button>
            </div>
            
            <div className="flex flex-col gap-[var(--space-200)]">
              <Label htmlFor="name" className="text-[length:var(--font-size-xs)] text-text-secondary">姓名</Label>
              <Input 
                id="name" 
                value={tempData.name} 
                className="h-[var(--space-900)] text-[length:var(--font-size-base)] border-border rounded-[var(--radius-input)]"
                onChange={(e) => setTempData({...tempData, name: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-[var(--space-200)]">
              <Label htmlFor="gender" className="text-[length:var(--font-size-xs)] text-text-secondary">性别</Label>
              <Select 
                value={tempData.gender} 
                onValueChange={(val) => setTempData({...tempData, gender: val})}
              >
                <SelectTrigger className="h-[var(--space-900)] text-[length:var(--font-size-base)] border-border rounded-[var(--radius-input)]">
                  <SelectValue placeholder="选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男</SelectItem>
                  <SelectItem value="female">女</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-[var(--space-200)] mt-[var(--space-400)]">
              <Button variant="outline" size="sm" onClick={handleCancel} className="h-[var(--space-800)] px-[var(--space-400)] rounded-[var(--radius-button)]">取消</Button>
              <Button size="sm" onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary-hover h-[var(--space-800)] px-[var(--space-400)] rounded-[var(--radius-button)] border-none">保存</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-[var(--space-400)]">
            <Avatar className="h-[var(--space-1600)] w-[var(--space-1600)]">
              <AvatarImage src={data.avatar} />
              <AvatarFallback>{data.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-[var(--space-50)] mt-[var(--space-100)]">
              <h3 className="font-[var(--font-weight-medium)] text-[length:var(--font-size-md)] text-text">{data.name}</h3>
              <p className="text-[length:var(--font-size-base)] text-text-secondary">
                {data.gender === 'male' ? '男' : data.gender === 'female' ? '女' : '其他'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
