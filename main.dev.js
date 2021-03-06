/**
 * @file 幻想私社网络请求函数库
 * @author E0SelmY4V - from 幻想私社
 * @version 1.2.20220603 包含qrycnv、AJAX函数和函数式编程相关
 * @link https://github.com/E0SelmY4V/scpo-webreq.js
 */
"use strict";
/**
 * 主函数库
 * @namespace
 */
var ScpoWR = ScpoWR || {};
/**
 * 默认配置
 * @namespace
 */
ScpoWR.config = {
	/**
	 * 更改默认配置
	 * @param {string|object} name 要更改的配置名称或配置键值对
	 * @param {any} value 更改后的值
	 */
	change: function (name, value) {
		if (typeof name == "string") this[name] = value;
		else for (var i in name) this[i] = name[i];
	},
	/**
	 * 简便函数请求模式
	 * @type {"ajax"}
	 * @default
	 */
	mode: "ajax",
	/**
	 * 请求地址
	 * @type {string}
	 */
	url: "",
	/**
	 * 请求方法
	 * @type {"get"|"post"}
	 * @default
	 */
	method: "get",
	/**
	 * 请求数据
	 * @type {string|object}
	 */
	data: "",
	/**
	 * 请求成功后执行的函数
	 * @callback ScpoWR.config.todo
	 * @param {string|XMLDocument} data 请求返回的数据
	 */
	todo: function (data) { },
	/**
	 * 请求失败后执行的函数
	 * @callback ScpoWR.config.ordo
	 * @param {XMLHttpRequest|Error} param XHR对象或Error对象
	 */
	ordo: function (param) { },
	/**
	 * 返回数据的格式
	 * @type {"xml"|"str"}
	 * @default
	 */
	format: "str",
	/**
	 * 是否异步
	 * @type {boolean}
	 * @default
	 */
	async: true,
	/**
	 * 请求未完成时readyState变化时执行的函数
	 * @callback ScpoWR.config.scdo
	 * @param {XMLHttpRequest} xhr XHR对象
	 */
	scdo: function (xhr) { }
};
/**
 * 请求数据类型
 * @typedef {
 *   HTMLFormElement|
 *   string|
 *   object
 * } ScpoWR.qrycnv.qryType
 */
/**
 * 请求字符串转换相关
 * @namespace
 */
