$(document).ready(function() {

    // create DropDownList from select HTML element
    $("#lead-source").kendoDropDownList();
    $("#select-dates").kendoDropDownList();
    $("#select-citys").kendoDropDownList();
    $("#actions-option").kendoDropDownList();
    
    // create DatePicker from input HTML element
    $("#datepicker-1").kendoDatePicker();
    $("#datepicker-2").kendoDatePicker();

    $("#record-list").kendoGrid({
        dataSource: {
            type: "table",
            pageSize: 8
        },
        height: 671,
        groupable: true,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [{
            field: "picture",
            title: "Picture",			
            width: 80
        }, {
            field: "firstname",
            title: "First Name",			
            width: 120
        }, {
            field: "lastname",
            title: "Last Name",			
            width: 120
        }, {
            field: "email",
            title: "Email",			
            width: 250
        }, {
            field: "phone",
            title: "Phone",			
            width: 100
        }, {
            field: "leadsource",
            title: "Lead Source",		
            width: 110
        }, {
            field: "date",
            title: "Date",
            width: 110
        }]
    });
    
    $("#property-record-list").kendoGrid({
        dataSource: {
            type: "table",
            pageSize: 6
        },
        height: 840,
        groupable: true,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [{
            field: "checkbox",
            title: "checkbox",			
            width: 30
        }, {
            field: "photo",
            title: "PHOTO",			
            width: 130
        }, {
            field: "name",
            title: "NAME",			
            width: 100
        }, {
            field: "bedroom",
            title: "BEDROOM",			
            width: 100
        }, {
            field: "bathroom",
            title: "BATHROOM",			
            width: 100
        }, {
            field: "slb_area",
            title: "SLB. AREA",			
            width: 100
        }, {
            field: "crp_area",
            title: "CRP. AREA",		
            width: 100
        }, {
            field: "price",
            title: "PRICE",
            width: 70
        }, {
            field: "project",
            title: "PROJECT",
            width: 110
        }, {
            field: "status",
            title: "STATUS",
            width: 100
        }]
    
    });
    
    $("#project-record-list").kendoGrid({
        dataSource: {
            type: "table",
            pageSize: 6
        },
        height: 840,
        groupable: true,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [{
            field: "checkbox",
            title: "checkbox",			
            width: 30
        }, {
            field: "logo",
            title: "LOGO",			
            width: 130
        }, {
            field: "name",
            title: "NAME",			
            width: 70
        }, {
            field: "location",
            title: "LOCATION",			
            width: 120
        }, {
            field: "unit_types",
            title: "UNIT TYPES",			
            width: 120
        }, {
            field: "total_units",
            title: "TOTAL UNITS",			
            width: 60
        }, {
            field: "available_units",
            title: "AVAILABLE UNITS",		
            width: 60
        }, {
            field: "area",
            title: "AREA",
            width: 120
        }, {
            field: "price",
            title: "PRICE",
            width: 70
        }]
    
    });
    
    var cityname = [
        "Paris",	
        "London", 	
        "Bangkok", 	
        "Singapore", 	
        "New York",
        "Kuala Lumpur", 	
        "Hong Kong",
        "Dubai-cityscape-during-sunset-mini",
        "Dubai", 	
        "Istanbul", 	
        "Rome",
        "Shanghai", 	
        "Los Angeles",	
        "Las Vegas",	
        "Miami", 	
        "Toronto",
        "Barcelona",	
        "Dublin",	
        "Amsterdam", 	
        "Moscow", 	
        "Cairo",
        "Prague", 	
        "Vienna",	
        "Madrid", 	
        "San Francisco", 	       
        "Budapest", 	
        "Rio de Janeiro",	
        "Berlin", 	
        "Tokyo", 	
        "Mexico City",
        "Buenos Aires", 	
        "St. Petersburg",	
        "Seoul", 	
        "Athens",	
        "Jerusalem",
        "Seattle",	
        "Delhi",	
        "Sydney",	
        "Mumbai", 	
        "Munich",
        "Venice", 		
        "Beijing", 	
        "Cape Town", 	
        "Washington D.C.",
        "Montreal",
        "Atlanta",	
        "Boston", 	
        "Philadelphia",	
        "Chicago",
        "San Diego", 	
        "Stockholm",	
        "Cancún",	
        "Warsaw",	
        "Sharm el-Sheikh",
        "Dallas",	
        "H? Chí Minh",	
        "Oslo", 	
        "Libson",
        "Punta Cana", 
        "Mecca", 	        
        "Taipei", 	
        "Orlando",	
        "São Paulo",
        "Riyadh", 	
        "Jakarta", 		
        "New Orleans", 	
        "Petra",
        "Melbourne",	
        "Luxor",	
        "Manila ",	
        "Houston"
    ];

    //create AutoComplete UI component
    $("#search_city").kendoAutoComplete({
        dataSource: cityname,
        filter: "startswith",
        placeholder: "Search City",
        separator: ", "
    });
    
    $("#upload-photo").kendoUpload();
    $(".img-upload").kendoUpload();
    
    $('#add-phone a').on('click', function() {
        var phone_f = $('<div id="phone-wrap" class="clearfix"><div id="phone-no" class="form-bx form-bx2"><input type="text" class="form-control" placeholder="Phone No." /></div><div class="remove-field"><a href="javascript:">remove</a></div></div>');
        $('#phone-wrap').after(phone_f);
    });
    
    $('#add-email a').on('click', function() {
        var phone_f = $('<div id="email-wrap" class="clearfix"><div id="email-no" class="form-bx form-bx2"><input type="text" class="form-control" placeholder="Email Id" /></div><div class="remove-field"><a href="javascript:">remove</a></div></div>');
        $('#email-wrap').after(phone_f);
    });
    
    $('#add-address a').on('click', function() {
        var phone_f = $('<div id="address-wrap" class="clearfix"><div id="address-no" class="form-bx form-bx2"><input type="text" class="form-control" placeholder="Address Line" /></div><div class="remove-field"><a href="javascript:">remove</a></div></div>');
        $('#address-wrap').after(phone_f);
    });
    
    $('#add-phone2 a').on('click', function() {
        var phone_f = $('<div id="phone-wrap2" class="clearfix"><div id="phone-no2" class="form-bx form-bx6"><input type="text" class="form-control" placeholder="033 25648695" /></div><div class="remove-field"><a href="javascript:">remove</a></div></div>');
        $('#phone-wrap2').after(phone_f);
    });
    
    $('#add-email2 a').on('click', function() {
        var phone_f = $('<div id="email-wrap2" class="clearfix"><div id="email-no2" class="form-bx form-bx6"><input type="text" class="form-control" placeholder="contact@dbrality.co.in" /></div><div class="remove-field"><a href="javascript:">remove</a></div></div>');
        $('#email-wrap2').after(phone_f);
    });
       
    $(document).on("click", ".remove-field", function() {
        $(this).parent().remove();
    });
    
    $("#organization_address, #organization_desc").kendoEditor({ resizable: {
        content: true,
        toolbar: true
        },
        tools: [
            "cleanFormatting",
            "fontName",
            "fontSize",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "justifyFull",
            "insertUnorderedList",
            "insertOrderedList",
            "outdent",
            "createLink",
            "unlink",
            "insertImage",
            "insertFile"
        ]    
    });
    
    
    $('#add-address2 a').on('click', function() {
        var phone_f = $('<div class="organization_address_wrap clearfix" class="clearfix"><div class="form-group form-bx form-bx7"><textarea class="organization_address2" style="width:100%;height:100px"></textarea></div><div class="remove-field"><a href="javascript:">remove</a></div></div>');
    $('.organization_address_wrap').after(phone_f);
    });
    
    $('#addr2-l a').on('click', function() {
        var phone_f = $('<div class="clearfix"><div id="addr2-f" class="form-group form-bx form-bx8"><input type="text" class="form-control" placeholder="" /></div><div class="remove-field"><a href="javascript:">remove</a></div></div>');
        $('#addr-wrap').after(phone_f);
    });
    
       
    $(".organization_address2").kendoEditor({ resizable: {
        content: true,
        toolbar: true
        },
        tools: [
            "cleanFormatting",
            "fontName",
            "fontSize",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "justifyFull",
            "insertUnorderedList",
            "insertOrderedList",
            "outdent",
            "createLink",
            "unlink",
            "insertImage",
            "insertFile"
        ]    
    });
    
    $('.project-type-list .project-type-bx').on('click', function() {
        $('.project-type-list .project-type-bx').removeClass('project-selected');        
        $(this).addClass('project-selected');
    });
    
    $('.dropzone').dropzone({ 
        url: "/file/post",
        processingmultiple: false
    });
    
    $('#builder-intro').readmore({
        speed: 400,
        moreLink: '<div class="more-txt text-center"><a href="#" id="view-sec" data-readmore-toggle="" aria-controls="builder-intro"><span class="icon"></span><br />MORE</a></div>',
        lessLink: '<div class="more-txt text-center"><a href="#" id="view-sec" data-readmore-toggle="" aria-controls="builder-intro">Close</a></div>',
        collapsedHeight: 76,
        afterToggle: function(trigger, element, expanded) {
            if(! expanded) { // The "Close" link was clicked
                $('html, body').animate({scrollTop: element.offset().top}, {duration: 100});
        }}
    });
   
	
});
//Random Tag color Generator
function ran_col() { //function name
    var color = '#'; // hexadecimal starting symbol
    var letters = ['875a53', '69c0d3', 'fdd048', '818dbe', '4999f3', 'ba9fd3', '2aae55', 'bec25f', '777d94', 'ea6d6d', '6c5d5d', '28afdb', '5c71b2', 'fdb453', '71bd8b', 'ff7a4c', '1890ff', '3e582a', '2a5846', '5941a7']; //Set your colors here

    color += letters[Math.floor(Math.random() * letters.length)];
    document.getElementById('posts').style.color = color;
    document.getElementById('posts').style.borderColor = color;// Setting the random color on your div element.
}
$(document).ready(function(){
    $(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
    $("button").click(function(){
        $("#txt").load("demo_ajax_load.asp");
    });
});