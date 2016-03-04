angular.module('login')
.controller('subscriptionController',
    function($scope, $state,apiService, security) {
      
        var loginSession1;
        
     

 
      
        alert('Hi3');

        // Kendo code
        $scope.mainGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Subscription/Get" 

                },
                pageSize: 5

                //group: {
                //    field: 'sport'
                //}
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            filterable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                        {
                            //template: "<img height='40px' width='40px' src='assets/images/image-2.jpg' />" +
                            //"<span style='padding-left:10px' class='customer-name'>#: first_name #</span>",
                            field: "name",
                            title: " Name",
                            width: "120px",
                            attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }

                        }, {
                            field: "description",
                            title: "Description",
                            width: "120px",
                            attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }

                        }, {
                            field: "renewal_type",
                            title: "Renewal Type",
                            width: "120px",
                            attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }

                        }, {
                            field: "price",
                            title: "Price",
                            width: "120px",
                            attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:right"
                  }

                        }, {
                            field: "renewal_term",
                            title: "Renewal Term",
                            width: "120px",
                            attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:right"
                  }

                        }]
        };
     
       
        
    }
);

