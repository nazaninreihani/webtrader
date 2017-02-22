define(["exports","jquery","charts/chartWindow","common/rivetsExtra","lodash"],function(a,b,c,d,e){"use strict";function f(a){return a&&a.__esModule?a:{"default":a}}function g(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(a,"__esModule",{value:!0}),a.init=void 0;var h=f(b),i=f(c),j=f(d),k=f(e),l=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();local_storage.get("templates")||local_storage.set("templates",[]);var m=function(){function a(b,c){var d=this;g(this,a);var e=this,f=local_storage.get("templates");f.forEach(function(a){a.random||(a=e.setRandom(a))}),local_storage.set("templates",f);var h=this.init_state(b,c);require(["text!charts/chartTemplateManager.html"],function(a){b.append(a.i18n()),d.view=j["default"].bind(b[0],h)})}return l(a,[{key:"init_state",value:function(a,b){var c=this,d=(h["default"]("#"+b+"_chart").highcharts(),{route:{value:"menu"},menu:{save_changes_disabled:!0},templates:{array:local_storage.get("templates"),save_as_value:"",rename_tmpl:null,rename_value:"",current:null}}),e=d.route,f=d.templates,g=d.menu,j=this.setRandom(i["default"].get_chart_options(b));return f.array=local_storage.get("templates"),-1!==k["default"].findIndex(f.array,function(a){return a.random===j.random})&&(f.current=j),e.update=function(a){e.value=a},g.save_as=function(){var a=i["default"].get_chart_options(b)||{};a.name=[a.timePeriod+" "+a.type].concat(a.indicators.map(function(a){return a.name})).concat(a.overlays.map(function(a){return a.displaySymbol})).join(" + "),f.save_as_value=a.name,e.update("save-as")},g.templates=function(){f.array=local_storage.get("templates"),e.update("templates")},g.save_changes=function(){var a=c.setRandom(i["default"].get_chart_options(b)),d=a.name,e=local_storage.get("templates"),g=k["default"].findIndex(e,function(a){return a.name===d});-1!==g?e[g]=a:e.push(a),local_storage.set("templates",e),f.array=e,f.current=a,h["default"].growl.notice({message:"Template changes saved ".i18n()+"("+a.name+")"})},g.open_file_selector=function(){h["default"](a).find("input[type=file]").click()},g.upload=function(a){var b=c,d=a.target.files[0];if(a.target.value=null,d){var e=new FileReader;e.onload=function(a){var c=a.target.result,d=local_storage.get("templates"),e=null;try{e=JSON.parse(c),e.name=e.name.substring(0,20).replace(/[<>]/g,"-");var g=e.random;if(e=b.setRandom(e),g!==e.random)throw"Invalid JSON file".i18n();if(b.isDuplicate(e,d))return;if(!e.indicators)throw"Invalid template type".i18n()}catch(a){return void h["default"].growl.error({message:a})}for(var i=1,j=e.name;;){if(!d.map(function(a){return a.name}).includes(j)){e.name=j;break}j=e.name+" ("+i+")",i++}f.apply(e),d.push(e),local_storage.set("templates",d),f.array=d,h["default"].growl.notice({message:"Successfully applied the template and saved it as ".i18n()+"<b>"+e.name+"</b>"})},e.readAsText(d)}},f.save_as=function(a){a.preventDefault();var d=f.save_as_value.substring(0,20).replace(/[<>]/g,"-"),g=c.setRandom(i["default"].get_chart_options(b));if(g){g.name=d;var h=local_storage.get("templates");if(c.isDuplicate(g,h))return;h.push(g),f.current=g,local_storage.set("templates",h),f.array=h,e.update("menu"),i["default"].set_chart_options(b,g)}},f.download=function(a){var b=JSON.stringify(a);download_file_in_browser(a.name+".json","text/json;charset=utf-8;",b),h["default"].growl.notice({message:"Downloading template as <b>".i18n()+a.name+".json</b>"})},f.remove=function(a){var b=local_storage.get("templates");f.array=b.filter(function(b){return b.name!==a.name}),local_storage.set("templates",f.array),f.current&&a.name===f.current.name&&(f.current=null)},f.rename=function(a){f.rename_value=a.name,f.rename_tmpl=a,e.update("rename")},f.do_rename=function(a){a.preventDefault();var d=f.rename_tmpl.name,g=f.rename_value.substring(0,20).replace(/[<>]/g,"-"),j=local_storage.get("templates");if(j.map(function(a){return a.name}).includes(g))return void h["default"].growl.error({message:"Template name already exists".i18n()});var k=j.find(function(a){return a.name===d});if(k){k.name=g,local_storage.set("templates",j),f.array=j,e.update("templates");var l=c.setRandom(i["default"].get_chart_options(b));l.name==d&&(l.name=g,i["default"].set_chart_options(b,l),f.current=l)}},f.apply=function(a){i["default"].apply_chart_options(b,a),f.current=a},f.confirm=function(a,b){e.update("confirm");var c=b.currentTarget.text;f.confirm_prevMenu=c==="Delete".i18n()?"templates":"menu",f.confirm_text="Delete"===c?"Are you sure you want to delete template?".i18n():"Are you sure you want to overwrite current template?".i18n(),f.confirm_yes=function(){c==="Delete".i18n()?f.remove(a):g.save_changes(),f.confirm_no()},f.confirm_no=function(){e.update(f.confirm_prevMenu)}},d}},{key:"setRandom",value:function(a){var b=a.name;return delete a.name,delete a.random,a.random=this.hashCode(JSON.stringify(a)),a.name=b,a}},{key:"hashCode",value:function(a){return a.split("").reduce(function(a,b){return a=(a<<5)-a+b.charCodeAt(0),a&a},0)}},{key:"isDuplicate",value:function(a,b){var c=k["default"].find(b,["random",a.random]);return c?(h["default"].growl.error({message:"Template already saved as ".i18n()+"<b>"+c.name+"</b>."}),!0):!1}},{key:"unbind",value:function(){this.view&&this.view.unbind(),this.view=null}}]),a}(),n=a.init=function(a,b){return new m(a,b)};a["default"]={init:n}});