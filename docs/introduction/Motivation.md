# Motivation

Most of the NodeJS based projects contain some kind if project configuration, pretty much all of them contain logic that is repeated all over the place, e.g.

* Validation of environment variable
* Setting fallback values of environment variables
* Configuration overrides based upon the value of the `NODE_ENV` environment variable
* Keeping a consistent structure which you can count on
* Path declarations
* ... and more

Since repeating this setup code all of the time is tedious and often not that well readable for an newcomer, we made it our goal to create a package that solves all of these cases in one single place.
