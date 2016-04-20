/**
    Version: 1.0.1
    Author: wowissu
    Angular: 1.4.*
    github: https://github.com/wowissu/angular-scroll-watch
 */
/*global arguments, window, $, angular */
/*jslint this:true */
/*property
    $$point, $$scrollBottom, $$scrollTop, $applyAsync, $watch, ScrollWatch,
    addPoint, bottomPointer, clientHeight, clientTop, directive,
    documentElement, factory, funcPointer, innerHeight, module, offsetHeight,
    on, pageYOffset, prototype, scope, scrollTop, target, topPinter,
    updatePoint, watchPoint, forEach, restrict, link, scrollPoint, error,
    hasOwnProperty, offsetLeft, offsetTop, offsetParent, left, top, bottom
*/

(function () {
    "use strict";

    var app = angular.module('scrollWatch', []);

    app.factory('ScrollWatch', ['$rootScope', function ($rootScope) {

        var doc = document.documentElement;

        var ScrollWatch = function (target, $useScope) {

            var self = this;

            self.funcPointer = {};
            self.topPinter = {};
            self.bottomPointer = {};
            self.target = $(target);

            self.scope = $useScope || $rootScope;
            self.scope.ScrollWatch = self;
            self.scope.$$point = {};

            var scope = self.scope;


            if (self.target[0] === window) {
                self.target.on('scroll', function () {
                    self.updatePoint(
                        (this.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
                        scope.$$scrollTop + this.innerHeight
                    );
                });
            } else {
                self.target.on('scroll', function () {
                    self.updatePoint(
                        this.scrollTop || self.target.scrollTop(),
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

            scope.$$scrollDown = scrollTop > scope.$$scrollTop;
            scope.$$scrollUp = !scope.$$scrollDown;
            scope.$$scrollTop = scrollTop;
            scope.$$scrollBottom = scrollBottom;

            angular.forEach(this.topPinter, function (point, name) {
                scope.$$point[name] = scrollTop > point;
            });
            angular.forEach(this.bottomPointer, function (point, name) {
                scope.$$point[name] = scrollBottom >= point;
            });
            angular.forEach(this.funcPointer, function (point, name) {
                scope.$$point[name] = !!point({
                    top: scrollTop,
                    bottom: scrollBottom
                });
            });
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
            var lx = 0;
            var ly = 0;
            while (el !== null) {
                lx += el.offsetLeft;
                ly += el.offsetTop;
                el = el.offsetParent;
            }
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
                    if ($attrs.hasOwnProperty('bottom')) {
                        $scope.ScrollWatch.addPoint($attrs.scrollPoint, function (scroll) {
                            return scroll.bottom > getPos($element[0]).top;
                        });
                    } else {
                        $scope.ScrollWatch.addPoint($attrs.scrollPoint, function (scroll) {
                            return scroll.top > getPos($element[0]).top;
                        });
                    }
                });
            }
        };
    }]);

}());
