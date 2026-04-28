import { useState } from "react";
import { ChatView } from "./components/ChatView";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "./components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./components/ui/hover-card";
import { ComponentShowcase } from "./components/ComponentShowcase";
import { useNavigate } from "react-router";
import {
  DEMO_HOME_ARCHIVED_NAV_ENTRIES,
  DEMO_HOME_INTERACTION_DEMO_INSTRUCTIONS_ENTRY,
  DEMO_HOME_INTERACTION_RULES_ENTRY,
  DEMO_HOME_PRIMARY_NAV_ENTRIES,
} from "./constants/demoHomeNavEntries";
import { CHAT_BUSINESS_ENTRY_DRAWER_SHEET_CLASSNAME } from "./constants/chatBusinessEntryDrawer";

export function Home() {
  const [open, setOpen] = useState(false);
  const [componentsOpen, setComponentsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto flex items-center justify-center bg-bg p-6">
      {/* 单列包裹各入口，仅整列在视口居中，中间不会出现大块空白 */}
      <div className="flex w-full max-w-sm flex-col items-center gap-6 shrink-0">
        <Button
          variant="chat-submit"
          className="w-full whitespace-normal text-center leading-snug py-[var(--space-250)]"
          onClick={() => navigate(DEMO_HOME_INTERACTION_DEMO_INSTRUCTIONS_ENTRY.path)}
        >
          {DEMO_HOME_INTERACTION_DEMO_INSTRUCTIONS_ENTRY.label}
        </Button>

        <Button
          variant="chat-reset"
          className="w-full whitespace-normal text-center leading-snug py-[var(--space-250)]"
          onClick={() => navigate(DEMO_HOME_INTERACTION_RULES_ENTRY.path)}
        >
          {DEMO_HOME_INTERACTION_RULES_ENTRY.label}
        </Button>

        <div className="w-full shrink-0 flex justify-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="chat-reset" className="w-full whitespace-normal text-center leading-snug py-[var(--space-250)]">
                业务入口
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={CHAT_BUSINESS_ENTRY_DRAWER_SHEET_CLASSNAME}>
              <div className="sr-only">
                <SheetTitle>Chat View</SheetTitle>
                <SheetDescription>业务入口抽屉视图</SheetDescription>
              </div>
              <ChatView onClose={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="w-full shrink-0 flex justify-center">
          <Dialog open={componentsOpen} onOpenChange={setComponentsOpen}>
            <DialogTrigger asChild>
              <Button variant="chat-reset" className="w-full whitespace-normal text-center leading-snug py-[var(--space-250)]">
                组件展示
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="max-w-[calc(100vw-80px)] w-[1200px] max-h-[calc(100vh-80px)] flex flex-col overflow-hidden gap-0 p-0 border border-border"
            >
              <DialogHeader className="shrink-0">
                <DialogTitle>组件库</DialogTitle>
                <DialogDescription className="sr-only">这是一个展示所有组件示例的弹窗</DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-hidden min-h-0 relative w-full flex flex-col">
                <ComponentShowcase />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <HoverCard openDelay={120} closeDelay={220}>
          <HoverCardTrigger asChild>
            <Button variant="chat-reset" className="w-full">
              页面归档
            </Button>
          </HoverCardTrigger>
          <HoverCardContent
            side="top"
            align="center"
            className="w-[min(100vw-2rem,24rem)] max-w-none border border-border p-2 shadow-lg"
          >
            <ul className="flex max-h-[min(70vh,28rem)] flex-col gap-0.5 overflow-y-auto">
              {DEMO_HOME_ARCHIVED_NAV_ENTRIES.map(({ label, path }) => (
                <li key={path}>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto w-full justify-start whitespace-normal px-2 py-2 text-left text-sm leading-snug"
                    onClick={() => navigate(path)}
                  >
                    {label}
                  </Button>
                </li>
              ))}
            </ul>
          </HoverCardContent>
        </HoverCard>

        {DEMO_HOME_PRIMARY_NAV_ENTRIES.map(({ label, path }) => (
          <Button
            key={path}
            variant="chat-reset"
            className="w-full whitespace-normal text-center leading-snug py-[var(--space-250)]"
            onClick={() => navigate(path)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
