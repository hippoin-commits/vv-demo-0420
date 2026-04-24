import React, { useState } from "react";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "./ui/select";

const COMPONENTS = [
  "Button",
  "Card",
  "Checkbox",
  "Dialog",
  "Form",
  "Input",
  "Select",
  "Label",
  "Popover",
  "Radio",
  "Table",
  "Tabs",
  "Tooltip",
];

export function ComponentShowcase() {
  const [activeTab, setActiveTab] = useState(COMPONENTS[0]);

  return (
    <div className="flex flex-col flex-1 relative w-full h-full min-h-0 bg-bg">
      <div className="flex items-stretch relative w-full flex-1 min-h-0">
        {/* Left Navigation */}
        <div className="bg-bg-secondary gap-[var(--space-200)] flex flex-col items-start overflow-y-auto overflow-x-hidden hide-scrollbar-until-hover container-hover-scrollbar relative shrink-0 w-[200px] p-[var(--space-500)] [overflow-y:overlay]">
          {COMPONENTS.map((comp) => (
            <button
              key={comp}
              onClick={() => setActiveTab(comp)}
              className={cn(
                "h-[var(--space-900)] w-full rounded-[var(--radius-200)] flex items-center px-[var(--space-350)] shrink-0 text-[length:var(--font-size-base)] leading-normal transition-colors",
                activeTab === comp
                  ? "bg-bg text-primary font-[var(--font-weight-medium)] shadow-xs"
                  : "bg-transparent text-text-tertiary hover:bg-[var(--black-alpha-11)] font-[var(--font-weight-regular)]"
              )}
            >
              {comp}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="flex-1 relative overflow-hidden overflow-y-auto hide-scrollbar-until-hover container-hover-scrollbar flex flex-col [overflow-y:overlay]">
          <div className="flex-1 overflow-y-auto p-[var(--space-800)] hide-scrollbar-until-hover container-hover-scrollbar [overflow-y:overlay]">
            <div className="mx-auto space-y-8 pb-12">
              {activeTab === "Button" && <ButtonShowcase />}
              {activeTab === "Card" && <CardShowcase />}
              {activeTab === "Checkbox" && <CheckboxShowcase />}
              {activeTab === "Dialog" && <DialogShowcase />}
              {activeTab === "Form" && <FormShowcase />}
              {activeTab === "Input" && <InputShowcase />}
              {activeTab === "Select" && <SelectShowcase />}
              {activeTab === "Label" && <LabelShowcase />}
              {activeTab === "Popover" && <PopoverShowcase />}
              {activeTab === "Radio" && <RadioShowcase />}
              {activeTab === "Table" && <TableShowcase />}
              {activeTab === "Tabs" && <TabsShowcase />}
              {activeTab === "Tooltip" && <TooltipShowcase />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -- Individual Showcases --

function ButtonShowcase() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)] text-text">Variants (变体)</h3>
        <div className="flex flex-wrap gap-[var(--space-400)] items-center p-[var(--space-600)] border border-border rounded-[var(--radius-lg)] bg-bg-secondary">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="dashed">Dashed</Button>
          <Button variant="dashedBlue">Dashed Blue</Button>
          <Button variant="text">Text</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)] text-text">Sizes (尺寸)</h3>
        <div className="flex flex-wrap gap-[var(--space-400)] items-end p-[var(--space-600)] border border-border rounded-[var(--radius-lg)] bg-bg-secondary">
          <Button size="xl">Extra Large (xl)</Button>
          <Button size="lg">Large (lg)</Button>
          <Button size="default">Default</Button>
          <Button size="sm">Small (sm)</Button>
          <Button size="xs">Extra Small (xs)</Button>
          <Button size="mini">Mini</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)] text-text">States (状态)</h3>
        <div className="flex flex-wrap gap-[var(--space-400)] items-center p-[var(--space-600)] border border-border rounded-[var(--radius-lg)] bg-bg-secondary">
          <Button disabled>Disabled Primary</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
          {/* Note: In actual usage, Button might support loading prop or children with spinner */}
          <Button>Active State</Button>
        </div>
      </div>
    </div>
  );
}

