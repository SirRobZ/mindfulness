+function(global){

  var mf = {
    module: module
  };

  function module(name, object){
    mf[key] = object;
  }

  global.mf = mf;

}(window);
