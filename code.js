function addPolygon( map )
{
    // Define the LatLng coordinates for the polygon.
    var shapeCoords = [
        new google.maps.LatLng(38.7717496, -9.2534604),
        new google.maps.LatLng(38.7917496, -9.2534604),
        new google.maps.LatLng(38.8017496, -9.2834604),
        new google.maps.LatLng(38.7817496, -9.2734604),
        new google.maps.LatLng(38.7717496, -9.2634604),
    ];    
    
    // Construct the polygon.
    var shape = new google.maps.Polygon({
        paths: shapeCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });

    shape.setMap(map);
}

function HomeControl(controlDiv, map, loc)
{
  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map.
  controlDiv.style.padding = '5px';

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to set the map to Home';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = 'Home';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to homeLocation.
  google.maps.event.addDomListener(controlUI, 'click', function() {
    map.setCenter(loc)
  });
}

function addHomeButton( map, loc )
{
    var homeControlDiv = document.createElement('div');
    var homeControl = new HomeControl(homeControlDiv, map, loc);

    homeControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
}

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
    var homeLocation = new google.maps.LatLng(38.7717496,-9.2534604)
    var mapOptions = {
        center: homeLocation,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        scaleControl: true,
        streetViewControl: false
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    
    addMarker( map ) ;
    addHomeButton( map, homeLocation ) ;
    addPolygon( map ) ;
}

function loadGoogleMapsScript()
{
    var key = decodeURIComponent((new RegExp('[?|&]key=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1])||""

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://maps.googleapis.com/maps/api/js?key=' + key + '&callback=initialize';
    document.body.appendChild(script);
}
