 
  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    console.log(response.authResponse);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      console.log('check login');
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else if(response.status == 'unknown'){
      Logout();//
    }
    else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState(event_type) {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  };
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

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    var loginTime = new Date().getTime();
    console.log(loginTime);
    FB.api('/me', function(response) {
      if(!response)
      console.log('null response');
    else{
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    } 
    });
  }
    /*FB.Event.subscribe('auth.authResponseChange', function(response) 
    {
     if (response.status === 'connected') 
    {
        document.getElementById("message").innerHTML +=  "<br>Connected to Facebook";
        //SUCCESS
 
    }    
    else if (response.status === 'not_authorized') 
    {
        document.getElementById("message").innerHTML +=  "<br>Failed to Connect";
 
        //FAILED
    } else 
    {
        document.getElementById("message").innerHTML +=  "<br>Logged Out";
 
        //UNKNOWN ERROR
    }
    }); */
 
    function Login()
    {
        console.log('func Login()');
        FB.login(function(response) {
           if (response.authResponse) 
           {
              FB.api('/me', function(response) {

              var str="<b>Name</b> : "+response.name+"<br>";
              console.log('name'+response.name);
              str +="<b>Link: </b>"+response.link+"<br>";
              str +="<b>Username:</b> "+response.username+"<br>";
              console.log('Username: '+response.username);
              str +="<b>id: </b>"+response.id+"<br>";
              console.log('Id: '+response.id);
              str +="<input type='button' value='Get Photo' onclick='getPhoto();'/>";
              str +="<input type='button' value='Logout' onclick='Logout();'/>";
              document.getElementById("status").innerHTML=str; 
              });
            } else 
            {
             console.log('User cancelled login or did not fully authorize.');
            }
         },{scope: 'public_profile, user_friends'});
 
    } 
    function getPhoto()
    {
      FB.api('/me/picture?type=normal', function(response) {
 
          var str="<br/><b>Pic</b> : <img src='"+response.data.url+"'/>";
          document.getElementById("status").innerHTML+=str;
 
    });
 
    }
    function Logout()
    {
      console.log('logout...');
        FB.logout(function(){document.location.reload();});
    }
 
  // Load the SDK asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));
