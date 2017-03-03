exports.html_finder = function(message) {
	var first = message.indexOf("<");
	var last = message.lastIndexOf(">") + 1;
	return message.substring(first, last);
};

exports.text_finder = function(message) {
	if (message.indexOf('<') != -1) { // condition is to weed out responses that don't have any html
		var first = message.lastIndexOf('>');
		var last = message.indexOf('<');
		if (message.slice(0, last) == '') {
			return message.slice(first);
		} else {
			return message.slice(0, last);
		}
	} else {
		return message; // no html!
	}
};