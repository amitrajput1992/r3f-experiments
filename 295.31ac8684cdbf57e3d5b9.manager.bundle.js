(self.webpackChunkr3f_experiments=self.webpackChunkr3f_experiments||[]).push([[295],{19295:f=>{f.exports=function(l,s){return s=s||{},new Promise(function(p,d){var e=new XMLHttpRequest,u=[],i=[],r={},a=function(){return{ok:(e.status/100|0)==2,statusText:e.statusText,status:e.status,url:e.responseURL,text:function(){return Promise.resolve(e.responseText)},json:function(){return Promise.resolve(e.responseText).then(JSON.parse)},blob:function(){return Promise.resolve(new Blob([e.response]))},clone:a,headers:{keys:function(){return u},entries:function(){return i},get:function(n){return r[n.toLowerCase()]},has:function(n){return n.toLowerCase()in r}}}};for(var c in e.open(s.method||"get",l,!0),e.onload=function(){e.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,function(n,t,o){u.push(t=t.toLowerCase()),i.push([t,o]),r[t]=r[t]?r[t]+","+o:o}),p(a())},e.onerror=d,e.withCredentials=s.credentials=="include",s.headers)e.setRequestHeader(c,s.headers[c]);e.send(s.body||null)})}}}]);