function CardShowcase() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>基础卡片 (Basic Card)</CardTitle>
          <CardDescription>这是一个基础卡片的描述信息。</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[length:var(--font-size-base)] text-text-secondary">卡片的内容区域，可放置任何所需的信息组件。</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-[var(--space-200)] border-t border-border pt-[var(--space-400)]">
          <Button variant="outline" size="sm">取消</Button>
          <Button size="sm">确认</Button>
        </CardFooter>
      </Card>

      <Card className="bg-[var(--blue-12)] border-[var(--blue-10)]">
        <CardHeader>
          <CardTitle className="text-[var(--blue-2)]">带样式的卡片</CardTitle>
          <CardDescription className="text-[var(--blue-3)]">可通过 className 覆盖样式。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-[var(--blue-11)] rounded-[var(--radius-md)] flex items-center justify-center text-[var(--blue-4)] text-[length:var(--font-size-base)]">
            自定义内容区块
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CheckboxShowcase() {
  return (
    <div className="space-y-6">
      <div className="p-[var(--space-600)] border border-border rounded-[var(--radius-lg)] space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="c1" defaultChecked />
          <Label htmlFor="c1" className="font-normal">默认选中 (Checked)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="c2" />
          <Label htmlFor="c2" className="font-normal">默认未选 (Unchecked)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="c3" disabled />
          <Label htmlFor="c3" className="font-normal text-text-muted">禁用状态 (Disabled Unchecked)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="c4" disabled defaultChecked />
          <Label htmlFor="c4" className="font-normal text-text-muted">禁用且选中 (Disabled Checked)</Label>
        </div>
      </div>
    </div>
  );
}

function DialogShowcase() {
  return (
    <div className="p-6 border rounded-lg flex gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>打开基础弹窗 (Open Dialog)</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>编辑个人信息</DialogTitle>
            <DialogDescription>
              在这里修改你的个人信息。点击保存以应用更改。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 px-5">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">姓名</Label>
              <Input id="name" defaultValue="张三" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">用户名</Label>
              <Input id="username" defaultValue="@zhangsan" className="col-span-3" />
            </div>
          </div>
          <DialogFooter className="px-5 pb-5 mt-0">
            <Button type="submit">保存更改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FormShowcase() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>业务表单 (Business Form)</CardTitle>
        <CardDescription>结合使用 Label, Input, Checkbox 和 Button 模拟一个表单。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">邮箱地址</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">密码</Label>
          <Input id="password" type="password" placeholder="请输入密码" />
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="font-normal">记住我</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">登录</Button>
      </CardFooter>
    </Card>
  );
}

function InputShowcase() {
  return (
    <div className="space-y-6 max-w-sm">
      <div className="space-y-2">
        <Label>基础输入框 (Default)</Label>
        <Input placeholder="请输入内容..." />
      </div>
      <div className="space-y-2">
        <Label>带搜索图标 (Search Variant)</Label>
        <Input variant="search" placeholder="搜索..." />
      </div>
      <div className="space-y-2">
        <Label>带默认值 (With Value)</Label>
        <Input defaultValue="这是默认文本" />
      </div>
      <div className="space-y-2">
        <Label>禁用状态 (Disabled)</Label>
        <Input disabled placeholder="不可输入的表单" />
      </div>
    </div>
  );
}

function SelectShowcase() {
  const [value, setValue] = useState<string>("");
  const [clearableValue, setClearableValue] = useState<string>("option2");

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)] text-text">基础选择 (Basic Select)</h3>
        <div className="p-[var(--space-600)] border border-border rounded-[var(--radius-lg)] bg-bg-secondary max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>默认选择器</Label>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择一个选项..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">苹果 Apple</SelectItem>
                <SelectItem value="banana">香蕉 Banana</SelectItem>
                <SelectItem value="orange">橙子 Orange</SelectItem>
                <SelectItem value="grape">葡萄 Grape</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)] text-text">可清空选择 (Clearable Select)</h3>
        <div className="p-[var(--space-600)] border border-border rounded-[var(--radius-lg)] bg-bg-secondary max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>带清除按钮的选择器 (悬停显示)</Label>
            <Select value={clearableValue} onValueChange={setClearableValue} allowClear>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择一个选项..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">选项 1</SelectItem>
                <SelectItem value="option2">选项 2 (默认)</SelectItem>
                <SelectItem value="option3">选项 3</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[length:var(--font-size-xs)] text-text-muted">当前值: {clearableValue || "无"}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)] text-text">分组选择 (Grouped Select)</h3>
        <div className="p-[var(--space-600)] border border-border rounded-[var(--radius-lg)] bg-bg-secondary max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>带分组的选择器</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择框架..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>前端框架</SelectLabel>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>后端框架</SelectLabel>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="nestjs">NestJS</SelectItem>
                  <SelectItem value="django">Django</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)] text-text">禁用状态 (Disabled States)</h3>
        <div className="p-[var(--space-600)] border border-border rounded-[var(--radius-lg)] bg-bg-secondary max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>完全禁用</Label>
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="不可选择的表单" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">选项 1</SelectItem>
                <SelectItem value="option2">选项 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>部分选项禁用</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择一个选项..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available1">可用选项 1</SelectItem>
                <SelectItem value="disabled1" disabled>禁用选项 1</SelectItem>
                <SelectItem value="available2">可用选项 2</SelectItem>
                <SelectItem value="disabled2" disabled>禁用选项 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)] text-text">错误状态 (Error State)</h3>
        <div className="p-[var(--space-600)] border border-border rounded-[var(--radius-lg)] bg-bg-secondary max-w-sm space-y-4">
          <div className="space-y-2">
            <Label className="text-[var(--color-error)]">必填项</Label>
            <Select>
              <SelectTrigger className="w-full" error>
                <SelectValue placeholder="请选择必填项..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">选项 1</SelectItem>
                <SelectItem value="option2">选项 2</SelectItem>
                <SelectItem value="option3">选项 3</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[length:var(--font-size-xs)] text-[var(--color-error)]">此字段为必填项</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelShowcase() {
  return (
    <div className="space-y-6 p-[var(--space-600)] border border-border rounded-[var(--radius-lg)]">
      <div className="flex items-center space-x-4">
        <Label htmlFor="demo-input" className="w-24">标准标签</Label>
        <Input id="demo-input" placeholder="输入关联内容..." />
      </div>
      <div className="flex flex-col space-y-2">
        <Label className="text-[var(--blue-3)] font-bold">带自定义样式的标签</Label>
        <p className="text-[length:var(--font-size-base)] text-text-muted">Label 组件可以自由传递 className 改变其呈现效果。</p>
      </div>
    </div>
  );
}

