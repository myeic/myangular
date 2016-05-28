/// <reference path="../../Content/ztree/js/jquery.ztree.all.min.js" />
/// <reference path="../angular.js" />
 
angular.module("directiveApp", [])
    .directive("unorderList", function () {
        return function (scope, element, attrs) {
            var datas = scope[attrs["unorderList"]];//从作用域中获取数据
            var propertyExpression = attrs['listProperty'];

            if (angular.isArray(datas))
            {
                var listElem = angular.element("<ul>");
                element.append(listElem);
                for (var i = 0; i < datas.length; i++)
                {
                    //立即调用的函数表达式（IIFE），又称自执行函数
                    (function(){
                        var itemElement = angular.element('<li>');
                        listElem.append(itemElement);
                        var index = i;
                        //公式计算表达式
                        var watchFn = function (watchScope) {
                            return watchScope.$eval(propertyExpression, datas[index]);
                        };
                        //监听值的变化
                        scope.$watch(watchFn, function (newValue, oldValue) {
                            itemElement.text(newValue);
                        });
                    })();
                }
            }
        };
    })
    .directive("demoDirective", function () {
        return function (scope, element, attrs) {
            var listElem = angular.element("<ol>");
            element.append(listElem);
            for (var i = 0; i < scope.names.length; i++)
            {
                listElem.append(angular.element("<li>").append(angular.element("<span>").text(scope.names[i])));
            }
            var buttons = element.find("button");
            buttons.on("click", function (e) {
                element.find("li").toggleClass("bold");
            });
        }
    })
    .directive("ylTree", function () {
        return {
            restrict:'A',
            require: '?ngModel',
            scope: {
                isload:'=',
                treeSetting: '=',
                treeDataset:'=',
            },
            link: function (scope, element, attrs, ngModel) {

                function zTreeOnClick(event, treeId, treeNode) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(treeNode);
                    });
                };

                var defaultSetting = {
                    callback: {
                        onClick: zTreeOnClick
                    }
                };

                var setting = null;
                if (angular.isUndefined(scope.treeSetting)) {
                    setting = defaultSetting;
                }
                else {
                    setting = scope.treeSetting;
                }


                scope.loadTree = function () {
                    var id = '#' + element.context.id;
                    var zNodes = scope.treeDataset;
                    var zTreeObj = $.fn.zTree.init($(id), setting, zNodes);
                };

                if (scope.isload)
                {
                    scope.loadTree();
                }
            },
        }
    })
    .directive('simpleRepeater', function () {
        return {
            scope: {
                data: '=source',
                properName: '@itemName'

            },
            transclude: 'element',
            compile: function (element, attrs, transcludeFn)
            {
                return function ($scope, $element, $attr)
                {
                    $scope.$watch('data.length', function () {
                        var parent = $element.parent();
                        parent.children().remove();
                        for (var i = 0; i < $scope.data.length; i++)
                        {
                            var childScope = $scope.$new();
                            childScope[$scope.properName] = $scope.data[i];
                            transcludeFn(childScope, function (clone) {
                                parent.append(clone);
                            });
                        }
                    });
                }
            },
        };
    })
    .directive('triButton', function () {
        return {
            restrict: 'AE',
            replace: true,
            require: 'ngModel',
            template: document.querySelector('#triTemplate').outerText,
            link: function (scope, element, attrs, ctrl) {

                ctrl.$formatters.push(function (value) {
                    return value == "Huh?" ? "Not Sure" : value;
                });

                element.on('click', function (event) {
                    setSelected(event.target.innerText);
                    scope.$apply(function () {
                        ctrl.$setViewValue(event.target.innerText);
                    });
                });

                var setSelected = function (value) {
                    var buttons = element.find('button');
                    buttons.removeClass('btn-primary');
                    for (var i = 0; i < buttons.length; i++) {
                        var btn = buttons.eq(i);
                        if (btn.text() == value) {
                            btn.addClass('btn-primary');
                        }
                    }
                };

                //setSelected(scope.dataValue);

                ctrl.$render = function () {
                    setSelected(ctrl.$viewValue || "Not Sure");
                };
            }
        };
    })


    .controller("defaultCtrl", function ($scope) {
        //$scope.dataValue = "No";


               $scope.products = [
                   { name: "Apples", category: "Fruit", price: 1.20, expiry: 10 },
                   { name: "Bananas", category: "Fruit", price: 2.42, expiry: 7 },
                   { name: "Pears", category: "Fruit", price: 2.02, expiry: 6 }
               ];
               $scope.incrementPrices = function () {
                   for (var i = 0; i < $scope.products.length; i++) {
                       $scope.products[i].price++;
                   }
               };
               $scope.names = ["Apples", "Bananas", "Oranges"];


               
               var zNodes = [
             {
                 name: "test1", open: true, children: [
                   { name: "test1_1" }, { name: "test1_2" }]
             },
             {
                 name: "test2", open: true, children: [
                   { name: "test2_1" }, { name: "test2_2" }]
             }
               ];

               $scope.treeDataset = zNodes;

               $scope.isload = false;

               $scope.addNode = function () {
                   var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                   var newNode = { name: "newNode1" };
                   newNode = treeObj.addNodes($scope.treeNode, newNode);
               };
               $scope.editNode = function () {
                   var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                   treeObj.editName($scope.treeNode);
               };
               $scope.removeNode = function () {
                   var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                   treeObj.removeNode($scope.treeNode);
               };
               $scope.updateNode = function () {
                   var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                   $scope.treeNode.name = "123";
                   treeObj.updateNode($scope.treeNode);
               };
    });









