void 0!==window.dashR&&dashR().addContext({name:"xml",js:{json:function(e,n){var t=this.parseXml(e);return this.xml2json(t,n)},parseXml:function(e){var n=null;if(window.DOMParser)try{n=(new DOMParser).parseFromString(e,"text/xml")}catch(e){n=null}else if(window.ActiveXObject)try{(n=new ActiveXObject("Microsoft.XMLDOM")).async=!1,n.loadXML(e)||window.alert(n.parseError.reason+n.parseError.srcText)}catch(e){n=null}else alert("cannot parse xml string!");return n},xml2json:function(e,n){var t={toObj:function(e){var n={};if(1==e.nodeType){if(e.attributes.length)for(var r=0;r<e.attributes.length;r++)n["@"+e.attributes[r].nodeName]=(e.attributes[r].nodeValue||"").toString();if(e.firstChild){for(var i=0,o=0,a=!1,l=e.firstChild;l;l=l.nextSibling)1==l.nodeType?a=!0:3==l.nodeType&&l.nodeValue.match(/[^ \f\n\r\t\v]/)?i++:4==l.nodeType&&o++;if(a)if(i<2&&o<2){t.removeWhite(e);for(l=e.firstChild;l;l=l.nextSibling)3==l.nodeType?n["#text"]=t.escape(l.nodeValue):4==l.nodeType?n["#cdata"]=t.escape(l.nodeValue):n[l.nodeName]?n[l.nodeName]instanceof Array?n[l.nodeName][n[l.nodeName].length]=t.toObj(l):n[l.nodeName]=[n[l.nodeName],t.toObj(l)]:n[l.nodeName]=t.toObj(l)}else e.attributes.length?n["#text"]=t.escape(t.innerXml(e)):n=t.escape(t.innerXml(e));else if(i)e.attributes.length?n["#text"]=t.escape(t.innerXml(e)):n=t.escape(t.innerXml(e));else if(o)if(o>1)n=t.escape(t.innerXml(e));else for(l=e.firstChild;l;l=l.nextSibling)n["#cdata"]=t.escape(l.nodeValue)}e.attributes.length||e.firstChild||(n=null)}else 9==e.nodeType?n=t.toObj(e.documentElement):alert("unhandled node type: "+e.nodeType);return n},toJson:function(e,n,r){var i=n?'"'+n+'"':"";if(e instanceof Array){for(var o=0,a=e.length;o<a;o++)e[o]=t.toJson(e[o],"",r+"\t");i+=(n?":[":"[")+(e.length>1?"\n"+r+"\t"+e.join(",\n"+r+"\t")+"\n"+r:e.join(""))+"]"}else if(null==e)i+=(n&&":")+"null";else if("object"==typeof e){var l=[];for(var s in e)l[l.length]=t.toJson(e[s],s,r+"\t");i+=(n?":{":"{")+(l.length>1?"\n"+r+"\t"+l.join(",\n"+r+"\t")+"\n"+r:l.join(""))+"}"}else i+="string"==typeof e?(n&&":")+'"'+e.toString()+'"':(n&&":")+e.toString();return i},innerXml:function(e){var n="";if("innerHTML"in e)n=e.innerHTML;else for(var t=function(e){var n="";if(1==e.nodeType){n+="<"+e.nodeName;for(var r=0;r<e.attributes.length;r++)n+=" "+e.attributes[r].nodeName+'="'+(e.attributes[r].nodeValue||"").toString()+'"';if(e.firstChild){n+=">";for(var i=e.firstChild;i;i=i.nextSibling)n+=t(i);n+="</"+e.nodeName+">"}else n+="/>"}else 3==e.nodeType?n+=e.nodeValue:4==e.nodeType&&(n+="<![CDATA["+e.nodeValue+"]]>");return n},r=e.firstChild;r;r=r.nextSibling)n+=t(r);return n},escape:function(e){return e.replace(/[\\]/g,"\\\\").replace(/[\"]/g,'\\"').replace(/[\n]/g,"\\n").replace(/[\r]/g,"\\r")},removeWhite:function(e){for(var n=e.firstChild;n;)if(3==n.nodeType)if(n.nodeValue.match(/[^ \f\n\r\t\v]/))n=n.nextSibling;else{var r=n.nextSibling;e.removeChild(n),n=r}else 1==n.nodeType?(t.removeWhite(n),n=n.nextSibling):n=n.nextSibling;return e}};9==e.nodeType&&(e=e.documentElement);var r=t.toJson(t.toObj(t.removeWhite(e)),e.nodeName,"\t");return"{\n"+(null!=n?n:"")+(n?r.replace(/\t/g,n):r.replace(/\t|\n/g,""))+"\n}"}}});