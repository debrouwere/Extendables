// pre-Extendables code
// - needs a big cleanup
// - needs to become generic rather than Drupal-bound
// - should comprise both an auth part, and a UI part

/*
	> http://en.wikipedia.org/wiki/Basic_access_authentication#Example
	> http://en.wikipedia.org/wiki/Digest_access_authentication#Example_with_explanation	
*/

function login_drupal() {
var cancellation = false;
var response = "";

/* LOGINFUNCTIONALITEIT */
var myDialog = new Window('dialog', 'Authentication with Drupal', null, {orientation: 'column'});
var myLogin = myDialog.add('group', null, null, {orientation: 'row'});
var mySubmit = myDialog.add('group', null, null, {orientation: 'row', alignment: 'right'});
	
myLogin.userLabel = myLogin.add('statictext', undefined, 'Username');
myLogin.userField = myLogin.add('edittext', undefined, '');
	myLogin.userField.characters = 20;
myLogin.passLabel = myLogin.add('statictext', undefined, 'Password');
myLogin.passField = myLogin.add('edittext', undefined, '', {noecho: true});
	myLogin.passField.characters = 20;

mySubmit.status = mySubmit.add('statictext', [undefined, undefined, 250, 20], '');
mySubmit.submit = mySubmit.add('button', undefined, 'Authenticate');
mySubmit.cancel = mySubmit.add('button', undefined, 'Cancel');

mySubmit.submit.onClick = function() {
  // Als gesubmit wordt
  dialogUsername = myLogin.userField.text;
  dialogPassword = myLogin.passField.text;
  response = dropbox(dialogUsername, dialogPassword, "");
  this.parent.parent.close(1);
}

mySubmit.cancel.onClick = function() {
  this.parent.parent.close(1);
  cancellation = true;
}

// see if we haven't already entered our username & pass
response = dropbox(dialogUsername, dialogPassword, "");

while (response != "T" && cancellation == false) {
		// TODO: onderscheid kunnen maken tussen rejectie en gefaalde connectie
		myDialog.show();
		if (response == "F") {
		mySubmit.status.text = "Authentication failed. Please try again.";
		} else {
			mySubmit.status.text = "Can't connect to the Drupal server.";
			}
}

return response;
} // f:login_drupal