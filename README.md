sectional
---------

Angular and PouchDB to replicate to Drupal 8 Relaxed endpoints



### Installation
It's a generator project based on generator-gulp-angular

This should install it
```sh
$ npm install -g gulp bower
$ npm install
$ bower install
```

### Config

To configure angular constants ENV specific etc, 
we take some *json* and convert it to a module that is injected into the app.

Just adjust and change the 
**src/config/angular-config.example** 
 to
**src/config/angular-config.json**


### Run

```sh
$ gulp serve
```