(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-53279185"],{"73cf":function(e,s,r){"use strict";r.r(s);var a=function(){var e=this,s=e.$createElement,r=e._self._c||s;return r("section",{staticClass:"form-section"},[r("div",{staticClass:"form-card"},[r("h1",[e._v("Register")]),r("div",{staticClass:"message error",class:{shown:e.errorMessage}},[e._v(e._s(e.errorMessage))]),r("div",{staticClass:"message success",class:{shown:e.success}},[e._v("Registration successful. Please check your Email to confirm your registration.")]),r("div",{staticClass:"form-wrap",class:{loading:e.isLoading}},[r("form",{class:{hidden:e.success},on:{submit:function(s){return s.preventDefault(),e.signup(s)}}},[r("label",[e._v(" Name "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.name,expression:"user.name"}],attrs:{type:"text",id:"name",required:""},domProps:{value:e.user.name},on:{input:function(s){s.target.composing||e.$set(e.user,"name",s.target.value)}}}),r("span")]),r("label",[e._v(" Email "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.email,expression:"user.email"}],attrs:{type:"text",id:"email",required:""},domProps:{value:e.user.email},on:{input:function(s){s.target.composing||e.$set(e.user,"email",s.target.value)}}}),r("span")]),r("label",[e._v(" Password "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.password,expression:"user.password"}],attrs:{type:"password",id:"password",required:""},domProps:{value:e.user.password},on:{input:function(s){s.target.composing||e.$set(e.user,"password",s.target.value)}}}),r("span")]),r("label",[e._v(" Confirm Password "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.confirmPassword,expression:"user.confirmPassword"}],attrs:{type:"password",id:"confirmPassword",required:""},domProps:{value:e.user.confirmPassword},on:{input:function(s){s.target.composing||e.$set(e.user,"confirmPassword",s.target.value)}}}),r("span")]),r("button",{staticClass:"btn btn-primary",attrs:{type:"submit"}},[e._v("Register")]),r("div",[e._v(" Already a member? "),r("router-link",{attrs:{to:"/login"}},[e._v("Login")])],1)])])])])},t=[],i=(r("caad"),r("b0c0"),r("d3b7"),r("2532"),r("ddb0"),r("5530")),n=r("f0b1"),o=r.n(n),u=r("2f62"),c=r("5fb0"),d=c.API_URL,m=d+"/auth/register",l={name:"Registration",data:function(){return{isLoading:!1,errorMessage:"",success:!1,user:{email:"",password:"",confirmPassword:"",name:""}}},methods:Object(i["a"])({},Object(u["c"])(["getAuth"]),{signup:function(){var e=this;if(this.errorMessage="",this.isLoading=!0,this.validUser()){var s={email:this.user.email,password:this.user.password,name:this.user.name},r={headers:{"Content-Type":"application/json"}};this.$http.post(m,s,r).then((function(s){e.isLoading=!1,e.success=!0,console.log(s)})).catch((function(s){e.isLoading=!1,e.user.password="",e.user.confirmPassword="",e.errorMessage=s.response.data.error}))}else this.isLoading=!1},validUser:function(){var e=o.a.object().keys({email:o.a.string().email().required(),password:o.a.string().min(3).max(30).required(),confirmPassword:o.a.string().min(3).max(30).required(),name:o.a.string().min(3).max(30).required()});if(this.user.password!==this.user.confirmPassword)return this.errorMessage="Passwords must match.",!1;var s=o.a.validate(this.user,e);return null===s.error||(s.error.message.includes("name")?(this.errorMessage="bad length or format of a name",!1):(s.error.message.includes("email")?this.errorMessage="email is invalid.":this.errorMessage="Password is invalid.",!1))}}),mounted:function(){document.querySelector("#name").focus()}},p=l,g=r("2877"),v=Object(g["a"])(p,a,t,!1,null,null,null);s["default"]=v.exports},b0c0:function(e,s,r){var a=r("83ab"),t=r("9bf2").f,i=Function.prototype,n=i.toString,o=/^\s*function ([^ (]*)/,u="name";!a||u in i||t(i,u,{configurable:!0,get:function(){try{return n.call(this).match(o)[1]}catch(e){return""}}})}}]);
//# sourceMappingURL=chunk-53279185.a0205ed7.js.map