angular.module('contacts')
.controller('listCtrl', function ($scope, $state, $cookieStore, apiService, $modal, $rootScope, $window) {
    console.log('listCtrl');

    var userID = $cookieStore.get('userId');
   
    var orgID = $cookieStore.get('orgID');
    $rootScope.title = 'Dwellar-ContactList';

    $scope.ListGrid ={
      dataSource: {
          type: "json",
          transport: {
              read: apiService.baseUrl + "PeopleList/GetPeopleListGrid?orgid=" + orgID ,
          },
          pageSize: 20,
          refresh: true,
          sort: {
              field: "created_date",
              dir: "desc"
          }
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
               template: "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
               title: "<input id='checkAll', type='checkbox', class='check-box' />",
               width: "60px",
               attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
           }, {
               field: "name",
               title: "NAME",
               width: "120px",
               attributes: {
                   "class": "UseHand",
                   "style": "text-align:center"
               }
           }, {
               field: "created_date_formatted",
               title: "CREATED DATE",
               width: "120px",
               //type: "date",
               //format: '{0:dd/MM/yyyy hh:mm:ss tt}',
               attributes: {
                   "class": "UseHand",
                   "style": "text-align:center"
               }
           }, {
               field: "totalcontact",
               title: "TOTAL CONTACT",
               width: "120px",
               attributes: {
                   "class": "UseHand",
                   "style": "text-align:center"
               }
           }, {
               field: "totalcampaign",
               title: "CAMPAIGNS",
               width: "120px",
               attributes:
               {
                   "class": "UseHand",
                   "style": "text-align:center"
               }
           }, ]

  };

    $scope.$on('REFRESH', function (event, args) {
        if (args == 'ListGrid') {
            $('.k-i-refresh').trigger("click");
        }
    });

    $scope.openListPopup = function () {
        $state.go('app.addNewList');
    };


});