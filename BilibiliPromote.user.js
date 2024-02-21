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
    //window = { set: (obj, prop, value) => { console.log(value); obj[prop] = value; } };
    //let proxy = new Proxy(window, handler);
    ajaxHooker.filter([
        { url: 'api.bilibili.com' },
    ]);
    function waitForElementAndExecute(elementCode, customCode, count = 6) {
        if (elementCode()) {
            customCode();
        } else {
            if (count == 0) {
                return;
            }


            setTimeout(() => waitForElementAndExecute(elementCode, customCode, count - 1), 3000 - 500 * count);
        }
    }
    async function waitForSelector(selector, execute) {
        for (let index = 0; index < 5; index++) {
            await new Promise((resolve, reject) => {
                console.log("[BilibiliPromote] 元素选择" + selector + "-当前剩余" + (5 - index).toString() + "次,等待元素出现操作...");
                setTimeout(resolve, 300)
            });
            if (document.querySelector(selector) !== null) {
                console.log("[BilibiliPromote] 元素选择-元素" + selector + "选择成功");
                await execute(document.querySelector(selector));
                return true;
            }
        }
        return false;
    }
    window.onload = async function () {
        let TargetURL = new URL(window.location.href);
        //waitForElementAndExecute(() => { return document.getElementsByClassName("ad-report video-card-ad-small")[0]; }, 2000, () => { document.getElementsByClassName("ad-report video-card-ad-small")[0].remove(); });
        let AdVideoReplaceCss = `
        .ad-floor-cover.b-img {
            display: none !important;
        }
        div.video-page-game-card-small{
            display: none !important;
        }
        a.ad-report.video-card-ad-small {
            display: none !important;
        }`;
        GM_addStyle(AdVideoReplaceCss);
        console.log("[BilibiliPromote] 预载-广告-删除");
        await waitForSelector(".download-entry", (ele) => { ele.remove(); });
        //waitForElementAndExecute(() => { return document.getElementsByClassName("download-entry download-client-trigger")[0]; }, () => { document.getElementsByClassName("download-entry download-client-trigger")[0].remove(); });
        console.log("[BilibiliPromote] 预载-标题栏美化-删除下载");
        await waitForSelector(".vip-wrap", (ele) => { ele.remove(); });
        console.log("[BilibiliPromote] 预载-标题栏-删除大会员");
        
        if (TargetURL.pathname == "/") {
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
                        //console.log(data);
                    }
                }
            });
            for (let k in [0, 1, 2, 3]) {
                //document.querySelector(".v-popover-wrap:nth-child(4)")
                await waitForSelector(".v-popover-wrap:nth-child(4)", (ele) => { ele.remove(); });
                //waitForElementAndExecute(() => { return document.getElementsByClassName("v-popover-wrap")[3]; }, () => { document.getElementsByClassName("v-popover-wrap")[3].remove(); });
            }
            console.log("[BilibiliPromote] 预载-标题栏美化-删除无用");
            await waitForSelector(".storage-box", (ele) => { ele.remove(); });
            //waitForElementAndExecute(() => { return document.getElementsByClassName("storage-box")[0]; }, () => { document.getElementsByClassName("storage-box")[0].remove(); });
            console.log("[BilibiliPromote] 预载-其它美化-删除无用浮窗");

            let SwiperReplaceCss = `@media (min-width: 1560px) and (max-width: 2059.9px) {
            .recommended-container_floor-aside .container>*:nth-of-type(6) {
                margin-top: 40px !important;
            }
            .recommended-container_floor-aside .container.is-version8>*:nth-of-type(n + 13) {
                margin-top: 40px !important;
            }
            .recommended-container_floor-aside .container>*:nth-of-type(7) {
                margin-top: 40px !important;
            }
        }`;
            GM_addStyle(SwiperReplaceCss);
            await waitForSelector("div.recommended-swipe.grid-anchor", (ele) => { ele.remove(); });
            //waitForElementAndExecute(() => { return document.getElementsByClassName("recommended-swipe grid-anchor")[0]; }, () => { document.getElementsByClassName("recommended-swipe grid-anchor")[0].remove(); });
            console.log("[BilibiliPromote] 预载-主页美化-删除幻灯片(仅1080P适配)");
        };
    }

})();
