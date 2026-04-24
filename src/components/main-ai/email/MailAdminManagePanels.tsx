import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { cn } from "../../ui/utils";
import { DEMO_BUSINESS_MAILBOXES } from "./emailCuiData";
import type { MailAdminPanelKind } from "./emailCuiData";

export type BusinessMailRow = { id: string; email: string; alias: string };
export type StaffMailRow = {
  id: string;
  name: string;
  email: string;
  status: "已开通" | "未开通";
};

function seedBusinessRows(): BusinessMailRow[] {
  return DEMO_BUSINESS_MAILBOXES.map((m) => ({
    id: m.id,
    email: m.email,
    alias: m.id === "bm_product" ? "产品对外" : "财务",
  }));
}

function seedStaffRows(): StaffMailRow[] {
  return [
    { id: "s1", name: "张三", email: "zhangsan@company.com", status: "已开通" },
    { id: "s2", name: "李四", email: "lisi@company.com", status: "已开通" },
    { id: "s3", name: "王五", email: "", status: "未开通" },
  ];
}

export function MailAdminManageList({
  kind,
  tenantName,
}: {
  kind: MailAdminPanelKind;
  tenantName: string;
}) {
  if (kind === "business") {
    return <BusinessMailAdminTable tenantName={tenantName} />;
  }
  return <StaffMailAdminTable tenantName={tenantName} />;
}

function BusinessMailAdminTable({ tenantName }: { tenantName: string }) {
  const [rows, setRows] = React.useState<BusinessMailRow[]>(seedBusinessRows);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Partial<BusinessMailRow>>({});

  const startEdit = (r: BusinessMailRow) => {
    setEditingId(r.id);
    setDraft({ ...r });
  };

  const saveEdit = () => {
    if (!editingId || !draft.email?.trim()) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === editingId
          ? {
              ...r,
              email: draft.email!.trim(),
              alias: (draft.alias ?? r.alias).trim(),
            }
          : r
      )
    );
    setEditingId(null);
    setDraft({});
  };

  const remove = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraft({});
    }
  };

  const addRow = () => {
    const id = `bm_new_${Date.now()}`;
    setRows((prev) => [...prev, { id, email: "newbox@company.com", alias: "新业务" }]);
    setEditingId(id);
    setDraft({ id, email: "newbox@company.com", alias: "新业务" });
  };

  return (
    <div className="flex flex-col gap-[var(--space-300)] min-w-0 w-full">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-200)]">
        <p className="text-[length:var(--font-size-xs)] text-text-secondary">
          租户 <span className="text-text font-[var(--font-weight-medium)]">{tenantName}</span>
        </p>
        <Button type="button" size="sm" variant="outline" className="gap-1" onClick={addRow}>
          <Plus className="size-4" strokeWidth={2} />
          新增业务邮箱
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-text-secondary">邮箱地址</TableHead>
            <TableHead className="text-text-secondary">别名 / 备注</TableHead>
            <TableHead className="text-text-secondary w-[140px] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="text-text-tertiary text-center py-8">
                暂无业务邮箱，请点击「新增业务邮箱」
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r) => (
              <TableRow key={r.id} className="border-border">
                <TableCell className="text-text max-w-[200px]">
                  {editingId === r.id ? (
                    <Input
                      value={draft.email ?? ""}
                      onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                      className="h-8 text-[length:var(--font-size-sm)]"
                    />
                  ) : (
                    <span className="truncate block">{r.email}</span>
                  )}
                </TableCell>
                <TableCell className="text-text-secondary max-w-[160px]">
                  {editingId === r.id ? (
                    <Input
                      value={draft.alias ?? ""}
                      onChange={(e) => setDraft((d) => ({ ...d, alias: e.target.value }))}
                      className="h-8 text-[length:var(--font-size-sm)]"
                    />
                  ) : (
                    r.alias
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {editingId === r.id ? (
                      <>
                        <Button type="button" size="sm" variant="default" onClick={saveEdit}>
                          保存
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(null);
                            setDraft({});
                          }}
                        >
                          取消
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={() => startEdit(r)}
                          aria-label="编辑"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-destructive hover:text-destructive"
                          onClick={() => remove(r.id)}
                          aria-label="删除"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function StaffMailAdminTable({ tenantName }: { tenantName: string }) {
  const [rows, setRows] = React.useState<StaffMailRow[]>(seedStaffRows);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Partial<StaffMailRow>>({});

  const startEdit = (r: StaffMailRow) => {
    setEditingId(r.id);
    setDraft({ ...r });
  };

  const saveEdit = () => {
    if (!editingId || !draft.name?.trim()) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === editingId
          ? {
              ...r,
              name: draft.name!.trim(),
              email: (draft.email ?? "").trim(),
              status: draft.status ?? r.status,
            }
          : r
      )
    );
    setEditingId(null);
    setDraft({});
  };

  const remove = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraft({});
    }
  };

  const addRow = () => {
    const id = `staff_${Date.now()}`;
    setRows((prev) => [
      ...prev,
      { id, name: "新成员", email: "", status: "未开通" },
    ]);
    setEditingId(id);
    setDraft({ id, name: "新成员", email: "", status: "未开通" });
  };

  return (
    <div className="flex flex-col gap-[var(--space-300)] min-w-0 w-full">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-200)]">
        <p className="text-[length:var(--font-size-xs)] text-text-secondary">
          租户 <span className="text-text font-[var(--font-weight-medium)]">{tenantName}</span>
        </p>
        <Button type="button" size="sm" variant="outline" className="gap-1" onClick={addRow}>
          <Plus className="size-4" strokeWidth={2} />
          新增成员
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-text-secondary">姓名</TableHead>
            <TableHead className="text-text-secondary">企业邮箱</TableHead>
            <TableHead className="text-text-secondary">状态</TableHead>
            <TableHead className="text-text-secondary w-[140px] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="text-text-tertiary text-center py-8">
                暂无成员记录
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r) => (
              <TableRow key={r.id} className="border-border">
                <TableCell>
                  {editingId === r.id ? (
                    <Input
                      value={draft.name ?? ""}
                      onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                      className="h-8 text-[length:var(--font-size-sm)] max-w-[140px]"
                    />
                  ) : (
                    r.name
                  )}
                </TableCell>
                <TableCell className="max-w-[200px]">
                  {editingId === r.id ? (
                    <Input
                      value={draft.email ?? ""}
                      onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                      className="h-8 text-[length:var(--font-size-sm)]"
                      placeholder="未分配可留空"
                    />
                  ) : (
                    <span className="text-text-secondary">{r.email || "—"}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === r.id ? (
                    <select
                      className={cn(
                        "h-8 rounded-[var(--radius-md)] border border-border bg-bg px-2 text-[length:var(--font-size-sm)] text-text"
                      )}
                      value={draft.status ?? r.status}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          status: e.target.value as StaffMailRow["status"],
                        }))
                      }
                    >
                      <option value="已开通">已开通</option>
                      <option value="未开通">未开通</option>
                    </select>
                  ) : (
                    <span
                      className={cn(
                        r.status === "已开通" ? "text-[var(--color-success-text,#15803d)]" : "text-text-tertiary"
                      )}
                    >
                      {r.status}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {editingId === r.id ? (
                      <>
                        <Button type="button" size="sm" variant="default" onClick={saveEdit}>
                          保存
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(null);
                            setDraft({});
                          }}
                        >
                          取消
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={() => startEdit(r)}
                          aria-label="编辑"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-destructive hover:text-destructive"
                          onClick={() => remove(r.id)}
                          aria-label="删除"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
