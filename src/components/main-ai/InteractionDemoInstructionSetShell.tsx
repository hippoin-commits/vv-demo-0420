import * as React from "react"
import { Check, Copy } from "lucide-react"
import type { DemoInstructionCommand } from "./demoInstructionTypes"
import { SpecDocBody } from "./specDocBodyRender"
import { cn } from "../ui/utils"

type DemoScenario = {
  id: string
  title: string
  navLabel?: string
  command: DemoInstructionCommand
  prompt: string
  logicMarkdown: string
  devPromptMarkdown: string
  hideDevPrompt?: boolean
  /** 为 true 时不出现在左侧演示导航（数据保留，便于日后恢复） */
  hidden?: boolean
}

type DemoCategory = {
  id: string
  title: string
  demos: readonly DemoScenario[]
  /** 为 true 时整组不出现在左侧演示导航（数据保留，便于日后恢复） */
  hidden?: boolean
}

type DetailSection = {
  id: string
  title: string
  markdown: string
}

const DEMO_INSTRUCTION_CATEGORIES: readonly DemoCategory[] = [
  {
    id: "conversation-positioning",
    title: "对话流定位",
    demos: [
      {
        id: "new-round-positioning",
        title: "新对话定位逻辑",
        command: { kind: "prefillMainAiDemoPrompt", prompt: "组织管理" },
        prompt:
          "系统默认启用新对话定位：任意角色开启新一轮内容时，都以本轮第一条消息作为新轮次起点，槽位高度始终按对话可视区域的 80% 计算。",
        logicMarkdown:
          "目标：页面刷新后，新对话定位逻辑默认生效，不依赖点击该演示节点。每次开启新一轮对话时，无论第一条内容来自用户还是系统，无论最终返回文本还是 CUI 卡片，都应该进入一个新的展示槽位。槽位从本轮第一条消息开始，而不是只从用户消息或 AI 卡片开始。\n\n**1. 全局默认**\n\n- 新对话槽位是系统默认行为，不是演示开关。\n- 页面刷新后默认启用。\n- 以后整个系统的新对话槽位高度统一为对话可视区域的 80%。\n- 任何演示节点只能展示或说明该逻辑，不应临时开启、关闭或改变比例。\n\n**2. 新一轮判定**\n\n以下行为都算新一轮：\n\n- 用户在输入框发送一条消息。\n- 用户点击快捷指令。\n- 用户点击底部应用入口或应用内菜单。\n- 用户点击 CUI 卡片中的行动按钮，触发新的消息或卡片。\n- 系统在没有用户先发消息的情况下，主动插入一条新消息、新卡片或新的任务结果。\n- 主 AI、应用 AI、组织 AI、员工 AI、抽屉 AI 中任意一个上下文发起新的任务。\n- 连续出现多条普通文本，只要它们分别代表独立任务或独立上下文触发，就必须视为多轮对话，而不是同一轮里的多条消息。\n\n**3. 槽位规则**\n\n每一轮新对话开始时，立即创建新的展示槽位。\n\n- 槽位起点是本轮第一条消息，不限制消息发送方。\n- 用户消息、系统消息、AI 回复、CUI 卡片、后续提示都可以成为一轮里的内容。\n- 新一轮开始时，旧槽位立即失效。\n- 新槽位只包裹当前轮，不允许把前一轮或后一轮消息混进去。\n- 多轮之间保持规范消息间距。\n\n**4. 滚动定位**\n\n新一轮出现时，不应简单滚到底部。\n\n推荐过程：\n\n1. 任意触发源开启新一轮。\n2. 创建新槽位，记录当前上下文和当前消息列表长度。\n3. 本轮第一条消息进入槽位。\n4. 滚动容器自动定位到新槽位顶部。\n5. 后续系统回复、用户回复或卡片进入同一槽位。\n6. 如果内容超过槽位高度，保持槽位顶部清晰，允许继续向下阅读。\n\n**5. 高度判断**\n\n槽位高度根据当前对话可视区域动态计算：\n\n- 对话可视区域 = 顶栏到底栏之间的高度，扣掉快捷入口和收起代办卡片占高；如果它们不存在，则不扣除。\n- 槽位高度 = max(200px, round(对话可视区域 × 0.8))。\n- 该比例对主 AI、应用 AI、组织 AI、员工 AI、抽屉 AI 等上下文一致生效。\n\n**6. 多上下文隔离**\n\n每个上下文都有自己的新一轮定位：\n\n- 主 AI 是主 AI 的槽位。\n- 邮箱、任务、教育、组织、员工等应用 AI 各自独立。\n- 当前在哪个对话发起，就在哪个对话创建槽位。\n- 从主 AI 打开应用 AI 并触发欢迎语，也算应用 AI 的新一轮。\n- 从主 AI / 应用 AI 打开抽屉 AI 并发起对话，也要按抽屉 AI 的当前上下文创建槽位。\n- 切换上下文不能继承另一个上下文的槽位和滚动状态。",
        devPromptMarkdown:
          "请实现全局默认的“新一轮对话定位”体验逻辑。\n\n要求：\n\n1. 页面刷新后默认启用该逻辑，不要依赖点击某个演示节点后才生效。\n2. 整个系统的新对话槽位高度统一为对话可视区域的 80%，不要再提供其他比例，也不要把比例作为演示状态。\n3. 每次开启新一轮对话时，立即创建展示槽位。新一轮包括：输入框发送、快捷指令、底部应用入口、应用菜单、CUI 卡片行动按钮、系统主动插入新消息或新卡片、主 AI / 应用 AI / 组织 AI / 员工 AI / 抽屉 AI 中任意上下文发起任务。\n4. 槽位起点必须是本轮第一条消息，不限制发送方；这条消息可能来自用户，也可能来自系统或 AI，不允许只在用户先发消息时才创建槽位。\n5. 每次新一轮开始，都必须刷新槽位。旧槽位立即失效，不能继续包裹后续消息。\n6. 严格区分每一轮。连续出现多条普通文本时，如果它们分别代表独立任务或独立上下文触发，就必须拆成多轮，不可以把多轮文本混在一个槽位里。多轮之间保持规范消息间距。\n7. 新槽位要绑定当前对话上下文。主 AI、各应用 AI、组织 AI、员工 AI、抽屉 AI 的消息列表、槽位状态和滚动定位互相隔离。\n8. 对话可视区域指顶栏到底栏之间，再扣掉快捷入口和收起代办卡片占高；如果快捷入口或待办卡片不存在，则不扣除这部分高度。\n9. 槽位高度 = max(200px, round(对话可视区域 × 0.8))。\n10. 滚动定位不能简单滚到底部。新一轮出现后，应自动滚动到槽位顶部，让用户看到本轮开始位置；如果内容超出槽位，保持顶部可见，允许继续向下阅读。",
      },
      {
        id: "scroll-to-bottom-threshold",
        title: "去底部按钮逻辑",
        command: { kind: "showScrollToBottomThresholdDemo" },
        prompt:
          "当用户向上滑动对话并离底部超过同源槽位阈值时，在当前聊天可视区域底部居中显示“去底部”按钮，点击后用 300ms 平滑过渡定位到当前对话底部。",
        logicMarkdown:
          "目标：定义“去底部”按钮在线上应用中的出现条件、悬浮位置、滚动容器绑定和点击行为。\n\n**1. 显示位置**\n\n- 按钮在当前聊天滚动可视区域底部居中悬浮展示，形态为轻量圆形按钮加向下箭头。\n- 按钮外层不应阻挡滚动条或消息区点击，只有按钮本体可以接收点击。\n- 按钮必须相对当前聊天可视容器定位，不能随消息列表内容高度变化而漂移。\n\n**2. 显示阈值**\n\n- 内容没有溢出、没有可滚动距离时，不显示按钮。\n- 用户已经接近底部时，不显示按钮。\n- 用户离底部足够远时，显示按钮。\n- “离底部足够远”的唯一阈值必须与新一轮对话阅读槽位高度一致，不允许再写一套经验像素值。\n- 当前项目的新一轮对话阅读槽位高度统一为对话可视区域的 80%，并保留系统下限，避免窗口极小时阈值过小。\n- 对话可视区域指顶栏到底栏之间的滚动容器高度，并扣除当前占用阅读区的 sticky / pinned 内容、收起的代办卡片和当前可见快捷入口；如果滚动容器本身已经是纯消息区，则可以直接使用该容器的可视高度。\n- 判断是否显示时，只使用“滚动内容总高度减去当前滚动位置，再减去容器可视高度”得到的离底部距离；仅当这个距离大于同源槽位阈值时显示按钮。\n\n**3. 重算时机**\n\n- 用户滚动时重新判断。\n- 容器尺寸变化时重新判断。\n- 消息新增、删除或内容高度变化时重新判断。\n- 应用、组织、员工、抽屉、浮窗等上下文切换时重新判断。\n- 槽位、快捷入口、吸顶内容、底部工具栏等相关布局变化时重新判断。\n\n**4. 布局结构**\n\n- 禁止把“去底部”按钮渲染在可滚动内容内部，也不要让它成为消息列表同一滚动流里的子节点。\n- 每个独立聊天上下文都应有自己的可视外层、内部滚动层和悬浮按钮层。\n- 可视外层负责提供稳定的相对定位和裁切高度，尺寸等于该上下文的可见阅读区，不随消息变长。\n- 内部滚动层只承载消息列表和滚动行为。\n- 悬浮按钮与内部滚动层是兄弟关系，挂在可视外层内、滚动层外，底部居中定位。\n- 如果使用滚动区域封装组件，按钮也应放在封装组件外侧的相对定位容器里，并以组件实际暴露的滚动视口作为阈值计算和滚动目标。\n- 主 AI、应用 AI、抽屉、浮窗等上下文各自独立实现滚动容器与外层包裹，禁止共用会串台的滚动引用或监听关系。\n\n**5. 点击行为**\n\n- 点击按钮后，当前对话容器需要在 300ms 内平滑过渡到底部。\n- 平滑过渡结束后，再在短时间内做一次或多次瞬时贴底校正，抵消新消息、图片加载、动画或高度重算造成的底部残留间隙。\n- 点击后应定位到当前对话容器底部，而不是其他应用、旧容器或页面底部。\n\n**6. 验收自查**\n\n- 内容很长时向上滚动，按钮应始终出现在当前聊天可视区域下沿附近，不随某条消息跑到屏幕中部。\n- 点击按钮后，应约 300ms 平滑到达底部。\n- 滚回底部时，按钮应消失。\n- 内容不足以产生“离底部大于槽位”的距离时，按钮应消失。\n- 从一个应用或上下文切到另一个应用或上下文后，继续滚动当前对话，按钮仍应按当前容器状态显示或隐藏。",
        devPromptMarkdown:
          "请实现“去底部按钮”的线上交互逻辑。\n\n要求：\n\n1. 去底部按钮在当前聊天滚动可视区域底部居中悬浮展示，不占用滚动条命中区域，只有按钮本体响应点击。\n2. 按钮显示条件必须同时满足：内容存在可滚动距离、用户未接近底部、用户离底部距离大于同源槽位阈值。\n3. “离底部足够远”的阈值只能复用新一轮对话阅读槽位高度；当前项目统一按对话可视区域的 80% 计算并保留系统下限，不要再写额外经验像素值。\n4. 对话可视区域指顶栏到底栏之间的滚动容器高度，并扣除当前占用阅读区的 sticky / pinned 内容、收起的代办卡片和当前可见快捷入口。没有这些元素时，直接使用聊天滚动区域可视高度；如果滚动容器本身已经是纯消息区，也可以直接使用该容器的可视高度。\n5. 判断离底部距离时，只使用滚动内容总高度、当前滚动位置、容器可视高度这三个实时读数进行计算；不要使用额外状态、固定变量名、固定应用名或历史容器缓存替代真实读数。\n6. 用户滚动、容器尺寸变化、消息增删、内容高度变化、上下文切换、槽位相关布局变化时，都要重新计算按钮是否显示。\n7. “去底部”按钮必须监听当前正在显示的对话滚动容器，不要只在首次挂载时绑定一次。\n8. 当用户在不同应用、组织、员工、抽屉或浮窗上下文之间切换时，当前对话滚动容器可能会被重新创建；此时必须解绑旧容器监听，并重新绑定到新容器，避免按钮仍监听已经离开的旧对话。\n9. 禁止把按钮放在可滚动内容内部，也不要让按钮成为消息列表同一滚动流里的子节点；否则按钮会跟随内容高度漂移，无法稳定贴在当前可视区域底部。\n10. 每个独立聊天上下文都应有自己的可视外层、内部滚动层和悬浮按钮层。悬浮按钮应与内部滚动层同级，挂在可视外层内、滚动层外，并相对可视外层底部居中定位。\n11. 如果使用滚动区域封装组件，按钮也应放在封装组件外侧的相对定位容器里，并以组件实际暴露的滚动视口作为阈值计算和滚动目标。\n12. 主 AI、应用 AI、抽屉、浮窗等上下文各自独立实现滚动容器与外层包裹，禁止共用会串台的滚动引用或监听关系。\n13. 点击“去底部”按钮后，当前对话容器需要用 300ms 平滑过渡到底部，再在短时间内做一次或多次瞬时贴底校正，抵消新消息、图片加载、动画或高度重算造成的底部残留间隙。\n14. 验收时需要覆盖：长内容向上滚动按钮始终贴在当前聊天可视区域下沿附近；点击按钮后约 300ms 平滑到达底部；滚回底部按钮消失；内容不足以超过槽位阈值时按钮不显示；从一个应用或上下文切到另一个应用或上下文后，当前对话继续滚动仍能正确显示或隐藏按钮。",
      },
      {
        id: "in-place-card-update-positioning",
        title: "卡片原位置更新的定位规范",
        command: {
          kind: "prefillMainAiDemoPrompt",
          prompt: "查看任务 Q2 产品路线图评审，卡片原位置更新定位演示",
        },
        prompt:
          "以 0417 任务详情卡片的原位置编辑为参考：卡片内部形态切换或数据更新不算新一轮，应在同一条卡片消息原位置更新，并把当前卡片顶对齐到阅读区顶部。",
        logicMarkdown:
          "目标：当 CUI 卡片在原位置发生形态切换或数据更新时，不应追加新消息，也不应触发新一轮对话槽位；系统应保持当前卡片为同一条消息，只更新卡片内部状态，并把该卡片定位到可视阅读区顶部。\n\n**1. 适用场景**\n\n- 同一张详情卡从浏览态切换到编辑态。\n- 编辑提交后，同一张卡从编辑态切回只读详情态。\n- 表单提交后，卡片内部数据、标题后缀、状态标签、快照内容发生变化。\n- 卡片内按钮布局迁移，例如底部功能按钮移动到标题区下方。\n- 不需要新增一轮用户消息，也不需要新增一张后续卡片。\n\n**2. 定位规则**\n\n- 原位置更新不是新一轮对话，不调用新一轮槽位逻辑。\n- 更新前记录当前卡片所属消息 ID。\n- 使用消息列表的 map 更新目标消息内容、快照或卡片状态。\n- 更新后将该消息所在卡片滚动到可视区域顶部。\n- 需要跳过一次“按末条是否卡片滚到底部”的默认布局滚动，避免刚定位到当前卡片又被拉回底部。\n\n**3. 任务详情卡片布局参考**\n\n- 任务详情卡独立作为演示起点卡片。\n- 卡片大标题仍为“任务详情”。\n- 任务标题行下方单独独占一行，放置原本卡片底部右侧的功能操作按钮栏。\n- 按钮栏位于任务标题和原有灰色内容板块之间，处于卡片中上部。\n- 下方灰色区域、字段、排版、交互保持不变。\n\n**4. 任务归属原则**\n\n- 任务详情对应一个具体任务，任务只能存在于其所属租户 / 组织内。\n- 即使在主 AI 对话内打开，也不展示组织切换入口，避免暗示任务可以跨租户切换。\n\n**5. 保留原则**\n\n- 不删除原有内容。\n- 不改变原有功能按钮行为。\n- 不新增无关组件。\n- 仅做卡片内部布局迁移、原位置更新定位。",
        devPromptMarkdown:
          "# Cursor 专用｜以任务详情卡片为演示起点，同时调整卡片的布局\n\n## 整体规范\n\n严格遵循 **CUI 卡片规范、现有组件规范**，不新增自定义组件，仅调整内部布局、位置、排版，原有所有内容、交互、样式全部保留，只做位置迁移。\n\n## 1. 整体改造说明\n\n将现有页面内 **任务详情卡片** 单独抽出，作为独立场景演示起点卡片，仅做布局改造，原有所有内容逻辑不变。\n\n## 2. 布局调整（核心）\n\n1. 卡片内**任务标题行**（Q2 产品路线图评审 这一行）下方\n2. 单独独占一行位置\n3. 将原本**卡片底部右侧所有功能操作按钮**，整体迁移到这个位置\n4. 位置层级：\n任务标题 → 迁移后的功能按钮栏 → 原有灰色板块上方\n整体放置在卡片**中上部区域**\n\n## 3. 任务归属约束\n\n任务详情对应一个具体任务，任务只能存在于其所属租户 / 组织内。即使在主 AI 对话内打开该任务详情卡片，也不展示组织切换入口。\n\n## 4. 其余内容保留\n\n1. 下方灰色区域、所有字段、排版、样式、交互**完全不变**\n2. 只迁移按钮位置，不新增组织切换入口\n3. 整体卡片视觉贴合现有CUI规范，间距对齐，布局自然不突兀\n\n## 5. 交付要求\n\n直接改造现有任务详情卡片结构，纯布局位置调整，不改动功能、不删减内容、不新增多余样式，可直接在 Cursor 生成改造后组件代码。",
      },
    ],
  },
  {
    id: "view-history-records",
    title: "查看历史记录",
    hidden: true,
    demos: [
      {
        id: "pull-history-load",
        title: "查看对话历史记录",
        command: { kind: "showPullHistoryLoadDemo" },
        prompt:
          "当用户滚动到当前对话顶部并继续下拉时，顶部露出固定 100px 的历史加载提示区；达到 100px 松手后加载更早历史，加载成功后插入顶部并保持当前视口不跳动。",
        logicMarkdown:
          "目标：定义对话流顶部继续下拉时的历史记录加载过程，适用于主 AI、应用 AI、抽屉、浮窗等独立对话容器。\n\n**1. 触发条件**\n\n- 仅当用户已经滚动到当前对话流顶部，并继续向下拉时，才展示历史加载提示。\n- 未到顶部时，正常滚动历史内容，不展示加载提示。\n- 每个独立聊天上下文都应绑定自己的滚动容器，不允许跨上下文共享加载状态。\n\n**2. 提示区域**\n\n- 历史加载提示区域的标准高度固定为 `100px`。\n- 历史加载提示属于对话流内部顶部内容；如果当前对话顶部存在吸顶待办卡片、吸顶提示或其他贴近标题栏的固定内容，历史加载提示必须显示在这些吸顶内容下方。\n- 下拉过程中，不改变提示区域自身高度；根据用户下拉距离控制这个 `100px` 区域的露出程度。\n- 提示文案在这个 `100px` 区域内居中展示。\n- 用户下拉距离小于 `100px` 时，文案为「下拉加载历史记录」。\n- 用户下拉距离达到或超过 `100px` 时，文案切换为「松开加载历史记录」。\n- 如果下拉超过阈值后又回到阈值以下，文案恢复为「下拉加载历史记录」。\n\n**3. 松手行为**\n\n- 用户在阈值以下松手时，不触发加载，提示区域消失，对话重新定位到原顶部状态。\n- 用户在达到或超过阈值后松手时，触发加载，提示区域固定露出 `100px`，文案切换为「正在加载历史记录」。\n- 「正在加载历史记录」状态可以使用动态加载图标；其他状态不展示图标。\n\n**4. 加载完成**\n\n- 加载成功后，提示区域消失，将更早历史消息插入当前对话列表顶部。\n- 插入历史消息时必须以加载区域下方当前可见的原对话内容作为锚点，保持它在视口中的位置不变，不允许用户正在看的内容跳动。\n- 如果加载结果是没有更多对话，提示区域固定显示 `100px`，文案为「没有更多记录」。\n- 进入「没有更多记录」状态后，当前对话不再响应下拉加载动作，也不重复触发加载。\n\n**5. 兼容性**\n\n- 该逻辑不能破坏新对话槽位定位、卡片原位置更新定位、去底部按钮显示阈值与点击行为。\n- 历史插入属于列表头部数据变化，不应被误判为新一轮对话，也不应触发滚到底部。",
        devPromptMarkdown:
          "请实现“上拉显示历史记录加载过程”的线上交互逻辑。\n\n要求：\n\n1. 仅当用户已经滚动到当前对话流顶部，并继续向下拉时，才展示历史加载提示。\n2. 历史加载提示区域的标准高度固定为 `100px`。\n3. 历史加载提示属于对话流内部顶部内容；如果当前对话顶部存在吸顶待办卡片、吸顶提示或其他贴近标题栏的固定内容，历史加载提示必须渲染在这些吸顶内容下方，不能覆盖或出现在它们上方。\n4. 下拉过程中，不改变提示区域自身高度；根据用户下拉距离控制这个 `100px` 区域的露出程度，提示文案在该区域内居中展示。\n5. 用户下拉距离小于 `100px` 时，文案为「下拉加载历史记录」。\n6. 用户下拉距离达到或超过 `100px` 时，文案切换为「松开加载历史记录」。\n7. 如果下拉超过阈值后又回到阈值以下，文案恢复为「下拉加载历史记录」。\n8. 用户在阈值以下松手时，不触发加载，提示区域消失，滚动位置恢复到原顶部状态。\n9. 用户在达到或超过阈值后松手时，触发加载，提示区域固定露出 `100px`，文案切换为「正在加载历史记录」。\n10. 「正在加载历史记录」状态使用动态加载图标；「下拉加载历史记录」「松开加载历史记录」「没有更多记录」不展示图标。\n11. 加载过程中，提示区域保持 `100px` 露出状态，不因消息插入、布局变化或滚动校正而抖动。\n12. 加载成功后，提示区域消失，将更早历史消息插入当前对话列表顶部。\n13. 插入历史消息时必须以加载区域下方当前可见的原对话内容作为锚点，保持它在视口中的位置不变，不允许用户正在看的内容跳动。\n14. 如果加载结果是没有更多对话，提示区域固定显示 `100px`，文案为「没有更多记录」。\n15. 进入「没有更多记录」状态后，当前对话不再响应下拉加载动作，也不重复请求历史数据。\n16. 该逻辑应适用于主 AI、应用 AI、抽屉、浮窗等独立对话容器，各上下文状态互相隔离。\n17. 该逻辑不能破坏新对话槽位定位、卡片原位置更新定位、去底部按钮显示阈值与点击行为；历史插入不应被误判为新一轮对话，也不应触发滚到底部。",
      },
    ],
  },
  {
    id: "context-switching",
    title: "组织/空间切换",
    demos: [
      {
        id: "main-ai-scope-switcher",
        title: "主AI卡片支持组织/空间切换",
        command: { kind: "prefillMainAiDemoPrompt", prompt: "组织管理" },
        prompt:
          "在主 AI 的业务卡片标题下方展示当前组织或教育空间，并提供切换入口；进入具体应用 AI 后不再重复展示。",
        logicMarkdown:
          "目标：主 AI 是全局对话容器，承载跨业务调度。因此，当主 AI 里出现与组织或教育空间相关的业务卡片时，需要在卡片标题下方补充当前上下文，并允许用户直接切换。\n\n**1. 显示位置**\n\n- 切换入口展示在业务卡片标题下方，作为标题区的一部分，而不是独立插入一条新消息。\n- 它应靠近卡片标题，用较弱的文字层级表达“当前上下文”。\n- 它不应抢占卡片主体内容，也不应影响卡片的主要操作按钮。\n\n**2. 显示条件**\n\n- 仅在主 AI 对话流中展示。\n- 当用户已经进入具体应用 AI、组织 AI、员工 AI、抽屉 AI 等上下文时，不再展示这个切换入口。\n- 如果卡片属于组织管理、权限、成员、流程等组织范围业务，展示组织切换入口。\n- 如果卡片属于课程、学生、教育空间等教育范围业务，展示教育空间切换入口。\n\n**3. 组织切换**\n\n- 展示当前组织名称，点击后打开组织列表。\n- 组织列表与产品顶部或全局组织选择保持同源数据。\n- 在卡片内使用时，应隐藏排序、新建、加入等管理动作，只保留选择能力。\n- 切换组织后，卡片应同步更新到新组织上下文，后续操作也应以新组织为准。\n\n**4. 教育空间切换**\n\n- 展示当前教育空间名称，点击后打开教育空间列表。\n- 教育空间可能包含机构空间、家庭空间，也可能按租户或机构树形组织。\n- 列表应支持搜索、展开上级节点、选择具体叶子空间。\n- 切换教育空间后，卡片应同步更新到新教育空间上下文，后续操作也应以新教育空间为准。\n\n**5. 上下文隔离**\n\n- 主 AI 中切换上下文，只影响当前主 AI 卡片和后续主 AI 操作。\n- 不应把主 AI 的卡片级上下文选择强行带入其他应用 AI 的独立对话状态。\n- 如果一张卡片自身携带了上下文信息，用户切换后应同步更新卡片记录，避免刷新或重新渲染后回到旧上下文。",
        devPromptMarkdown:
          "请实现“主 AI 业务卡片中的上下文切换入口”。\n\n要求：\n\n1. 当主 AI 对话流中出现需要组织或教育空间上下文的业务卡片时，在卡片标题下方展示当前上下文和切换入口。\n2. 该入口只在主 AI 中展示；进入具体应用 AI、组织 AI、员工 AI、抽屉 AI 等上下文后，不要重复展示。\n3. 组织类业务卡片展示组织切换入口；教育类业务卡片展示教育空间切换入口。\n4. 切换入口应属于卡片标题区的一部分，视觉层级弱于主标题，避免打断对话流。\n5. 组织切换列表应复用全局组织数据，但在卡片内只保留选择能力，不展示排序、新建、加入等管理动作。\n6. 教育空间切换列表应复用全局教育空间数据，并支持搜索、展开上级节点、选择具体空间。\n7. 用户切换组织或教育空间后，当前卡片需要同步更新到新的上下文；后续在该卡片上的操作也应使用新的上下文。\n8. 如果卡片消息或卡片状态中保存了上下文标识，切换后要同步更新这份记录，避免重新渲染后回到旧上下文。\n9. 主 AI 的卡片级上下文切换不应污染其他应用 AI 的独立对话状态；不同 AI 上下文各自管理自己的选择状态。\n10. 如果当前业务没有可切换的组织或教育空间，入口可以隐藏，或展示只读的当前上下文名称。",
      },
    ],
  },
  {
    id: "main-ai-app-entry",
    title: "主AI应用入口",
    demos: [
      {
        id: "main-ai-app-entry-visibility",
        title: "主AI应用入口展示逻辑",
        navLabel: "逻辑：主AI应用入口展示",
        command: { kind: "prefillMainAiDemoPrompt", prompt: "演示：查看主AI应用入口展示逻辑" },
        hideDevPrompt: true,
        prompt:
          "主 AI 底部应用入口随组织/租户状态变化：无组织时只展示个人 7 个应用；只要有任一租户或组织被选中，就展示个人应用 + 工作台应用。",
        logicMarkdown:
          "目标：主 AI 底部应用入口需要表达当前用户可用的业务范围。无组织时只能使用个人应用；当用户已经加入组织、选中任一租户，或处于可明确归属到组织/租户的演示上下文时，需要展示完整工作台入口。\n\n**1. 无组织状态**\n\n无组织时，底部应用入口固定为 7 个个人应用，顺序不可被工作台入口打乱：\n\n- 教育\n- 待办\n- 日程\n- 会议\n- 邮箱\n- 文档\n- 微盘\n\n这些应用不依赖组织权限，可以在个人或教育空间上下文中使用。\n\n**2. 有组织或租户已选状态**\n\n只要当前用户有组织，或当前主 AI 已经选中任一租户/组织，就应该在 7 个个人应用之后追加工作台应用。\n\n追加顺序建议跟工作台应用分组保持一致：公司、组织、员工、招聘、考勤、薪酬、绩效、财务、制度、物资、入职、转正、调岗、离职、合同、目标、项目、任务、反馈、会议室、流程、权限、客户。\n\n**3. 三处入口同源**\n\n以下三处必须使用同一份规则化应用数组，不能各自维护排序：\n\n- 主 AI 底部应用入口。\n- 主 AI 的更多应用浮层。\n- 应用 AI 内的应用切换浮层。\n\n当组织状态、租户选择、应用排序缓存或演示上下文变化时，三处入口要同时更新，顺序和可见项保持完全一致。\n\n**4. 去重规则**\n\n- 工作台追加区不要重复展示个人入口。\n- 「我的」「会议」「邮箱」属于个人或全局入口，不作为工作台追加项重复出现。\n- 如果某个截图或配置同时包含文档、会议、邮箱、微盘等个人应用，应以个人 7 项为准，只保留一次。\n\n**5. 上下文触发**\n\n以下任一情况都视为“有组织/租户已选”：\n\n- 用户账号已经加入组织。\n- 主 AI 顶部组织/租户选择器有当前选中值。\n- 业务卡片明确绑定了组织或租户上下文。\n- 演示页中为了展示组织/空间切换而预置了多租户上下文。\n\n**6. 排序与稳定性**\n\n- 个人 7 项始终在前，顺序稳定。\n- 工作台应用始终在个人应用之后，顺序稳定。\n- 用户自定义排序或本地缓存不应破坏这个演示规则；规则升级时需要刷新旧缓存或使用同源构建函数生成展示列表。\n- 点击工作台应用时，如果当前组织权限不足，应进入对应的申请、空态或占位说明，而不是从底部入口消失。",
        devPromptMarkdown:
          "请实现“主 AI 应用入口展示逻辑”。\n\n要求：\n\n1. 根据当前用户的组织/租户状态决定主 AI 底部应用入口。\n2. 无组织状态只展示 7 个个人应用，顺序为：教育、待办、日程、会议、邮箱、文档、微盘。\n3. 有组织、或当前已经选中任一租户/组织时，在上述 7 个个人应用后追加工作台应用。\n4. 工作台应用顺序为：公司、组织、员工、招聘、考勤、薪酬、绩效、财务、制度、物资、入职、转正、调岗、离职、合同、目标、项目、任务、反馈、会议室、流程、权限、客户。\n5. 主 AI 底部应用入口、主 AI 的更多应用浮层、应用 AI 内的应用切换浮层必须使用同一份排序后的应用数组，不能各自维护过滤和排序逻辑。\n6. 追加工作台应用时要做去重；不要重复展示“我的”“会议”“邮箱”，也不要重复展示已经作为个人 7 项出现的入口。\n7. 当前主 AI 只要存在明确租户/组织选择，就按有组织状态处理，即使它发生在演示页或业务卡片上下文中。\n8. 应用入口排序需要稳定，不受旧本地缓存影响。若项目有本地应用排序缓存，需要升级版本或在演示入口中使用规则化列表。\n9. 点击工作台应用后，如果功能尚未实现，可以进入占位提示、权限申请或对应应用 AI；不要因为能力未实现就隐藏入口。\n10. 这套规则只决定主 AI 底部入口展示；进入应用 AI 后，应用内部快捷入口应继续按应用自己的能力集合展示。",
      },
    ],
  },
  {
    id: "card-state-switching",
    title: "卡片状态切换",
    demos: [
      {
        id: "meeting-room-in-place-state",
        title: "会议室：原位置切换浏览与编辑",
        command: { kind: "openMeetingRoomCardStateDemo" },
        hideDevPrompt: true,
        prompt:
          "用「一楼对话流 + 二楼抽屉」的分层，观察卡片何时在原消息内变形态、何时新开一轮消息、何时滑出抽屉；以及保存、删除等操作后界面与轻提示如何反馈。",
        logicMarkdown:
          "本演示只说明**交互分层与状态切换**，不涉及具体业务规则如何计算。\n\n---\n\n## 一楼、二楼分别指什么\n\n- **一楼**：会议室应用 AI 里的**主对话流**。用户消息与助手消息按时间向下堆叠；这里的卡片挂在具体某条助手消息下。\n- **二楼**：从一楼某些入口打开后出现的**业务抽屉**（侧滑层）。抽屉内有**自己的**滚动对话区与输入框，与一楼列表**不混排**；关闭抽屉后回到一楼当前进度。\n\n可以把一楼理解为「应用内主会话」，二楼理解为「在同一会话之上叠一层、专门走表单/多步说明的子会话」。\n\n---\n\n## 什么时候在一楼、什么时候上二楼\n\n- **始终在一楼出现**：进入演示后注入的**主列表卡**；底栏「查看会议室」「新建会议室」触发的操作会在一楼**新开一轮**（一条用户短句 + 一条助手占位），其后的**独立卡片**也停在一楼。\n- **打开二楼抽屉**：在一楼主列表卡、或一楼「查看会议室」卡片里的列表上，点击会跳转到**编辑**或**单条设置**类入口时，**打开抽屉**并在抽屉内展示对应场景（列表 / 表单 / 详情 / 设置流程等由当前入口决定）。\n- **仍在二楼、但模拟「多轮」**：例如从**详情**进入设置时，抽屉里可能在**同一条主内容下方**再追加一块「新一轮」的说明气泡 + 表单区（用于表达「子话题」叠在同一抽屉会话里），这与一楼新开用户轮次的触发方式不同，但视觉上都属于抽屉内向下延伸。\n\n---\n\n## 什么时候卡片在原位置变形态，什么时候换一张卡\n\n- **原位置、同一条助手消息、同一张卡内切换**：一楼「新建」类卡片在**提交成功后**，不新增助手消息，**当前卡**从表单态切到详情态（必要时将卡片顶对齐到阅读区顶部，避免被默认滚底打断）。\n- **新开消息上的卡**：底栏触发的「查看」「新建」会走**新的一轮**用户消息 + 助手消息，卡片落在**新消息**上，而不是去改旧消息的卡片。\n- **列表 → 编辑/详情**：主列表卡本身可视为一种稳定形态；需要长表单或分步流时走抽屉，避免把整段表单硬塞进主列表那条消息里。\n\n---\n\n## 创建 / 修改 / 删除 的反馈怎么体现（纯界面层）\n\n- **轻提示（Toast）**：成功保存、成功删除、部分校验不通过等，会用**短时条带提示**给出结果，不打断当前所在楼层（一楼或二楼）。\n- **时间类文案在卡片标题行**：非删除态下，详情等卡片标题旁可出现**「创建于 / 修改于」**一类小字，与保存后是否首次写入有关；**删除后**同一位置可改为**「已删除 + 时间」**一类状态小字。\n- **删除态的版面**：主名称等关键文案可走**删除线**；底部操作区在删除态**隐藏**，避免继续操作已删除对象。\n- **列表与抽屉的同步**：在一楼或二楼任一入口完成会改数据的操作后，**同源列表**（主卡内列表、一楼列表卡、抽屉内列表）应一起反映最新形态，无需用户手动刷新页面。\n\n---\n\n## 小结\n\n| 维度 | 要点 |\n| --- | --- |\n| 一楼 | 主对话流；底栏入口多会**新开一轮**再出卡 |\n| 二楼 | 抽屉内独立滚动区；从列表点「编辑/设置」等**打开** |\n| 原位置切换 | 典型：一楼新建卡**保存后同卡**切详情 |\n| 反馈 | Toast + 标题旁状态小字 + 删除态样式与操作隐藏 + 多列表同源更新 |",
        devPromptMarkdown: "",
      },
    ],
  },
]

