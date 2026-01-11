// Using Leaflet for creating the map and adding controls for interacting with the map

//
//--- Part 1: adding base maps ---
//

//creating the map; defining the location in the center of the map (geographic coords) and the zoom level. These are properties of the leaflet map object
//the map window has been given the id 'map' in the .html file
var map = L.map('map', {
	center: [50.9, 11.05],
	zoom: 8
});


//adding base map/s 

// add open street map as base layer
var osmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});
 
// add the DLR forest canopy loss WMS layer
 var treeloss =  L.tileLayer.wms('https://geoservice.dlr.de/eoc/land/wms', {
    layers: 'TREE_CANOPY_COVER_LOSS_PERC_ALLFOREST_P1Y',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: '© DLR EOC Geoservice'
  });




// for using the two base maps in the layer control, I defined a baseMaps variable
/*var baseMaps = {
	"Open Street Map": osmap
}
*/

//
//---- Part 2: Adding a scale bar
//

L.control.scale({position:'bottomright',imperial:false}).addTo(map);

//
//---- Part 3: adding GeoJSON line features 
//

//Task: please add here the GEOJSON line features contained in the mwalk file


//
//---- Part 4: adding an event to the map
//

//when you click in the map, an alert with the latitude and longitude coordinates of the click location is shown
//This is the event object that is created on mouse click

//Task: change the event type from click to doubleclick

/*
map.addEventListener('click', function(e) {
    alert(e.latlng);
});
*/



//the same functionality can be realized with reference to the function onClick

/*
//definition of the function onClick
function onClick(evt){
	alert(evt.latlng);
}
*/
//map.addEventListener('click', onClick);

//short version (on is an alias for addEventListener):
//map.on('click', onClick);


//
//---- Part 5: Adding GeoJSON features and interactivity
//

//Adding a mask of the federal state of Thuringia to highlight the area of interest 
//when basemaps are activated Thuringia stands out

var germany = L.geoJson(germany, {
    style: {
        color: "#ffffffa0",           // stroke (border) color
        weight: 2,                      // stroke width
        opacity: 1,                     // stroke opacity
        fillColor: "#ffffffff",       // fill color
        fillOpacity: 0.8                // fill opacity
    }
}).addTo(map);


//Adding the federal state of Thuringia to enable zoom-to function 
var Thuringia;

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

Thuringia = L.geoJson(Thuringia, {
    style: {
		color: "#ffffff",
		weight: 1.5},
    onEachFeature: function (feature, layer) {
        layer.on('click', zoomToFeature);}
		//you can also write:
		//layer.on({click: zoomToFeature}); }
});


Thuringia.addTo(map); 




//
//---- Part 6: Adding GeoJSON features and several forms of interactivity
//comment out part 5 before testing part 6
 

function highlightFeature(e) {
    var activefeature = e.target;  //access to activefeature that was hovered over through e.target
	
    activefeature.setStyle({
        weight: 5,
        color: '#2a2a2aff',
        dashArray: '',
        fillOpacity: 1
    });
	
    if (!L.Browser.ie && !L.Browser.opera) {
        activefeature.bringToFront();
    }
}


//function for resetting the highlight
function resetHighlight(e) {
	barkbeetles2023.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

//to call these methods we need to add listeners to our features

function interactiveFunction(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
   } );
}

/*
var myParkStyle = {
    color: "#D34137",
    weight: 5,
    opacity: 0.65
}

parks = L.geoJson(npark, {
    style: myParkStyle,
    onEachFeature: interactiveFunction
}).addTo(map); 
 
*/


//
//---- Part 7: adding GeoJSON point features to marker object
//

//Task: extend the content of the Popup with the height information and the latlng coordinates of the summits

//option to represent bark beetle data with beetle icon

/*
 var myIconkafer = L.icon({
	iconUrl: 'css/images/kafer.png',
	iconSize: [18, 18]
}); 


var barkbeetles2023 = L.geoJson(barkbeetles2023, {
	pointToLayer: function(feature, latlng) {
		return  L.marker(latlng, {icon:myIconkafer, title: "Bark Beetle Catch Counts 2023"});
	},
	onEachFeature: function(feature, marker) {
		marker.bindPopup("Catch Counts: " +'<br>'+'<b>' +feature.properties.AnzahlBuchdrucker);
	}
});

barkbeetles2023.addTo(map);
*/

var barkbeetles2023 = L.geoJson(barkbeetles2023, {
    pointToLayer: function(feature, latlng) {
        // Get the value from your property
        var value = feature.properties["Anzahl"];
        
        // Scale the radius (you can adjust the multiplier for better visual effect)
        var radius = value * 0.0002; // for example, 0.0002 pixels per unit
        
        // Return a proportional circle marker
        return L.circleMarker(latlng, {
            radius: radius,
            fillColor: "#821520",
            color: "#821520",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    },
   // Add popup with annual beetle catch count
    onEachFeature: function(feature, layer) {
        //pop up
        layer.bindPopup("Annual Beetle Catch Count: " + feature.properties["Anzahl"]);
        // interactivity (hover + zoom)
        interactiveFunction(feature, layer);
    }

});

barkbeetles2023.addTo(map);


//
//---- Part 8: Adding a layer control for base maps and feature layers
//

//the variable features lists layers that I want to control with the layer control
var features = {
	"Bark Beetle Monitoring 2023": barkbeetles2023,
    "Tree Canopy Loss in % (2018-2021)": treeloss,
    "Open Street Map": osmap,
    "Mask of Thuringia": germany
}

//the legend uses the layer control with entries for the base maps and two of the layers we added
//in case either base maps or features are not used in the layer control, the respective element in the properties is null

L.control.layers(null, features, {position:'topleft'}).addTo(map);






