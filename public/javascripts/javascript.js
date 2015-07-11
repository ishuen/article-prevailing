 
  var accToken;
  var userID;

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState(event_type) {
    FB.getLoginStatus(function(response) {
      //console.log(JSON.stringify(response));
      //statusChangeCallback(response);
      if (response.status === 'connected') {
      userID = response.authResponse.userID;
      testAPI(userID);
    } else if (response.status === 'not_authorized') {
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
        Login();
    } else if(response.status == 'unknown'){
      document.getElementById('status').innerHTML = 'Please log into Facebook.';
    }
    });
  }
  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  // This is called with the results from from FB.getLoginStatus().
/*  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(JSON.stringify(response));
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      userID = response.authResponse.userID;
      accToken = response.authResponse.accessToken;
      console.log('userID:'+userID);
      console.log('accessToken:'+accToken);
      testAPI(userID);
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
        Login();
    } else if(response.status == 'unknown'){
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      var logoutTime = new Date().getTime();
      console.log('logout...'+logoutTime);
      document.getElementById('status').innerHTML = 'Please log into Facebook.';
      //Logout();
    }
  }*/

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI(userID) {
    console.log('Welcome!  Fetching your information.... ');
    /*var loginTime = new Date().getTime();
    console.log('login...'+loginTime);
    console.log('userID:'+userID);*/
    FB.api('/me', {fields:'public_profile, user_friends'}, function(response) {
      console.log(JSON.stringify(response));
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }
 
  function Login(){
    FB.login(function(response){
    // Handle the response object, like in statusChangeCallback() in our demo
    // code.
  },{scope:'public_profile, user_friends'});
  }

  /*function Logout(){
    var logoutTime = new Date().getTime();
    console.log('logout...'+logoutTime);
    FB.logout(function(){document.location.reload();});
  }*/
 
  // Load the SDK asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "http://connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));
