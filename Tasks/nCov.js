/**
 *  疫情日报，自动获取当前位置的疫情信息
 *  API来自 http://api.tianapi.com/txapi/ncov/
 *  @author: Peng-YM
 *  感谢 @Mazetsz 提供腾讯API接口Token
 *  更新地址: https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/nCov.js
 */

const $ = API("nCov");

const key = "NOUBZ-7BNHD-SZ64A-HUWCW-YBGZ7-DDBNK";
const headers = {
    "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36",
};

!(async () => {
    // get current location
    const province = await $.http.get(`https://apis.map.qq.com/ws/location/v1/ip?key=${key}`).then(resp => {
        const data = JSON.parse(resp.body);
        return data.result.ad_info.province;
    });
    $.log(province);
    console.log(province);
    const newslist = await $.http.get({
        url: "http://api.tianapi.com/txapi/ncov/index?key=5dcf1a3871f36bcc48c543c8193223fc",
        headers,
    }).then((resp) => JSON.parse(resp.body).newslist[0])
        .delay(1000);
    $.log(newslist);
    console.log(newslist);
    let desc = newslist.desc;
    let news = newslist.news[0];
    let title = "🗞【疫情信息概览】";
    let subtitle = `📅  ${formatTime()}`;
    let detail =
        "\n「全国数据」" +
        "\n\n    -新增确诊: " +
        desc.confirmedIncr +
        "\n    -现有确诊: " +
        desc.currentConfirmedCount +
        "\n    -累计确诊: " +
        desc.confirmedCount +
        "\n    -治愈: " +
        desc.curedCount +
        "\n    -死亡: " +
        desc.deadCount +
        "\n\n「疫情动态」\n\n     " +
        news.title +
        "\n\n「动态详情」\n\n     " +
        news.summary +
        "\n\n    发布时间：" +
        news.pubDateStr;
    $.notify(title, subtitle, detail);
})()
    .catch((err) => $.error(err))
    .finally(() => $.done());

function formatTime() {
    const date = new Date();
    return `${
        date.getMonth() + 1
    }月${date.getDate()}日 ${date.getHours()}时`;
}

// prettier-ignore
/*********************************** API *************************************/
function ENV(){const e="undefined"!=typeof $task,t="undefined"!=typeof $loon,s="undefined"!=typeof $httpClient&&!t,o="function"==typeof require&&"undefined"!=typeof $jsbox;return{isQX:e,isLoon:t,isSurge:s,isNode:"function"==typeof require&&!o,isJSBox:o,isRequest:"undefined"!=typeof $request,isScriptable:"undefined"!=typeof importModule}}function HTTP(e,t={}){const{isQX:s,isLoon:o,isSurge:i,isScriptable:n,isNode:r}=ENV();const u={};return["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"].forEach(h=>u[h.toLowerCase()]=(u=>(function(u,h){(h="string"==typeof h?{url:h}:h).url=e?e+h.url:h.url;const c=(h={...t,...h}).timeout,l={onRequest:()=>{},onResponse:e=>e,onTimeout:()=>{},...h.events};let a,d;if(l.onRequest(u,h),s)a=$task.fetch({method:u,...h});else if(o||i||r)a=new Promise((e,t)=>{(r?require("request"):$httpClient)[u.toLowerCase()](h,(s,o,i)=>{s?t(s):e({statusCode:o.status||o.statusCode,headers:o.headers,body:i})})});else if(n){const e=new Request(h.url);e.method=u,e.headers=h.headers,e.body=h.body,a=new Promise((t,s)=>{e.loadString().then(s=>{t({statusCode:e.response.statusCode,headers:e.response.headers,body:s})}).catch(e=>s(e))})}const f=c?new Promise((e,t)=>{d=setTimeout(()=>(l.onTimeout(),t(`${u} URL: ${h.url} exceeds the timeout ${c} ms`)),c)}):null;return(f?Promise.race([f,a]).then(e=>(clearTimeout(d),e)):a).then(e=>l.onResponse(e))})(h,u))),u}function API(e="untitled",t=!1){const{isQX:s,isLoon:o,isSurge:i,isNode:n,isJSBox:r,isScriptable:u}=ENV();return new class{constructor(e,t){this.name=e,this.debug=t,this.http=HTTP(),this.env=ENV(),this.node=(()=>{if(n){return{fs:require("fs")}}return null})(),this.initCache();Promise.prototype.delay=function(e){return this.then(function(t){return((e,t)=>new Promise(function(s){setTimeout(s.bind(null,t),e)}))(e,t)})}}initCache(){if(s&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(o||i)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),n){let e="root.json";this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.root={},e=`${this.name}.json`,this.node.fs.existsSync(e)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.cache={})}}persistCache(){const e=JSON.stringify(this.cache);s&&$prefs.setValueForKey(e,this.name),(o||i)&&$persistentStore.write(e,this.name),n&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:"w"},e=>console.log(e)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},e=>console.log(e)))}write(e,t){this.log(`SET ${t}`),-1!==t.indexOf("#")?(t=t.substr(1),i&o&&$persistentStore.write(e,t),s&&$prefs.setValueForKey(e,t),n&&(this.root[t]=e)):this.cache[t]=e,this.persistCache()}read(e){return this.log(`READ ${e}`),-1===e.indexOf("#")?this.cache[e]:(e=e.substr(1),i&o?$persistentStore.read(e):s?$prefs.valueForKey(e):n?this.root[e]:void 0)}delete(e){this.log(`DELETE ${e}`),-1!==e.indexOf("#")?(e=e.substr(1),i&o&&$persistentStore.write(null,e),s&&$prefs.removeValueForKey(e),n&&delete this.root[e]):delete this.cache[e],this.persistCache()}notify(e,t="",h="",c={}){const l=c["open-url"],a=c["media-url"],d=h+(l?`\n点击跳转: ${l}`:"")+(a?`\n多媒体: ${a}`:"");if(s&&$notify(e,t,h,c),i&&$notification.post(e,t,d),o){let s={};l&&(s.openUrl=l),a&&(s.mediaUrl=a),"{}"==JSON.stringify(s)?$notification.post(e,t,h):$notification.post(e,t,h,s)}if(n||u)if(r){require("push").schedule({title:e,body:(t?t+"\n":"")+d})}else console.log(`${e}\n${t}\n${d}\n\n`)}log(e){this.debug&&console.log(e)}info(e){console.log(e)}error(e){console.log("ERROR: "+e)}wait(e){return new Promise(t=>setTimeout(t,e))}done(e={}){s||o||i?$done(e):n&&!r&&"undefined"!=typeof $context&&($context.headers=e.headers,$context.statusCode=e.statusCode,$context.body=e.body)}}(e,t)}
/*****************************************************************************/