ScpoWR.qrycnv = {
	/**
	 * 表单元素中作为输入框的标签列表
	 * @type {string[]}
	 * @readonly
	 */
	iptype: [
		"input",
		"textarea"
	],
	/**
	 * 表单元素转请求字符串
	 * @param {HTMLFormElement} frm 表单元素
	 * @returns {string} 请求字符串
	 */
	frm2str: function (frm) {
		var l = [], k, j, i, k = j = i = -1, p, d, a, str = "", e = encodeURIComponent;
		while (p = this.iptype[++j]) {
			var a = frm.getElementsByTagName(p);
			while (d = a[++k]) l.push(d);
		}
		while (p = l[++i]) str += e(p.name) + "=" + e(p.value) + "&";
		return str.slice(0, -1);
	},
	/**
	 * 请求字符串转表单元素
	 * @param {string} str 请求字符串
	 * @returns {HTMLFormElement} 表单元素
	 */
	str2frm: function (str) {
		var arr = str.split("&"), frm = document.createElement("form"), ipt, pos, i = -1, d = decodeURIComponent;
		while (str = arr[++i]) {
			ipt = document.createElement("textarea");
			ipt.setAttribute("name", d(str.slice(0, pos = str.indexOf("="))));
			ipt.value = d(str.slice(pos + 1));
			frm.appendChild(ipt);
		}
		return frm;
	},
	/**
	 * 表单元素转请求键值对
	 * @param {HTMLFormElement} frm 表单元素
	 * @returns {object} 请求键值对
	 */
	frm2obj: function (frm) {
		var l = [], k, j, i, k = j = i = -1, p, d, a, obj = {};
		while (p = this.iptype[++j]) {
			var a = frm.getElementsByTagName(p);
			while (d = a[++k]) l.push(d);
		}
		while (p = l[++i]) obj[p.name] = p.value;
		return obj;
	},
	/**
	 * 请求键值对转表单元素
	 * @param {object} obj 请求键值对
	 * @returns {HTMLFormElement} 表单元素
	 */
	obj2frm: function (obj) {
		var frm = document.createElement("form"), ipt, i;
		for (i in obj) {
			ipt = document.createElement("textarea");
			ipt.setAttribute("name", i);
			ipt.value = obj[i];
			frm.appendChild(ipt);
		}
		return frm;
	},
	/**
	 * 请求键值对转请求字符串
	 * @param {object} obj 请求键值对
	 * @returns {string} 请求字符串
	 */
	obj2str: function (obj) {
		var str = "", e = encodeURIComponent;
		for (var i in obj) str += e(i) + "=" + e(obj[i]) + "&";
		return str.slice(0, -1);
	},
	/**
	 * 请求字符串转请求键值对
	 * @param {string} str 请求字符串
	 * @returns {object} 请求键值对
	 */
	str2obj: function (str) {
		var arr = str.split("&"), obj = {}, pos, i = 0, d = decodeURIComponent;
		while (str = arr[i++]) obj[d(str.slice(0, pos = str.indexOf("=")))] = d(str.slice(pos + 1));
		return obj;
	},
	/**
	 * 判断请求数据类型
	 * @param {*} n 要判断的请求数据
	 * @returns {"frm"|"str"|"obj"|"unkown"} 类型
	 */
	getype: function (n) {
		if (typeof n == "string") return "str";
		if (typeof n != "object") return "unkown";
		if (window.HTMLElement
			? n instanceof HTMLElement
			: (n.nodeType === 1 && typeof n.nodeName === 'string')
		) return "frm";
		return "obj";
	},
	/**
	 * 请求数据类型列表
	 * @type {string[]}
	 * @readonly
	 */
	type: [
		"str",
		"frm",
		"obj"
	],
	/**
	 * 判断是否是请求数据类型
	 * @param {string} n 要判断的符串
	 * @returns {boolean} 是否是请求数据类型
	 */
	isType: function (n) {
		if (this.typeObj) return Boolean(this.typeObj[n]);
		this.typeObj = {};
		var z, i = -1;
		while (z = this.type[++i]) this.typeObj[z] = true;
		return this.isType(n);
	},
	/**
	 * 转换请求数据类型
	 * @param {ScpoWR.qrycnv.qryType} n 要转换的请求数据
	 * @param {string} type 要转换成的请求数据类型
	 * @returns {ScpoWR.qrycnv.qryType} 转换后的数据
	 */
	convert: function (n, type) {
		type = this.getype(n) + "2" + type;
		return this[type] ? this[type](n) : n;
	},
	/**
	 * 将请求数据转换为请求字符串
	 * @param {ScpoWR.qrycnv.qryType} n 请求数据
	 * @returns {string} 请求字符串
	 */
	toStr: function (n) {
		return this.convert(n, "str");
	},
	/**
	 * 将请求数据转换为请求键值对
	 * @param {ScpoWR.qrycnv.qryType} n 请求数据
	 * @returns {object} 请求键值对
	 */
	toObj: function (n) {
		return this.convert(n, "obj");
	},
	/**
	 * 将请求数据转换为表单元素
	 * @param {ScpoWR.qrycnv.qryType} n 请求数据
	 * @returns {HTMLFormElement} 表单元素
	 */
	toFrm: function (n) {
		return this.convert(n, "frm");
	}
};
/**
 * AJAX请求参数数组
 * @typedef {Array.<
 *   string,
 *   ScpoWR.qrycnv.qryType,
 *   ScpoWR.config.todo,
 *   ScpoWR.config.ordo,
 *   ScpoWR.config.format,
 *   ScpoWR.config.async,
 *   ScpoWR.config.scdo
 * >} ScpoWR.ajaxParams
 */
/**
 * 发起AJAX请求
 * @param {ScpoWR.config.method} method 请求方法
 * @param {string|ScpoWR.ajaxParams} url 请求地址；也可传入一个参数数组
 * @param {ScpoWR.qrycnv.qryType} data 请求数据
 * @param {ScpoWR.config.todo} todo 请求成功后执行的函数
 * @param {ScpoWR.config.ordo} ordo 请求失败后执行的函数
 * @param {ScpoWR.config.format} format 返回数据的格式
 * @param {ScpoWR.config.async} async 是否异步
 * @param {ScpoWR.config.scdo} scdo 请求未完成时readyState变化时执行的函数
 * @returns {void|any} 若异步则返回void，否则返回todo或ordo函数执行的结果
 */
