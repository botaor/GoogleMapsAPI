function OriMap( name, coords )
{
    this.name = name ;
    // Construct the polygon.
    this.area = new google.maps.Polygon({
        paths: coords,
        strokeColor: '#888888',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#888888',
        fillOpacity: 0.35,
        map: null,
    });
    this.center = new google.maps.Marker({
        position: {lat: 0.0, lng: 0.0},
        map: null,
        title: name
    });
    this.center.position = this.getCentroid() ;
    this.size = google.maps.geometry.spherical.computeArea( this.area.getPath() );

    this.bounds = this.getBounds() ;
}


OriMap.prototype.show = function ( map )
{
    this.area.setMap(map);
}

OriMap.prototype.hide = function ()
{
    this.show( null );
}

OriMap.prototype.getArea = function ()
{
    return this.size ;
}

OriMap.prototype.getCentroid = function ()
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

OriMap.prototype.getBounds = function ()
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

    return new google.maps.LatLngBounds(
      new google.maps.LatLng(rect.minX, rect.minY),
      new google.maps.LatLng(rect.maxX, rect.maxY)) ;    
}
