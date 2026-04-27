import * as React from "react";
import {
  SquarePlus,
  MapPin,
  Upload,
  Info,
  Undo2,
  Redo2,
  Type as TypeIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Smile,
  Quote,
  IndentIncrease,
  IndentDecrease,
  Plus,
  ChevronDown,
} from "lucide-react";
import { GenericFormCard } from "./GenericFormCard";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

/** 行政公司 → 国家/地区 自动带入关系（设计稿示例数据） */
const ADMIN_COMPANY_COUNTRY_MAP: Record<string, string> = {
  "VVAI教育集团": "新加坡",
  "小测教育机构": "中国大陆",
  "VV Education HK": "中国香港",
};

export interface CreateInstitutionEducationSpaceData {
  name: string;
  shortName: string;
  logo?: File;
  slogan: string;
  adminCompany: string;
  country: string;
  location: string;
  email: string;
  phoneCode: string;
  phone: string;
  description: string;
}

interface CreateInstitutionEducationSpaceCardProps {
  onSubmit: (data: CreateInstitutionEducationSpaceData) => void;
  onCancel?: () => void;
  /** 主 AI：表单卡标题下教育空间切换 */
  mainAiTitleBelowAccessory?: React.ReactNode;
}

/**
 * 创建机构教育空间表单卡片（CUI 卡片规范）
 * 对应 Figma：名称 / 机构对外简称 / Logo / 宣传语 / 行政公司 / 国家/地区 / 地点 / 邮箱 / 电话 / 介绍
 */
