import * as React from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { cn } from "../ui/utils"
import { X, Search, Mail } from "lucide-react"

import { GenericFormCard } from "../main-ai/GenericFormCard"

export interface CreateEmailFormProps {
  isReadonly?: boolean
  onSubmit?: (data: any) => void
  initialData?: any
}

const HIERARCHY_DATA = {
  group: ["阿里巴巴集团", "腾讯科技", "字节跳动", "百度", "美团"],
  company: {
    "阿里巴巴集团": ["淘宝网络", "阿里云", "菜鸟网络", "蚂蚁金服"],
    "腾讯科技": ["微信事业群", "互动娱乐事业群", "云与智慧产业事业群"],
    "字节跳动": ["抖音集团", "火山引擎", "飞书", "朝夕光年"],
    "百度": ["百度核心", "爱奇艺", "百度智能云"],
    "美团": ["美团外卖", "美团到店", "美团优选"]
  },
  department: {
    "淘宝网络": ["技术部", "产品部", "运营部", "设计部"],
    "阿里云": ["弹性计算", "数据库", "存储", "安全"],
    "微信事业群": ["基础产品部", "开放平台部", "增值业务部"],
    "互动娱乐事业群": ["天美工作室群", "光子工作室群", "魔方工作室群"],
    "抖音集团": ["算法推荐", "商业化", "用户增长"],
    "飞书": ["产品部", "商业化部", "客户成功部"]
  },
  team: {
    "技术部": ["前端架构组", "后端基础组", "测试与质量组", "运维组"],
    "产品部": ["用户体验组", "商业化组", "创新业务组"],
    "弹性计算": ["计算编排", "虚拟化网络", "容器平台"],
    "基础产品部": ["消息研发组", "通讯录与关系链", "小程序底层"],
    "算法推荐": ["推荐核心组", "多模态架构", "NLP组"],
    "产品部_飞书": ["协同文档组", "会议应用组", "日历与排期组"]
  }
}

const MOCK_USERS = [
  "张三", "李四", "王五", "赵六", "陈七", "孙八", "周九", "吴十", 
  "郑十一", "王建国", "李华", "刘强", "张伟"
]