ScpoWR.ajax = function (method, url, data, todo, ordo, format, async, scdo) {
	if (typeof url == "object") {
		var a = url, i = 0, g = function () { return a[i++] };
		url = g(), data = g(), todo = g(), ordo = g(), format = g(), async = g(), scdo = g();
	} else if (typeof url == "undefined") url = cfg.url;
	var cfg = ScpoWR.config, data = ScpoWR.qrycnv.toStr(data);
	var xh = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	if (!todo) todo = cfg.todo;
	if (!ordo) ordo = cfg.ordo;
	if (!scdo) scdo = cfg.scdo;
	if (typeof async == "undefined") async = cfg.async;
	format = "response" + ((format ? format : cfg.format) == "xml" ? "XML" : "Text");
	if (async) xh.onreadystatechange = function () {
		xh.readyState == 4 ? xh.status == 200 ? todo(xh[format]) : ordo(xh) : scdo(xh);
	};
	if ((method ? method : cfg.method) == "get") {
		xh.open("GET", url + (data ? "?" + data : ""), async);
		xh.send();
	} else {
		xh.open("POST", url, async);
		xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xh.send(data);
	}
	if (!async) return xh.status == 200 ? todo(xh[format]) : ordo(xh);
};
/**
 * 简便函数：发起AJAX请求
 * @param {ScpoWR.config.method} method 请求方法
 * @param {ScpoWR.ajaxParams} args AJAX请求参数数组
 * @returns {void|any} 请求函数的返回值
 */
ScpoWR.request = function (method, args) {
	var f, m = ScpoWR.config.mode;
	switch (m) {
		case "ajax":
			break;
		default:
			return;
	}
	return ScpoWR[m](method, args);
};
/**
 * 简便函数：发起AJAX GET请求
 * @param {string} url 请求地址
 * @param {ScpoWR.qrycnv.qryType} data 请求数据
 * @param {ScpoWR.config.todo} todo 请求成功后执行的函数
 * @param {ScpoWR.config.ordo} ordo 请求失败后执行的函数
 * @param {ScpoWR.config.format} format 返回数据的格式
 * @param {ScpoWR.config.async} async 是否异步
 * @param {ScpoWR.config.scdo} scdo 请求未完成时readyState变化时执行的函数
 * @returns {void|any} 请求函数的返回值
 */
ScpoWR.get = function (url, data, todo, ordo, format, async, scdo) {
	return ScpoWR.request("get", typeof url == "object"
		? url
		: [url, data, todo, ordo, format, async, scdo]
	);
};
/**
 * 简便函数：发起AJAX POST请求
 * @param {string} url 请求地址
 * @param {ScpoWR.qrycnv.qryType} data 请求数据
 * @param {ScpoWR.config.todo} todo 请求成功后执行的函数
 * @param {ScpoWR.config.ordo} ordo 请求失败后执行的函数
 * @param {ScpoWR.config.format} format 返回数据的格式
 * @param {ScpoWR.config.async} async 是否异步
 * @param {ScpoWR.config.scdo} scdo 请求未完成时readyState变化时执行的函数
 * @returns {void|any} 请求函数的返回值
 */
ScpoWR.post = function (url, data, todo, ordo, format, async, scdo) {
	return ScpoWR.request("post", typeof url == "object"
		? url
		: [url, data, todo, ordo, format, async, scdo]
	);
};
/**
 * 幻想私社异步过程类请求成功时的回调函数
 * @callback ScpoWR.Process.todo
 * @param {*} param 一个参数
 */
/**
 * 幻想私社异步过程类请求失败时的回调函数
 * @callback ScpoWR.Process.ordo
 * @param {*} param 一个参数
 */
/**
 * 幻想私社异步过程类
 * @param {boolean} cleared 是否已经完成异步请求
 * @class
 * @borrows ScpoWR.then as then
 * @borrows ScpoWR.config.change as fset
 * @borrows ScpoWR.onerr as onerr
 * @borrows ScpoWR.frequest as frequest
 * @borrows ScpoWR.fget as fget
 * @borrows ScpoWR.fpost as fpost
 */
