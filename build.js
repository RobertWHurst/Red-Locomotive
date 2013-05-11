//==============================================
// CONFIG
//----------------------------------------------

var input = './src/red-locomotive.js'
var output = './red-locomotive.js'
var opts = {
    debug: true
}

//===============================================

var browserify = require('browserify')
var watch = require('node-watch')
var fs = require('fs')

var throwErrors = true
var handleErr = function(err) {
    if(!err) return
    if(!throwErrors) throw err
    console.log(err)
}
var writeFileCallback = function(err) {
    if(err) handleErr(err)
    console.log('red-locomotive sucessfully built')
}
var bundleCallback = function(err, src) {
    if(err) handleErr(err)
    fs.writeFile(output, src, writeFileCallback)
}
var build = function() {
    var parser = browserify(input)
    parser.ignore('./node_modules/canvas');
    parser.bundle(opts, bundleCallback)
}

module.exports = function(flags) {
    flags = flags || {}
    if(flags.watch) {
        throwErrors = false
        console.log('watching src directory for changes...')
        watch('./src', build)
    }
    build()
}