export function CreateEmailForm({ isReadonly = false, onSubmit, initialData }: CreateEmailFormProps) {
  const [formData, setFormData] = React.useState({
    group: initialData?.group || "",
    company: initialData?.company || "",
    department: initialData?.department || "",
    team: initialData?.team || "",
    emailPrefix: initialData?.emailPrefix || "",
    domain: initialData?.domain || "@company.com",
    members: initialData?.members || [] as string[]
  })
  const [isActivating, setIsActivating] = React.useState(false)
  const [emailActivated, setEmailActivated] = React.useState(initialData?.emailActivated || false)
  
  const [memberSearch, setMemberSearch] = React.useState("")
  const [showMemberDropdown, setShowMemberDropdown] = React.useState(false)

  // Reset dependent fields when parent changes
  const handleGroupChange = (val: string) => {
    setFormData(prev => ({ ...prev, group: val, company: "", department: "", team: "" }))
  }
  
  const handleCompanyChange = (val: string) => {
    setFormData(prev => ({ ...prev, company: val, department: "", team: "" }))
  }
  
  const handleDepartmentChange = (val: string) => {
    setFormData(prev => ({ ...prev, department: val, team: "" }))
  }
  
  const handleTeamChange = (val: string) => {
    setFormData(prev => ({ ...prev, team: val }))
  }

  const handleActivate = () => {
    if (!formData.emailPrefix) return
    setIsActivating(true)
    setTimeout(() => {
      setIsActivating(false)
      setEmailActivated(true)
    }, 1000)
  }

  const handleAddMember = (user: string) => {
    if (!formData.members.includes(user)) {
      setFormData(prev => ({ ...prev, members: [...prev.members, user] }))
    }
    setMemberSearch("")
    setShowMemberDropdown(false)
  }

  const handleRemoveMember = (user: string) => {
    setFormData(prev => ({ ...prev, members: prev.members.filter((m: string) => m !== user) }))
  }

  const handleSubmit = () => {
    onSubmit?.({ ...formData, emailActivated })
  }

  const filteredUsers = MOCK_USERS.filter(u => 
    u.toLowerCase().includes(memberSearch.toLowerCase()) && 
    !formData.members.includes(u)
  )

  const isValid = formData.group && formData.company && formData.department && formData.team && emailActivated && formData.members.length > 0

  return (
    <GenericFormCard
      title="创建业务邮箱"
      isReadonly={isReadonly}
      isSubmitted={isReadonly}
      onSubmit={handleSubmit}
      submitText="提交创建"
      onReset={() => setFormData({ group: "", company: "", department: "", team: "", emailPrefix: "", domain: "@company.com", members: [] })}
      icon={<Mail className="w-full h-full" />}
      className={cn(isReadonly && "opacity-80 pointer-events-none grayscale-[0.2]")}
    >
      <div className="flex flex-col gap-[var(--space-400)] w-full">
        {isReadonly && (
          <div className="flex justify-end w-full mb-[var(--space-200)]">
            <span className="text-success bg-[var(--color-success-disabled)] px-[var(--space-200)] py-[var(--space-100)] rounded-[var(--radius-100)] text-[length:var(--font-size-xs)]">
              已创建
            </span>
          </div>
        )}
        {/* 4 层级下拉 */}
        <div className="grid grid-cols-2 gap-[var(--space-400)]">
        <div className="flex flex-col gap-[var(--space-100)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-tertiary">集团 (Group)</Label>
          <Select disabled={isReadonly} value={formData.group} onValueChange={handleGroupChange}>
            <SelectTrigger className="h-[var(--space-800)] text-[length:var(--font-size-base)]">
              <SelectValue placeholder="请选择集团" />
            </SelectTrigger>
            <SelectContent>
              {HIERARCHY_DATA.group.map(g => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[var(--space-100)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-tertiary">公司 (Company)</Label>
          <Select disabled={isReadonly || !formData.group} value={formData.company} onValueChange={handleCompanyChange}>
            <SelectTrigger className="h-[var(--space-800)] text-[length:var(--font-size-base)]">
              <SelectValue placeholder="请选择公司" />
            </SelectTrigger>
            <SelectContent>
              {(HIERARCHY_DATA.company[formData.group as keyof typeof HIERARCHY_DATA.company] || []).map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[var(--space-100)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-tertiary">部门 (Department)</Label>
          <Select disabled={isReadonly || !formData.company} value={formData.department} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="h-[var(--space-800)] text-[length:var(--font-size-base)]">
              <SelectValue placeholder="请选择部门" />
            </SelectTrigger>
            <SelectContent>
              {(HIERARCHY_DATA.department[formData.company as keyof typeof HIERARCHY_DATA.department] || []).map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[var(--space-100)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-tertiary">团队 (Team)</Label>
          <Select disabled={isReadonly || !formData.department} value={formData.team} onValueChange={handleTeamChange}>
            <SelectTrigger className="h-[var(--space-800)] text-[length:var(--font-size-base)]">
              <SelectValue placeholder="请选择团队" />
            </SelectTrigger>
            <SelectContent>
              {((HIERARCHY_DATA.team[formData.department as keyof typeof HIERARCHY_DATA.team] || HIERARCHY_DATA.team["产品部_飞书"]) || []).map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 邮箱输入与激活 */}
      <div className="flex flex-col gap-[var(--space-100)] mt-[var(--space-0)]">
        <Label className="text-[length:var(--font-size-xs)] text-text-tertiary">业务邮箱 (Business Email)</Label>
        <div className="flex items-center gap-[var(--space-200)]">
          <div className="flex-1 flex items-center border border-border rounded-[var(--radius-input)] overflow-hidden focus-within:ring-2 focus-within:ring-ring transition-all">
            <Input 
              disabled={isReadonly || emailActivated}
              value={formData.emailPrefix}
              onChange={e => setFormData(prev => ({ ...prev, emailPrefix: e.target.value.replace(/[^a-zA-Z0-9_-]/g, '') }))}
              placeholder="请输入前缀" 
              className="border-none shadow-none focus-visible:ring-0 rounded-none h-[var(--space-800)] bg-transparent text-text flex-1 text-[length:var(--font-size-base)]"
            />
            <div className="px-[var(--space-400)] h-[var(--space-800)] flex items-center bg-bg-secondary border-l border-border-divider text-text-tertiary text-[length:var(--font-size-base)]">
              {formData.domain}
            </div>
          </div>
          <Button 
            disabled={isReadonly || emailActivated || !formData.emailPrefix || isActivating}
            onClick={handleActivate}
            variant={emailActivated ? "outline" : "primary"}
            className={cn(
              "shrink-0 min-w-[80px] h-[var(--space-800)]", 
              emailActivated && "text-white bg-[var(--color-success-disabled)] hover:bg-[var(--color-success-disabled)]"
            )}
          >
            {isActivating ? "激活中..." : emailActivated ? "已激活" : "激活"}
          </Button>
        </div>
      </div>

      {/* 成员多选 */}
      <div className="flex flex-col gap-[var(--space-100)] mt-[var(--space-0)] relative">
        <Label className="text-[length:var(--font-size-xs)] text-text-tertiary">分配成员 (Assign Members)</Label>
        
        <div className="flex flex-wrap gap-[var(--space-150)] p-[var(--space-200)] min-h-[var(--space-800)] border border-border rounded-[var(--radius-input)] bg-bg focus-within:ring-2 focus-within:ring-ring transition-all">
          {formData.members.map((member: string) => (
            <span key={member} className="flex items-center gap-[var(--space-100)] px-[var(--space-250)] py-[var(--space-50)] bg-[var(--color-primary-disabled)] text-primary rounded-[var(--radius-100)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)]">
              {member}
              {!isReadonly && (
                <button 
                  onClick={() => handleRemoveMember(member)}
                  className="hover:text-primary-hover focus:outline-none flex items-center justify-center rounded-full"
                >
                  <X className="size-[var(--icon-2xs)]" />
                </button>
              )}
            </span>
          ))}
          {!isReadonly && (
            <div className="flex-1 min-w-[120px] relative flex items-center">
              <Input
                value={memberSearch}
                onChange={e => {
                  setMemberSearch(e.target.value)
                  setShowMemberDropdown(true)
                }}
                onFocus={() => setShowMemberDropdown(true)}
                placeholder={formData.members.length === 0 ? "搜索成员添加..." : "继续添加..."}
                className="border-none shadow-none focus-visible:ring-0 p-0 h-[var(--space-600)] text-[length:var(--font-size-base)] bg-transparent w-full px-[var(--space-100)]"
              />
            </div>
          )}
        </div>

        {/* 成员搜索下拉面板 */}
        {showMemberDropdown && !isReadonly && (
          <>
            <div
              role="presentation"
              className="fixed inset-0 z-40"
              onClick={() => setShowMemberDropdown(false)}
            />
            <div className="absolute top-[calc(100%+var(--space-100))] left-0 w-full max-h-[200px] overflow-y-auto bg-bg border border-border-divider shadow-md rounded-[var(--radius-lg)] z-50 p-[var(--space-100)] flex flex-col gap-[var(--space-50)]">
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <button
                  key={user}
                  type="button"
                  onClick={() => handleAddMember(user)}
                  className="w-full text-left px-[var(--space-300)] py-[var(--space-200)] text-[length:var(--font-size-base)] text-text hover:bg-bg-secondary rounded-[var(--radius-sm)] transition-colors"
                >
                  {user}
                </button>
              )) : (
                <div className="px-[var(--space-300)] py-[var(--space-200)] text-[length:var(--font-size-sm)] text-text-muted text-center">
                  无匹配成员
                </div>
              )}
            </div>
          </>
        )}
      </div>
      </div>
    </GenericFormCard>
  )
}