function EditablePolygon( map, coords )
{
    // Construct the polygon.
    this.area = new google.maps.Polygon({
        paths: coords,
        strokeColor: '#888888',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#888888',
        fillOpacity: 0.35,
        draggable: true,
        editable: true
    });
    this.center = new google.maps.Marker({
        position: {lat: 0.0, lng: 0.0},
        map: null,
        title: 'Centroid'
    });
    this.bounds = new google.maps.Rectangle({
        strokeColor: '#FFFF00',
        strokeOpacity: 0.50,
        strokeWeight: 1.5,
        fillColor: '#FFFF00',
        fillOpacity: 0.40,
        map: null,
        bounds: null
    });    
    this.map = map ;

    // make sure bounds is under the actual polygon
    this.area.setOptions({ zIndex: 10 });
    this.bounds.setOptions({ zIndex:0 });
    
    this.area.setMap(map);
    addDeleteButton( this.area, 'poly_del.png');
}

EditablePolygon.prototype.getVertices = function ()
{
    var vertices = this.area.getPath();

    // Iterate over the vertices.
    var str = "";
    var xy ;
    var n = vertices.getLength() ;
    for( var i = 0; i < n; ++i )
    {
        xy = vertices.getAt(i);
        str += xy.lat() + ',' + xy.lng() + '\n';
    }    

    return str;    
}

EditablePolygon.prototype.getArea = function ()
{
    return google.maps.geometry.spherical.computeArea( this.area.getPath() );
}

EditablePolygon.prototype.getPerimeter = function ()
{
    return google.maps.geometry.spherical.computeLength( this.area.getPath() );
}

// This function gives the best result. Gives the center of mass of the polygon
EditablePolygon.prototype.getCentroid = function ()
{
    var vertices = this.area.getPath();

    // Iterate over the vertices.
    var centroid = { x: 0.0, y: 0.0 };
    var xy, sf ;
    var n = vertices.getLength() ;
    var xy_old = vertices.getAt(0) ;
    var sum = 0.0 ;
    for( var i = 1; i <= n; ++i )
    {
        if( i == n )
            xy = vertices.getAt(0);
        else
            xy = vertices.getAt(i);

        sf = xy_old.lng() * xy.lat() - xy.lng() * xy_old.lat() ;
        sum += sf ;
        centroid.x += (xy_old.lat() + xy.lat()) * sf ;
        centroid.y += (xy_old.lng() + xy.lng()) * sf ;
        
        xy_old = xy ;
    }    
    var a = 0.5 * sum ;
    centroid.x /= 6.0*a;
    centroid.y /= 6.0*a;

    this.center.setPosition( {lat: centroid.x, lng: centroid.y} ) ;
    this.center.setMap( this.map ) ;

    return this.center.position;    
}

// Fancy math, but still very close to the average of the coordinates.
// Still has problems if there are many points close together
EditablePolygon.prototype.getCentroidFancy = function ()
{
    var vertices = this.area.getPath();

    // Iterate over the vertices.
    var x, y, z;
    x = y = z = 0.0 ;
    var xy, lan, lng ;
    var n = vertices.getLength() ;
    for( var i = 0; i < n; ++i )
    {
        xy = vertices.getAt(i);
        lat = toRadians( xy.lat() ) ;
        lng = toRadians( xy.lng() ) ;

        x += Math.cos(lat) * Math.cos(lng) ;
        y += Math.cos(lat) * Math.sin(lng) ;
        z += Math.sin(lat) ;
    }    
    x /= n ;
    y /= n ;
    z /= n ;
    var yy = Math.atan2( y, x ) ;
    var xx = Math.atan2( z, Math.sqrt( x*x + y*y ) ) ;

    this.center.setPosition( {lat: toDegrees(xx), lng: toDegrees(yy)} ) ;
    this.center.setMap( this.map ) ;

    return this.center;    
}

// Just the average of the coordinates.
// Has problems if there are many points close together
EditablePolygon.prototype.getCentroidAverage = function ()
{
    var vertices = this.area.getPath();

    // Iterate over the vertices.
    var centroid = { x: 0.0, y: 0.0 };
    var xy ;
    var n = vertices.getLength() ;
    for( var i = 0; i < n; ++i )
    {
        xy = vertices.getAt(i);

        centroid.x += xy.lat();
        centroid.y += xy.lng();
    }    
    centroid.x /= n;
    centroid.y /= n;

    this.center.setPosition( {lat: centroid.x, lng: centroid.y} ) ;
    this.center.setMap( this.map ) ;

    return this.center;    
}

EditablePolygon.prototype.getBounds = function ()
{
    var vertices = this.area.getPath();

    // Iterate over the vertices.
    var rect = { minX: 500.0, minY: 500.0, maxX: -500.0, maxY: -500.0 };
    var xy ;
    var n = vertices.getLength() ;
    for( var i = 0; i < n; ++i )
    {
        xy = vertices.getAt(i);
        
        if( xy.lat() < rect.minX )
            rect.minX = xy.lat()
        if( xy.lat() > rect.maxX )
            rect.maxX = xy.lat()
        if( xy.lng() < rect.minY )
            rect.minY = xy.lng()
        if( xy.lng() > rect.maxY )
            rect.maxY = xy.lng()
    }    

    this.bounds.setBounds( new google.maps.LatLngBounds(
      new google.maps.LatLng(rect.minX, rect.minY),
      new google.maps.LatLng(rect.maxX, rect.maxY))) ;    
    this.bounds.setMap( this.map ) ;

    return this.bounds;    
}

EditablePolygon.prototype.hide = function ()
{
    this.area.setMap( null ) ;
    this.center.setMap( null ) ;
    this.bounds.setMap( null ) ;
}

EditablePolygon.prototype.show = function ( m )
{
    if( m === undefined )
        m = this.map ;
        
    this.area.setMap( m ) ;
}

function toRadians( deg )
{
    return deg * (3.14159265/180.0)
}

function toDegrees( rad )
{
    return rad * (180.0/3.14159265)
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
