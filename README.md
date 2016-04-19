angular-scroll-watch
===================================

<br/>

## JS

Basic use

```js
    var app = angular.module('app', ['scrollWatch']);
    // ...
    app.controller('appCtrl', ['$scope', 'ScrollWatch', function ($scope, ScrollWatch) {
        var myWatch = new ScrollWatch();
            //default scrollElement is window
            //default scope is $rootScope

        // also define it by yourself
        var myWatch = new ScrollWatch('#scrollElement', $scope);
    };
```

- - -

#### Define watch point

###### addPoint (pointName, integer || callback, watchScrollBottom = false)
```js

myWatch.addPoint('myPoint', 500);

$scope.$$point.myPoint // find point in $$point , it will be boolean

```

* If third argument is `true`,then check point on scroll bottom

```js
    myWatch.addPoint('myBottomPoint', 500, true);
```

* Also use callback

```js
    myWatch.addPoint('myPoint', function (top, bottom) {
        return top > 500;
    });
```

- - -

#### Watch defined point

###### watchPoint (pointName, callback)
```js
    myWatch.watchPoint('topPoint', function (val) {
        console.log('watch topPoint status: ', val);
    });
```



## HTML

### Watch scroll top or bottom

* When scrollTop > 500px , hide element.
* When scrollBottom < 500px , show target element.

```html
    <body ng-app="app" ng-controller="appCtrl">
        ...
        <div ng-hide="$$scrollTop > 500" >hide me when scroll top over 500px</div>
        <div ng-show="$$scrollBottom > 500" >show me when scroll bottom over 500px</div>
        ...
    </body>
```

### Watch Element

* When scrollTop over myPoint1 element, $$point.myPoint1 = true.
* When scrollBottom over myPoint2 element, $$point.myPoint2 = true.

```html
    <body ng-app="app" ng-controller="appCtrl">
        ...
        <div scroll-point="myPoint1" ng-class="{top_over_me: $$point.myPoint1}"></div>
        <div scroll-point="myPoint2" bottom ng-class="{bottom_over_me: $$point.myPoint2}"></div>
        ...
    </body>
```

