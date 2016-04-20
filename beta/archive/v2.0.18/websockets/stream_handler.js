define(["websockets/binary_websockets","charts/chartingRequestMap","common/util"],function(a,b){function c(a,b,c){a.xAxis.forEach(function(a){b||(b=a.getExtremes().min),c||(c=a.getExtremes().max),a.setExtremes(b,c)})}var d=b.barsTable;a.events.on("tick",function(a){var c=a.echo_req.ticks_history+a.echo_req.granularity;if(c&&b[c.toUpperCase()]){c=c.toUpperCase(),$(document).trigger("feedTypeNotification",[c,"realtime-feed"]);var e=parseFloat(a.tick.quote),g=1e3*parseInt(a.tick.epoch),h=b[c];if(h.id=h.id||a.tick.id,!(h.chartIDs&&h.chartIDs.length>0))return;var i=$(h.chartIDs[0].containerIDWithHash).data("timePeriod");if(!i)return;if(isTick(i)){var j={instrumentCdAndTp:c,time:g,open:e,high:e,low:e,close:e};d.insert(j),f("tick",{tick:j,key:c}),h.chartIDs.forEach(function(a){var b=$(a.containerIDWithHash).highcharts();if(b){var d=b.get(c);d&&d.addPoint([g,e])}})}}}),a.events.on("ohlc",function(a){var e=a.ohlc.symbol+a.ohlc.granularity;if(e&&b[e.toUpperCase()]){e=e.toUpperCase(),$(document).trigger("feedTypeNotification",[e,"realtime-feed"]);var g=parseFloat(a.ohlc.open),h=parseFloat(a.ohlc.high),i=parseFloat(a.ohlc.low),j=parseFloat(a.ohlc.close),k=1e3*parseInt(a.ohlc.open_time),l=b[e];if(l.id=l.id||a.ohlc.id,!(l.chartIDs&&l.chartIDs.length>0))return;var m=$(l.chartIDs[0].containerIDWithHash).data("timePeriod");if(!m)return;var n=d.chain().find({$and:[{instrumentCdAndTp:e},{time:k}]}).simplesort("time",!0).limit(1).data(),o=!1;!n||n.length<=0?(n={instrumentCdAndTp:e,time:k,open:g,high:h,low:i,close:j},d.insert(n),o=!0):(n=n[0],n.open=g,n.high=h,n.low=i,n.close=j,d.update(n)),f("ohlc",{ohlc:n,is_new:o,key:e}),l.chartIDs.forEach(function(a){var b=$(a.containerIDWithHash).highcharts();if(b){var d=b.get(e);if(d){var f=$(a.containerIDWithHash).data("type"),l=d.data[d.data.length-1];return d.options.data.length!=d.data.length?void c(b,null,n.time):void(f&&isDataTypeClosePriceOnly(f)?o?d.addPoint([k,j],!0,!0,!1):l.update({y:j}):o?d.addPoint([k,g,h,i,j],!0,!0,!1):l.update({open:g,high:h,low:i,close:j}))}}})}});var e={},f=function(a){var b=[].slice.call(arguments,1),c=e[a]||[];c.forEach(function(a){setTimeout(function(){a.apply(void 0,b)},0)})};return{events:{on:function(a,b){return(e[a]=e[a]||[]).push(b),b},off:function(a,b){if(e[a]){var c=e[a].indexOf(b);-1!==c&&e[a].splice(c,1)}}}}});