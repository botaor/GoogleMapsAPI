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
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: null,
        bounds: null
    });    
    
    this.area.setMap(map);
    addDeleteButton( this.area, 'poly_del.png');
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

EditablePolygon.prototype.getVertices = function ()
{
    this.area.setOptions({ zIndex: 10 });
    this.bounds.setOptions({ zIndex:0 });

    var vertices = this.area.getPath();

    // Iterate over the vertices.
    var centroid = { x: 0.0, y: 0.0 };
    var rect = { minX: 500.0, minY: 500.0, maxX: -500.0, maxY: -500.0 };
    var str = "";
    var xy ;
    var n = vertices.getLength() ;
    for( var i = 0; i < n; ++i )
    {
        xy = vertices.getAt(i);
        str += xy.lat() + ',' + xy.lng() + '\n';

        centroid.x += xy.lat();
        centroid.y += xy.lng();
        
        if( xy.lat() < rect.minX )
            rect.minX = xy.lat()
        if( xy.lat() > rect.maxX )
            rect.maxX = xy.lat()
        if( xy.lng() < rect.minY )
            rect.minY = xy.lng()
        if( xy.lng() > rect.maxY )
            rect.maxY = xy.lng()
    }    
    centroid.x /= n;
    centroid.y /= n;

    this.center.setPosition( {lat: centroid.x, lng: centroid.y} ) ;
    this.center.setMap( this.area.getMap() ) ;

    this.bounds.setBounds( new google.maps.LatLngBounds(
      new google.maps.LatLng(rect.minX, rect.minY),
      new google.maps.LatLng(rect.maxX, rect.maxY))) ;    
    this.bounds.setMap( this.area.getMap() ) ;

    return str;    
}
