+function(){
  var token = localStorage.getItem('x-auth');
  if(!token){
    location.assign('/');
  }
}();
