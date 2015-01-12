function sleep(delay)
{
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
      
var map = null ;
var myMaps = [] ;
var visibleMaps = [] ;
var infoW = null ;

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
    var i ;
    for( i = 0; i < visibleMaps.length; ++i )
    {
        visibleMaps[i].hide() ;
    }
    visibleMaps = []
    for( i = 0; i < myMaps.length; ++i )
    {
        if( myMaps[i].isVisible( bounds ) )
            visibleMaps.push( myMaps[i] ) ;
    }
    
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

    for( i = 0; i < visibleMaps.length; ++i )
    {
        visibleMaps[i].show( map, minArea ) ;
    }
}    

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
    var coords ;
    myMaps = [] ;
    
    coords = [
        new google.maps.LatLng(38.78820335964493,-9.381004803076166),
        new google.maps.LatLng(38.79489326430675,-9.389072887792963),
        new google.maps.LatLng(38.79382292175236,-9.401604168310541),
        new google.maps.LatLng(38.789608292998146,-9.405037395849604),
        new google.maps.LatLng(38.78117828663811,-9.400745861425776),
        new google.maps.LatLng(38.7804422862835,-9.387184612646479),
    ];    
    myMaps.push( new OriMap( "Palácio Sintra", coords, infoW ) ) ;

    coords = [
        new google.maps.LatLng(38.71322973485406,-9.253975384130854),
        new google.maps.LatLng(38.71309578975657,-9.261871807470698),
        new google.maps.LatLng(38.70713497882959,-9.262987606420893),
        new google.maps.LatLng(38.700838751550684,-9.25955437888183),
        new google.maps.LatLng(38.70097271961232,-9.25680779685058),
        new google.maps.LatLng(38.702647299207825,-9.253717892065424),
        new google.maps.LatLng(38.70271428157601,-9.250456325903315),
        new google.maps.LatLng(38.70907732036694,-9.244555466070551),
        new google.maps.LatLng(38.71751584561367,-9.25058507193603),
    ];    
    myMaps.push( new OriMap( "Jamor", coords, infoW ) ) ;

    coords = [
        new google.maps.LatLng(39.07136671453458,-8.447038166418452),
        new google.maps.LatLng(39.07574787193005,-8.45083617438354),
        new google.maps.LatLng(39.07546468746928,-8.456264965429682),
        new google.maps.LatLng(39.071766527247824,-8.46205853690185),
        new google.maps.LatLng(39.06776829835274,-8.465577595129389),
        new google.maps.LatLng(39.0646361941391,-8.465084068670649),
        new google.maps.LatLng(39.06263690604749,-8.462959759130854),
        new google.maps.LatLng(39.06160391830709,-8.458475105657953),
        new google.maps.LatLng(39.06250361815611,-8.450728886022944),
        new google.maps.LatLng(39.06550253468199,-8.445707790747065),
    ];    
    myMaps.push( new OriMap( "Lamarosa", coords, infoW ) ) ;
    
    coords = [
        new google.maps.LatLng(40.00851087438587,-8.888207905187983),
        new google.maps.LatLng(40.00614412402224,-8.912068836584467),
        new google.maps.LatLng(39.97931522136828,-8.908463947668452),
        new google.maps.LatLng(39.98654954226223,-8.887607090368647),
        new google.maps.LatLng(39.99720232916462,-8.888551227941889),
        new google.maps.LatLng(39.99864887449919,-8.885375492468256),
    ];    
    myMaps.push( new OriMap( "Osso da Baleia", coords, infoW ) ) ;
    
    coords = [
        new google.maps.LatLng(40.0003583924251,-8.449784748449702),
        new google.maps.LatLng(39.99956939054439,-8.456136219396967),
        new google.maps.LatLng(39.98832512445314,-8.45853947867431),
        new google.maps.LatLng(39.98115676116251,-8.455964558020014),
        new google.maps.LatLng(39.980893687604805,-8.449613087072748),
        new google.maps.LatLng(39.989311537768494,-8.446866505041498),
    ];    
    myMaps.push( new OriMap( "Vale Florido", coords, infoW ) ) ;
    
    coords = [
        new google.maps.LatLng(40.939152377977074,-7.403165333166498),
        new google.maps.LatLng(40.94155130367417,-7.411662571325678),
        new google.maps.LatLng(40.938114977717774,-7.424794666662592),
        new google.maps.LatLng(40.919309276825366,-7.424966328039545),
        new google.maps.LatLng(40.91956870224039,-7.404195301428217),
    ];    
    myMaps.push( new OriMap( "Serra do Sirigo", coords, infoW ) ) ;
    
    coords = [
        new google.maps.LatLng(40.35801173906583,-8.789502613439936),
        new google.maps.LatLng(40.357423099540796,-8.794223301306147),
        new google.maps.LatLng(40.34015405419317,-8.801518909826655),
        new google.maps.LatLng(40.342182087919625,-8.785811893835444),
    ];    
    myMaps.push( new OriMap( "Tocha 2", coords, infoW ) ) ;
    
    coords = [
        new google.maps.LatLng(40.36527120398361,-8.791047565832514),
        new google.maps.LatLng(40.365303902507435,-8.80535983313598),
        new google.maps.LatLng(40.36075865556474,-8.80413674582519),
        new google.maps.LatLng(40.360562450955015,-8.809072010412592),
        new google.maps.LatLng(40.346499634069666,-8.806153767004389),
        new google.maps.LatLng(40.34754627030646,-8.798514835729975),
    ];    
    myMaps.push( new OriMap( "Tocha 1", coords, infoW ) ) ;
}
