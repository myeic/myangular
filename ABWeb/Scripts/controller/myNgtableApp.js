/// <reference path="../angular-resource.js" />
/// <reference path="../angular.js" />
/// <reference path="../../Content/angular-ngtable/dist/ng-table.js" />

angular.module('myNgtableApp', ['ngTable', 'ngResource', 'ngSanitize','ui.bootstrap'])

.constant('DataService',{
    datalist:  [{ name: "Moroni", age: 50, money: 55,country:'China' },
                { name: "Simon", age: 43, money: 50, country: 'English' },
                { name: "Jacob", age: 27, money: 25, country: 'American' },
                { name: "Nephi", age: 29, money: 53, country: 'German' },
                { name: "Christian", age: 34, money: 35, country: 'China' },
                { name: "Tiancum", age: 43, money: 52, country: 'Geran' },
                { name: "Jacob", age: 27, money: 52, country: 'Jappan' }
    ],
    countries: [{ id: 1, title: "China", name: 'China' },
                { id: 2, title: "English", name: 'English' },
                { id: 3, title: "American", name: 'American' },
                { id: 4, title: "German", name: 'German' },
                { id: 5, title: "Jappan", name: 'Jappan' }]
})

.factory('myDataService', ['$resource', function ($resource) {
   return $resource("api/TblApi", {}, {
          query: {
                method: "GET", isArray: true,
          },
    });
}])

.run(function configureDefaults(ngTableDefaults) {
    ngTableDefaults.params.count = 5;
    ngTableDefaults.settings.counts = [5, 10, 25];
})

.controller('clockCtrl', function ($scope) {
    var updateLock = function () {
        $scope.clock = new Date();
    };
    var timer = setInterval(function () {
        $scope.$apply(updateLock);
    }, 1000);
    updateLock();
})
.controller('introController', function ($scope, DataService, NgTableParams) {
    //$scope.tableParams = new NgTableParams({ count: 5 }, { counts: [5, 10, 25], dataset: data });
    $scope.tableParams = new NgTableParams({}, { dataset: DataService.datalist });
})
.controller('lasyLoadingCtrl', function ($scope,DataService,NgTableParams) {
    var tbl = {
        datasets: ['1', '2'],
        dataset1: DataService.datalist,
        tableParams: new NgTableParams()
    };

    tbl.changeDs = changeDs;
    tbl.dataset2 = createDs2();

    function changeDs() {
        tbl.tableParams.settings({
            dataset: tbl["dataset" + tbl.dataset]
        });
    }

    function createDs2() {
        return DataService.datalist.map(function (item) {
            return angular.extend({}, item, {
                age: item.age + 100
            });
        });
    }
    $scope.tbl = tbl;
})

.controller('loadFromServerCtrl', function ($scope, myDataService, NgTableParams) {

    //本地分页的效果
    $scope.initTableSimple = function () {
        $scope.tableParams = new NgTableParams({}, {
            dataset: $scope.tableData
        });
    };
    myDataService.query().$promise.then(function (data) {
        $scope.tableData = data;
        $scope.initTableSimple();
    });
    //这个是服务端分页的效果
    //$scope.tableParams = new NgTableParams({}, {
    //    getData: function ($defer,params) {
    //       //return myDataService.query(function (datas) {
    //       //     params.total(datas.length);
    //       //     return  $defer.resolve(datas);
    //       //  });

    //        return myDataService.query().$promise.then(function (result) {
    //            params.total(99);
    //            return result;
    //        });
    //   }
    //});
})

.controller('basePanginationCtrl', function ($scope, DataService, NgTableParams) {
  
    $scope.defaultConfigTableParams = new NgTableParams({}, { dataset: DataService.datalist });

    $scope.customConfigParams = createUsingFullOptions();

    function createUsingFullOptions() {
        var initialParams = {
            count: 5 // initial page size
        };
        var initialSettings = {
            // page size buttons (right set of buttons in demo)
            counts: [],
            // determines the pager buttons (left set of buttons in demo)
            paginationMaxBlocks: 13,
            paginationMinBlocks: 2,
            dataset: DataService.datalist
        };
        return new NgTableParams(initialParams, initialSettings);
    }
})

