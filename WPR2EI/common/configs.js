// Fix for IE9, 10
if(!window.location.origin) {
    window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}

angular.module('configs', [])

.constant('CONFIGS', {
    baseURL: function () {
       return 'http://dw-webservices-dev1.azurewebsites.net/';
          //return 'http://dwellar-demo2.azurewebsites.net/';
        //  return 'http://dw-webservices-uat.azurewebsites.net/';
        //return 'http://localhost:3979/';
    },
    uploadURL: function () {
        return 'http://dw-webservices-dev1.azurewebsites.net/MediaElement/upload';
       // return 'http://dwellar-demo2.azurewebsites.net/MediaElement/upload';
    },
    ipTraceUrl: function () {
        return 'http://ipinfo.io/json';
    }
})

.constant('PATTERNREGEXS', {
    email: /^[a-zA-Z][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/,
    number: /[0-9]/,
    alphabet: /^[A-Za-z ][A-Za-z ]*$/,
    phone: /^[0-9]{10}$/,
    //phone: /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/,
    ssn: /^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$/,
    date: /[0-9]{2}/,
    month: /[0-9]{2}/,
    year: /[0-9]{4}/
})

.constant('KENDOPATTERN', {
    alphabet: '^[A-Za-z ][A-Za-z ]*$'
})



   .controller('notification', ['$scope', '$location', '$cookies', function ($scope, $location, $cookies) {
       $scope.logout = function () {
           alert("sdfk");
           var cookies = $cookies.getAll();
           angular.forEach(cookies, function (v, k) {
               $cookies.remove(k);
           });
       }
       localStorage.clearAll();
       $location.url('/app/index.html#/login');

   }])

.constant('COUNTRIES',[
    {name: 'India', flag: 'assets/icons/flags/india.gif'}
    //{name: 'China', flag: 'assets/icons/flags/china.gif'}
])

.constant('COUNTRIES2',[
    'Afghanistan', 'Aland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola',
    'Anguilla', 'Antarctica', 'Antigua And Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin',
    'Bermuda', 'Bhutan', 'Bolivia, Plurinational State of', 'Bonaire, Sint Eustatius and Saba', 'Bosnia and Herzegovina',
    'Botswana', 'Bouvet Island', 'Brazil',
    'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia',
    'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China',
    'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo',
    'Congo, the Democratic Republic of the', 'Cook Islands', 'Costa Rica', 'Cote d\'Ivoire', 'Croatia', 'Cuba',
    'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
    'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)',
    'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia',
    'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece',
    'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea',
    'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Holy See (Vatican City State)',
    'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran, Islamic Republic of', 'Iraq',
    'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya',
    'Kiribati', 'Korea, Democratic People\'s Republic of', 'Korea, Republic of', 'Kuwait', 'Kyrgyzstan',
    'Lao People\'s Democratic Republic', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
    'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia, The Former Yugoslav Republic Of',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique',
    'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of', 'Moldova, Republic of',
    'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
    'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger',
    'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau',
    'Palestinian Territory, Occupied', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
    'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russian Federation',
    'Rwanda', 'Saint Barthelemy', 'Saint Helena, Ascension and Tristan da Cunha', 'Saint Kitts and Nevis', 'Saint Lucia',
    'Saint Martin (French Part)', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
    'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
    'Sint Maarten (Dutch Part)', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
    'South Georgia and the South Sandwich Islands', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
    'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic',
    'Taiwan, Province of China', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Timor-Leste',
    'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
    'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
    'United States', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu',
    'Venezuela, Bolivarian Republic of', 'Viet Nam', 'Virgin Islands, British', 'Virgin Islands, U.S.',
    'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'
])

.constant('CITIES', [
    {name: 'Unselect'},
    {name: 'Mumbai'},
    {name: 'Delhi'},
    {name: 'Bangalore'},
    {name: 'Hyderabad'},
    {name: 'Ahmedabad'},
    {name: 'Chennai'},
    {name: 'Kolkata'},
    {name: 'Surat'},
    {name: 'Pune'}
])

.constant('STATES', [
    {name: 'Unselect', abbreviation: ''},
    {name: 'Uttar Pradesh', abbreviation: ''},
    {name: 'Maharashtra', abbreviation: ''},
    {name: 'Bihar', abbreviation: ''},
    {name: 'West Bengal', abbreviation: ''},
    {name: 'Madhya Pradesh', abbreviation: ''},
    {name: 'Tamil Nadu', abbreviation: ''},
    {name: 'Rajasthan', abbreviation: ''},
    {name: 'Karnataka', abbreviation: ''},
    {name: 'Gujarat', abbreviation: ''},
    {name: 'Andhra Pradesh', abbreviation: ''},
    {name: 'Odisha', abbreviation: ''},
    {name: 'Telangana', abbreviation: ''},
    {name: 'Kerala', abbreviation: ''}
]);
