# Food Native iOS Requirement

> 该文件用于新做饭产品的需求基线草案。迁移到新 repo 后，可直接重命名为 `requirement.md` 继续维护。

## 1. Product Goal
构建一个 **离线可用的做饭辅助 App**，帮助用户快速记录值得回购的超市预制菜，并基于家里现有食材，快速找到可执行的菜谱。

核心价值：
- 打开即能回看“哪些预制菜值得买、怎么做最好吃”
- 从已有食材出发，而不是从空白菜谱库开始思考
- 菜谱推荐以“当前能做什么”为核心，而不是内容堆砌
- 数据优先本地化，先保证自己长期可维护、可积累

## 2. Target User
- 主要用户：你自己（个人日常做饭与采购决策）
- 次要用户：未来可分享给少量朋友或家人测试

## 3. Non-Goals (当前版本不做)
- 不做登录/注册
- 不做云端同步
- 不做外卖、买菜、商超下单链路
- 不做社区分享、评论、排行榜
- 不做复杂营养分析与卡路里计算
- 不做 AI 聊天式问答入口
- 不做 OCR 扫包装、扫食材识别（后续可讨论）

## 4. Current Scope (v0.1)
### 4.1 页面
1. Tab 1 - 预制菜
- 展示本地预制菜列表，支持卡片浏览。
- 每个预制菜记录产品外貌图、品牌、购买渠道、加热/烹饪方式与主观评价。
- 支持按 tag 分类筛选，例如：`韩餐`、`速食`、`高蛋白`、`适合囤货`。
- 支持收藏，收藏项优先展示。
- 可进入预制菜详情页，查看多图、做法、注意事项与回购建议。

2. Tab 2 - 食材选菜谱
- 顶部展示食材分类与可勾选食材列表。
- 用户可通过勾选现有食材构建“当前食材集合”。
- 系统基于已勾选食材，从本地菜谱库推荐可制作菜谱。
- 菜谱列表优先展示“完全可做”的菜谱，其次展示“缺少少量食材”的菜谱。
- 可进入菜谱详情页，查看成品图、所需食材、步骤、预计时长与缺少食材。

3. 当前版本不单独开第 3 个 Tab
- 收藏、历史、最近做过等能力先作为 Tab 1 / Tab 2 的附属状态存在。
- 若后续使用频率高，再扩展独立 Tab。

### 4.2 数据
- `Resources/Data/PreparedFoodLibrary/*.json`：单文件单预制菜。
- `Resources/Data/RecipeLibrary/*.json`：单文件单菜谱。
- `Resources/Data/IngredientLibrary/*.json`：单文件单食材定义，用于筛选与匹配。
- `Resources/Images`：本地图片，承载预制菜包装图、成品图、步骤参考图。
- 当前版本默认本地 JSON + 本地图片，不依赖网络。

### 4.3 技术
- 原生 iOS：SwiftUI
- 架构：`View + ViewModel + Local Repository`
- UI 架构：`DesignSystem + Reusable Components`
- 数据源：本地 JSON + 本地图片
- 最低系统建议：iOS 17

## 5. Data Schema (Single Source of Truth)
`Resources/Data/PreparedFoodLibrary/*.json` 采用“单文件单预制菜”结构，每个 Prepared Food 文件如下：

```json
{
  "id": "string",
  "name": "string",
  "brand": "string",
  "category": "string",
  "purchaseSource": "string",
  "tags": ["string"],
  "coverImageName": "local_image_name",
  "detailImageNames": ["local_image_name"],
  "cookMethod": {
    "method": "Microwave|Pan|Boil|Oven|AirFryer|Steam",
    "durationMinutes": 8,
    "heatLevel": "Low|Medium|High",
    "steps": ["string"]
  },
  "servingSuggestion": ["string"],
  "notes": ["string"],
  "rating": 4,
  "wouldRepurchase": true
}
```

说明：
- `detailImageNames` 为可选字段，用于包装图、成品图、加热后效果图。
- `cookMethod.steps` 用于记录最适合自己的做法，而不是只抄包装说明。
- `rating` 先按 1-5 整数处理。

`Resources/Data/IngredientLibrary/*.json` 采用“单文件单食材”结构，每个 Ingredient 文件如下：

```json
{
  "id": "string",
  "name": "string",
  "category": "Vegetable|Protein|Staple|Seasoning|Frozen|Other",
  "aliases": ["string"],
  "tags": ["string"]
}
```

说明：
- `aliases` 用于处理“西红柿/番茄”“青椒/甜椒”之类的同义词。
- `tags` 用于支持未来更细的筛选，例如 `常备`、`低卡`、`适合快手菜`。

`Resources/Data/RecipeLibrary/*.json` 采用“单文件单菜谱”结构，每个 Recipe 文件如下：

