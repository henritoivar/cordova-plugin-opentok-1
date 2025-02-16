#!/usr/bin/env node

module.exports = function (context) {
    var IosSDKVersion = "OpenTok-iOS-2.19.0";
    var downloadFile = require('./downloadFile.js'),
        exec = require('./exec/exec.js'),
        Q = require('q'),
        deferral = new Q.defer();
    console.log('Downloading OpenTok iOS SDK');
    downloadFile('https://s3.amazonaws.com/artifact.tokbox.com/rel/ios-sdk/' + IosSDKVersion + '.tar.bz2',
        './' + IosSDKVersion + '.tar.bz2', function (err) {
            if (!err) {
                console.log('downloaded');
                exec('tar -zxvf ./' + IosSDKVersion + '.tar.bz2', function (err, out, code) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('expanded');
                    var frameworkDir = context.opts.plugin.dir + '/src/ios/';
                    var unzippedDir = 'OpenTok-iOS';
                    exec('mv ./' + unzippedDir + '/OpenTok.framework ' + frameworkDir, function (err, out, code) {
                        if (err) {
                            console.log(err);
                        }
                        console.log('moved OpenTok.framework into ' + frameworkDir);
                        exec('rm -r ./' + unzippedDir, function (err, out, code) {
                            if (err) {
                                console.log(err);
                            }
                            console.log('Removed extracted dir');
                            exec('rm ./' + IosSDKVersion + '.tar.bz2', function (err, out, code) {
                                console.log('Removed downloaded SDK');
                                deferral.resolve();
                            });
                        });
                    });
                });
            }
        });
    return deferral.promise;
};
