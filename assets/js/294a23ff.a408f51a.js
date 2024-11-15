"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[877],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return d}});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),p=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=p(e.components);return a.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),m=p(n),d=r,k=m["".concat(c,".").concat(d)]||m[d]||u[d]||i;return n?a.createElement(k,l(l({ref:t},s),{},{components:n})):a.createElement(k,l({ref:t},s))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,l=new Array(i);l[0]=m;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var p=2;p<i;p++)l[p]=n[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},17863:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return c},default:function(){return d},frontMatter:function(){return o},metadata:function(){return p},toc:function(){return u}});var a=n(87462),r=n(63366),i=(n(67294),n(3905)),l=["components"],o={sidebar_position:2,description:"\u4e86\u89e3\u5982\u4f55\u624b\u52a8\u8fdb\u884c\u591a\u7eb9\u7406\u5408\u6279\u3002"},c="\u591a\u7eb9\u7406\u5408\u6279",p={unversionedId:"user-guide/multi-render/multi-batcher",id:"version-2.2.0/user-guide/multi-render/multi-batcher",title:"\u591a\u7eb9\u7406\u5408\u6279",description:"\u4e86\u89e3\u5982\u4f55\u624b\u52a8\u8fdb\u884c\u591a\u7eb9\u7406\u5408\u6279\u3002",source:"@site/versioned_docs/version-2.2.0/user-guide/multi-render/multi-batcher.md",sourceDirName:"user-guide/multi-render",slug:"/user-guide/multi-render/multi-batcher",permalink:"/cocos-enhance-kit/docs/2.2.0/user-guide/multi-render/multi-batcher",draft:!1,tags:[],version:"2.2.0",sidebarPosition:2,frontMatter:{sidebar_position:2,description:"\u4e86\u89e3\u5982\u4f55\u624b\u52a8\u8fdb\u884c\u591a\u7eb9\u7406\u5408\u6279\u3002"},sidebar:"tutorialSidebar",previous:{title:"\u591a\u7eb9\u7406\u6750\u8d28",permalink:"/cocos-enhance-kit/docs/2.2.0/user-guide/multi-render/multi-material"},next:{title:"\u6587\u672c\u6e32\u67d3",permalink:"/cocos-enhance-kit/docs/2.2.0/user-guide/text-render/text-render-intro"}},s={},u=[{value:"\u5f00\u5173\u81ea\u52a8\u5207\u6362\u591a\u7eb9\u7406\u6750\u8d28",id:"\u5f00\u5173\u81ea\u52a8\u5207\u6362\u591a\u7eb9\u7406\u6750\u8d28",level:2},{value:"\u8bbe\u7f6e\u7eb9\u7406\u7684\u5173\u8054\u6750\u8d28",id:"\u8bbe\u7f6e\u7eb9\u7406\u7684\u5173\u8054\u6750\u8d28",level:2},{value:"\u591a\u7eb9\u7406\u5408\u6279\u7ba1\u7406\u5668",id:"\u591a\u7eb9\u7406\u5408\u6279\u7ba1\u7406\u5668",level:2},{value:"\u5982\u4f55\u4f7f\u7528",id:"\u5982\u4f55\u4f7f\u7528",level:3}],m={toc:u};function d(e){var t=e.components,o=(0,r.Z)(e,l);return(0,i.kt)("wrapper",(0,a.Z)({},m,o,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"\u591a\u7eb9\u7406\u5408\u6279"},"\u591a\u7eb9\u7406\u5408\u6279"),(0,i.kt)("p",null,"\u4f7f\u7528 ",(0,i.kt)("a",{parentName:"p",href:"/cocos-enhance-kit/docs/2.2.0/user-guide/multi-render/multi-material"},"\u591a\u7eb9\u7406\u6750\u8d28")," \u6587\u6863\u4e2d\u63d0\u5230\u7684 ",(0,i.kt)("inlineCode",{parentName:"p"},"MultiHandler")," \u7684\u63a5\u53e3\u6765\u52a8\u6001\u8bbe\u7f6e\u6750\u8d28\u7684\u7eb9\u7406\u63d2\u69fd\u53ef\u80fd\u4f1a\u6bd4\u8f83\u9ebb\u70e6\uff0c\u6bd4\u5982\u4f60\u9700\u8981\u4f7f\u7528\u4e00\u4e2a\u7eb9\u7406\u65f6\uff0c\u8fd8\u5f97\u627e\u5230\u8be5\u7eb9\u7406\u6240\u5728\u7684\u6750\u8d28\u5e76\u8bbe\u7f6e\u5230\u6e32\u67d3\u7ec4\u4ef6\u4e0a\u3002"),(0,i.kt)("p",null,"\u4e3a\u4e86\u80fd\u66f4\u65b9\u4fbf\u5730\u8fdb\u884c\u591a\u7eb9\u7406\u5408\u6279\uff0c\u793e\u533a\u7248\u4e3a\u7ec4\u4ef6\u589e\u52a0\u4e86\u81ea\u52a8\u5207\u6362\u591a\u7eb9\u7406\u6750\u8d28\u7684\u673a\u5236\uff0c\u5e76\u4e14\u5c01\u88c5\u4e86\u4e00\u4e2a\u591a\u7eb9\u7406\u5408\u6279\u7ba1\u7406\u7c7b ",(0,i.kt)("inlineCode",{parentName:"p"},"cc.sp.MultiBatcher"),"\u3002"),(0,i.kt)("p",null,"\u52a8\u6001\u56fe\u96c6\u4e0e\u5b57\u7b26\u56fe\u96c6\u4f7f\u7528\u7684\u662f\u5168\u5c40\u591a\u7eb9\u7406\u5408\u6279\u7ba1\u7406\u5668\u5b9e\u4f8b\uff0c\u53ef\u4ee5\u901a\u8fc7 ",(0,i.kt)("inlineCode",{parentName:"p"},"cc.sp.multiBatcher")," \u8bbf\u95ee\u3002"),(0,i.kt)("h2",{id:"\u5f00\u5173\u81ea\u52a8\u5207\u6362\u591a\u7eb9\u7406\u6750\u8d28"},"\u5f00\u5173\u81ea\u52a8\u5207\u6362\u591a\u7eb9\u7406\u6750\u8d28"),(0,i.kt)("p",null,"\u53ef\u4ee5\u901a\u8fc7\u5168\u5c40\u5f00\u5173\u6765\u63a7\u5236\u6240\u6709\u7ec4\u4ef6\u7684\u9ed8\u8ba4\u503c\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"cc.sp.autoSwitchMaterial = false;\n")),(0,i.kt)("p",null,"\u9ed8\u8ba4\u60c5\u51b5\u4e0b\u7ec4\u4ef6\u4f1a\u4f7f\u7528\u5168\u5c40\u503c\uff0c\u4f60\u53ef\u4ee5\u63a7\u5236\u5355\u4e2a\u7ec4\u4ef6\u662f\u5426\u5f3a\u5236\u542f\u7528/\u7981\u7528\u8be5\u673a\u5236\uff1a"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"autoswitchsettings",src:n(18490).Z,width:"1004",height:"1000"})),(0,i.kt)("p",null,"\u9664\u4e86\u5728\u7f16\u8f91\u5668\u8c03\u6574\uff0c\u4e5f\u53ef\u4ee5\u901a\u8fc7\u4ee3\u7801\u63a7\u5236\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"// cc.RenderComponent.EnableType\n// GLOBAL: \u5168\u5c40\u9ed8\u8ba4\u503c\n// ENABLE: \u5f00\u542f\n// DISABLE: \u5173\u95ed\nsprite.autoSwitchMaterial = cc.RenderComponent.EnableType.ENABLE;\n")),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"\u6ce8\u610f")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u7ec4\u4ef6\u6709\u810f\u68c0\u67e5\u6807\u8bb0\uff0c\u5982\u679c\u4fee\u6539\u5168\u5c40\u5f00\u5173\u6216\u8005\u4fee\u6539\u7eb9\u7406\u5173\u8054\u7684\u6750\u8d28\uff0c\u9700\u8981\u5bf9\u6240\u6709\u4f7f\u7528\u8be5\u7eb9\u7406\u7684\u6e32\u67d3\u7ec4\u4ef6\u8c03\u7528 ",(0,i.kt)("inlineCode",{parentName:"p"},"comp.setVertsDirty()")," \u91cd\u65b0\u68c0\u67e5\u3002"))),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"\u7279\u522b\u6ce8\u610f")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u5982\u679c Spine \u7ec4\u4ef6\u6240\u4f7f\u7528\u7684 ",(0,i.kt)("inlineCode",{parentName:"p"},"SkeletonData")," \u540c\u65f6\u4f7f\u7528\u4e86\u591a\u4e2a\u7eb9\u7406\uff0c\u90a3\u4e48\u53ea\u4f1a\u904d\u5386\u6570\u636e\u4ee5\u627e\u5230\u7684\u7b2c\u4e00\u4e2a\u7eb9\u7406\u4e3a\u4e3b\u6267\u884c\u81ea\u52a8\u5207\u6362\u673a\u5236\u3002"))),(0,i.kt)("h2",{id:"\u8bbe\u7f6e\u7eb9\u7406\u7684\u5173\u8054\u6750\u8d28"},"\u8bbe\u7f6e\u7eb9\u7406\u7684\u5173\u8054\u6750\u8d28"),(0,i.kt)("p",null,"\u6211\u4eec\u4e3a\u7eb9\u7406\u589e\u52a0\u4e86\u4e00\u4e2a\u5173\u8054\u6750\u8d28\u7684\u6982\u5ff5\uff0c\u5728\u652f\u6301\u7684\u7ec4\u4ef6\u5185\u5bf9\u7eb9\u7406\u8fdb\u884c\u6e32\u67d3\u65f6\uff0c\u4f1a\u63d0\u524d\u5207\u6362\u4e3a\u8be5\u7eb9\u7406\u5173\u8054\u7684\u6750\u8d28\u3002"),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u6bcf\u4e2a\u7eb9\u7406\u53ea\u80fd\u5173\u8054\u4e00\u4e2a\u6750\u8d28\uff0c\u5982\u679c\u540c\u4e00\u4e2a\u7eb9\u7406\uff0c\u4e0d\u540c\u7684\u6e32\u67d3\u7ec4\u4ef6\u9700\u8981\u4f7f\u7528\u4e0d\u540c\u6750\u8d28\u5c31\u9700\u8981\u624b\u52a8\u8bbe\u7f6e\u3002"))),(0,i.kt)("p",null,"\u5173\u8054\u6750\u8d28\u7684\u63a5\u53e3\u6709\u4e24\u79cd\u7528\u6cd5\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const bool = texture.linkMaterial(material);\nconst bool = texture.linkMaterial(material, index);\n")),(0,i.kt)("p",null,"\u7b2c\u4e00\u53e5\u4ee3\u7801\u4f1a\u81ea\u52a8\u5c06\u7eb9\u7406\u8bbe\u7f6e\u5230\u6750\u8d28\u7684\u7a7a\u63d2\u69fd\u4e2d\uff0c\u7136\u540e\u5c06\u8be5\u6750\u8d28\u8bbe\u7f6e\u4e3a\u8be5\u7eb9\u7406\u7684\u5173\u8054\u6750\u8d28\uff0c\u5982\u679c\u6ca1\u6709\u7a7a\u63d2\u69fd\u4f1a\u8fd4\u56de ",(0,i.kt)("inlineCode",{parentName:"p"},"false"),"\u3002"),(0,i.kt)("p",null,"\u7b2c\u4e8c\u53e5\u5219\u662f\u5f3a\u5236\u5c06\u7eb9\u7406\u8bbe\u7f6e\u5230\u6307\u5b9a\u7684\u63d2\u69fd\u4e2d\uff0c\u5e76\u5c06\u8be5\u6750\u8d28\u8bbe\u7f6e\u4e3a\u8be5\u7eb9\u7406\u7684\u5173\u8054\u6750\u8d28\u3002"),(0,i.kt)("p",null,"\u60f3\u8981\u89e3\u9664\u4e24\u8005\u7684\u5173\u8054\u53ef\u4ee5\u4f7f\u7528\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"texture.unlinkMaterial();\n")),(0,i.kt)("p",null,"\u83b7\u53d6\u5173\u8054\u7684\u6750\u8d28\u53ef\u4ee5\u4f7f\u7528\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const material = texture.getLinkedMaterial();\n")),(0,i.kt)("h2",{id:"\u591a\u7eb9\u7406\u5408\u6279\u7ba1\u7406\u5668"},"\u591a\u7eb9\u7406\u5408\u6279\u7ba1\u7406\u5668"),(0,i.kt)("p",null,"\u624b\u52a8\u5173\u8054\u6750\u8d28\u5c31\u610f\u5473\u7740\u4f60\u9700\u8981\u624b\u52a8\u521b\u5efa\u5e76\u7ba1\u7406\u521b\u5efa\u7684\u6240\u6709\u6750\u8d28\uff0c\u5982\u679c\u662f\u5927\u91cf\u7eb9\u7406\u9700\u8981\u5173\u8054\u6750\u8d28\u5c31\u4f1a\u6bd4\u8f83\u9ebb\u70e6\u3002"),(0,i.kt)("p",null,"\u6240\u4ee5\u6211\u4eec\u5c01\u88c5\u4e86\u4e00\u4e2a\u5c0f\u5de7\u7684\u591a\u7eb9\u7406\u5408\u6279\u7ba1\u7406\u5668 ",(0,i.kt)("inlineCode",{parentName:"p"},"cc.sp.MultiBatcher"),"\u3002"),(0,i.kt)("p",null,"\u8fd9\u4e2a\u7ba1\u7406\u5668\u6709\u70b9\u50cf\u52a8\u6001\u5408\u56fe\u7ba1\u7406\u5668\uff0c\u5b83\u4f1a\u6301\u6709\u4e00\u4e2a\u6750\u8d28\u6570\u7ec4\uff0c\u521d\u59cb\u5316\u540e\u4f1a\u4f7f\u7528\u5185\u7f6e\u7684\u591a\u7eb9\u7406 Effect \u7740\u8272\u5668\u521b\u5efa\u4e00\u4e2a\u6750\u8d28\u5e76\u653e\u5728\u6570\u7ec4\u4e2d\u3002"),(0,i.kt)("p",null,"\u4f60\u53ef\u4ee5\u4f20\u7ed9\u7ba1\u7406\u5668\u4e00\u4e2a\u7eb9\u7406\uff0c\u5b83\u4f1a\u67e5\u627e\u6240\u6709\u6750\u8d28\u7684\u7a7a\u63d2\u69fd\uff0c\u5982\u679c\u6ca1\u6709\u6750\u8d28\u6709\u7a7a\u63d2\u69fd\u5219\u4f1a\u521b\u5efa\u4e00\u4e2a\u65b0\u6750\u8d28\uff0c\u7136\u540e\u628a\u7eb9\u7406\u4e0e\u6750\u8d28\u5173\u8054\u3002"),(0,i.kt)("h3",{id:"\u5982\u4f55\u4f7f\u7528"},"\u5982\u4f55\u4f7f\u7528"),(0,i.kt)("p",null,"\u521b\u5efa\u7ba1\u7406\u5668\u5e76\u521d\u59cb\u5316\u53ef\u4ee5\u4f7f\u7528\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const batcher = new cc.sp.MultiBatcher();\nbatcher.init();\n")),(0,i.kt)("p",null,"\u4f20\u5165\u7eb9\u7406\u53ef\u4ee5\u4f7f\u7528\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const material = batcher.requsetMaterial(texture);\n")),(0,i.kt)("p",null,"\u4f1a\u8fd4\u56de\u5173\u8054\u7684\u6750\u8d28\uff0c\u5982\u679c\u7eb9\u7406\u672c\u6765\u5c31\u5df2\u7ecf\u6709\u5173\u8054\u7684\u6750\u8d28\uff0c\u5219\u4f1a\u76f4\u63a5\u8fd4\u56de\u5df2\u5173\u8054\u7684\u6750\u8d28\u3002"),(0,i.kt)("p",null,"\u6e05\u7a7a\u5185\u90e8\u6570\u7ec4\u53ef\u4ee5\u4f7f\u7528\uff08\u8fd9\u4e0d\u4f1a\u53d6\u6d88\u7eb9\u7406\u7684\u5173\u8054\uff09\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"batcher.reset();\n")))}d.isMDXComponent=!0},18490:function(e,t,n){t.Z=n.p+"assets/images/autoswitch-settings-97d83acf8ae9d15a37b13e4f716cf32c.png"}}]);