```json
{
  "id": "string",
  "title": "string",
  "subtitle": "string",
  "tags": ["string"],
  "coverImageName": "local_image_name",
  "estimatedMinutes": 20,
  "difficulty": "Easy|Medium|Hard",
  "ingredients": [
    {
      "ingredientID": "string",
      "displayName": "string",
      "amount": "string",
      "required": true
    }
  ],
  "steps": [
    {
      "id": "string",
      "title": "string",
      "instruction": "string",
      "imageName": "local_image_name"
    }
  ],
  "tips": ["string"]
}
```

说明：
- 菜谱推荐逻辑应以 `ingredientID` 为主进行匹配，避免只靠名称字符串比较。
- `required: false` 可表示可选配料或装饰项。
- `steps.imageName` 为可选字段。

## 6. File/Module Convention
新项目建议沿用当前 AppFit 的目录组织：

- `AppName/Models`: 数据模型
- `AppName/Services`: 本地数据读取与匹配逻辑
- `AppName/ViewModels`: 页面状态管理
- `AppName/Views`: 页面
- `AppName/DesignSystem`: 设计 token（Color / Font / Layout）
- `AppName/Components`: 可复用 UI 组件（Card / Tag / Filter Bar / Section Header）
- `AppName/Resources/Data/PreparedFoodLibrary`: 预制菜 JSON
- `AppName/Resources/Data/IngredientLibrary`: 食材 JSON
- `AppName/Resources/Data/RecipeLibrary`: 菜谱 JSON
- `AppName/Resources/Images`: 本地图片

命名约定建议如下：
- 预制菜：`food_*.json`
- 食材：`ingredient_*.json`
- 菜谱：`recipe_*.json`

## 7. Acceptance Criteria
满足以下全部条件即视为当前版本完成：
1. 可稳定切换 2 个核心模块：预制菜、食材选菜谱。
2. Tab 1 可基于 `PreparedFoodLibrary/*.json` 正确渲染预制菜列表。
3. Tab 1 顶部可按 tag 进行本地筛选，且收藏项优先展示。
4. 预制菜详情页可展示封面图、可选多图、做法、主观评价与回购建议。
5. Tab 2 可展示可勾选的食材集合，支持多选与取消选择。
6. 菜谱推荐结果应根据当前勾选食材实时刷新。
7. 推荐列表可区分“完全可做”和“缺少部分食材”两类结果。
8. 菜谱详情页可展示食材清单、步骤、预计时长与缺少食材。
9. 菜谱匹配逻辑以结构化 `ingredientID` 为主，不依赖自由文本模糊匹配。
10. 预制菜、食材、菜谱数据均可通过新增 JSON 文件扩展，不要求修改工程代码。
11. 页面层不散落硬编码 Color/Font（图像内容除外）。
12. 整个产品在无网络条件下仍可完整浏览与使用核心能力。

## 8. Iteration Plan
### Phase A
- SwiftUI 原生骨架完成。
- 双模块 Tab 结构完成。
- 本地 JSON 驱动的预制菜与菜谱基础浏览完成。
- 食材勾选与菜谱匹配逻辑完成。

### Phase B
- 收藏、最近做过、最近买过完成。
- 菜谱排序策略增强，例如：按匹配度、耗时、难度排序。
- 预制菜详情补充更多图文字段，如包装营养信息、最佳加热方式备注。
- 菜谱详情补充步骤参考图与可选替换食材。

### Phase C
- 本地导入/导出 JSON 模板。
- Pantry 模式：标记家里常备食材，降低每次勾选成本。
- OCR 扫包装或拍照辅助录入（若后续确认需要）。
- iPad 布局适配。

## 9. Collaboration Contract
建议沿用双文件协作：
1. `changerequest.md`：你维护，只写“想改什么”。
2. `requirement.md`：我维护，记录“当前真实状态、已实现范围、下一步计划”。

如果在当前仓库临时起草，则可先使用：
1. `changerequest.md`
2. `food_requirement.md`

迁移到新 repo 后，建议统一收敛为：
1. `changerequest.md`
2. `requirement.md`

请求模板如下：

```md
## CR-YYYYMMDD-XX
- Status: Open
- Goal:
- Scope:
- Out of Scope:
- Acceptance Criteria:
- UI Reference: (可选，Figma 链接或截图说明)
- Notes: (可选)
```

## 10. Delivery Log
### Initial Draft (2026-03-16)
- 创建新做饭产品需求基线文档。
- 明确两大核心模块：预制菜记录、食材选菜谱。
- 约束首版范围为“本地 JSON + 本地图片 + 离线使用”。
- 定义 `PreparedFoodLibrary`、`IngredientLibrary`、`RecipeLibrary` 三类数据目录与基础 JSON 结构。
- 约定新项目继续沿用 SwiftUI 原生技术栈与 `View + ViewModel + Local Repository` 架构。
