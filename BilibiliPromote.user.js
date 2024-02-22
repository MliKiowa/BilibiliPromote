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
        ]);
        ajaxHooker.hook(async request => {
            let HookURL = new URL(request.url);
            if (HookURL.pathname == "/x/web-interface/wbi/index/top/feed/rcmd") {
                console.log("[BilibiliPromote] 拦截-视频列表-删除广告");
                request.response = async res => {
                    let data = [];
                    for (let k in res.json.data.item) {
                        if (res.json.data.item[k].id != 0) {
                            data.push(res.json.data.item[k]);
                        } else {
                            data.push(data[0]);//复制一份 保持数据对齐
                        }
                    }
                    res.json.data.item = data;
                    //console.log(data);
                }
            }
        });
    }

    // 预加载样式
    let AdVideoCss = `.ad-floor-cover.b-img {
        display: none !important;
    }
    div.video-page-game-card-small{
        display: none !important;
    }
    a.ad-report.video-card-ad-small {
        display: none !important;
    }`;
    console.log("[BilibiliPromote] 预载-视频页广告-删除广告");

    let StorageBoxCss = `.storage-box{
        display: none !important;
    }`;
    console.log("[BilibiliPromote] 预载-主页浮窗-删除无用浮窗");


    let SwiperCss = `@media (min-width: 1560px) and (max-width: 2059.9px) {
        .recommended-container_floor-aside .container>*:nth-of-type(6) {
            margin-top: 40px !important;
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
    }`;
    console.log("[BilibiliPromote] 预载-主页幻灯片-移除幻灯片(仅1080P适配)");
    let VipWarpCss = `.vip-wrap{
        display: none !important;
    }`;

    let TittleDisplayCss = `ul.left-entry > li:nth-child(n+4):nth-child(-n+7){
        display: none !important;
    }`;
    console.log("[BilibiliPromote] 预载-主页导航栏-删除无用导航");

    let DownloadEntryCss = `.download-entry{
        display: none !important;
    }`;
    console.log("[BilibiliPromote] 预载-主页标题栏-删除下载入口");
    //li.right-entry-item.right-entry-item--upload
    let UploadEntryCss = `li.right-entry-item.right-entry-item--upload{
        display: none !important;
    }`;
    console.log("[BilibiliPromote] 预载-主页标题栏-删除投稿入口");
    // 预载入批量处理
    GM_addStyle(AdVideoCss + SwiperCss + StorageBoxCss + VipWarpCss + TittleDisplayCss + DownloadEntryCss + UploadEntryCss);

    // 以下是需要等待 Dom加载完毕
    document.addEventListener("DOMContentLoaded", (event) => {
        console.log("[BilibiliPromote] DOMContentLoaded...");
    });

})();
