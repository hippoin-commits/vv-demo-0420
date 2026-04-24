import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger, tabsTriggerVariants } from "../ui/tabs"
import { cn } from "../ui/utils"
import { Plus, Trash2, Pencil } from "lucide-react"

export interface RegionData {
  id: string
  countryCode: string
  countryName: string
  fields: Record<string, string>
}

// Mock definitions for available countries and their fields
const AVAILABLE_COUNTRIES = [
  { code: 'sg', name: '新加坡', fields: ['NRIC', '邮编', '地址'] },
  { code: 'cn', name: '中国', fields: ['身份证号', '省份', '城市', '详细地址'] },
  { code: 'us', name: '美国', fields: ['SSN', 'State', 'City', 'Zip Code'] },
  { code: 'jp', name: '日本', fields: ['个人番号', '都道府县', '住所'] },
]

interface RegionalInfoCardProps {
  className?: string
}

export function RegionalInfoCard({ className }: RegionalInfoCardProps) {
  // Initial State: Singapore as default
  const [regions, setRegions] = React.useState<RegionData[]>([
    {
      id: 'sg-default',
      countryCode: 'sg',
      countryName: '新加坡',
      fields: {
        'NRIC': 'S1234567A',
        '邮编': '123456',
        '地址': 'Marina Bay Sands'
      }
    }
  ])
  
  const [activeTab, setActiveTab] = React.useState('sg-default')
  const [isEditing, setIsEditing] = React.useState(false)
  const [isAdding, setIsAdding] = React.useState(false)
  const [tempData, setTempData] = React.useState<RegionData | null>(null)
  const [selectedNewCountry, setSelectedNewCountry] = React.useState<string>("")

  // Scroll active tab into view
  React.useEffect(() => {
    if (activeTab) {
      const element = document.getElementById(`tab-trigger-${activeTab}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [activeTab])

  // Helper to get field config for a country code
  const getCountryConfig = (code: string) => AVAILABLE_COUNTRIES.find(c => c.code === code)

  // Start adding a new region
  const startAddRegion = () => {
    setIsAdding(true)
    setSelectedNewCountry("")
    setIsEditing(true) // Treat adding as a form of editing
    // We don't create the tab yet, we wait for country selection
  }

  // Handle country selection for new region
  const handleCountrySelect = (code: string) => {
    const config = getCountryConfig(code)
    if (!config) return

    const newId = `new-${Date.now()}`
    const newRegion: RegionData = {
      id: newId,
      countryCode: code,
      countryName: config.name,
      fields: config.fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
    }

    setRegions([...regions, newRegion])
    setActiveTab(newId)
    setTempData(newRegion)
    setSelectedNewCountry(code)
    // isAdding remains true until saved
  }

  // Start editing current region
  const handleEdit = () => {
    const current = regions.find(r => r.id === activeTab)
    if (current) {
      setTempData(JSON.parse(JSON.stringify(current)))
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    if (isAdding) {
      // If adding, remove the temporary region (the last one if we added it)
      if (selectedNewCountry) {
         setRegions(regions.filter(r => r.id !== activeTab))
         setActiveTab(regions[0].id)
      }
      setIsAdding(false)
    }
    setIsEditing(false)
    setTempData(null)
    setSelectedNewCountry("")
  }

  const handleSave = () => {
    if (tempData) {
      setRegions(regions.map(r => r.id === tempData.id ? tempData : r))
    }
    setIsEditing(false)
    setIsAdding(false)
    setTempData(null)
    setSelectedNewCountry("")
  }

  const handleDelete = (id?: string) => {
    const targetId = id || activeTab
    const newRegions = regions.filter(r => r.id !== targetId)
    setRegions(newRegions)
    if (activeTab === targetId) {
      setActiveTab(newRegions[0]?.id || "")
    }
    // If we were editing the deleted one, stop editing
    if (isEditing && activeTab === targetId) {
      setIsEditing(false)
      setTempData(null)
    }
  }

  const currentRegion = regions.find(r => r.id === activeTab)
  const isDefaultRegion = activeTab === 'sg-default'

  // Available countries for dropdown (exclude already added ones if needed? Prompt doesn't specify, but usually good practice. For now keeping simple)
  const availableOptions = AVAILABLE_COUNTRIES

  return (
    <div className={cn("w-full mt-[var(--space-400)]", className)}>
      <div className="flex flex-row items-center justify-between pb-[var(--space-200)]">
        <h4 className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">国家/地区信息</h4>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={handleEdit} className="text-primary hover:text-primary-hover gap-[var(--space-150)] h-auto p-[var(--space-50)] font-[var(--font-weight-medium)] bg-transparent hover:bg-transparent">
            <Pencil className="size-[var(--icon-sm)]" />
            编辑
          </Button>
        )}
      </div>
      <div className="pt-[var(--space-200)]">
        {isAdding && !selectedNewCountry ? (
           <div className="flex flex-col gap-[var(--space-400)]">
             <Label className="text-[length:var(--font-size-xs)] text-text-tertiary">选择国家/地区</Label>
             <Select onValueChange={handleCountrySelect}>
               <SelectTrigger className="bg-input-background border-border focus:ring-ring h-[var(--space-800)] text-[length:var(--font-size-base)]">
                 <SelectValue placeholder="请选择..." />
               </SelectTrigger>
               <SelectContent className="bg-popover border-border text-popover-foreground">
                 {availableOptions.map(c => (
                   <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
             <div className="flex justify-end mt-[var(--space-400)]">
                <Button variant="outline" size="sm" onClick={handleCancel} className="font-[var(--font-weight-medium)] h-[var(--space-800)] px-[var(--space-400)] rounded-[var(--radius-button)]">取消</Button>
             </div>
           </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} variant="card" className="w-full">
              <div className="w-full overflow-x-auto scrollbar-hide mb-[var(--space-400)]">
               <TabsList className="w-auto inline-flex justify-start h-auto bg-transparent p-0 flex-nowrap mb-0 gap-0">
                  {regions.map(region => (
                    <TabsTrigger
                      key={region.id}
                      id={`tab-trigger-${region.id}`}
                      value={region.id}
                      disabled={isEditing && region.id !== activeTab}
                      closable={!isEditing && region.id !== 'sg-default'}
                      onClose={() => handleDelete(region.id)}
                      className={cn(
                        isEditing && region.id !== activeTab && "opacity-50 cursor-not-allowed",
                        "text-[length:var(--font-size-base)]"
                      )}
                    >
                      {region.countryName}
                    </TabsTrigger>
                  ))}
                  
                  {!isEditing && (
                    <button
                      className={cn(
                        tabsTriggerVariants({ variant: "card" }),
                        "data-[state=inactive]:bg-card data-[state=inactive]:text-text-secondary data-[state=inactive]:border-border",
                        "cursor-pointer hover:bg-bg-secondary transition-colors",
                        "self-stretch w-[34px] p-0 flex items-center justify-center",
                        "sticky right-0 z-40 shadow-[-8px_0_12px_-4px_var(--black-alpha-12)] ml-0"
                      )}
                      data-state="inactive"
                      onClick={startAddRegion}
                    >
                      <Plus className="size-[var(--icon-sm)]" />
                    </button>
                  )}
               </TabsList>
            </div>

            {regions.map(region => (
              <TabsContent key={region.id} value={region.id} className="mt-0">
                {isEditing && tempData?.id === region.id ? (
                  <div className="flex flex-col gap-[var(--space-400)] animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 gap-x-[var(--space-600)] gap-y-[var(--space-400)]">
                      {Object.keys(tempData.fields).map((fieldName) => (
                        <div key={fieldName} className="flex flex-col gap-[var(--space-200)]">
                          <Label className="text-[length:var(--font-size-xs)] text-text-tertiary" htmlFor={`${region.id}-${fieldName}`}>{fieldName}</Label>
                          <Input
                            id={`${region.id}-${fieldName}`}
                            value={tempData.fields[fieldName]}
                            className="bg-input-background border-border focus-visible:ring-ring h-[var(--space-800)] text-[length:var(--font-size-base)] rounded-[var(--radius-input)] px-[var(--space-400)]"
                            onChange={(e) => setTempData({
                              ...tempData,
                              fields: { ...tempData.fields, [fieldName]: e.target.value }
                            })}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-[var(--space-600)] pt-[var(--space-200)]">
                       {/* Delete button only for non-default regions */}
                       {!isDefaultRegion && (
                         <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-[var(--space-150)] font-[var(--font-weight-medium)] h-[var(--space-800)] px-[var(--space-400)] rounded-[var(--radius-button)]">
                           <Trash2 className="size-[var(--icon-sm)]" /> 删除
                         </Button>
                       )}
                       {!isDefaultRegion ? <div /> : null /* Spacer if no delete button */}
                       
                       <div className={cn("flex gap-[var(--space-200)]", isDefaultRegion && "w-full justify-end")}>
                         <Button variant="outline" size="sm" onClick={handleCancel} className="font-[var(--font-weight-medium)] h-[var(--space-800)] px-[var(--space-400)] rounded-[var(--radius-button)]">取消</Button>
                         <Button size="sm" onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary-hover font-[var(--font-weight-medium)] h-[var(--space-800)] px-[var(--space-400)] rounded-[var(--radius-button)] border-none">保存</Button>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-[var(--space-600)] gap-y-[var(--space-400)] w-full">
                    {Object.entries(region.fields).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-[var(--space-100)]">
                        <span className="text-[length:var(--font-size-xs)] text-text-tertiary whitespace-nowrap">{key}</span>
                        <span className="text-[length:var(--font-size-base)] text-text">{value || '-'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  )
}
