import{r as _}from"./use-self-router-ecbf91f5.js";import{d,r as f,g as v,a2 as b,a3 as g,h as l,i as h,j as x,c as e,k as a,m as n,b as V,l as A}from"./index-c42bf1ef.js";const k={class:"scroll-y"},C=A("div",{class:"font-bold mb-10px"},"Second Page KeepAlive Demo",-1),w=d({name:"KeepAliveGroup"}),F=d({...w,setup(D){const o=f({name:"",age:""}),r=v(1);r.value=2,console.log(r.value),b(()=>{console.log("onActivated")}),g(()=>{console.log("onDeactivated")});const i=()=>{_("SecondChild",{name:"SecondKeepAlive"})};return(S,t)=>{const c=l("el-input"),p=l("el-form-item"),m=l("el-form"),u=l("el-button");return h(),x("div",k,[C,e(m,{ref:"refsearchForm",inline:!0,class:"mt-2"},{default:a(()=>[e(p,{"label-width":"0px",label:"",prop:"errorLog","label-position":"left"},{default:a(()=>[e(c,{modelValue:n(o).name,"onUpdate:modelValue":t[0]||(t[0]=s=>n(o).name=s),class:"w-150px",placeholder:"input to test keepAlive"},null,8,["modelValue"])]),_:1}),e(p,{"label-width":"0px",label:"",prop:"pageUrl","label-position":"left"},{default:a(()=>[e(c,{modelValue:n(o).age,"onUpdate:modelValue":t[1]||(t[1]=s=>n(o).age=s),class:"w-150px",placeholder:"input to test keepAlive"},null,8,["modelValue"])]),_:1})]),_:1},512),e(u,{type:"primary",onClick:i},{default:a(()=>[V("to SecondChild.vue")]),_:1})])}}});export{F as default};
