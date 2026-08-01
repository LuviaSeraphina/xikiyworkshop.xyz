# XikiyWorkshop

个人网站，包含首页、博客、文章详情、时间轴、云盘、友链六个核心界面，整体采用插画手绘风格，并通过 `DEVELOPER_MODE` 区分动态开发与静态生产构建。

## 技术栈

- Next.js 16（App Router）+ TypeScript
- Tailwind CSS 4
- Markdown / MDX 内容层
- Cloudflare R2（云盘与图片存储）
- 不蒜子（访客 / 浏览量统计）

## 快速开始

```bash
npm install
cp .env.example .env.local
npm run dev
```

默认 `DEVELOPER_MODE=false`，访问 `http://localhost:3000`。

## 开发模式

```bash
DEVELOPER_MODE=true npm run dev
```

开启后：

- 顶部导航出现「管理」入口，访问 `/admin/` 进入管理后台。
- 管理后台支持：写博客、上传并裁剪图片、编辑云盘目录、修改站点配置。
- 所有编辑会直接写入 `content/posts/`、`data/`、`public/images/`，保存后重新构建即可发布。

## 静态构建

```bash
DEVELOPER_MODE=false npm run build
```

构建产物输出到 `out/`，是纯静态站点；开发模式相关的管理入口、按钮和 API 不会出现在产物中。

## 目录结构

```text
content/posts/   文章（Markdown + frontmatter）
data/site.json   站点配置、个人信息、友链、技术栈
data/cloud.json  云盘目录树
public/images/   图片素材
src/app/         页面路由
src/components/  通用与页面组件
src/lib/         数据读取、Markdown 处理
```

## R2 配置（可选）

云盘接口在开发模式会优先读取本地清单；如需直接对接 R2，在 `.env.local` 中填写：

```text
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=xikiy-bucket
R2_PUBLIC_URL=
```
