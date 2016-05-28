/// <reference path="../angular.js" />
/// <reference path="../../Content/angularui/ui-utils/mask.min.js" />
/// <reference path="../../Content/angular-calender/dist/calendar.js" />

angular.module('myAngularuiApp', ['ui.mask','ui.event'])
.controller('maskCtrl', function ($scope,$timeout) {
    $scope.person = {
        firstName: "yang",
        lastName:"lei"
    };
    $scope.mask = "(999) 999-9999 ext 99";

    $scope.getModel = function () {
        return JSON.stringify($scope.person, undefined, 2);
    };

    var colors = ["#CCC", "#F77", "#9F9"];
    var activeColor = 0;

    $scope.modelStatus = function () {
        return { backgroundColor:colors[activeColor]};
    };

    $scope.focusCallback = function () {
        activeColor = 1;
    };

    $scope.blurCallback = function () {
        activeColor = 2;
        $timeout(function () {
            activeColor = 0;
        }, 2000);
    }

    $scope.helpKeyDown = function ($event) {
        console.log($event);
        $scope.helpText = "Easy. Just enter your name.";
        $timeout(function () { $scope.helpText = "" }, 10000);
    };
})
.controller('calenderCtrl', function ($scope) {
    $scope.date = new Date;
})


.directive('calendar', function ($compile, $timeout, $filter, $locale) {
    return {
        restrict: 'EA',
        replace: false,
        scope: { selecteddate: '=', selecteddates: '=' },
        compile: function ($place, att) {
            var template =
                '<div class="panel panel-info">' +
                    '<div class="panel-heading">' +
                        '<div class="row">' +
                           '<div class="col-md-4"><span class="pull-left" ng-click="prevMonth()">prev</span></div>' +
                           '<div class="col-md-4"><span class="text-center">{{currentMonth.date | date:"MMMM"}}</span></div>' +
                           '<div class="col-md-4"><span class="pull-right" ng-click="nextMonth()">next</span></div>' +
                        '</div>' +
                     '</div>' +
                    '<div class="panel-body">' +
                        '<div class="row">' +
                            '<table class="table">' +
                               '<thead>' +
                                  '<tr class="info">' +
                                       '<td>{{weekdays[1]}}</td>' +
                                       '<td>{{weekdays[2]}}</td>' +
                                       '<td>{{weekdays[3]}}</td>' +
                                       '<td>{{weekdays[4]}}</td>' +
                                       '<td>{{weekdays[5]}}</td>' +
                                       '<td>{{weekdays[6]}}</td>' +
                                       '<td>{{weekdays[0]}}</td>' +
                                  '<tr>' +
                               '</thead>' +
                               '<tbody>' +
                                    '<tr ng-repeat="day in currentMonth.days" ng-class="{today: isToday(day), \'other-month\': !isCurrentMonth(day)}">' +
                                        '<td>{{day.getDate()}}</td>' +
                                    '<tr>' +
                               '</tbody>' +
                            '</table>' +
                        '</div>' +
                    '</div>' +
                    '<div class="body">' +
                        '<div class="months">' +
                            '<div class="days">' +
                                '<div class="day" ng-repeat="day in currentMonth.days"' +
                                '                 ng-class="{today: isToday(day), \'other-month\': !isCurrentMonth(day)}"' +
                                '                 aria-selected="{{isSelected(day)}}"' +
                                '                 ng-click="select(day)" title="{{day | date}}">' +
                                   '' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

            var link = function (scope, $element) {
                scope.selecteddate = scope.selecteddate || new Date;
                scope.weekdays = $locale.DATETIME_FORMATS.SHORTDAY;

                scope.currentMonth = {
                    date: scope.selecteddate.getMonthDate(),
                    days: []
                };

                scope.isToday = function (date) {
                    return (new Date).getDayDate().valueOf() == date.getDayDate().valueOf();
                }

                scope.isCurrentMonth = function (date) {
                    return scope.currentMonth.date.valueOf() == date.getMonthDate().valueOf();
                }

                scope.nextMonth = function () {
                    scope.changeMonth(1);
                };

                scope.prevMonth = function () {
                    scope.changeMonth(-1);
                };

                scope.isSelected = function (date) {
                    var datevalue = date.getDayDate().valueOf();
                    if (scope.selecteddates != null) {
                        return scope.selecteddates.indexOf(datevalue) != -1;
                    }

                    return scope.selecteddate.getDayDate().valueOf() == datevalue;
                };

                scope.changeMonth = function (diff) {
                    scope.currentMonth.date = scope.currentMonth.date.addMonths(diff).getMonthDate();

                }
                scope.select = function (date) {

                    scope.selecteddate = date;
                    scope.currentMonth.date = date.getMonthDate();

                    if (scope.popout != null) {
                        scope.popout.show = false;
                    }

                    if (scope.selecteddates == null) return;
                    var datevalue = date.getDayDate().valueOf();

                    if (scope.selecteddates.indexOf(datevalue) != -1) {
                        scope.selecteddates.remove(datevalue);
                    }
                    else {
                        scope.selecteddates.push(datevalue);
                    }
                };

                scope.$watch('selecteddate', function (date, oldDate) {
                    if (!Date.isValid(date)) {
                        if (Date.isValid(oldDate)) {
                            scope.selecteddate = oldDate;
                        }

                        return;
                    }
                });

                scope.$watch('currentMonth.date', function (newMonth, oldMonth) {
                    newMonth = newMonth.getMonthDate();
                    oldMonth = oldMonth.getMonthDate();
                    var monthsdiff = newMonth.valueOf() - oldMonth.valueOf();

                    if (monthsdiff == 0) return;

                    $element.removeClass('slidein-from-right slidein-from-left');
                    $timeout(function () {
                        if (monthsdiff > 0) {
                            $element.addClass('slidein-from-right');
                        }
                        else if (monthsdiff < 0) {
                            $element.addClass('slidein-from-left');
                        }
                    });

                    $timeout(function () {
                        generateMonth(newMonth);
                    }, 40); //timeout to keep in sync with animation (10% of duration)
                });

                var loadDays = function (monthDate) {
                    var firstday = monthDate.firstDayOfWeek();

                    if (firstday.getDate() == 1) {
                        firstday = firstday.addDays(-7);
                    }

                    return Array.range(0, 42, function (i) {
                        var day = firstday.addDays(i);
                        scope.currentMonth.days[i] = day;
                        return day;
                    });
                };

                var generateMonth = function (monthDate) {
                    loadDays(monthDate);
                };

                generateMonth(scope.currentMonth.date);
            };

            return function (scope, $element) {
                if ($element.get(0).nodeName == 'INPUT') {
                    scope.element = $element;
                    $compile('<popout input="element">' + template + '</popout>')(scope, function (clone) {
                        link(scope, clone);

                        scope.$watch('selecteddate', function (val) {
                            $element.val($filter('date')(val));
                        });

                        $element.change(function (val) {
                            var date = new Date($element.val())
                            scope.$apply(function () {
                                scope.selecteddate = date;
                            });
                        });

                        clone.insertAfter($element);
                    });
                }
                else {
                    $compile(template)(scope, function (clone) {
                        link(scope, clone);
                        clone.appendTo($element);
                    });
                }
            };
        }
    };
})
.directive('popout', function ($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: { input: '=' },
        link: function (scope, $element) {
            scope.show = false;
            scope.$parent.popout = scope;

            var pos = scope.input.offset();
            $element.offset({
                left: pos.left,
                top: pos.top + scope.input.innerHeight()
            });

            $(document).on('click', function (ev) {
                scope.$apply(function () {
                    if (scope.input.get(0) != ev.target && $element.has($(ev.target)).length == 0) {
                        scope.show = false;
                    }
                });
            });

            scope.input.focus(function () {
                scope.$apply(function () {
                    scope.show = true;
                });
            }).blur(function () {
                $timeout(function () {
                    if (document.activeElement != document.body && $element.has($(document.activeElement)).length == 0) {
                        scope.$apply(function () {
                            scope.show = false;
                        });
                    }
                });
            });

        },
        template:
            '<div class="popout transitioned" ng-class="{collapsedY: !show}" ng-transclude>' +
            '</div>'
    };
});




