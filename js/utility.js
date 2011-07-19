function ucfirst( str ) {	// Make a string&#039;s first character uppercase
	// 
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)

	var f = str.charAt(0).toUpperCase();
	return f + str.substr(1, str.length-1);
}
