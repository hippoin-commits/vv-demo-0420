import { createMemoryRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./Home";
import { MainAIPage } from "./pages/MainAIPage";
import { MainAI0421NewUserInvitedOrgPage } from "./pages/MainAI0421NewUserInvitedOrgPage";
import { MainAI0421NewUserInvitedEduStudentPage } from "./pages/MainAI0421NewUserInvitedEduStudentPage";
import { MainAI0421InteractionRulesPage } from "./pages/MainAI0421InteractionRulesPage";
import { MainAI0422ScheduleDrawerDemoPage } from "./pages/MainAI0422ScheduleDrawerDemoPage";
import { MainAITaskPage } from "./pages/MainAITaskPage";
import { MainAITaskPlan2Page } from "./pages/MainAITaskPlan2Page";
import { MainAIEmailPlan0413Page } from "./pages/MainAIEmailPlan0413Page";
import { MainAIEmailPlan0415Page } from "./pages/MainAIEmailPlan0415Page";
import { MainAIEmailPlan0417Page } from "./pages/MainAIEmailPlan0417Page";
import { MainAITask0417InlineEditPage } from "./pages/MainAITask0417InlineEditPage";
import { MainAITask0417CardEditPage } from "./pages/MainAITask0417CardEditPage";
import { MainAI0419SidebarExplorePage } from "./pages/MainAI0419SidebarExplorePage";
import { MainAINoEducationSpacePage } from "./pages/MainAINoEducationSpacePage";
import { MainAINoEducationSpacePage2 } from "./pages/MainAINoEducationSpacePage2";
import { NotFound } from "./pages/NotFound";
import { ScenarioShowcase } from "./pages/ScenarioShowcase";

export const router = createMemoryRouter(
  [
    {
      path: "/",
      Component: Root,
      children: [
        { index: true, Component: Home },
        { path: "main-ai", Component: MainAIPage },
        { path: "main-ai-0421-new-user-invited-org", Component: MainAI0421NewUserInvitedOrgPage },
        {
          path: "main-ai-0421-new-user-invited-edu-student",
          Component: MainAI0421NewUserInvitedEduStudentPage,
        },
        {
          path: "main-ai-0421-interaction-rules",
          Component: MainAI0421InteractionRulesPage,
        },
        { path: "main-ai-0422-schedule-drawer-demo", Component: MainAI0422ScheduleDrawerDemoPage },
        { path: "main-ai-task", Component: MainAITaskPage },
        { path: "main-ai-task-plan2", Component: MainAITaskPlan2Page },
        { path: "main-ai-email-plan-0413", Component: MainAIEmailPlan0413Page },
        { path: "main-ai-email-plan-0415", Component: MainAIEmailPlan0415Page },
        { path: "main-ai-email-plan-0417", Component: MainAIEmailPlan0417Page },
        { path: "main-ai-task-0417-inline-edit", Component: MainAITask0417InlineEditPage },
        { path: "main-ai-task-0417-card-edit", Component: MainAITask0417CardEditPage },
        { path: "main-ai-0419-sidebar-explore", Component: MainAI0419SidebarExplorePage },
        { path: "main-ai-no-edu-space", Component: MainAINoEducationSpacePage },
        { path: "main-ai-no-edu-space-2", Component: MainAINoEducationSpacePage2 },
        { path: "scenario-showcase", Component: ScenarioShowcase },
        { path: "*", Component: NotFound },
      ],
    },
  ],
  { initialEntries: ["/"] },
);