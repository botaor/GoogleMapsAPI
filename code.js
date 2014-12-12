function addMarker( map )
{
    var marker = new google.maps.Marker({
        position: {lat: 38.7517496, lng: -9.2334604},
        map: map,
        title: 'Aqui!'
    });
}

function initialize()
{
    var mapOptions = {
        center: new google.maps.LatLng(38.7717496,-9.2534604),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    
    addMarker( map )
}

function loadGoogleMapsScript()
{
    var key = decodeURIComponent((new RegExp('[?|&]key=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1])||""

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://maps.googleapis.com/maps/api/js?key=' + key + '&callback=initialize';
    document.body.appendChild(script);
}
