function Task(src) {

  // wrap the source so it can be evaluated as
  // a worker
  src = this._wrapSrc(src);

  this.legacyMode = ( 
    typeof Worker == 'undefined' ||
    typeof Blob == 'undefined' ||
    typeof URL == 'undefined'
  );


  if(this.legacyMode) {

    // create a function to execute the worker
    // source
    var fn = new Function(
      'data',
      'postMessage',
      'self = { postMessage: postMessage }; ' + src + ' self.onmessage({data: data});'
    );

    // create fake worker
    this._worker = {
      postMessage: function(data) {
        var _this = this;
        fn(data, function(data) {
          _this.onmessage({ data: data });
        });
      },
      onmessage: function() {}
    };

  } else {

    //create a worker
    var blob = new Blob([src], { type: 'application/javascript' });
    var workerUrl = URL.createObjectURL(blob);
    this._worker = new Worker(workerUrl);
  }
}

Task.prototype.send = function(data, callback) {
  if(callback != undefined) {
    this._worker.onmessage = function(e) {
      callback(undefined, e.data);
    };
    this._worker.onerror = function(e) {
      callback(new Error(e.message));
    };
  }
  this._worker.postMessage(data);
};

Task.prototype._wrapSrc = function(src) {
  return 'self.onmessage = function(e) { self.postMessage((' + src + ')(e.data)); };';
}