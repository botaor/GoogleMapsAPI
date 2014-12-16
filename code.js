function addEditablePolygon( map )
{
    // Define the LatLng coordinates for the polygon.
    var shapeCoords = [
        new google.maps.LatLng(38.7717496, -9.2134604),
        new google.maps.LatLng(38.7917496, -9.2134604),
        new google.maps.LatLng(38.7817496, -9.2334604),
        new google.maps.LatLng(38.7717496, -9.2234604),
    ];    
    
    // Construct the polygon.
    var shape = new google.maps.Polygon({
        paths: shapeCoords,
        strokeColor: '#888888',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#888888',
        fillOpacity: 0.35,
        draggable: true,
        editable: true
    });

    shape.setMap(map);
    addDeleteButton(shape, 'poly_del.png');
}

function addDeleteButton(poly, imageUrl)
{
    var path = poly.getPath();
    path.btnDeleteClickHandler = {};
    path.btnDeleteImageUrl = imageUrl;

    google.maps.event.addListener(poly.getPath(),'set_at',pointUpdated);
    google.maps.event.addListener(poly.getPath(),'insert_at',pointUpdated);
}

function pointUpdated(index)
{
    var path = this;
    // make sure we have at least 3 corners
    if( path.getLength() <= 3 )
    {
        $('.deletePoly').height(0);
        return false;
    }

    $('.deletePoly').height(27);
    var btnDelete = getDeleteButton(path.btnDeleteImageUrl);

    if(btnDelete.length === 0) 
    {
        var undoimg = $("img[src$='http://maps.gstatic.com/mapfiles/undo_poly.png']");

        undoimg.parent().css('height', '21px !important');
        undoimg.parent().parent().append('<div class="deletePoly" style="overflow-x: hidden; overflow-y: hidden; position: absolute; width: 30px; height: 27px;top:21px;"><img src="' + path.btnDeleteImageUrl + '" style="height:auto; width:auto; position: absolute; left:0;"/></div>');

        // now get that button back again!
        btnDelete = getDeleteButton(path.btnDeleteImageUrl);
        btnDelete.hover(function() { $(this).css('left', '-30px'); return false;}, 
            function() { $(this).css('left', '0px'); return false;});
        btnDelete.mousedown(function() { $(this).css('left', '-60px'); return false;});
    }

    // if we've already attached a handler, remove it
    if(path.btnDeleteClickHandler) 
        btnDelete.unbind('click', path.btnDeleteClickHandler);

    // now add a handler for removing the passed in index
    path.btnDeleteClickHandler = function() {
        // make sure we have at least 3 corners
        if( path.getLength() <= 3 )
            return false;
        path.removeAt(index); 
            return false;
    };
    btnDelete.click(path.btnDeleteClickHandler);
}

function getDeleteButton(imageUrl)
{
    return  $("img[src$='" + imageUrl + "']");
}

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

function addMarkerTotal( map, pos, dim, tit, drag )
{
    var image = {
        url: 'marquersprite.png',
        // This marker is 20 pixels wide by 32 pixels tall.
        size: dim.size,
        // The origin for this image is 0,0.
        origin: dim.origin,
        // The anchor for this image is the base of the flagpole at 0,32.
        anchor: dim.anchor
    };
    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: tit,
        icon: image,
        draggable: drag
    });
    
    return marker ;
}

function addMarkerImage( map, imgName )
{
    var marker = new google.maps.Marker({
        position: {lat: 38.7717496, lng: -9.2934604},
        map: map,
        title: 'My Image!',
        icon: imgName
    });
}

function addMarker( map )
{
    var marker = new google.maps.Marker({
        position: {lat: 38.7517496, lng: -9.2334604},
        map: map,
        title: 'Aqui!'
    });
}

function makeContentString( str )
{
    return '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">The Heading</h1>'+
    '<div id="bodyContent">'+
    '<p><b>Notice</b>: You can write whatever you want in these notices. ' +
    'But there should be only <u>one</u> shown at any given time. '+
    'If you show <i>more</i>, the user will be distracted.</p>'+
    '<p>Link: <a target="_blank" href="http://google.com">http://google.com</a></p>'+
    '<p>Position: '+str+'</p>'+
    '</div>'+
    '</div>';
}

function showWindow( ev )
{
    this.infoWindow.content = makeContentString( ev.latLng ) ;
    this.infoWindow.open( this.map,this );
}

function addMarkersComplex( map, infoW )
{
    addMarkerImage( map, 'marquer.png' ) ;
    
    var dim, mk ;
    dim = { 
        origin: new google.maps.Point(0,0), 
        size: new google.maps.Size(20, 34), 
        anchor: new google.maps.Point(10, 34)
    };
    mk = addMarkerTotal( map, {lat: 38.7457496, lng: -9.2854604}, dim, 'Image 1', false ) ;
    mk.infoWindow = infoW ;
    google.maps.event.addListener(mk, 'click', showWindow);    

    dim = { 
        origin: new google.maps.Point(20,0), 
        size: new google.maps.Size(30, 50), 
        anchor: new google.maps.Point(15, 49)
    };
    mk = addMarkerTotal( map, {lat: 38.7457496, lng: -9.2744604}, dim, 'Image 2', true ) ;
    mk.infoWindow = infoW ;
    google.maps.event.addListener(mk, 'click', showWindow);    

    dim = { 
        origin: new google.maps.Point(50,0), 
        size: new google.maps.Size(9, 18), 
        anchor: new google.maps.Point(4, 17)
    };
    mk = addMarkerTotal( map, {lat: 38.7457496, lng: -9.2634604}, dim, 'Image 3', false ) ;
    mk.infoWindow = infoW ;
    google.maps.event.addListener(mk, 'click', showWindow);    
}

function makeInfoWindow( map )
{
    return new google.maps.InfoWindow({
        content: "later",
        maxWidth: 200
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
    addEditablePolygon( map ) ;
    
    var infoW = makeInfoWindow( map ) ;
    addMarkersComplex( map, infoW ) ;
}

function loadGoogleMapsScript()
{
    var key = decodeURIComponent((new RegExp('[?|&]key=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1])||""

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://maps.googleapis.com/maps/api/js?key=' + key + '&callback=initialize';
    document.body.appendChild(script);
}
