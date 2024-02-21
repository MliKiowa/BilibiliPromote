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
    ajaxHooker.filter([
        { url: 'api.bilibili.com' },
    ]);

    ajaxHooker.hook(async request => {
        let HookURL = new URL(request.url);
        if (HookURL.pathname == "/x/web-interface/wbi/index/top/feed/rcmd") {
            console.log("[BilibiliPromote] 拦截-视频列表-删除广告");
            request.response = async res => {
                let data = [];
                for (let k in res.json.data.item) {
                    if (res.json.data.item[k].id != 0) data.push(res.json.data.item[k]);
                }
                res.json.data.item = data;
                console.log(data);
            }
        }
    });

    window.onload = function () {
        document.getElementsByClassName("storage-box")[0].remove();
        console.log("[BilibiliPromote] 预载-其它美化-删除无用浮窗");
        document.getElementsByClassName("download-entry download-client-trigger")[0].remove();
        console.log("[BilibiliPromote] 预载-标题栏美化-删除下载");
        document.getElementsByClassName("recommended-swipe grid-anchor")[0].remove();
        let SwiperReplaceCss = `@media (min-width: 1560px) and (max-width: 2059.9px) {
            .recommended-container_floor-aside .container>*:nth-of-type(6) {
                margin-top: 40px !important;
            }
        
            .recommended-container_floor-aside .container>*:nth-of-type(7) {
                margin-top: 40px !important;
            }
        }`;
        GM_addStyle(SwiperReplaceCss);
        console.log("[BilibiliPromote] 预载-主页美化-删除幻灯片(仅1080P视频)");
    };
})();
