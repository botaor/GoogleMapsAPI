function initialize()
{
    var homeLocation = new google.maps.LatLng(39.499903,-8.719593)
    var mapOptions = {
        center: homeLocation,
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        scaleControl: true,
        streetViewControl: false
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

function loadGoogleMapsScript()
{
    var key = decodeURIComponent((new RegExp('[?|&]key=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1])||""

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://maps.googleapis.com/maps/api/js?key=' + key + '&callback=initialize';
    document.body.appendChild(script);
}
