import * as React from "react";

/** 会话消息行内卡片：右上角「操作来源」点击跳转到来源消息 */
export type OperationSourceNavContextValue = {
  onNavigateToOperationSource?: () => void;
};

export const OperationSourceNavContext = React.createContext<OperationSourceNavContextValue>({});