/** 左侧导航实际展示的演示分类（已过滤 `hidden`） */
export const VISIBLE_DEMO_INSTRUCTION_CATEGORIES: readonly DemoCategory[] =
  DEMO_INSTRUCTION_CATEGORIES.filter((c) => !c.hidden)
    .map((c) => ({ ...c, demos: c.demos.filter((d) => !d.hidden) }))
    .filter((c) => c.demos.length > 0)

/**
 * 当前被隐藏的演示入口（整组 `category.hidden` 或单条 `demo.hidden`）。
 * 需要恢复时在 `DEMO_INSTRUCTION_CATEGORIES` 里去掉对应 `hidden` 即可。
 */
export function listHiddenDemoInstructionOutlineEntries(): ReadonlyArray<{
  categoryId: string
  categoryTitle: string
  hiddenDemos: ReadonlyArray<{ id: string; title: string }>
}> {
  const out: Array<{
    categoryId: string
    categoryTitle: string
    hiddenDemos: ReadonlyArray<{ id: string; title: string }>
  }> = []
  for (const c of DEMO_INSTRUCTION_CATEGORIES) {
    if (c.hidden) {
      out.push({
        categoryId: c.id,
        categoryTitle: c.title,
        hiddenDemos: c.demos.map((d) => ({ id: d.id, title: d.title })),
      })
      continue
    }
    const hiddenDemos = c.demos.filter((d) => d.hidden).map((d) => ({ id: d.id, title: d.title }))
    if (hiddenDemos.length) {
      out.push({ categoryId: c.id, categoryTitle: c.title, hiddenDemos })
    }
  }
  return out
}