ScpoWR.Process = function (cleared) {
	var n = this;
	this.todo = [], this.ordo = [];
	if (cleared) this.cleared = true;
	else this.clear = function (param) {
		var w = param instanceof XMLHttpRequest ? "ordo" : "todo", f, d = true;
		while (f = n[w].shift()) if (typeof f == "function") param = f(param), d = false;
		if (d) ScpoWR.config[w](param);
		n.cleared = true, n.lastRtn = param;
	};
};
/**
 * 添加回调
 * @param {ScpoWR.Process.todo} todo 成功时的回调函数
 * @param {ScpoWR.Process.ordo} ordo 出错时的回调函数
 * @returns {ScpoWR.Process} 执行的过程对象
 */
ScpoWR.then = function (todo, ordo) {
	var proc = this instanceof ScpoWR.Process ? this : new ScpoWR.Process(true);
	if (proc.cleared) {
		if (typeof todo == "function") proc.lastRtn = todo(proc.lastRtn);
	} else proc.todo.push(todo), proc.ordo.push(ordo);
	return proc;
}
/**
 * @borrows ScpoWR.config.change as fset
 */
ScpoWR.fset = function (name, value) {
	return this.then(function (param) {
		return ScpoWR.config.change(name, value), param;
	});
}
/**
 * catch错误
 * @param {ScpoWR.Process.ordo} ordo 出错时的回调函数
 * @returns {ScpoWR.Process} 执行的过程对象
 */
ScpoWR.onerr = function (ordo) {
	return this.then(null, ordo);
}
/**
 * 发起AJAX请求
 * @param {boolean} order 是否使用上一次回调的返回的参数数组
 * @param {ScpoWR.config.method} method 请求方法
 * @param {string} url 请求地址
 * @param {ScpoWR.qrycnv.qryType} data 请求数据
 * @param {ScpoWR.config.format} format 返回数据的格式
 * @returns {ScpoWR.Process} 执行的过程对象
 */
ScpoWR.frequest = function (order, method, url, data, format) {
	var proc = new ScpoWR.Process();
	if (order == "get" || order == "post") {
		format = data, data = url, url = method, method = order, order = false;
		if (typeof url == "object") data = url[1], format = url[2], url = url[0];
	}
	var todo = function (param) {
		if (order !== false) {
			if (typeof param == "object") {
				if (order === true) method = Array.isArray(param) ? param.shift() : param.method;
			} else {
				if (order === true) method = "get";
				param = [param];
			}
			url = param[0] || param.url;
			data = param[1] || param.data;
			format = param[2] || param.format;
		}
		ScpoWR.request(method, [url, data, proc.clear, proc.clear, format, true]);
	};
	this instanceof ScpoWR.Process ? this.then(todo) : todo();
	return proc;
}
/**
 * 函数式编程简便函数：发起AJAX GET请求
 * @param {string|true} url 请求地址。或者若为true则使用上次回调返回的参数数组
 * @param {ScpoWR.qrycnv.qryType} data 请求数据
 * @param {ScpoWR.config.format} format 返回数据的格式
 * @returns {ScpoWR.Process} 执行的过程对象
 */
ScpoWR.fget = function (url, data, format) {
	return url === true
		? this.frequest(void (0), "get")
		: this.frequest("get", [url, data, format]);
}
/**
 * 函数式编程简便函数：发起AJAX POST请求
 * @param {string|true} url 请求地址。或者若为true则使用上次回调返回的参数数组
 * @param {ScpoWR.qrycnv.qryType} data 请求数据
 * @param {ScpoWR.config.format} format 返回数据的格式
 * @returns {ScpoWR.Process} 执行的过程对象
 */
ScpoWR.fpost = function (url, data, format) {
	return url === true
		? this.frequest(void (0), "get")
		: this.frequest("post", [url, data, format]);
}
ScpoWR.Process.prototype = {
	then: ScpoWR.then,
	fset: ScpoWR.fset,
	onerr: ScpoWR.onerr,
	frequest: ScpoWR.frequest,
	fget: ScpoWR.fget,
	fpost: ScpoWR.fpost
};
if (ScpoWR.onload) ScpoWR.onload();