function PopoverShowcase() {
  return (
    <div className="p-[var(--space-600)] border border-border rounded-[var(--radius-lg)]">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">点击打开气泡卡片 (Popover)</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-[var(--font-weight-medium)] leading-none">尺寸设置</h4>
              <p className="text-[length:var(--font-size-base)] text-text-muted">
                调整此组件的展示尺寸。
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">宽度 (Width)</Label>
                <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="max-width">最大宽</Label>
                <Input id="max-width" defaultValue="300px" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function RadioShowcase() {
  return (
    <div className="p-[var(--space-600)] border border-border rounded-[var(--radius-lg)] max-w-sm">
      <RadioGroup defaultValue="option-one">
        <div className="flex items-center space-x-2 py-2">
          <RadioGroupItem value="option-one" id="r1" />
          <Label htmlFor="r1" className="font-normal cursor-pointer">选项 1 (Option One)</Label>
        </div>
        <div className="flex items-center space-x-2 py-2">
          <RadioGroupItem value="option-two" id="r2" />
          <Label htmlFor="r2" className="font-normal cursor-pointer">选项 2 (Option Two)</Label>
        </div>
        <div className="flex items-center space-x-2 py-2">
          <RadioGroupItem value="option-disabled" id="r3" disabled />
          <Label htmlFor="r3" className="font-normal text-text-muted">选项 3 (Disabled)</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

function TableShowcase() {
  const data = [
    { invoice: "INV-001", status: "Paid", method: "Credit Card", amount: "$250.00" },
    { invoice: "INV-002", status: "Pending", method: "PayPal", amount: "$150.00" },
    { invoice: "INV-003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
    { invoice: "INV-004", status: "Paid", method: "Credit Card", amount: "$450.00" },
  ];

  return (
    <div className="border border-border rounded-[var(--radius-lg)] bg-bg overflow-hidden">
      <Table>
        <TableHeader className="bg-bg-secondary">
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.invoice}>
              <TableCell className="font-[var(--font-weight-medium)]">{row.invoice}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell className="text-right font-[var(--font-weight-medium)]">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TabsShowcase() {
  return (
    <div className="max-w-md">
      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">账户 (Account)</TabsTrigger>
          <TabsTrigger value="password">密码 (Password)</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>账户配置</CardTitle>
              <CardDescription>
                在这里更新你的账户设置，点击保存生效。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="tab-name">姓名</Label>
                <Input id="tab-name" defaultValue="张三" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>保存更改</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>修改密码</CardTitle>
              <CardDescription>
                请确保你的新密码足够安全。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="current">当前密码</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">新密码</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>更新密码</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TooltipShowcase() {
  return (
    <div className="flex gap-[var(--space-800)] p-[var(--space-1200)] border border-border rounded-[var(--radius-lg)] bg-bg-secondary justify-center items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">悬停查看提示 (Hover me)</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>这是一个气泡提示内容</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-xl" className="w-10 h-10 rounded-full bg-bg border border-border shadow-elevation-sm">
              +
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>点击新增一项</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}