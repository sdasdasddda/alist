import{d as i,a0 as m,e as p,h as r,i as u,j as _,l,b as d,c as n,m as s}from"./index-c42bf1ef.js";const V={class:"scroll-y"},w=l("h3",{class:"mb-20px"},"props operate demo of settings.js",-1),h={class:"rowSS"},c={class:"mb-10px"},v=l("div",{class:"font-bold text-20px"},"page layout related",-1),g={class:"mt-20px"},x={class:"mt-30px"},b={class:"mt-30px"},N={class:"mt-30px"},f={class:"mt-30px"},T={class:"mt-30px"},S={class:"mt-30px"},U={class:"mb-10px ml-60px"},D=l("div",{class:"font-bold text-20px"},"page animation related",-1),L=l("div",{class:"mt-20px"},'mainNeedAnimation：places to "settings file" for setting',-1),B={class:"mt-30px"},j=i({}),y=Object.assign(j,{__name:"SettingSwitch",setup(H){const{settings:e}=m(p());return(M,o)=>{const a=r("el-switch");return u(),_("div",V,[w,l("div",h,[l("div",c,[v,l("div",g,[d(" sidebarLogo： "),n(a,{modelValue:s(e).sidebarLogo,"onUpdate:modelValue":o[0]||(o[0]=t=>s(e).sidebarLogo=t)},null,8,["modelValue"])]),l("div",x,[d(" showNavbarTitle： "),n(a,{modelValue:s(e).showNavbarTitle,"onUpdate:modelValue":o[1]||(o[1]=t=>s(e).showNavbarTitle=t)},null,8,["modelValue"])]),l("div",b,[d(" ShowDropDown： "),n(a,{modelValue:s(e).ShowDropDown,"onUpdate:modelValue":o[2]||(o[2]=t=>s(e).ShowDropDown=t)},null,8,["modelValue"])]),l("div",N,[d(" showHamburger： "),n(a,{modelValue:s(e).showHamburger,"onUpdate:modelValue":o[3]||(o[3]=t=>s(e).showHamburger=t)},null,8,["modelValue"])]),l("div",f,[d(" showLeftMenu： "),n(a,{modelValue:s(e).showLeftMenu,"onUpdate:modelValue":o[4]||(o[4]=t=>s(e).showLeftMenu=t)},null,8,["modelValue"])]),l("div",T,[d(" showTagsView： "),n(a,{modelValue:s(e).showTagsView,"onUpdate:modelValue":o[5]||(o[5]=t=>s(e).showTagsView=t)},null,8,["modelValue"])]),l("div",S,[d(" showTopNavbar： "),n(a,{modelValue:s(e).showTopNavbar,"onUpdate:modelValue":o[6]||(o[6]=t=>s(e).showTopNavbar=t)},null,8,["modelValue"])])]),l("div",U,[D,L,l("div",B,[d(" isNeedNprogress： "),n(a,{modelValue:s(e).isNeedNprogress,"onUpdate:modelValue":o[7]||(o[7]=t=>s(e).isNeedNprogress=t)},null,8,["modelValue"])])])])])}}});export{y as default};