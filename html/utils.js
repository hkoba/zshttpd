// copyright by hkoba@users.sourceforge.net

function get_id(name) {
  return document.getElementById ?
    document.getElementById(name) : null;
}

function get_tags(name) {
  return document.getElementsByTagName ?
    document.getElementsByTagName(name) : null;
}

function lsearch(list, value, i) {
  if (i == null)
    i = 0;
  for (; i < list.length; i++) {
    if (list[i] == value)
      return i;
  }
  return null;
}

function same_sibling(node, dir) {
  var prop = same_sibling.map[dir];
  var orig = node.nodeName;
  for (var sibling = node[prop]; sibling; sibling = sibling[prop]) {
    if (sibling.nodeName == orig)
      return sibling;
  }
  return null;
}
same_sibling.map = [];
same_sibling.map[1] = 'nextSibling';
same_sibling.map['next'] = 'nextSibling';
same_sibling.map[-1] = 'previousSibling';
same_sibling.map['previous'] = 'previousSibling';

function NodeFinder() {
  var navmap = arguments.callee.navmap = [];
  navmap[1] = 'nextSibling';
  navmap['next'] = 'nextSibling';
  navmap[-1] = 'previousSibling';
  navmap['previous'] = 'previousSibling';
  function find(node, dir, pred) {
    var prop = navmap[dir];
    for (var sibling = node[prop]; sibling; sibling = sibling[prop]) {
      if (pred(sibling))
	return sibling;
    }
    return null;
  }
  arguments.callee.find = find;
}
NodeFinder();

function obj_keys(obj) {
  var res = [];
  for (var k in obj) {
    res.push(k);
  }
  res.sort();
  res.toString = function() {
    return "[" + this.join(", ") + "]";
  };
  return res;
}

function stringify(obj) {
  var result = [];
  for (var k in obj) {
    var s;
    try {
      s = obj[k];
    } catch (e) {
      s = "(ERR: " + e + ")";
    }
    result.push(k + ": " + s);
  }
  return "{" + result.join(", ") + "}";
}

function htmlescape(str) {
  var map = window.htmlescape.map;
  var list = str.split(/([<>&])/);
  var result = "";
  for (var i = 0; i < list.length; i++) {
    result += list[i];
    if (++i >= list.length)
      break;
    result += map[list[i]];
  }
  return result
}
htmlescape.map = [];
htmlescape.map["<"] = "&lt;";
htmlescape.map[">"] = "&gt;";
htmlescape.map["&"] = "&amp;";

function dump_win(value) {
  var w = window.open();
  var s = typeof value == "string" ? value : stringify(value);
  w.document.write(s);
}

function dump_to_win(w, value) {
  var result = "";
  if (typeof value == "object" && value != null) {
    var keys = obj_keys(value);
    result += "<table>\n";
    for (var i = 0; i < keys.length; i++) {
      result += "<tr><td>" + keys[i] + "</td><td>" +
	htmlescape(value[keys[i]] + "") + "</td></tr>\n";
    }
    result += "</table>\n";
  } else {
    result = value + "";
  }
  w.document.write(result);
}

function coalesce() {
  for (var i = 0; i < arguments.length; i++) {
    var value = arguments[i];
    if (value != null) {
      return value;
    }
  }
}

function safe_get(target, desc) {
  for (var i = 1; target != null && i < desc.length; i++) {
    var key = desc[i];
    if (typeof key == "string") {
      // normal get.
      target = target[key];
    } else if (typeof key[0] == "string") {
      // single call
      var func = target[key[0]];
      if (! func) return;
      target = func.prototype.apply(target, key.slice(1));
    } else {
      // OR case.
      var found;
      for (var j = 0; j < key.length; j++) {
	found = safe_get(target, key[j]);
	if (found != null) break;
      }
      target = found;
    }
  }
  return target;
}

function upfunc(level, args) {
  if (! args) {
    args = arguments.callee.caller;
  }
  for (; level > 0; level--) {
    args = args.arguments.callee.caller;
  }
  return args;
}

