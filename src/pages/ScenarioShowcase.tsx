import * as React from "react";
import IMChatView from "../imports/单聊收到通知";
import CuiDrawer from "../imports/Cui业务框架组件";

interface ScenarioItem {
  id: string;
  title: string;
  description: string;
}

const SCENARIOS: ScenarioItem[] = [
  {
    id: "im-to-cui-drawer",
    title: "IM打开CUI对话抽屉",
    description: "点击IM聊天中的卡片，打开右侧CUI对话抽屉",
  },
];

export function ScenarioShowcase() {
  const [selectedScenario, setSelectedScenario] = React.useState<string>("im-to-cui-drawer");
  const [showDrawer, setShowDrawer] = React.useState(false);

  return (
    <div className="flex h-screen w-full bg-bg overflow-hidden">
      {/* 左侧列表 */}
      <div className="w-[280px] border-r border-border bg-bg-secondary flex flex-col shrink-0">
        <div className="p-[var(--space-600)] border-b border-border">
          <h1 className="text-[length:var(--font-size-xl)] font-[var(--font-weight-semi-bold)] text-text">
            场景列表
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto p-[var(--space-400)]">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                setSelectedScenario(scenario.id);
                setShowDrawer(false);
              }}
              className={`w-full text-left p-[var(--space-400)] rounded-[var(--radius-lg)] mb-[var(--space-200)] transition-colors ${
                selectedScenario === scenario.id
                  ? "bg-primary text-[var(--color-white)]"
                  : "bg-bg hover:bg-[var(--black-alpha-11)] text-text"
              }`}
            >
              <h3 className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] mb-[var(--space-100)]">
                {scenario.title}
              </h3>
              <p
                className={`text-[length:var(--font-size-xs)] ${
                  selectedScenario === scenario.id
                    ? "text-[var(--color-white)] opacity-90"
                    : "text-text-secondary"
                }`}
              >
                {scenario.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧展示区域 */}
      <div className="flex-1 relative bg-bg overflow-hidden">
        {selectedScenario === "im-to-cui-drawer" && (
          <div className="absolute inset-0 flex items-center justify-center p-[var(--space-600)]">
            {/* IM聊天界面容器 */}
            <div className="relative">
              <div 
                className="relative bg-white rounded-[12px] overflow-hidden border border-border"
                style={{ 
                  width: "980px", 
                  height: "640px",
                  boxShadow: "0px 8px 32px rgba(26, 24, 30, 0.1)"
                }}
              >
                <IMChatView />
                
                {/* 可点击热区 - 根据截图红框位置定位 */}
                <button
                  onClick={() => setShowDrawer(true)}
                  className="absolute bg-transparent hover:bg-[var(--blue-alpha-1)] transition-colors cursor-pointer"
                  style={{
                    top: "380px",
                    right: "60px",
                    width: "280px",
                    height: "180px",
                  }}
                  aria-label="打开CUI对话抽屉"
                />
              </div>

              {/* CUI抽屉 - 从右侧滑入覆盖 */}
              {showDrawer && (
                <div 
                  className="absolute top-0 right-0 bg-white rounded-r-[12px] overflow-hidden border-l border-border transition-transform"
                  style={{ 
                    width: "560px", 
                    height: "640px",
                    boxShadow: "-4px 0 16px rgba(26, 24, 30, 0.1)"
                  }}
                >
                  <CuiDrawer />
                  
                  {/* 关闭按钮 */}
                  <button
                    onClick={() => setShowDrawer(false)}
                    className="absolute top-[var(--space-400)] right-[var(--space-400)] bg-bg-secondary hover:bg-[var(--black-alpha-11)] text-text px-[var(--space-400)] py-[var(--space-200)] rounded-[var(--radius-md)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] transition-colors z-10"
                    style={{ boxShadow: "0px 4px 16px rgba(15, 24, 30, 0.05)" }}
                  >
                    关闭
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}