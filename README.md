# angular-scroll-point

angular scroll watch


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

## JS

```js
    var app = angular.module('app', ['scrollPoint']);
    // ...
    app.controller('appCtrl', ['$scope', 'ScrollPoint', function ($scope, ScrollPoint) {
        var scrollpoint = new ScrollPoint(window, $scope);
    };
```

###### addPoint (pointName, integer || callback, watchScrollBottom = false)

新增一個檢查點

```js
    scrollpoint.addPoint('myPoint', 500);
```

在 $scope.$$point 中可以找到你的 point，他會是 true 或 false
第三個參數帶 true，就可以檢查 scroll bottom

```js
    scrollpoint.addPoint('myBottomPoint', 500, true);
```

也可以用 callback 自己檢查


```js
    scrollpoint.addPoint('myBottomPoint', function (top, bottom) {
        return top > 500;
    });
```

###### watchPoint (pointName, callback)

監控某個點的變化

```js
    scrollpoint.watchPoint('topPoint', function (val) {
        console.log('watch topPoint status: ', val);
    });
```