export function CreateInstitutionEducationSpaceCard({
  onSubmit,
  mainAiTitleBelowAccessory,
}: CreateInstitutionEducationSpaceCardProps) {
  const [name, setName] = React.useState("");
  const [shortName, setShortName] = React.useState("");
  const [logo, setLogo] = React.useState<File | undefined>(undefined);
  const [slogan, setSlogan] = React.useState("");
  const [adminCompany, setAdminCompany] = React.useState("VVAI教育集团");
  const [country, setCountry] = React.useState(
    ADMIN_COMPANY_COUNTRY_MAP["VVAI教育集团"] ?? "新加坡",
  );
  const [location, setLocation] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneCode, setPhoneCode] = React.useState("+65");
  const [phone, setPhone] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleReset = () => {
    setName("");
    setShortName("");
    setLogo(undefined);
    setSlogan("");
    setAdminCompany("VVAI教育集团");
    setCountry(ADMIN_COMPANY_COUNTRY_MAP["VVAI教育集团"] ?? "新加坡");
    setLocation("");
    setEmail("");
    setPhoneCode("+65");
    setPhone("");
    setDescription("");
    setErrors({});
  };

  const handleSubmit = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "名称不能为空";
    if (!shortName.trim()) next.shortName = "机构对外简称不能为空";
    if (!adminCompany.trim()) next.adminCompany = "行政公司不能为空";
    if (!country.trim()) next.country = "国家/地区不能为空";
    if (!location.trim()) next.location = "地点不能为空";
    if (!email.trim()) {
      next.email = "邮箱不能为空";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "邮箱格式不正确";
    }
    if (!description.trim()) next.description = "介绍不能为空";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setIsSubmitted(true);
    onSubmit({
      name: name.trim(),
      shortName: shortName.trim(),
      logo,
      slogan: slogan.trim(),
      adminCompany,
      country,
      location: location.trim(),
      email: email.trim(),
      phoneCode,
      phone: phone.trim(),
      description: description.trim(),
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, logo: "图片大小不能超过 100 MB" }));
      return;
    }
    if (!["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, logo: "仅支持 jpg、png、gif 格式" }));
      return;
    }
    setLogo(file);
    clearError("logo");
  };

  return (
    <GenericFormCard
      title="创建教育空间"
      icon={<SquarePlus className="w-[18px] h-[18px]" />}
      titleBelowAccessory={mainAiTitleBelowAccessory}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitText="确定创建"
      resetText="重置"
      isSubmitted={isSubmitted}
    >
      <div className="flex flex-col gap-[var(--space-500)]">
        {/* 名称 */}
        <FieldRow label="名称" required error={errors.name}>
          <Input
            placeholder="请输入"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError("name");
            }}
            className={errors.name ? "border-error" : ""}
          />
        </FieldRow>

        {/* 机构对外简称 */}
        <FieldRow label="机构对外简称" required error={errors.shortName}>
          <Input
            placeholder="请输入"
            value={shortName}
            onChange={(e) => {
              setShortName(e.target.value);
              clearError("shortName");
            }}
            className={errors.shortName ? "border-error" : ""}
          />
        </FieldRow>

        {/* Logo */}
        <FieldRow label="Logo">
          <div className="flex flex-col gap-[var(--space-200)]">
            <label
              className="flex items-center justify-center w-[88px] h-[88px] border border-dashed border-border rounded-[var(--radius-200)] cursor-pointer hover:border-primary transition-colors bg-bg-secondary/50"
              aria-label="上传 Logo"
            >
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleLogoChange}
                className="hidden"
              />
              {logo ? (
                <img
                  src={URL.createObjectURL(logo)}
                  alt="Logo 预览"
                  className="w-[72px] h-[72px] object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-[var(--space-100)] text-text-tertiary">
                  <Upload className="w-[18px] h-[18px]" />
                </div>
              )}
            </label>
            <p className="text-[length:var(--font-size-xs)] text-text-tertiary leading-[18px]">
              支持jpg、png、gif格式，图片大小不超过 100 MB，仅支持上传 1 张
            </p>
            {errors.logo && (
              <p className="text-[length:var(--font-size-xs)] text-error">{errors.logo}</p>
            )}
          </div>
        </FieldRow>

        {/* 宣传语 */}
        <FieldRow label="宣传语">
          <Textarea
            placeholder="请输入"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            rows={1}
            showCount
            maxLength={100}
            className="min-h-[36px]"
          />
        </FieldRow>

        {/* 行政公司 */}
        <FieldRow label="行政公司" required error={errors.adminCompany}>
          <Select
            value={adminCompany}
            onValueChange={(v) => {
              setAdminCompany(v);
              const mapped = ADMIN_COMPANY_COUNTRY_MAP[v];
              if (mapped) setCountry(mapped);
              clearError("adminCompany");
              clearError("country");
            }}
          >
            <SelectTrigger className="w-full" error={!!errors.adminCompany}>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VVAI教育集团">VVAI教育集团</SelectItem>
              <SelectItem value="小测教育机构">小测教育机构</SelectItem>
              <SelectItem value="VV Education HK">VV Education HK</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>

        {/* 国家/地区（根据行政公司自动带入） */}
        <FieldRow
          label="国家/地区"
          required
          error={errors.country}
          hint="根据行政公司自动带入，我们会根据位置信息，为您提供更好的本地化和数据存储服务"
        >
          <Input
            value={country}
            readOnly
            placeholder="新加坡"
            className="bg-bg-secondary/60"
          />
        </FieldRow>

        {/* 地点 */}
        <FieldRow label="地点" required error={errors.location}>
          <div className="relative">
            <Input
              placeholder="请输入"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                clearError("location");
              }}
              className={`pr-[var(--space-900)] ${errors.location ? "border-error" : ""}`}
            />
            <MapPin className="absolute right-[var(--space-300)] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-text-tertiary" />
          </div>
        </FieldRow>

        {/* 邮箱 + 电话 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-400)]">
          <FieldRow
            label={
              <span className="inline-flex items-center gap-[var(--space-100)]">
                邮箱
                <Info className="w-[12px] h-[12px] text-text-tertiary" />
              </span>
            }
            required
            error={errors.email}
          >
            <Input
              type="email"
              placeholder="请输入"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              className={errors.email ? "border-error" : ""}
            />
          </FieldRow>

          <FieldRow label="电话">
            <div className="flex gap-[var(--space-200)]">
              <Select value={phoneCode} onValueChange={setPhoneCode}>
                <SelectTrigger className="w-[104px]">
                  <SelectValue placeholder="区号" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+65">🇸🇬 +65</SelectItem>
                  <SelectItem value="+86">🇨🇳 +86</SelectItem>
                  <SelectItem value="+852">🇭🇰 +852</SelectItem>
                  <SelectItem value="+886">🇹🇼 +886</SelectItem>
                  <SelectItem value="+1">🇺🇸 +1</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="tel"
                placeholder="请输入"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1"
              />
            </div>
          </FieldRow>
        </div>

        {/* 介绍（富文本，这里用装饰性工具条 + Textarea 近似呈现） */}
        <FieldRow label="介绍" required error={errors.description}>
          <div
            className={`flex flex-col rounded-[var(--radius-200)] border ${errors.description ? "border-error" : "border-border"} overflow-hidden`}
          >
            <RichTextToolbarStub />
            <Textarea
              placeholder="可输入您的办学优势，例如独特的教育理念、雄厚的师资力量、创新的课程体系等。"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                clearError("description");
              }}
              rows={5}
              showCount
              maxLength={5000}
              className="border-0 rounded-none shadow-none focus-visible:ring-0"
            />
          </div>
        </FieldRow>
      </div>
    </GenericFormCard>
  );
}

