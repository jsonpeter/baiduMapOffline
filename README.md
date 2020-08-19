# 百度离线地图Web端Nodejs采集版

#####可使用瓦片地图下载器 下载所需区域和层级地图

#####在联网的情况下程序会判断本地是否存在瓦片地图，如果不存在会自动抓取

# 开始使用 (Getting Started)

`npm install`

`node mian.js`

## 配置 (Configuration)

加载 `BaiduApi_2.0.js` 之前修改自定义配置：

custom config before load `BaiduApi_2.0.js`:

```js
window.__BMAP_EXTRA_CONFIG__ = {
    enable: true,
    host: '', // exmaple in nginx container
    path: '',
    tilePath: 'tiles/tile',
    satellitePath: 'tiles/it',
    roadPath: 'tiles/road'
}
```

默认配置 (default configuration):

```js
{
    // 是否启用离线地图 (main switch)
    enable: false,
    // 部署离线地图的服务器地址 (deploy bmap-offline server host)
    host: '',
    // 静态资源路径，相对于 [host]/
    // (static resources path (relative host root path))
    path: '',
    // 瓦片图资源路径，相对于 [host]/[path]/
    // (tile pics resources path)
    tilePath: 'tiles/tile',
    // 卫星图资源路径，相对于 [host]/[path]/
    // (satellite pics resources path)
    satellitePath: 'tiles/it',
    // 混合地图中的路网图资源路径，相对于 [host]/[path]/
    // (satellite street pics resources path)
    roadPath: 'tiles/road',
    // 瓦片图时间戳 (tile updated date)
    tileUdt: '20170927',
    // 卫星图时间戳 (satellite updated date)
    satelliteUdt: '20170927',
    // 混合地图中的路网图时间戳 (satellite street updated date)
    roadUdt: '20170927',
    // 离线化的功能模块 js 文件
    // (localized modules (path is [host]/[path]/[getmodules]/[mod].js))
    modules: [
        'map,scommon,mapclick,oppc,newvectordrawlib,style,tile,navictrl',
        'canvablepath,common,symbol,marker,copyrightctrl',
        'draw,drawbycanvas,drawbysvg,drawbyvml,poly'
    ],
    // 百度地图自身 API 请求拦截器 (BMap request interceptor)
    interceptor: function (url) {
        return /(qt=vQuest|qt=verify|qt=cen)/.test(url);
    }
}
```
