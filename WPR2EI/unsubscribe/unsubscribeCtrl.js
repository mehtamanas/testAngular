﻿angular.module('unsubscribe')
.controller('unsubscribeController',
     function ($scope, $state, security, $cookieStore, apiService, $rootScope, $modal, $window) {

         var orgID = $cookieStore.get('orgID');

         $rootScope.title = 'Dwellar./SelectClient';

         var userID = $cookieStore.get('userId');
        


         $scope.SelectUnsubscribe = {
             dataSource: {
                 type: "json",
                 transport: {
                     read: function (options) {
                         apiService.getWithoutCaching("Contact/GetAllContactDetails?Id=" + userID + "&type=Client").then(function (response) {
                             data = response.data;


                             options.success(data);
                         }, function (error) {
                             options.error(error);
                         })

                     },
                 },
                 pageSize: 5
             },
             groupable: true,
             sortable: true,
             selectable: "multiple",
             reorderable: true,
             resizable: true,
             height: screen.height - 370,
             filterable: true,
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
                template: "<input type='checkbox', class='checkbox', data-id='#= Contact_Id #',  ng-click='check($event,dataItem)' />",
                title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
                width: "60px",
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
            },  {
                field: "Name",
                template: '<a ui-sref="app.contactdetail({id:dataItem.Contact_Id})" href="">#=Name#</a>',
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            },
            {
                field: "Contact_Email",
                title: "Email",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
          
           }, ]
         };


         $scope.chooseAction = function () {
             var allGridElements = $(".checkbox").toArray();
             var allCheckedElement = _.filter(allGridElements, function (o)
             { return o.checked });
             allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
             $cookieStore.remove('checkedIds');
             $cookieStore.put('checkedIds', allCheckedIds);

         }


         $scope.checkALL = function (e) {
             if ($('.check-box:checked').length > 0) {
                 $('.checkbox').prop('checked', true);
                 $scope.chooseAction();
             }
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

         //Audit log start															
         $scope.params =
             {
                 device_os: $cookieStore.get('Device_os'),
                 device_type: $cookieStore.get('Device'),
                 //device_mac_id: "34:#$::43:434:34:45",
                 module_id: "unsubscribe",
                 action_id: "unsubscribe View",
                 details: "UnsubscribeView",
                 application: "angular",
                 browser: $cookieStore.get('browser'),
                 ip_address: $cookieStore.get('IP_Address'),
                 location: $cookieStore.get('Location'),
                 organization_id: $cookieStore.get('orgID'),
                 User_ID: $cookieStore.get('userId')
             };

         AuditCreate = function (param) {
             apiService.post("AuditLog/Create", param).then(function (response) {
                 var loginSession = response.data;
             },
        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        });
         };
         AuditCreate($scope.params);

         //end


         // Kendo Grid on change



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

         $scope.$on('REFRESH', function (event, args) {
             if (args == 'SelectUnsubscribe') {
                 $('.k-i-refresh').trigger("click");
             }
         });

         function clearFilters() {
             var gridData = $("#peopleGrid").data("kendoGrid");
             gridData.dataSource.filter({});
         }





         //$scope.cancel = function () {
         //    $modalInstance.dismiss();
         //}
         $scope.totalContact = $cookieStore.get('checkedIds');

         $scope.SelectUnsubscribeList = function () {

             $scope.chooseAction();
             $scope.length = parseInt($scope.totalContact.length);
             var postData = {
                 client_id: $scope.totalContact,                
                 user_id: $cookieStore.get('userId'),
                 organization_id: $cookieStore.get('orgID')
             }
             apiService.post('Template/ClientDemandLetterMapping', postData).then(function (response) {
                 var SessionData = response.data;
                 $scope.openSucessfullPopup();
             },

             function (error) {
             });


         }

         $scope.addNew = function (isValid) {
             $scope.showValid = true;
             if (isValid) {
                 $scope.SelectUnsubscribeList();
                 $scope.showValid = false;
             }
         }


         $scope.openSucessfullPopup = function () {
             var modalInstance = $modal.open({
                 animation: true,
                 templateUrl: 'newuser/sucessfull.tpl.html',
                 backdrop: 'static',
                 controller: sucessfullController,
                 size: 'sm',
                 resolve: { items: { title: "Unsubscribe" } }
             });
         }
     });