const LEFT_DEFAULT_WIDTH_PX = 260
const RIGHT_DEFAULT_WIDTH_PX = 360
const SIDE_MIN_WIDTH_PX = 200
const SIDE_MAX_WIDTH_PX = 520
const SPLITTER_WIDTH_PX = 10
const OUTLINE_HIT_H = "30px"
const DOC_ZONE_PAD_X = "var(--space-400)"
const OUTLINE_DEMO_INDENT_FROM_EDGE = "var(--space-300)"
const COPY_RESET_MS = 3000

function clampSideWidth(next: number) {
  return Math.min(SIDE_MAX_WIDTH_PX, Math.max(SIDE_MIN_WIDTH_PX, next))
}

function CopyableMarkdownSection(props: {
  id: string
  title: string
  markdown: string
  sectionRef?: React.Ref<HTMLElement>
}) {
  const { id, title, markdown, sectionRef } = props
  const [copied, setCopied] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`## ${title}\n\n${markdown}`)
      if (timerRef.current) clearTimeout(timerRef.current)
      setCopied(true)
      timerRef.current = setTimeout(() => {
        setCopied(false)
        timerRef.current = null
      }, COPY_RESET_MS)
    } catch {
      /* clipboard failure should not interrupt the demo */
    }
  }, [markdown, title])

  return (
    <section
      id={id}
      ref={sectionRef}
      className="scroll-mt-[length:var(--space-1200)] border-t border-border/50 py-[length:var(--space-500)] first:border-t-0 first:pt-0"
    >
      <div className="mb-[length:var(--space-300)] flex min-w-0 items-center justify-start gap-[length:var(--space-200)]">
        <h2 className="min-w-0 shrink text-[length:var(--font-size-lg)] font-[var(--font-weight-semibold)] leading-snug text-text">
          {title}
        </h2>
        <button
          type="button"
          onClick={() => void handleCopy()}
          aria-label={copied ? "已复制" : `复制${title}`}
          title={copied ? "已复制" : `复制${title}`}
          className="flex size-[length:var(--space-800)] shrink-0 items-center justify-center rounded-[length:var(--radius-200)] border border-border bg-[var(--black-alpha-11)] text-text-secondary shadow-xs transition-colors hover:bg-[var(--black-alpha-12)] hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {copied ? (
            <Check className="size-[length:var(--space-400)] text-text" strokeWidth={2} aria-hidden />
          ) : (
            <Copy className="size-[length:var(--space-400)]" strokeWidth={2} aria-hidden />
          )}
        </button>
      </div>
      <SpecDocBody markdown={markdown} />
    </section>
  )
}

