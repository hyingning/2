/**
 * Netlify Serverless Function
 * 潍坊市教育局 - 公告公示 RSS Feed 生成器
 *
 * 部署后访问:
 *   https://你的域名.netlify.app/rss
 *   https://你的域名.netlify.app/rss.xml
 */

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildRSS(items, baseUrl) {
  const siteUrl = 'http://jyj.weifang.gov.cn';
  const listUrl = siteUrl + '/jyjlist/?ancestorCataId=trs1308520&pCataId=trs1308520&cataId=trs1308521';
  const pubDate = new Date().toUTCString();

  const itemXml = items.map(item => {
    const title = escapeXml(item.subject);
    const link = `${siteUrl}/55332/${item.xxid}.html`;
    const date = new Date(item.fwdate).toUTCString();
    return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${date}</pubDate>
      <source>潍坊市教育局</source>
      <description>${title}</description>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>潍坊市教育局 - 公告公示</title>
    <link>${escapeXml(listUrl)}</link>
    <description>潍坊市教育局信息公开 - 公告公示栏目（Netlify 自动生成）</description>
    <language>zh-CN</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <generator>Netlify Serverless RSS Generator</generator>
${itemXml}
  </channel>
</rss>`;
}

// Netlify Function Handler
exports.handler = async (event, context) => {
  const baseUrl = event.headers['host']
    ? `https://${event.headers['host']}`
    : 'https://localhost';

  const headers = {
    'Content-Type': 'application/rss+xml; charset=utf-8',
    'Cache-Control': 'public, max-age=600, s-maxage=600'
  };

  try {
    const response = await fetch('http://jyj.weifang.gov.cn/els-service/article/1/50', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ dwid: '55332', catas: ['trs1308521'] }),
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success || !data.data || !data.data.contents) {
      throw new Error('API 返回数据格式异常');
    }

    const rssXml = buildRSS(data.data.contents, baseUrl);

    return {
      statusCode: 200,
      headers,
      body: rssXml
    };

  } catch (error) {
    console.error('RSS 生成失败:', error.message);
    return {
      statusCode: 200,
      headers,
      body: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>潍坊市教育局 - 公告公示</title>
    <link>http://jyj.weifang.gov.cn</link>
    <description>RSS 临时不可用，请稍后刷新。错误: ${escapeXml(error.message)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`
    };
  }
};
