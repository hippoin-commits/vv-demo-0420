/** 反馈列表 / 详情抽屉共用行数据 */
export type FeedbackListItem = {
  id: string;
  title: string;
  body: string;
  /** 经办人 */
  assignee: string;
  participants: string;
  feedbackType: string;
  anonymous: boolean;
  time: string;
  status: string;
  /** 来源，如「当前任务」 */
  source: string;
  /** 反馈人（提交人展示名） */
  reporterName: string;
};
