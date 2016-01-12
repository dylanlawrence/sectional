angular.module('app.config', [])
.constant('version', "0.0.1")
.constant('ENV', {"couchDB":"http://192.168.0.21:5984/","drupalDB":"http://admin:unsafe@aqua.local:80/relaxed/","api":"http://localhost/"});
