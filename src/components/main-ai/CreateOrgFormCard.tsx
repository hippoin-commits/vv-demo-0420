import * as React from "react";
import { GenericFormCard } from "./GenericFormCard";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChatPromptButton } from "../chat/ChatPromptButton";
import { Building2, MapPin, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface CreateOrgFormCardProps {
  onSubmit: (data: { 
    country: string;
    industry: string;
    fullName: string;
    shortName: string;
    logo?: File;
    address: string;
    email: string;
    phoneCode: string;
    phone: string;
    description: string;
  }) => void;
  onCancel: () => void;
}

export function CreateOrgFormCard({ onSubmit, onCancel }: CreateOrgFormCardProps) {
  const [country, setCountry] = React.useState("中国大陆");
  const [industry, setIndustry] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [shortName, setShortName] = React.useState("");
  const [logo, setLogo] = React.useState<File | undefined>(undefined);
  const [address, setAddress] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneCode, setPhoneCode] = React.useState("+65");
  const [phone, setPhone] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleReset = () => {
    setCountry("中国大陆");
    setIndustry("");
    setFullName("");
    setShortName("");
    setLogo(undefined);
    setAddress("");
    setEmail("");
    setPhoneCode("+65");
    setPhone("");
    setDescription("");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!country.trim()) newErrors.country = "国家/地区不能为空";
    if (!industry.trim()) newErrors.industry = "行业不能为空";
    if (!fullName.trim()) newErrors.fullName = "企业/组织全称不能为空";
    if (!address.trim()) newErrors.address = "地址不能为空";
    if (!email.trim()) {
      newErrors.email = "邮箱不能为空";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "邮箱格式不正确";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({
      country: country.trim(),
      industry: industry.trim(),
      fullName: fullName.trim(),
      shortName: shortName.trim(),
      logo,
      address: address.trim(),
      email: email.trim(),
      phoneCode,
      phone: phone.trim(),
      description: description.trim()
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        setErrors({ ...errors, logo: "图片大小不能超过 100 MB" });
        return;
      }
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
        setErrors({ ...errors, logo: "仅支持 jpg、png、gif 格式" });
        return;
      }
      setLogo(file);
      if (errors.logo) {
        const newErrors = { ...errors };
        delete newErrors.logo;
        setErrors(newErrors);
      }
    }
  };

  return (
    <>
      <GenericFormCard 
        title={
          <div className="flex items-center gap-[var(--space-200)]">
            <Building2 className="w-[16px] h-[16px] text-text-tertiary" />
            <span>创建企业/组织</span>
          </div>
        }
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitText="确定创建"
        resetText="重置"
      >
        <div className="flex flex-col gap-[var(--space-600)]">
          {/* 企业信息分组标题 */}
          <div className="flex items-center gap-[var(--space-200)]">
            <div className="w-[3px] h-[16px] bg-primary rounded-full" />
            <h3 className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
              企业信息
            </h3>
          </div>

          {/* 国家/地区 和 行业 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-400)]">
            <div className="flex flex-col gap-[var(--space-200)]">
              <label className="text-[length:var(--font-size-sm)] text-text">
                国家/地区 <span className="text-error">*</span>
              </label>
              <Select
                value={country}
                onValueChange={(value) => {
                  setCountry(value);
                  if (errors.country) {
                    const newErrors = { ...errors };
                    delete newErrors.country;
                    setErrors(newErrors);
                  }
                }}
              >
                <SelectTrigger className="w-full" error={!!errors.country}>
                  <SelectValue placeholder="请选择国家/地区" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="中国大陆">中国大陆</SelectItem>
                  <SelectItem value="中国香港">中国香港</SelectItem>
                  <SelectItem value="中国台湾">中国台湾</SelectItem>
                  <SelectItem value="新加坡">新加坡</SelectItem>
                  <SelectItem value="美国">美国</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-[length:var(--font-size-xs)] text-error">{errors.country}</p>
              )}
            </div>

            <div className="flex flex-col gap-[var(--space-200)]">
              <label className="text-[length:var(--font-size-sm)] text-text">
                行业 <span className="text-error">*</span>
              </label>
              <Select
                value={industry}
                onValueChange={(value) => {
                  setIndustry(value);
                  if (errors.industry) {
                    const newErrors = { ...errors };
                    delete newErrors.industry;
                    setErrors(newErrors);
                  }
                }}
              >
                <SelectTrigger className="w-full" error={!!errors.industry}>
                  <SelectValue placeholder="所属行业类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="教育行业">教育行业</SelectItem>
                  <SelectItem value="互联网/信息技术">互联网/信息技术</SelectItem>
                  <SelectItem value="制造业">制造业</SelectItem>
                  <SelectItem value="贸易/批发/零售">贸易/批发/零售</SelectItem>
                  <SelectItem value="房地产业">房地产业</SelectItem>
                  <SelectItem value="建筑业">建筑业</SelectItem>
                  <SelectItem value="金融业">金融业</SelectItem>
                  <SelectItem value="医疗健康">医疗健康</SelectItem>
                  <SelectItem value="文化娱乐">文化娱乐</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-[length:var(--font-size-xs)] text-error">{errors.industry}</p>
              )}
            </div>
          </div>

          {/* 企业/组织全称 和 简称 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-400)]">
            <div className="flex flex-col gap-[var(--space-200)]">
              <label className="text-[length:var(--font-size-sm)] text-text">
                企业/组织全称 <span className="text-error">*</span>
              </label>
              <Input
                placeholder="企业工商注册名称"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) {
                    const newErrors = { ...errors };
                    delete newErrors.fullName;
                    setErrors(newErrors);
                  }
                }}
                className={errors.fullName ? "border-error" : ""}
              />
              {errors.fullName && (
                <p className="text-[length:var(--font-size-xs)] text-error">{errors.fullName}</p>
              )}
            </div>

            <div className="flex flex-col gap-[var(--space-200)]">
              <label className="text-[length:var(--font-size-sm)] text-text">
                简称
              </label>
              <Input
                placeholder="企业对外简称"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
              />
            </div>
          </div>

          {/* Logo 上传 */}
          <div className="flex flex-col gap-[var(--space-200)]">
            <label className="text-[length:var(--font-size-sm)] text-text">
              Logo
            </label>
            <label className="flex flex-col items-center justify-center w-[130px] h-[130px] border-2 border-dashed border-border rounded-[var(--radius-200)] cursor-pointer hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleLogoChange}
                className="hidden"
              />
              {logo ? (
                <div className="flex flex-col items-center gap-[var(--space-100)]">
                  <img 
                    src={URL.createObjectURL(logo)} 
                    alt="Logo preview" 
                    className="w-[80px] h-[80px] object-contain"
                  />
                  <span className="text-[length:var(--font-size-xs)] text-text-tertiary">
                    点击更换
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-[var(--space-200)]">
                  <Upload className="w-[24px] h-[24px] text-text-tertiary" />
                  <span className="text-[length:var(--font-size-sm)] text-text-tertiary">
                    上传图片
                  </span>
                </div>
              )}
            </label>
            <p className="text-[length:var(--font-size-xs)] text-text-tertiary">
              支持jpg、png、gif格式，图片大小不超过 100 MB，仅支持上传 1 张
            </p>
            {errors.logo && (
              <p className="text-[length:var(--font-size-xs)] text-error">{errors.logo}</p>
            )}
          </div>

          {/* 地址 */}
          <div className="flex flex-col gap-[var(--space-200)]">
            <label className="text-[length:var(--font-size-sm)] text-text">
              地址 <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Input
                placeholder="企业办公地址"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) {
                    const newErrors = { ...errors };
                    delete newErrors.address;
                    setErrors(newErrors);
                  }
                }}
                className={`pr-[var(--space-1000)] ${errors.address ? "border-error" : ""}`}
              />
              <MapPin className="absolute right-[var(--space-300)] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-tertiary" />
            </div>
            {errors.address && (
              <p className="text-[length:var(--font-size-xs)] text-error">{errors.address}</p>
            )}
          </div>

          {/* 邮箱 和 电话 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-400)]">
            <div className="flex flex-col gap-[var(--space-200)]">
              <label className="text-[length:var(--font-size-sm)] text-text">
                邮箱 <span className="text-error">*</span>
              </label>
              <Input
                type="email"
                placeholder="企业官方邮箱"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    const newErrors = { ...errors };
                    delete newErrors.email;
                    setErrors(newErrors);
                  }
                }}
                className={errors.email ? "border-error" : ""}
              />
              {errors.email && (
                <p className="text-[length:var(--font-size-xs)] text-error">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-[var(--space-200)]">
              <label className="text-[length:var(--font-size-sm)] text-text">
                电话
              </label>
              <div className="flex gap-[var(--space-200)]">
                <Select value={phoneCode} onValueChange={setPhoneCode}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="区号" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+65">🇸🇬 +65</SelectItem>
                    <SelectItem value="+86">🇨🇳 +86</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+852">🇭🇰 +852</SelectItem>
                    <SelectItem value="+886">🇹🇼 +886</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  placeholder="企业官方电话"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* 介绍 */}
          <div className="flex flex-col gap-[var(--space-200)]">
            <label className="text-[length:var(--font-size-sm)] text-text">
              介绍
            </label>
            <Textarea
              placeholder="如企业基本信息、核心业务、使命/愿景等"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              showCount
              maxLength={5000}
            />
          </div>
        </div>
      </GenericFormCard>

      {/* Prompt Buttons - Outside the card */}
      <div className="flex flex-wrap gap-[var(--space-200)] mt-[var(--space-200)]">
        
        
      </div>
    </>
  );
}