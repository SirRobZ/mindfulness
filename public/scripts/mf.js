+function(global){

  var mf = {
    module: module
  };

  function module(name, object){
    mf[name] = object;
  }

  global.mf = mf;

}(window);
