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
            console.log("[BilibiliPromote] 拦截-视频列表-刷新数据");
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
})();