define(["exports","jquery","text!../oauth/app_id.json","common/util"],function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}Object.defineProperty(a,"__esModule",{value:!0}),a.sell_expired=a.is_authenticated=a.send=a.cached=a.switch_account=a.execute=a.proposal_open_contract=a.events=a.invalidate=a.app_id=void 0;var e=d(b),f=d(c),g=!1,h=null,i=function(){var a=JSON.parse(f["default"]),b=local_storage.get("config"),c=b&&b.app_id||"";if(!c){var d=window.location.href;for(var e in a)if(0==d.lastIndexOf(e,0)){c=a[e];break}}return c},j=a.app_id=i(),k=function(){var a=local_storage.get("config"),b=(local_storage.get("i18n")||{value:"en"}).value,c=(a&&a.websocket_url||"wss://ws.binaryws.com/websockets/v3?l="+b)+"&app_id="+j,d=new WebSocket(c);return d.addEventListener("open",t),d.addEventListener("close",m),d.addEventListener("message",u),d.addEventListener("error",function(){e["default"].growl.error({message:"Connection error.".i18n()}),m()}),d},l=!1,m=function(){require(["windows/tracker"],function(a){var b=a.get_trade_dialogs();g=!1,B("logout"),l||(l=!0,setTimeout(function(){l=!1,h=k(),local_storage.get("oauth")&&O.cached.authorize().then(function(){return a.reopen_trade_dialogs(b)}),require(["charts/chartingRequestMap"],function(a){var b=[];Object.keys(a).forEach(function(c){var d=a[c];if(d&&d.symbol&&!d.timerHandler){var e=a.register({symbol:d.symbol,granularity:d.granularity,subscribe:1,count:1,style:d.granularity>0?"candles":"ticks"})["catch"](function(a){return void 0});b.push(e)}}),Promise.all(b).then(function(){require(["charts/charts","charts/chartOptions"],function(a,b){b.getAllChartsWithTheirTypes().forEach(function(b){return a.refresh("#"+b.id+"_chart",null,b.chartType)})})})})},1e3))})},n={},o=[],p=[],q={},r={},s=function(){return h&&1===h.readyState},t=function(){for(;p.length>0;){var a=p.shift();q[a.req_id]||h.send(JSON.stringify(a))}for(var b in q){var c=q[b];c&&(c.sent_before?c.reject({message:"Connection closed.".i18n()}):(c.sent_before=!0,h.send(JSON.stringify(c.data))))}for(;o.length>0;)o.shift()()},u=function(a){var b=JSON.parse(a.data);(n[b.msg_type]||[]).forEach(function(a){setTimeout(function(){return a(b)},0)});var c=b.req_id,d=q[c];d&&(delete q[c],b.error?(b.error.echo_req=b.echo_req,b.error.req_id=b.req_id,d.reject(b.error)):d.resolve(b))};h=k(),require(["websockets/stream_handler"]);var v=function(a){for(var b in{balance:1,statement:1,profit_table:1,portfolio:1,proposal_open_contract:1,buy:1,sell:1,get_self_exclusion:1,set_self_exclusion:1})if(b in a)return!0;return!1},w=0,x=function(a){return a.req_id=++w,new Promise(function(b,c){q[a.req_id]={resolve:b,reject:c,data:a},s()?h.send(JSON.stringify(a)):p.push(a)})},y=function(a){var b=!1,c={authorize:a},d=JSON.stringify(c),e=x(c);return e.then(function(a){g=!0,local_storage.set("authorize",a.authorize);var f=-1!==a.authorize.landing_company_name.indexOf("japan");if(f||B("login",a),local_storage.get("oauth-login")){var h=local_storage.get("oauth-login").value;local_storage.remove("oauth-login"),h&&!f&&B("oauth-login",a)}return b=!0,r[d]={data:c,promise:e},a})["catch"](function(a){throw"SelfExclusion"===a.code||b||(g=!1,B("logout"),local_storage.remove("oauth")),delete r[d],a})},z=a.invalidate=function(){local_storage.remove("oauth"),local_storage.remove("authorize"),B("reset_realitycheck"),O.send({logout:1})["catch"](function(a){e["default"].growl.error({message:a.message}),h.close()});for(var a in r)(v(r[a].data)||"authorize"in r[a].data)&&delete r[a]},A=function(a){if(g)return x(a);var b=x.bind(null,a);if(local_storage.get("oauth")){var c=local_storage.get("oauth"),d=c[0].token;return y(d).then(b)}return Promise.reject({message:"Please log in".i18n()})},B=function(a){for(var b=arguments.length,c=Array(b>1?b-1:0),d=1;b>d;d++)c[d-1]=arguments[d];var e=n[a]||[];e.forEach(function(a){setTimeout(function(){return a.apply(void 0,c)},0)})},C=function(a,b){setTimeout(function(){var b=q[a];b&&(delete q[a],b.reject({message:"Timeout for websocket request".i18n()}))},b)},D={},E={},F={},G=a.events={on:function(a,b){return(n[a]=n[a]||[]).push(b),b},off:function(a,b){if(n[a]){var c=n[a].indexOf(b);-1!==c&&n[a].splice(c,1)}},on_till:function(a,b){var c=function d(){var c=b.apply(void 0,arguments);c&&O.events.off(a,d)};O.events.on(a,c)}},H=a.proposal_open_contract={subscribe:function(a){if(E[a]&&E[a].subscribers>0)return E[a].subscribers++,E[a].promise;var b=O.send({proposal_open_contract:1,contract_id:a,subscribe:1}).then(function(b){return E[a].stream_id=b.proposal_open_contract.id,b})["catch"](function(b){throw E[a]=void 0,b});return E[a]={subscribers:1,promise:b},b},forget:function P(a){var b=E[a],P=F[a];if(!b)return P||Promise.resolve();if(0==b.subscribers)return P;if(b.subscribers--,b.subscribers>0)return Promise.resolve();var c=function(){return E[a]=void 0,O.send({forget:b.stream_id})["catch"](function(b){throw F[a]=void 0,b}).then(function(b){return F[a]=void 0,b})};return F[a]=b.stream_id?c():b.promise["catch"](function(){}).then(function(){return b.stream_id?c():void 0}),F[a]}},I=a.execute=function(a){s()?setTimeout(a,0):o.push(a)},J=a.switch_account=function(a){var b=local_storage.get("oauth");if(!b)return Promise.reject({message:"Account token not found.".i18n()});var c=b.map(function(a){return a.id}).indexOf(a);if(-1===c)return promise.reject({message:"Account id not found.".i18n()});var d=b[c];b.splice(c,1),b.unshift(d),local_storage.set("oauth",b);for(var e in r)(v(r[e].data)||"authorize"in r[e].data)&&delete r[e];return g=!1,O.send({forget_all:"transaction"})["catch"](function(a){return void 0}),O.send({forget_all:"balance"})["catch"](function(a){return void 0}),O.cached.authorize().then(function(){return B("switch_account")})},K=a.cached={send:function(a){var b=JSON.stringify(a);return r[b]?r[b].promise:(r[b]={data:a,promise:null},r[b].promise=O.send(a).then(function(a){return a},function(a){throw delete r[b],a}))},authorize:function(){var a=local_storage.get("oauth"),b=a&&a[0]&&a[0].token,c=JSON.stringify({authorize:b});return g&&b&&r[c]?r[c].promise:b?y(b):Promise.reject("Please log in.".i18n())}},L=a.send=function(a,b){if(a&&v(a))return A(a);var c=x(a);return b&&C(a.req_id,b),c},M=a.is_authenticated=function(){return g},N=a.sell_expired=function(a){var b=(new Date).getTime()/1e3|0;a=a||b+1,!D[a]&&1*a>b&&(D[a]=setTimeout(function(){D[a]=void 0,O.send({sell_expired:1})["catch"](function(a){return void 0})},1e3*(a+2-b)))},O={events:G,proposal_open_contract:H,execute:I,switch_account:J,cached:K,send:L,is_authenticated:M,sell_expired:N,invalidate:z,app_id:j};O.events.on("login",function(){O.send({transaction:1,subscribe:1})["catch"](function(a){return void 0}),O.send({balance:1,subscribe:1})["catch"](function(a){return void 0})}),O.events.on("logout",function(){O.send({forget_all:"transaction"})["catch"](function(a){return void 0}),O.send({forget_all:"balance"})["catch"](function(a){return void 0})}),a["default"]=O});