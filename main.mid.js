"use strict";
var ScpoAJAX=(function(){
	var A="getElementsByTagName",
		B=encodeURIComponent,
		C=decodeURIComponent,
		D=function(){},
		E="undefined";
	return{
		config:{
			url:"",
			method:"get",
			data:"",
			tdro:D,
			todo:D,
			format:"str",
			async:true,
			scdo:D
		},
		query:{
			toStr:function(a){
				var b=a[A]("input"),i=-1,c,d="";
				while(c=b[++i])d+=B(c.name)+"="+B(c.value)+"&";
				return d.slice(0,-1)
			},
			toObj:function(a){
				var b=a[A]("input"),i=-1,c,d={};
				while(c=b[++i])d[c.name]=c.value;
				return d
			},
			obj2str:function(a){
				var b="",i;
				for(i in a)b+=B(i)+"="+B(a[i])+"&";
				return b.slice(0,-1)
			},
			str2obj:function(a){
				var b=a.split("&"),c={},d,i=0;
				while(a=b[i++])c[C(a.slice(0,d=a.indexOf("=")))]=C(a.slice(d+1));
				return c
			}
		},
		request:function(a,b,c,d,e,f,g,h){
			var i=this,j=i.config,k=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
			if(typeof a==E)a=j.url;
			if(c instanceof Object)c=i.query.obj2str(c);
			if(!d)d=j.todo;
			if(!e)e=j.ordo;
			if(typeof g==E)g=j.async;
			f="response"+((f?f:j.format)=="xml"?"XML":"Text");
			if(g)k.onreadystatechange=function(){
				k.readyState==4
					?k.status==200?d(k[f]):e(k)
					:(h?h:j.scdo)(k)
			};
			if((b?b:j.method)=="get"){
				k.open("GET",a+(c?"?"+c:""),g);
				k.send()
			}else{
				k.open("POST",a,g);
				k.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				k.send(c)
			}
			if(!g)return k.status==200?d(k[f]):e(k)
		},
		get:function(a,b,c,d,e,f,g){
			this.request(a,"get",b,c,d,e,f,g)
		},
		post:function(a,b,c,d,e,f,g){
			this.request(a,"post",b,c,d,e,f,g)
		}
	}
}());