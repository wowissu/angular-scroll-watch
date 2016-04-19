angular-scroll-watch
===================================

### watch scroll top or bottom

* when scrollTop > 500px , hide element.
* when scrollBottom < 500px , show target element.

```html
    <body ng-app="app" ng-controller="appCtrl">
        ...
        <div ng-hide="$$scrollTop > 500" >hide me when scroll top over 500px</div>
        <div ng-show="$$scrollBottom > 500" >show me when scroll bottom over 500px</div>
        ...
    </body>
```

### watch element

* when scrollTop over myPoint1 element, $$point.myPoint1 = true.
* when scrollBottom over myPoint2 element, $$point.myPoint2 = true.

```html
    <body ng-app="app" ng-controller="appCtrl">
        ...
        <div scroll-point="myPoint1" ng-class="{top_over_me: $$point.myPoint1}"></div>
        <div scroll-point="myPoint2" bottom ng-class="{bottom_over_me: $$point.myPoint2}"></div>
        ...
    </body>
```

<br/>

## JS

基本使用

```js
    var app = angular.module('app', ['scrollWatch']);
    // ...
    app.controller('appCtrl', ['$scope', 'ScrollWatch', function ($scope, ScrollWatch) {
        var myWatch = new ScrollWatch(window, $scope);
    };
```

- - -

#### 新增檢查點

###### addPoint (pointName, integer || callback, watchScrollBottom = false)
```js

myWatch.addPoint('myPoint', 500);

$scope.$$point.myPoint // 在 $$point 中可以找到定義好的 point，他會是一個布林值

```

* 第三個參數帶 true，就可以檢查 scroll bottom

```js
    myWatch.addPoint('myBottomPoint', 500, true);
```

* 也可以用 callback 自己檢查

```js
    myWatch.addPoint('myBottomPoint', function (top, bottom) {
        return top > 500;
    });
```

- - -

#### 監控檢查點

###### watchPoint (pointName, callback)
```js
    myWatch.watchPoint('topPoint', function (val) {
        console.log('watch topPoint status: ', val);
    });
```

