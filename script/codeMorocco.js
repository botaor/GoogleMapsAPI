var myArea ;
var map ;

function initialize()
{
    var mapStyles = [{featureType: "administrative.country",stylers: [{ visibility: "off" }]}];
    var mapType = new google.maps.StyledMapType(mapStyles ,{name: "Maroc"});

    var homeLocation = new google.maps.LatLng(29.54619, -7.36133)
    var mapOptions = {
        center: homeLocation,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        scaleControl: true,
        streetViewControl: false
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.mapTypes.set('maroc', mapType );
    map.setMapTypeId('maroc');
    layer = new google.maps.FusionTablesLayer({
        query: {
        select: 'geometry',
        from: '1S4aLkBE5u_WS0WMVSchhBgMLdAARuPEjyW4rs20',
            where: "col1 contains 'MAR'"
        },
        styles: [{
            polylineOptions: {
                strokeColor: "#333333",
                strokeWeight: 2
            },
        }],
        suppressInfoWindows: false,
    });
    layer.setMap(map);
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
    script.src = 'http://maps.googleapis.com/maps/api/js?' + keyStr + 'callback=initialize';
    document.body.appendChild(script);
}

