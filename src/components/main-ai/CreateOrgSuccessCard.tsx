import * as React from "react";
import { GenericCard } from "./GenericCard";
import { Building2, CheckCircle2, MapPin, Briefcase, Mail, Phone, Users, FileText } from "lucide-react";

interface CreateOrgSuccessCardProps {
  orgId: string;
  orgName: string;
  fullName: string;
  country: string;
  industry: string;
  address: string;
  email: string;
  phone: string;
  description: string;
  memberCount: number;
  titleBelowAccessory?: React.ReactNode;
}

export function CreateOrgSuccessCard({
  orgId,
  orgName,
  fullName,
  country,
  industry,
  address,
  email,
  phone,
  description,
  memberCount,
  titleBelowAccessory,
}: CreateOrgSuccessCardProps) {
  return (
    <GenericCard
      title="组织创建成功"
      titleSuffix={<CheckCircle2 className="size-[length:var(--space-500)] shrink-0 text-success" aria-hidden />}
      titleBelowAccessory={titleBelowAccessory}
    >
      <p className="m-0 text-[length:var(--font-size-base)] text-text-secondary leading-relaxed">
        {`恭喜！企业/组织「${orgName}」已成功创建，您已自动切换到该组织。作为创建者，您拥有该组织的全部管理权限。`}
      </p>
      <div className="flex flex-col gap-[var(--space-400)] mt-[var(--space-400)]">
        {/* 组织基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-300)] p-[var(--space-400)] bg-[var(--black-alpha-11)] rounded-[var(--radius-200)] border border-border">
          <div className="flex items-start gap-[var(--space-200)]">
            <Building2 className="size-[16px] text-text-secondary shrink-0 mt-[2px]" />
            <div className="flex-1 min-w-0">
              <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-50)]">组织名称</p>
              <p className="text-[length:var(--font-size-base)] text-text font-[var(--font-weight-medium)]">{fullName}</p>
              {fullName !== orgName && (
                <p className="text-[length:var(--font-size-xs)] text-text-secondary mt-[var(--space-50)]">简称：{orgName}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-[var(--space-200)]">
            <Briefcase className="size-[16px] text-text-secondary shrink-0 mt-[2px]" />
            <div className="flex-1 min-w-0">
              <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-50)]">行业类型</p>
              <p className="text-[length:var(--font-size-base)] text-text">{industry}</p>
            </div>
          </div>

          <div className="flex items-start gap-[var(--space-200)] md:col-span-2">
            <MapPin className="size-[16px] text-text-secondary shrink-0 mt-[2px]" />
            <div className="flex-1 min-w-0">
              <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-50)]">所在地区</p>
              <p className="text-[length:var(--font-size-base)] text-text">{country}</p>
            </div>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-300)] p-[var(--space-400)] bg-[var(--black-alpha-11)] rounded-[var(--radius-200)] border border-border">
          <div className="flex items-start gap-[var(--space-200)]">
            <Mail className="size-[16px] text-text-secondary shrink-0 mt-[2px]" />
            <div className="flex-1 min-w-0">
              <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-50)]">联系邮箱</p>
              <p className="text-[length:var(--font-size-base)] text-text break-all">{email}</p>
            </div>
          </div>

          <div className="flex items-start gap-[var(--space-200)]">
            <Phone className="size-[16px] text-text-secondary shrink-0 mt-[2px]" />
            <div className="flex-1 min-w-0">
              <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-50)]">联系电话</p>
              <p className="text-[length:var(--font-size-base)] text-text">{phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-[var(--space-200)] md:col-span-2">
            <MapPin className="size-[16px] text-text-secondary shrink-0 mt-[2px]" />
            <div className="flex-1 min-w-0">
              <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-50)]">详细地址</p>
              <p className="text-[length:var(--font-size-base)] text-text">{address}</p>
            </div>
          </div>
        </div>

        {/* 组织描述 */}
        {description && (
          <div className="flex flex-col gap-[var(--space-300)] p-[var(--space-400)] bg-[var(--black-alpha-11)] rounded-[var(--radius-200)] border border-border">
            <div className="flex items-start gap-[var(--space-200)]">
              <FileText className="size-[16px] text-text-secondary shrink-0 mt-[2px]" />
              <div className="flex-1 min-w-0">
                <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-50)]">组织描述</p>
                <p className="text-[length:var(--font-size-base)] text-text">{description}</p>
              </div>
            </div>
          </div>
        )}

        {/* 成员统计 */}
        <div className="flex items-center gap-[var(--space-200)] p-[var(--space-300)] bg-success/10 border border-success/20 rounded-[var(--radius-200)]">
          <Users className="size-[16px] text-success shrink-0" />
          <p className="text-[length:var(--font-size-xs)] text-text">
            当前成员：<span className="font-[var(--font-weight-medium)]">{memberCount}</span> 人（仅您一人）
          </p>
        </div>
      </div>
    </GenericCard>
  );
}