//util

function curryIdentity(fn) {
    return function () {
        var args = [].slice.call(arguments);
        args.splice(0, 0, this);
        return fn.apply(this, args);
    }
}

Date.prototype.addMonths = curryIdentity(Date.addMonths = function (date, months) {
    var d = new Date(date);
    d.setMonth(date.getMonth() + months);
    return d;
});

Date.prototype.addDays = curryIdentity(Date.addDays = function (date, days) {
    var d = new Date(date);
    d.setDate(date.getDate() + days);
    return d;
});

Date.prototype.firstDayOfMonth = curryIdentity(Date.firstDayOfMonth = function (date) {
    var d = new Date(date);
    d.setDate(1);
    return d;
});

Date.prototype.lastDayOfMonth = curryIdentity(Date.lastDayOfMonth = function (date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
});

Date.DAY_OF_MILLISECONDS = 86400000

Date.prototype.firstDayOfWeek = curryIdentity(Date.firstDayOfWeek = function (date) {
    return new Date(date.valueOf() - (date.getDay() <= 0 ? 7 - 1 : date.getDay() - 1) * Date.DAY_OF_MILLISECONDS);
});

Date.prototype.lastDayOfWeek = curryIdentity(Date.lastDayOfWeek = function (date) {
    return new Date(date.firstDayOfWeek().valueOf() + 6 * Date.DAY_OF_MILLISECONDS);
});

Date.prototype.getMonthDate = curryIdentity(Date.getMonthDate = function (date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
});

Date.prototype.getDayDate = curryIdentity(Date.getMonthDate = function (date) {

    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
});

Date.prototype.isValid = curryIdentity(Date.isValid = function (date) {
    return Object.prototype.toString.call(date) === '[object Date]' && isFinite(date);
});

Date.fromSqlFormat = function (str) {
    var exp = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/
    var m = exp.exec(str);
    return new Date(m[1], m[2], m[3], m[4], m[5], m[6]);
};

Array.range = function (min, max, selector) {
    selector = selector || function (x) { return x; };
    return Array(max - min).join().split(',').map(function (e, i) { return selector(min + i); });
}

Array.prototype.remove = curryIdentity(Array.remove = function (array, value) {
    var index = array.indexOf(value);
    if (index >= 0) {
        array.splice(index, 1);
    }
    return value;
});


Array.generate = function (fn) {
    var current = null, i = 0, result = [];
    fn(0, null);
    while ((current = fn(i, current)) !== false) {
        result[i] = current;
        i++;
    }

    return result;
}
