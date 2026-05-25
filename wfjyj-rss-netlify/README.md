# 市教育局公告公示 RSS Feed - Netlify 部署

## 一键部署

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/wfjyj-rss-netlify)

## 手动部署

### 方式一：GitHub 导入（推荐）

1. 把本项目推送到 GitHub 仓库
2. 登录 [Netlify](https://app.netlify.com)
3. 点击 **Add new site → Import an existing project**
4. 选择 GitHub 仓库
5. 保持默认设置，点击 **Deploy**

### 方式二：CLI 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
cd wfjyj-rss-netlify
netlify deploy --prod --dir=.
```

## 访问地址

| 路径 | 说明 |
|------|------|
| `https://你的域名.netlify.app/rss` | RSS 主地址 |
| `https://你的域名.netlify.app/rss.xml` | 备用地址 |
| `https://你的域名.netlify.app/feed` | 别名 |

## 订阅到 RSS 阅读器

将部署后的 RSS 链接添加到任意 RSS 阅读器即可。

## 自定义域名

Netlify 支持绑定自己的域名，在 **Site settings → Domain management** 中设置。