/** 统一标签 + 输入区 + 错误/提示 的字段行 */
function FieldRow({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: React.ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[var(--space-200)]">
      <label className="text-[length:var(--font-size-sm)] text-text leading-[20px]">
        {label}
        {required && <span className="text-error ml-[var(--space-100)]">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[length:var(--font-size-xs)] text-text-tertiary leading-[18px]">
          {hint}
        </p>
      )}
      {error && (
        <p className="text-[length:var(--font-size-xs)] text-error leading-[18px]">{error}</p>
      )}
    </div>
  );
}

/** 装饰性富文本工具条：仅用于还原 Figma 视觉，不具备真实编辑能力（CUI 示例）。 */
function RichTextToolbarStub() {
  const btn =
    "inline-flex items-center gap-[var(--space-100)] h-[28px] px-[var(--space-150)] rounded-[var(--radius-150)] text-text-secondary hover:bg-bg-secondary text-[length:var(--font-size-xs)]";
  const divider = "w-px h-[16px] bg-border mx-[var(--space-100)]";
  return (
    <div className="flex flex-col gap-[var(--space-100)] px-[var(--space-200)] py-[var(--space-150)] border-b border-border bg-bg-secondary/40">
      <div className="flex flex-wrap items-center gap-[var(--space-100)]">
        <button type="button" className={btn} aria-label="撤销"><Undo2 className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="重做"><Redo2 className="w-[14px] h-[14px]" /></button>
        <span className={divider} />
        <button type="button" className={btn}><TypeIcon className="w-[14px] h-[14px]" />字号 <ChevronDown className="w-[12px] h-[12px]" /></button>
        <button type="button" className={btn}>行高 <ChevronDown className="w-[12px] h-[12px]" /></button>
        <button type="button" className={btn}>字间距 <ChevronDown className="w-[12px] h-[12px]" /></button>
        <span className={divider} />
        <button type="button" className={btn} aria-label="字体颜色">A</button>
        <button type="button" className={btn} aria-label="加粗"><Bold className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="斜体"><Italic className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="下划线"><Underline className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="删除线"><Strikethrough className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="表情"><Smile className="w-[14px] h-[14px]" /></button>
      </div>
      <div className="flex flex-wrap items-center gap-[var(--space-100)]">
        <button type="button" className={btn} aria-label="左对齐"><AlignLeft className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="居中对齐"><AlignCenter className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="右对齐"><AlignRight className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="两端对齐"><AlignJustify className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="无序列表"><List className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="有序列表"><ListOrdered className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="引用"><Quote className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="增加缩进"><IndentIncrease className="w-[14px] h-[14px]" /></button>
        <button type="button" className={btn} aria-label="减少缩进"><IndentDecrease className="w-[14px] h-[14px]" /></button>
        <span className={divider} />
        <button type="button" className={btn}><Plus className="w-[14px] h-[14px]" />插入 <ChevronDown className="w-[12px] h-[12px]" /></button>
      </div>
    </div>
  );
}