.controller('changePageCtrl', function ($scope,DataService, NgTableParams) {

    $scope.tableParams = new NgTableParams({ count: 5 }, { counts: [5, 10, 20], dataset: DataService.datalist });

    $scope.selectedPageSizes = $scope.tableParams.settings().counts;

    $scope.availablePageSizes = [5, 10, 15, 20, 25, 30, 40, 50, 100];

    $scope.changePage = function (nextPage) {
        $scope.tableParams.page(nextPage);
    };

    $scope.changePageSize = function (newPageSize) {
        $scope.tableParams.count(newPageSize);
    };
    $scope.changePageSizes = function (newSizes)
    {
        if (newSizes.indexOf($scope.tableParams.count()) === -1) {
            newSizes.push($scope.tableParams.count());
            newSizes.sort();
        }
        $scope.tableParams.settings({ counts: newSizes });
    }
})

.controller('baseSortingCtrl', function ($scope, DataService, NgTableParams) {
    $scope.tableParams = new NgTableParams({
        // initial sort order
        sorting: { name: "asc" }
         }, {
            dataset:DataService.datalist
         });
})

.controller('baseDynamicSortingCtrl', function ($scope, DataService, NgTableParams) {

    $scope.cols = [
      { field: "name", title: "Name", sortable: "name", show: true },
      { field: "age", title: "Age", sortable: "age", show: true },
      { field: "money", title: "Money", show: true }
    ];
    $scope.tableParams = new NgTableParams({
        // initial sort order
        sorting: { age: "desc" }
    }, {
        dataset: DataService.datalist
    });
})

.controller('changeSortOrderCtrl', function ($scope, DataService, NgTableParams) {
    $scope.cols = [
      { field: "name", title: "Name", sortable: "name", sortDirection: "desc" },
      { field: "age", title: "Age", sortable: "age", sortDirection: "desc" },
      { field: "money", title: "Money", sortable: false, sortDirection: "asc" }
    ];

    $scope.sortables = _.indexBy($scope.cols, "field");

    $scope.tableParams = new NgTableParams({ sorting: { name: "asc" } }, {
        dataset: DataService.datalist
    });

    $scope.applySelectedSort = applySelectedSort;

    function applySelectedSort() {

        $scope.tableParams.sorting($scope.newSort, $scope.isSortDesc ? 'desc' : 'asc');
        $scope.newSort = "";
        $scope.newSortForm.$setPristine();
    }
})

.controller('enableSortingCtrl', function (DataService, NgTableParams) {
    var self = this;
    self.tableParams = new NgTableParams({
        // initial sort order
        sorting: { name: "asc" }
    }, {
        dataset: DataService.datalist
    });
    self.toggleSortability = toggleSortability;

    ////////

    function toggleSortability($column) {
        if ($column.sortable()) {
            $column.sortField = $column.sortable();
            $column.sortable.assign(self, false);
        } else {
            $column.sortable.assign(self, $column.sortField);
        }
    }
})
.controller('enableSortingDynamicSortingCtrl', function (DataService, NgTableParams) {
    var self = this;

    self.cols = [
      { field: "name", title: "Name", sortable: "name", show: true },
      { field: "age", title: "Age", sortable: "age", show: true },
      { field: "money", title: "Money", sortable: "money", show: true }
    ];
    self.tableParams = new NgTableParams({
        // initial sort order
        sorting: { age: "desc" }
    }, {
        dataset: DataService.datalist
    });
    self.toggleSortability = toggleSortability;

    ////////////

    function toggleSortability(col) {
        if (col.sortable === col.field) {
            col.sortable = false;
        } else {
            col.sortable = col.field;
        }
    }
})

.controller('baseFilterCtrl', function (DataService, NgTableParams) {
    this.countries = DataService.countries;
    this.tableParams = new NgTableParams({
        // initial filter
        filter: { name: "T" }
    }, {
        dataset: DataService.datalist
    });
})