// ==UserScript==
// @name         BilibiliPromote
// @namespace    https://github.com/Mlikiowa/BilibiliPromote
// @version      1.0.0
// @description  增强B站脚本
// @author       Mlikiowa
// @match        *://bilibili.com/*
// @match        *://*.bilibili.com/*
// @require      https://scriptcat.org/lib/637/1.3.3/ajaxHooker.js
// @connect      *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
(function () {
    'use strict';
    let TargetURL = new URL(window.location.href);
    if (TargetURL.pathname == "/") {
        // 当前在主页 挂载Hook
        ajaxHooker.filter([
            { url: 'api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd' },
            { url: 'api.bilibili.com/pugv/app/web/floor/switch' },
            { url: 'api.bilibili.com/pgc/web/variety/feed' },
            { url: 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList' },
            { url: 'api.bilibili.com/pgc/web/timeline/v2' },
            { url: 'api.bilibili.com/x/web-interface/dynamic/region' },
            { url: 'manga.bilibili.com/twirp/comic.v1.Comic/GetClassPageSixComics' },
            { url: 'api.bilibili.com/x/web-show/wbi/res/locs' }
        ]);
        ajaxHooker.hook(async request => {
            let HookURL = new URL(request.url);
            //console.log("[BilibiliPromote] 拦截URL:" + HookURL.pathname);
            if (HookURL.pathname == "/x/web-interface/wbi/index/top/feed/rcmd") {
                console.log("[BilibiliPromote] 拦截-视频列表-删除广告");
                request.response = async res => {
                    let data = [];
                    res.json.data.side_bar_column = []; //置空 我忘了是干嘛的
                    for (let k in res.json.data.item) {
                        if (res.json.data.item[k].id != 0) {
                            data.push(res.json.data.item[k]);
                        } else {
                            data.push(data[0]);//复制一份 保持数据对齐
                        }
                    }
                    res.json.data.item = data;
                    //console.log(res.json);
                }
            }
            if (HookURL.pathname == "/pugv/app/web/floor/switch") {
                console.log("[BilibiliPromote] 拦截-推荐列表-删除推课");
                request.response = async res => {
                    res.json.data.season = []; //列表置空
                    //console.log(res.json);
                }
            }
            if (HookURL.pathname == "/pgc/web/variety/feed") {
                console.log("[BilibiliPromote] 拦截-推荐列表-删除杂类推荐");
                request.response = async res => {
                    res.json.data.cursor = "0";
                    res.json.data.list = []; //列表置空
                    //console.log(res.json);
                }
            }
            if (HookURL.pathname == "/xlive/web-interface/v1/webMain/getMoreRecList") {
                console.log("[BilibiliPromote] 拦截-推荐列表-删除直播推荐");
                request.response = async res => {
                    res.json.data.recommend_room_list = []; //列表置空
                    //console.log(res.json);
                }
            }
            if (HookURL.pathname == "/pgc/web/timeline/v2") {
                return; //不破坏看番
                console.log("[BilibiliPromote] 拦截-推荐列表-删除番剧推荐");
                request.response = async res => {
                    res.json.result.latest = []; //列表置空
                    res.json.result.timeline = [];
                    //console.log(res.json);
                }
            }
            if (HookURL.pathname == "/x/web-interface/dynamic/region") {
                console.log("[BilibiliPromote] 拦截-推荐列表-删除电影纪录片推荐");
                request.response = async res => {
                    if (res.json.code != 0 && res.json.code != 200) return;
                    res.json.data.archives = []; //列表置空
                    res.json.data.page.size = 0;
                    //console.log(res.json);
                }

            }
            if (HookURL.pathname == "/twirp/comic.v1.Comic/GetClassPageSixComics") {
                return; //不破坏漫画
                console.log("[BilibiliPromote] 拦截-推荐列表-删除漫画推荐");
                request.response = async res => {
                    if (res.json.code != 0 && res.json.code != 200) return;
                    res.json.data.roll_six_comics = []; //列表置空
                    //console.log(res.json);
                }
            }
            if (HookURL.pathname == "/x/web-show/wbi/res/locs") {
                console.log("[BilibiliPromote] 拦截-推荐列表-删除赛事推荐");
                request.response = async res => {
                    for (let k in res.json.data) {
                        res.json.data[k] = [];// 全部列表置空 不遍历有漏的
                    }
                    //console.log(res.json);
                }
            }
        });
    }

    // 预加载样式
    let AdVideoCss = `
    .ad-floor-cover.b-img {
        display: none !important;
    }
    div.video-page-game-card-small{
        display: none !important;
    }
    a.ad-report.video-card-ad-small {
        display: none !important;
    }`;
    console.log("[BilibiliPromote] 预载-视频页广告-删除广告");

    let StorageBoxCss = `
    .storage-box{
        display: none !important;
    }`;
    console.log("[BilibiliPromote] 预载-主页浮窗-删除无用浮窗");

    // 此处过滤了主页直播
    let SwiperCss = `
        .bili-live-card .is-rcmd {
            display: none !important;
        }
        .recommended-container_floor-aside .container.is-version8>*:nth-of-type(n + 13) {
            margin-top: 40px !important;
        }
        .recommended-container_floor-aside .container>*:nth-of-type(7) {
            margin-top: 40px !important;
        }
        div.recommended-swipe.grid-anchor{
            display: none !important;
        }
    `;
    console.log("[BilibiliPromote] 预载-主页幻灯片-移除幻灯片(仅1080P适配)");
    let VipWarpCss = `
    .vip-wrap{
        display: none !important;
    }`;

    let TittleDisplayCss = `
    ul.left-entry > li:nth-child(n+4):nth-child(-n+7){
        display: none !important;
    }
    div.nav-link > ul > li:nth-child(n+5){
        display: none !important;
    }`;
    console.log("[BilibiliPromote] 预载-主页导航栏-删除无用导航");

    let DownloadEntryCss = `
    .download-entry{
        display: none !important;
    }`;
    console.log("[BilibiliPromote] 预载-主页标题栏-删除下载入口");
    //li.right-entry-item.right-entry-item--upload
    let UploadEntryCss = `
    li.right-entry-item.right-entry-item--upload{
        display: none !important;
    }`;
    console.log("[BilibiliPromote] 预载-主页标题栏-删除投稿入口");
    let VideoFllowCss = `
    .bpx-player-top-left-follow
    {
        display: none !important;
    }`;

    console.log("[BilibiliPromote] 预载-视频播放器-删除多余关注")
    let AvatarVipCss = `
    #biliMainHeader > div > div > ul.right-entry > li.v-popover-wrap.header-avatar-wrap > div.v-popover.is-bottom > div > div > div.vip-entry-containter{
        display: none !important;
    }`;
    console.log("[BilibiliPromote] 预载-主页标题栏-删除官方广告")
    // 预载入批量处理
    GM_addStyle(AdVideoCss + SwiperCss + StorageBoxCss + VipWarpCss + TittleDisplayCss + DownloadEntryCss + UploadEntryCss + VideoFllowCss + AvatarVipCss);

    // 以下是需要等待 Dom加载完毕
    document.addEventListener("DOMContentLoaded", (event) => {
        console.log("[BilibiliPromote] DOMContentLoaded...");
    });

})();
