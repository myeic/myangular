/// <reference path="../angular.js" />
/// <reference path="../../Content/angular-xeditable/dist/js/xeditable.js" />
angular.module('myXeditableApp', ["xeditable", 'ui.bootstrap', 'checklist-model'])
.run(
function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}
)
.controller('TextSimpleCtrl', function ($scope) {
    $scope.user = {
        name: 'awesome user'
    };
})
.controller('SelectLocalCtrl', function ($scope, $filter) {
    $scope.user = {
        status: 2
    };

    $scope.statuses = [
      { value: 1, text: 'status1' },
      { value: 2, text: 'status2' },
      { value: 3, text: 'status3' },
      { value: 4, text: 'status4' }
    ];

    $scope.showStatus = function () {
        var selected = $filter('filter')($scope.statuses, { value: $scope.user.status });
        return ($scope.user.status && selected.length) ? selected[0].text : 'Not set';
    };
})
.controller('SelectRemoteCtrl', function ($scope, $filter, $http) {
    $scope.user = {
        group: 4,
        groupName: 'admin' // original value
    };

    $scope.groups = [];

    $scope.loadGroups = function () {
        return $scope.groups.length ? null : $http.get('XEditable/GetGroup').success(function (data) {
            $scope.groups = data;
        });
    };

    $scope.$watch('user.group', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            var selected = $filter('filter')($scope.groups, { id: $scope.user.group });
            $scope.user.groupName = selected.length ? selected[0].text : null;
        }
    });
})
.controller('Html5InputsCtrl', function ($scope) {
    $scope.user = {
        email: 'email@example.com',
        tel: '123-45-67',
        number: 29,
        range: 10,
        url: 'http://example.com',
        search: 'blabla',
        color: '#6a4415',
        date: null,
        time: '12:30',
        datetime: null,
        month: null,
        week: null
    };
})
.controller('TextareaCtrl', function ($scope) {
    $scope.user = {
        desc: 'Awesome user \ndescription!'
    };
})
.controller('CheckboxCtrl', function($scope) {
    $scope.user = {
        remember: true
    };  
})
.controller('ChecklistCtrl', function ($scope, $filter) {
    $scope.user = {
        status: [2, 3]
    };

    $scope.statuses = [
      { value: 1, text: 'status1' },
      { value: 2, text: 'status2' },
      { value: 3, text: 'status3' }
    ];

    $scope.showStatus = function () {
        var selected = [];
        angular.forEach($scope.statuses, function (s) {
            if ($scope.user.status.indexOf(s.value) >= 0) {
                selected.push(s.text);
            }
        });
        return selected.length ? selected.join(', ') : 'Not set';
    };

})
.controller('RadiolistCtrl', function ($scope, $filter) {
    $scope.user = {
        status: 2
    };

    $scope.statuses = [
      { value: 1, text: 'status1' },
      { value: 2, text: 'status2' }
    ];

    $scope.showStatus = function () {
        var selected = $filter('filter')($scope.statuses, { value: $scope.user.status });
        return ($scope.user.status && selected.length) ? selected[0].text : 'Not set';
    };
})
.controller('TypeaheadCtrl', function ($scope) {
    $scope.user = {
        state: 'Arizona'
    };

    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
})
.controller('SelectMultipleCtrl', function ($scope, $filter) {
    $scope.user = {
        status: [2, 4]
    };

    $scope.statuses = [
      { value: 1, text: 'status1' },
      { value: 2, text: 'status2' },
      { value: 3, text: 'status3' },
      { value: 4, text: 'status4' }
    ];

    $scope.showStatus = function () {
        var selected = [];
        angular.forEach($scope.statuses, function (s) {
            if ($scope.user.status.indexOf(s.value) >= 0) {
                selected.push(s.text);
            }
        });
        return selected.length ? selected.join(', ') : 'Not set';
    };
})
.controller('ValidateLocalCtrl', function ($scope) {
    $scope.user = {
        name: 'awesome user'
    };

    $scope.checkName = function (data) {
        if (data !== 'awesome') {
            return "Username should be `awesome`";
        }
    };
})
.controller('ValidateRemoteCtrl', function ($scope, $http, $q) {
    $scope.user = {
        name: 'awesome user'
    };

    $scope.checkName = function (data) {
        var d = $q.defer();
        $http.post('XEditable/CheckName', { value: data }).success(function (res) {
            res = res || {};
            if (res.status === 'ok') { // {status: "ok"}
                d.resolve()
            } else { // {status: "error", msg: "Username should be `awesome`!"}
                d.resolve(res.msg)
            }
        }).error(function (e) {
            d.reject('Server error!');
        });
        return d.promise;
    };
})
.controller('OnbeforesaveCtrl', function ($scope, $http, $q) {
    $scope.user = {
        id: 1,
        name: 'awesome user'
    };

    $scope.updateUser = function (data) {
        var d = $q.defer();
        $http.post('XEditable/UpdateUser', { id: $scope.user.id, name: data }).success(function (res) {
            res = res || {};
            if (res.status === 'ok') { // {status: "ok"}
                d.resolve()
            } else { // {status: "error", msg: "Username should be `awesome`!"}
                d.resolve(res.msg)
            }
        }).error(function (e) {
            d.reject('Server error!');
        });
        return d.promise;
    };
})
.controller('EditableFormCtrl', function ($scope, $filter, $http) {
    $scope.user = {
        id: 1,
        name: 'awesome user',
        status: 2,
        group: 4,
        groupName: 'admin'
    };

    $scope.statuses = [
      { value: 1, text: 'status1' },
      { value: 2, text: 'status2' },
      { value: 3, text: 'status3' },
      { value: 4, text: 'status4' }
    ];

    $scope.groups = [];
    $scope.loadGroups = function () {
        return $scope.groups.length ? null : $http.get('XEditable/GetGroup').success(function (data) {
            $scope.groups = data;
        });
    };

    $scope.showGroup = function () {
        if ($scope.groups.length) {
            var selected = $filter('filter')($scope.groups, { id: $scope.user.group });
            return selected.length ? selected[0].text : 'Not set';
        } else {
            return $scope.user.groupName;
        }
    };

    $scope.checkName = function (data) {
        if (data !== 'awesome' && data !== 'error') {
            return "Username should be `awesome` or `error`";
        }
    };

    $scope.saveUser = function () {
        // $scope.user already updated!
        return $http.post('XEditable/SaveUser', $scope.user).error(function (err) {
            if (err.field && err.msg) {
                // err like {field: "name", msg: "Server-side error for this username!"} 
                $scope.editableForm.$setError(err.field, err.msg);
            } else {
                // unknown error
                $scope.editableForm.$setError('name', 'Unknown error!');
            }
        }).success(function (res) {
            var d = res;
        });
    };
});