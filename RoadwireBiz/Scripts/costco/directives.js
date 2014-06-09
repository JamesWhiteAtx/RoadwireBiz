angular.module('costco.directives', [])

.directive('selCarSelect', function () {

    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            attrPlural: "@secPlural",
            attrName: "@secName",
            secMdName: "@secModel",  
            secModel: "=secModel",
            //slctModel: "=slctModel",
            //secList: "=secList",
            //secId: "@secId",
            secHide: "@secOnlyOpts"
        },
        template:
            '<div class="slctr-opt" ng-class="{selected: secModel.isSelected}" > ' +
                '<div ng-show="secModel.isLoading" class="loading">Loading {{secPlural}}...</div>' +
                '<select id="slct-{{secId}}" title="{{secName}}" class="form-control"' +
                    'ng-disabled="secModel.isLoading || secModel.list.length == 0" ' +
                    'ng-hide="(secModel.isLoading) || ((secHide) && (secModel.list.length < 2))" ' +
                    'focus-it="secModel.shouldFocus" ' +
                    'ng-model="secModel.obj" ' +
                    'ng-options="i as i.name for i in secModel.list">' +
                    '<option value="">-- Select {{secName}} --</option>' +
                '</select>' +
            '</div>',
        link: function (scope, element) {
            scope.secName = scope.attrName || scope.secMdName.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
            scope.secId = scope.secName.toLowerCase();
            scope.secPlural = scope.attrPlural || scope.secName + "s";
        }
    };
})

;