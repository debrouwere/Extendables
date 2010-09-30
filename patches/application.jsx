/**
 * @desc Check the host app.
 * @param {String} application The application name. Case-insensitive. Prefixing 
 * @param {String|Number} [version] The application version number. Add two to your CS version number.
 *
 * @example
 *     alert(app.is('indesign'));       // any version
 *     alert(app.is('indesign', 4);     // Creative Suite 2
 *     alert(app.is('indesign', '6.0'); // Creative Suite 4.0
 */

Application.prototype.is = function (application, version) {
	var version = version || this.version;
	var is_app = this.name.to('lower').contains(application.to('lower'));
	var is_version = this.version.toString().startswith(version);
	return is_app && is_version;
}