function SectionDockBar(props: {
  sections: readonly DetailSection[]
  onJump: (id: string) => void
}) {
  const { sections, onJump } = props
  if (!sections.length) return null

  return (
    <div className="sticky bottom-0 z-20 -mx-[length:var(--space-400)] mb-[calc(var(--space-600)*-1)] border-t border-border/60 bg-bg-secondary px-[length:var(--space-300)] pb-[length:var(--space-800)] pt-[length:var(--space-300)] shadow-sm after:absolute after:inset-x-0 after:top-full after:h-[length:var(--space-600)] after:bg-bg-secondary">
      <div className="flex min-w-0 flex-wrap gap-[length:var(--space-150)]">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onJump(section.id)}
            className="min-h-[length:var(--space-700)] max-w-full rounded-[length:var(--radius-200)] bg-[var(--black-alpha-11)] px-[length:var(--space-250)] py-[length:var(--space-100)] text-left text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-snug text-text-secondary transition-colors hover:bg-[var(--black-alpha-12)] hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="line-clamp-2">{section.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function InteractionDemoInstructionSetShell(props: {
  children: React.ReactNode
  onCommand: (cmd: DemoInstructionCommand) => void
}) {
  const { children, onCommand } = props
  const [selectedId, setSelectedId] = React.useState(
    VISIBLE_DEMO_INSTRUCTION_CATEGORIES[0]?.demos[0]?.id ?? "",
  )
  const [leftWidthPx, setLeftWidthPx] = React.useState(LEFT_DEFAULT_WIDTH_PX)
  const [rightWidthPx, setRightWidthPx] = React.useState(RIGHT_DEFAULT_WIDTH_PX)
  const leftDragRef = React.useRef<{ startX: number; startW: number } | null>(null)
  const rightDragRef = React.useRef<{ startX: number; startW: number } | null>(null)
  const detailScrollRef = React.useRef<HTMLElement | null>(null)
  const detailSectionRefs = React.useRef<Record<string, HTMLElement | null>>({})

  const selected = React.useMemo(() => {
    for (const category of VISIBLE_DEMO_INSTRUCTION_CATEGORIES) {
      const hit = category.demos.find((demo) => demo.id === selectedId)
      if (hit) return hit
    }
    return VISIBLE_DEMO_INSTRUCTION_CATEGORIES[0]?.demos[0] ?? null
  }, [selectedId])

  const detailSections = React.useMemo<DetailSection[]>(
    () => {
      if (!selected) return []
      return [
        ...(selected.hideDevPrompt
          ? []
          : [
              {
                id: `${selected.id}-dev-prompt`,
                title: "开发指令 prompt",
                markdown: selected.devPromptMarkdown,
              },
            ]),
        {
          id: `${selected.id}-logic`,
          title: "交互逻辑说明",
          markdown: selected.logicMarkdown,
        },
      ]
    },
    [selected],
  )

  const scrollDetailSectionIntoView = React.useCallback((id: string) => {
    detailSectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const handleDemoClick = React.useCallback(
    (demo: DemoScenario) => {
      setSelectedId(demo.id)
      onCommand(demo.command)
    },
    [onCommand],
  )

  const onLeftResizePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      leftDragRef.current = { startX: e.clientX, startW: leftWidthPx }
    },
    [leftWidthPx],
  )

  const onLeftResizePointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!leftDragRef.current) return
    setLeftWidthPx(clampSideWidth(leftDragRef.current.startW + e.clientX - leftDragRef.current.startX))
  }, [])

  const onRightResizePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      rightDragRef.current = { startX: e.clientX, startW: rightWidthPx }
    },
    [rightWidthPx],
  )

  const onRightResizePointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!rightDragRef.current) return
    setRightWidthPx(clampSideWidth(rightDragRef.current.startW - (e.clientX - rightDragRef.current.startX)))
  }, [])

  const onResizePointerUp = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    leftDragRef.current = null
    rightDragRef.current = null
  }, [])

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-row pt-[76px]">
      <nav
        className="flex min-h-0 shrink-0 flex-col gap-0 overflow-y-auto overflow-x-hidden border-r border-border/40 py-[length:var(--space-200)]"
        style={{ width: leftWidthPx }}
        aria-label="交互演示指令集·演示入口"
      >
        {VISIBLE_DEMO_INSTRUCTION_CATEGORIES.map((category) => (
          <div key={category.id} className="min-w-0">
            <div
              style={{ paddingLeft: DOC_ZONE_PAD_X, height: OUTLINE_HIT_H, minHeight: OUTLINE_HIT_H }}
              className="flex w-full min-w-0 items-center gap-0 rounded-none border-0 py-0 pr-0 text-left text-text-secondary"
            >
              <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-none">
                {category.title}
              </span>
            </div>
            {category.demos.map((demo) => {
              const active = demo.id === selectedId
              return (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleDemoClick(demo)}
                  style={{
                    paddingLeft: `calc(${DOC_ZONE_PAD_X} + ${OUTLINE_DEMO_INDENT_FROM_EDGE})`,
                    height: OUTLINE_HIT_H,
                    minHeight: OUTLINE_HIT_H,
                  }}
                  className={cn(
                    "flex w-full min-w-0 items-center gap-0 rounded-none border-0 py-0 pr-0 text-left text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-none text-primary transition-colors hover:bg-[var(--black-alpha-11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                    active && "bg-[var(--black-alpha-11)]",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate text-left">
                    {demo.navLabel ?? `演示：${demo.title}`}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="调整演示入口宽度"
        onPointerDown={onLeftResizePointerDown}
        onPointerMove={onLeftResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerUp}
        className="group relative z-10 shrink-0 cursor-col-resize touch-none select-none"
        style={{ width: SPLITTER_WIDTH_PX }}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-[length:var(--space-600)] pl-[length:var(--space-50)] pr-[length:var(--space-50)] pt-0">
        {children}
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="调整逻辑和指令区域宽度"
        onPointerDown={onRightResizePointerDown}
        onPointerMove={onRightResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerUp}
        className="group relative z-10 shrink-0 cursor-col-resize touch-none select-none"
        style={{ width: SPLITTER_WIDTH_PX }}
      />

      <aside
        ref={detailScrollRef}
        className="min-h-0 shrink-0 overflow-y-auto overflow-x-hidden border-l border-border/40 pb-[length:var(--space-600)] pt-[length:var(--space-300)]"
        style={{ width: rightWidthPx, paddingLeft: DOC_ZONE_PAD_X, paddingRight: DOC_ZONE_PAD_X }}
        aria-label="交互演示指令集·逻辑和指令"
      >
        {selected ? (
          <article className="py-[length:var(--space-500)]">
            <h1 className="mb-[length:var(--space-300)] text-[length:var(--font-size-xl)] font-[var(--font-weight-semibold)] leading-snug text-text">
              {selected.title}
            </h1>
            <p className="mb-[length:var(--space-500)] text-[length:var(--font-size-sm)] leading-normal text-text-secondary">
              {selected.prompt}
            </p>
            {detailSections.map((section) => (
              <CopyableMarkdownSection
                key={section.id}
                id={section.id}
                title={section.title}
                markdown={section.markdown}
                sectionRef={(node) => {
                  detailSectionRefs.current[section.id] = node
                }}
              />
            ))}
          </article>
        ) : null}
        <SectionDockBar
          sections={detailSections}
          onJump={scrollDetailSectionIntoView}
        />
      </aside>
    </div>
  )
}
