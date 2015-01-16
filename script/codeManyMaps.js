function sleep(delay)
{
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
      
var map = null ;
var myMaps = [] ;
var infoW = null ;
var markerClusterer = null;

var myStyles = [{
    url: 'img/m1.png',
    height: 42,
    width: 42
}, {
    url: 'img/m2.png',
    height: 44,
    width: 44
}, {
    url: 'img/m3.png',
    height: 52,
    width: 52
}, {
    url: 'img/m4.png',
    height: 62,
    width: 62
}, {
    url: 'img/m5.png',
    height: 70,
    width: 70
}] ;
    

function getMinimumArea()
{
    var ne = map.getBounds().getNorthEast() ;
    var sw = map.getBounds().getSouthWest() ;
    
    var s = sw.lat() - ne.lat() ;
    if( s < 0 )
        s = -s ;
    var a = (s * 20) / $("#map_canvas").height() ;
    var path = [
        new google.maps.LatLng(sw.lat(),sw.lng()),
        new google.maps.LatLng(sw.lat()+a,sw.lng()),
        new google.maps.LatLng(sw.lat()+a,sw.lng()+a),
        new google.maps.LatLng(sw.lat(),sw.lng()+a),
    ];    
    return google.maps.geometry.spherical.computeArea( path ) / 1000000 ;
}    

function showElements()
{
    document.getElementById("zoomlevel").value = map.getZoom() ;

    var bounds = map.getBounds() ;
    
    var ne = bounds.getNorthEast() ;
    var sw = bounds.getSouthWest() ;

    var minArea = getMinimumArea() ;    
    var str = "bounds: " + ne.lat() + ',' + ne.lng() + '\n' +
              "        " + sw.lat() + ',' + sw.lng() + '\n' +
              "div height: " + $("#map_canvas").height() + '\n' +  
              "area: " + minArea + '\n' ;  

    document.getElementById( "result" ).value = str ;
    //simulate read from database
    //sleep( 200 ) ;

    if (markerClusterer)
        markerClusterer.clearMarkers();
    
    var markers = [];
    var i ;
    var o ;
    for( i = 0; i < myMaps.length; ++i )
    {
        o = myMaps[i].show( map, minArea ) ;
        if( o )
            markers.push( o ) ;
    }

    markerClusterer = new MarkerClusterer(map, markers, {
          gridSize: 40,
          averageCenter: true,
          imagePath: "img/m",
          styles: myStyles
        });
}    

function initialize()
{
    var homeLocation = new google.maps.LatLng(39.499903,-8.719593)
    var mapOptions = {
        center: homeLocation,
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        panControl: false,
        scaleControl: true,
        streetViewControl: false
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    
    google.maps.event.addListener( map, 'idle', showElements );
    
    infoW = makeInfoWindow() ;
    makeMaps( infoW ) ;
}

function showAll()
{
    for( i = 0; i < myMaps.length; ++i )
    {
        myMaps[i].show( map, 1000.0 ) ;
    }
}

function hideAll()
{
    for( i = 0; i < myMaps.length; ++i )
    {
        myMaps[i].hide() ;
    }
}

function loadGoogleMapsScript()
{
    var key = decodeURIComponent((new RegExp('[?|&]key=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1])||""

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://maps.googleapis.com/maps/api/js?key=' + key + '&libraries=geometry&callback=initialize';
    document.body.appendChild(script);
}

function makeInfoWindow()
{
    return new google.maps.InfoWindow({
        content: "later"
    });
}

function makeMaps( infoW )
{
    myMaps = [] ;
    var coords ;

    var i ;
    var j ;
    var c ;
    for( i = 0; i < mapsInfo.length; ++i )
    {
        c = mapsInfo[i].coords ;
        coords = [] ;
        for( j = 0; j < c.length; ++j )
        {
            coords.push( new google.maps.LatLng( c[j].lng, c[j].lat ) ) ;
        }
        myMaps.push( new OriMap( mapsInfo[i].name, coords, infoW ) ) ;
    }
}
