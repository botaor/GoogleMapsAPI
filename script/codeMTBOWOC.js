function sleep(delay)
{
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
      
var map = null ;
var myMaps = [] ;


function initialize()
{
    var homeLocation = new google.maps.LatLng(24.49601556375601, 65.65784840624997)
    var mapOptions = {
        center: homeLocation,
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        panControl: false,
        scaleControl: true,
        streetViewControl: false
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    
    putPlaces() ;
}

function loadGoogleMapsScript()
{
    var key = decodeURIComponent((new RegExp('[?|&]key=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1])||""
    var keyStr ;
    if( key != "" )
        keyStr = 'key=' + key + '&' ;
    else
        keyStr = "" ;

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://maps.googleapis.com/maps/api/js?' + keyStr + 'libraries=geometry&callback=initialize';
    document.body.appendChild(script);
}

function putPlaces()
{
    var marker;

    marker = new google.maps.Marker({
        position: { lat: -37.557038, lng: 143.865062 },
        map: map,
        title: 'Ballarat'
    });

    marker = new google.maps.Marker({
        position: { lat: 48.741121, lng: 19.146592 },
        map: map,
        title: 'Banska Bystrica'
    });

    marker = new google.maps.Marker({
        position: { lat: 62.601405, lng: 29.764624 },
        map: map,
        title: 'Joensuu'
    });

    marker = new google.maps.Marker({
        position: { lat: 49.565946, lng: 16.075339 },
        map: map,
        title: 'Nove Mesto na Morave'
    });

    marker = new google.maps.Marker({
        position: { lat: 53.706438, lng: 19.968005 },
        map: map,
        title: 'Ostróda'
    });

    marker = new google.maps.Marker({
        position: { lat: 31.953463, lng: 34.921706 },
        map: map,
        title: 'Ben Shemen'
    });

    marker = new google.maps.Marker({
        position: { lat: 41.832249, lng: -7.785295 },
        map: map,
        title: 'Montalegre'
    });

    marker = new google.maps.Marker({
        position: { lat: 59.354337, lng: 26.356963 },
        map: map,
        title: 'Rakvere'
    });
}
