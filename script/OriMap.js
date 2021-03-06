function OriMap( name, coords, infoW )
{
    this.name = name ;
    this.infoWindow = infoW ;
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
    this.area.oriMap = this ;
    google.maps.event.addListener( this.area, 'click', showWindow );
    
    var marker = {
        url: 'img/orimarquers.png',
        size: new google.maps.Size(16, 16),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(8, 8)
    };

    this.center = new google.maps.Marker({
        position: this.getCentroid(),
        map: null,
        title: name,
        icon: marker,
    });
    this.center.oriMap = this ;
    google.maps.event.addListener( this.center, 'click', showWindow );    
    this.size = google.maps.geometry.spherical.computeArea( this.area.getPath() ) / 1000000;

    this.bounds = this.getBounds() ;
}


OriMap.prototype.show = function ( map, minArea )
{
    if( this.size > minArea )
    {
        this.center.setMap( null );
        this.area.setMap( map );
    }
    else
    {
        this.area.setMap( null );
        // We return it, so that it can be added to the marker cluster.
        return this.center ;
    }
}

OriMap.prototype.hide = function ()
{
    this.show( null );
}

OriMap.prototype.isVisible = function ( bounds )
{
    var path = this.area.getPath() ;
    for( i = 0; i < path.length; ++i )
    {
        if( bounds.contains( path.getAt(i) ) )
            return true ;
    }

    return false ;
}

OriMap.prototype.getArea = function ()
{
    return this.size ;
}

OriMap.prototype.getName = function ()
{
    return this.name ;
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

    return {lat: centroid.x, lng: centroid.y};    
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

function makeContentString( oMap )
{
    return '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">' + oMap.getName() + '</h1>'+
    '<div id="bodyContent">'+
    '<p>One special map with some more text.</p>'+
    '</div>'+
    '</div>';
}

function showWindow( ev )
{
    var om = this.oriMap ;
    
    om.infoWindow.setContent( makeContentString( om ) ) ;
    // Using setPosition makes it able to be used for markers and maps alike
    om.infoWindow.setPosition( om.center.position ) ;

    om.infoWindow.open( this.map );
}
