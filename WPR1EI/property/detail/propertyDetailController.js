'use strict';

angular.module('property')

    



    .controller('PropertyDetailController', ['$scope', 'propertyService', 'appConstants', '$sce', '$modal', '$window','apiService','$cookieStore','$rootScope',
           
    function ($scope, propertyService, appConstants, $sce, $modal, apiService, $window, $cookieStore, $rootScope) {
            
  
            $rootScope.title = 'Dwellar./PropertyDetails';




            //$('.swipebox').swipebox();
            // var orgID = $cookieStore.get('orgID');
            var propertyId = window.sessionStorage.selectedCustomerID;
            var getPropertyDetail = function () {
                propertyService.getPropertyDetail(propertyId).then(function (detail) {
                    $scope.detail = detail.data[0];

                    // Build address if it is not of free from type
                    if ($scope.detail.freeform_address) {
                        $scope.propertyAddress = $scope.detail.freeform_address_text;
                    }
                    else {
                        var address = $scope.detail.street_1 + ', ' + $scope.detail.street_2 + ', ' + $scope.detail.city
                            + ', ' + $scope.detail.state + ', ' + $scope.detail.country + ', ' + $scope.detail.zip_code;

                        $scope.propertyAddress = address;
                    }
                })
            };


            getPropertyDetail();

            var getPropertyAddress = function () {
                propertyService.getPropertyAddress(propertyId).then(function (address) {
                    $scope.address = address.data[0];
                })
            };
            getPropertyAddress();

            var getPropertyImages = function () {
                propertyService.getPropertyImages(propertyId).then(function (images) {
                    $scope.images = images.data;
                })
            };

            var getProperty2DImages = function () {
                propertyService.getProperty2DImages(propertyId).then(function (images) {
                    $scope.images2D = images.data;
                })
            };
            var getProperty3DImages = function () {
                propertyService.getProperty3DImages(propertyId).then(function (images) {
                    $scope.images3D = images.data;
                })
            };

            var getPropertyVideos = function () {
                propertyService.getPropertyVideos(propertyId).then(function (videos) {
                    $scope.videos = videos.data;
                    angular.forEach(videos.data, function (obj) {
                        obj.media_url_formatted = $sce.trustAsResourceUrl(obj.media_url);
                    })
                })
            };

            getPropertyImages();
            getPropertyVideos();
            getProperty2DImages();
            getProperty3DImages();



            $scope.exportLeadsFromGrid = function () {
                $("#recordGrid").data("kendoGrid").saveAsExcel()
            };

            $scope.recordGrid = {
                dataSource: {
                    pageSize: 20,
                    type: "json",
                    transport: {
                        read: appConstants.APIBaseURL + 'Contact/GetContactByProperty/' + propertyId
                    },
                    schema: {
                        model: {
                            fields: {
                                Contact_First_Name: { type: "string" },
                                Contact_Last_Name: { type: "string" },
                                Contact_Email: { type: "string" },
                                Contact_Phone: { type: "string" },
                                LeadSource: { type: "string" },
                                Contact_Created_Date: { type: "date" }
                            }
                        }
                    }
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
                columns: [{
                    field: "Picture",
                    title: "Picture",
                    template: "<div class='user-photo'><img src='{{Contact_Image}}'/></div>",
                    width: '100px'
                },
                    {
                        field: "Contact_First_Name",
                        title: "First Name",
                        width: '150px'
                    },
                    {
                        field: "Contact_Last_Name",
                        title: "Last Name",
                        width: '150px'
                    },
                    {
                        field: "Contact_Email",
                        title: "EMail",
                        width: '200px'
                    },
                    {
                        field: "Contact_Phone",
                        title: "Phone",
                        width: '100px'
                    },
                    {
                        field: "LeadSource",
                        title: "Lead Source",
                        width: '100px'
                    },
                    {
                        field: "Contact_Created_Date",
                        title: "Date",
                        width: '100px',
                        format: '{0:dd/MM/yyyy}'
                    }
                ]
            }


        //////Audit log start															
        ////    $scope.params =
        ////        {
        ////            devicec_id: "34:#$::43:434:34:45",
        ////            module_id: "Contact",
        ////            action_id: "Contact View",
        ////            details: "PropertyDetailsView",
        ////            application: "angular",
        ////            browser: $cookieStore.get('browser'),
        ////            ip_address: $cookieStore.get('IP_Address'),
        ////            location: $cookieStore.get('Location'),
        ////            organization_id: $cookieStore.get('orgID'),
        ////            User_ID: $cookieStore.get('userId')
        ////        };

        ////    AuditCreate = function (param) {
        ////        apiService.post("AuditLog/Create", param).then(function (response) {
        ////            var loginSession = response.data;
        ////        },
        ////   function (error) {_os: $cookieStore.get('Device_os'),
        ////            device_type: $cookieStore.get('Device'),
        ////            device_ma

        ////   });
        ////    };
        ////    AuditCreate($scope.params);

        ////////end
            $scope.openImageUploadPopup = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'property/detail/upload/imageUpload/imageUpload.tpl.html',
                    controller: ImageUploadController,
                    size: 'md'
                });
            };

            $scope.openVideoUploadPopup = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'property/detail/upload/videoUpload/videoUpload.tpl.html',
                    controller: VideoUploadController,
                    size: 'md'
                });
            };

        }

    ]);