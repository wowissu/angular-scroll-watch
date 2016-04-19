/**
    Version: 1.0.0
    Author: adam su
 */

(function () {

    "use strict";

    var app = angular.module('scrollWatch', []);

    app.factory('ScrollWatch', ['$rootScope', function ($rootScope) {

        var doc = document.documentElement;

        var ScrollWatch = function (target, $useScope) {
            this.funcPointer = {};
            this.topPinter = {};
            this.bottomPointer = {};
            this.target = $(target);

            this.scope = $useScope || $rootScope;
            this.scope.ScrollWatch = this;
            this.scope.$$point = {};

            var scope = this.scope;
            var target = this.target;
            var self = this;

            if (target[0] === window) {
                target.on('scroll', function () {
                    self.updatePoint(
                        (this.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
                        scope.$$scrollTop + this.innerHeight
                    );

                });
            } else {
                target.on('scroll', function () {
                    self.updatePoint(
                        this.scrollTop || target.scrollTop(),
                        scope.$$scrollTop + (this.offsetHeight || this.clientHeight)
                    );
                });
            }
        };

        ScrollWatch.prototype.watchPoint = function (point, callback) {
            this.scope.$watch('$$point.' + point, callback);
            return this;
        };

        ScrollWatch.prototype.updatePoint = function (scrollTop, scrollBottom) {

            var scope = this.scope;

            scope.$$scrollTop    = scrollTop;
            scope.$$scrollBottom = scrollBottom;

            for(name in this.topPinter) {
                scope.$$point[name] = scrollTop > this.topPinter[name];
            }
            for(name in this.bottomPointer) {
                scope.$$point[name] = scrollBottom >= this.bottomPointer[name];
            }
            for(name in this.funcPointer) {
                scope.$$point[name] = !!this.funcPointer[name](scrollTop, scrollBottom);
            }
            scope.$applyAsync();
            return this;
        };

        ScrollWatch.prototype.addPoint = function (name, point, bottom) {
            if (typeof point === 'function') {
                this.funcPointer[name] = point;
            } else if (bottom) {
                this.bottomPointer[name] = point;
            } else {
                this.topPinter[name] = point;
            }
            this.scope.$$point[name] = false;
            return this;
        };

        return ScrollWatch;
    }]);

    app.directive('scrollPoint', ['$timeout', function ($timeout) {
        var getPos = function (el) {
            for (var lx = 0, ly = 0;el != null;lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
            return {left: lx, top: ly};
        };
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                $timeout(function () {
                    if (!$attrs.scrollPoint) {
                        console.error('require point name.');
                        return;
                    }
                    if (!$scope.ScrollWatch) {
                        console.error('undefined ScrollWatch object.');
                        return;
                    }
                    if ('bottom' in $attrs) {
                        $scope.ScrollWatch.addPoint($attrs.scrollPoint, function (scrollTop, scrollBottom) {
                            return scrollBottom > getPos($element[0]).top;
                        });
                    } else {
                        $scope.ScrollWatch.addPoint($attrs.scrollPoint, function (scrollTop) {
                            return scrollTop > getPos($element[0]).top;
                        });
                    }
                });
            }
        };
    }]);

}());
