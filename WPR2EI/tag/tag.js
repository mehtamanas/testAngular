angular.module('tag')
.controller('tagController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('tagController');

        var userID = $cookieStore.get('userId');

        var orgID = $cookieStore.get('orgID');

        $scope.TagAction = 'no_action';

        $rootScope.title = 'Dwellar-Tag';

        $scope.tagGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Tags/GetTags/" + orgID

                },
              
                pageSize: 20
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            filterable: true,
            height: screen.height - 370,
            columnMenu: {
                messages: {
                    columns: "Choose columns",
                    filter: "Apply filter",
                    sortAscending: "Sort (asc)",
                    sortDescending: "Sort (desc)"
                }
            },
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                 {
                     template: " <input type='checkbox' , class='checkbox', data-id='#= id #', ng-click='check($event,dataItem)'/>",
                     title: "<input id='checkAll', type='checkbox', class='check-box' ng-click='checkALL(dataItem)'/>",





                     width: "10px",
                     attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

                 },
              
                {
                    template: '<label ng-repeat="tag in tags" style="margin-left:2%;background-color:#=background_color#;" class="upper tag-name"><a ui-sref="app.tagpeople({id:dataItem.id})" class="tag_link" href=""></a>#=name#</label>',
                    title: "Tag Name",

                    width: "120px",
                    attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:left"
                   }
                },]
        };
        $scope.openTagPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'tag/createTag.html',
                backdrop: 'static',
                controller: AddTagPopUpController,
                size: 'lg'
            });
        };


        $scope.filterNow = function () {
            if ($scope.lastNameFilter)
                applyFilter('first_name', $scope.lastNameFilter);
            else
                clearFilters();

        };

        function applyFilter(filterField, filterValue) {

            // get the kendoGrid element.
            var gridData = $("#peopleGrid").data("kendoGrid");

            // get currently applied filters from the Grid.
            var currFilterObj = gridData.dataSource.filter();

            // get current set of filters, which is supposed to be array.
            // if the oject we obtained above is null/undefined, set this to an empty array
            var currentFilters = currFilterObj ? currFilterObj.filters : [];

            // iterate over current filters array. if a filter for "filterField" is already
            // defined, remove it from the array
            // once an entry is removed, we stop looking at the rest of the array.
            if (currentFilters && currentFilters.length > 0) {
                for (var i = 0; i < currentFilters.length; i++) {
                    if (currentFilters[i].field == filterField) {
                        currentFilters.splice(i, 1);
                        break;
                    }
                }
            }

            // if "filterValue" is "0", meaning "-- select --" option is selected, we don't
            // do any further processing. That will be equivalent of removing the filter.
            // if a filterValue is selected, we add a new object to the currentFilters array.
            if (filterValue != "0") {
                currentFilters.push({
                    field: filterField,
                    operator: "eq",
                    value: filterValue
                });
            }

            // finally, the currentFilters array is applied back to the Grid, using "and" logic.
            gridData.dataSource.filter({
                logic: "and",
                filters: currentFilters
            });

        }
        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'tagGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.TagAction = 'no_action';
        });

        $scope.chooseAction = function () {
            var allGridElements = $(".checkbox").toArray();
            var allCheckedElement = _.filter(allGridElements, function (o)
            { return o.checked });
            allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', allCheckedIds);

            if (allCheckedIds.length > 0) {

                if ($scope.TagAction === "no_action") {

                }
                else if ($scope.TagAction === "add_tag") {
                    $state.go($scope.tagOptionPopup());
                }
                else if ($scope.TagAction === "assign_to") {
                    $state.go($scope.assignToUpPopup());
                }
                else if ($scope.TagAction === "delete") {
                    var tagDelete = [];
                    for (var i in allCheckedIds) {
                        var tag = {};
                        tag.id = allCheckedIds[i];
                        tag.organization_id = $cookieStore.get('orgID');
                        tagDelete.push(tag);
                    }
                    $cookieStore.put('tagDelete', tagDelete);
                    $scope.openConfirmation();
                }
            }
        }

        $scope.openConfirmation = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'tag/confirmremovetag.html',
                backdrop: 'static',
                controller: confirmTagController,
                size: 'sm',
                resolve: { items: { title: "Tag" } }

            });

        }

        $scope.checkALL = function (e) {
            if ($('.check-box:checked').length > 0)
                $('.checkbox').prop('checked', true);
            else
                $('.checkbox').prop('checked', false);
        };


        $scope.check = function (e, data) {
            var allListElements = $(".checkbox").toArray();
            for (var i in allListElements) { // not all checked
                if (!allListElements[i].checked) {
                    $('#checkAll').prop('checked', false);
                    break;
                }
                if (i == allListElements.length - 1) // if all are checked manually
                    $('#checkAll').prop('checked', true);
            }
        }

        $scope.myGridChangetag = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;

            $state.go('app.tagpeople', { id: dataItem.id });
        };

    }
);

