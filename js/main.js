// Using Leaflet for creating the map and adding controls for interacting with the map

//
//--- Part 1: adding base maps ---
//

//creating the map; defining the location in the center of the map (geographic coords) and the zoom level. These are properties of the leaflet map object
//the map window has been given the id 'map' in the .html file

var map = L.map('map', {
	center: [50.9, 10.45],
	zoom: 8
});

//adding base map/s 
// add open street map and carto as base layers

var osmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

/*var carto = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO'
});
*/

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors | Map style: &copy; OpenTopoMap',
    maxZoom: 17
});


// Add Tree Cover Layer from ArcGIS MapServer tile

var treelosstiles = L.tileLayer("https://tiles.arcgis.com/tiles/Sf0q24s0oDKgX14j/arcgis/rest/services/TreeCoverAndTreeLoss_allScale/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Hansen/UMD/Google/USGS/NASA",
    maxZoom: 19, 
}).addTo(map);


/*
// add the DLR forest canopy loss WMS layer
var treeloss =  L.tileLayer.wms('https://geoservice.dlr.de/eoc/land/wms', {
    layers: 'TREE_CANOPY_COVER_LOSS_PERC_ALLFOREST_P1Y',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: '© DLR EOC Geoservice'
  });
*/


//
//---- Part 2: Adding a scale bar
//

L.control.scale({position:'bottomright',imperial:false}).addTo(map);

// Remove default zoom control
map.zoomControl.remove();

// Add zoom control to top-right
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

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

var europe = L.geoJson(europe, {
    style: {
        color: "#ffffffa0",           // stroke (border) color
        weight: 2,                      // stroke width
        opacity: 1,                     // stroke opacity
        fillColor: "#ffffffff",       // fill color
        fillOpacity: 1                // fill opacity
    }
}).addTo(map);


//Adding the federal state of Thuringia to enable zoom-to function 
var Thuringia;

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

Thuringia = L.geoJson(Thuringia, {
    style: {
		color: "#696969",
		weight: 1.5},
        fillColor: "#ffffff",   // fill color
        fillOpacity: 0,
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
        // Get the value from attribute colmn
        var value = feature.properties["Anzahl"];
        
        // Scale the radius 
        var radius = value * 0.0001; 
        
        // Proportional circle marker
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

//adding attribution for bark beetle data
map.attributionControl.addAttribution('Bark beetle data © Hauptstelle für Waldschutz des Forstlichen Forschungs- und Kompetenzzentrums Gotha');

//
//---- Part 8: Adding a layer control for base maps and feature layers
//
//list of layers for layer control
var features = {
	"Bark Beetle Monitoring 2023": barkbeetles2023,
    "Tree Cover": treelosstiles,
    "Mask for Federal State of Thuringia": europe
}

var baselayers = {
    "Open Street Map": osmap,
	"Open Topo Map": topo
    //"Carto Light": carto
}


//the legend uses the layer control with entries for the base maps and two of the layers we added
//in case either base maps or features are not used in the layer control, the respective element in the properties is null

L.control.layers(baselayers, features, {position:'topright', collapsed: false}).addTo(map);

//custom legend
const legend = L.control({ position: 'topright' });

legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');

    // Legend container styling
    div.style.backgroundColor = 'white';
    div.style.padding = '8px';
    div.style.border = '1px solid #ccc';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';

    div.innerHTML = `
        <!-- Bark beetle circles -->
        <div style="font-weight: bold; margin-bottom: 6px;">Amount of bark beetles caught in 2023</div>
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <span style="width: 24px; height: 24px; background: #821520; border-radius: 50%; display: inline-block;"></span>
                <span style="margin-top: 4px;">200,000</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <span style="width: 16px; height: 16px; background: #821520; border-radius: 50%; display: inline-block;"></span>
                <span style="margin-top: 4px;">100,000</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <span style="width: 12px; height: 12px; background: #821520; border-radius: 50%; display: inline-block;"></span>
                <span style="margin-top: 4px;">5,000</span>
            </div>
        </div>

        <!-- Gap between categories -->
        <div style="height: 10px;"></div>

        <!-- Tree cover rectangles -->
        <div style="font-weight: bold; margin-bottom: 6px;">Tree Cover</div>
        <div class="legend-item" style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="width: 20px; height: 20px; background: #468b4d; display: inline-block; margin-right: 6px;"></span>
            <span>Currently existing</span>
        </div>
        <div class="legend-item" style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="width: 20px; height: 20px; background: #fdae61; display: inline-block; margin-right: 6px;"></span>
            <span>Damaged</span>
        </div>
    `;

    return div;
};

legend.addTo(map);



//Introduction text and images 
const intro = L.control({ position: 'topleft' });

intro.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');

    // Container styling
    div.style.backgroundColor = 'white';
    div.style.padding = '10px';
    div.style.border = '1px solid #ccc';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
    div.style.maxWidth = '400px'; 
    div.style.fontFamily = '"Helvetica Neue", Arial, sans-serif';

    div.innerHTML = `
        <!-- Top section with image + headings -->
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <!-- Image -->
            <img src="data/15LifeonLand_edit.png" alt="SDG15" style="height: 4em; width: auto; border-radius: 3px;">

            <!-- Texts -->
            <div>
                <div style="font-weight: bold; color: #468b4d; font-size: 1.7em;">What is Happening to the Forest?</div>
                <div style="font-weight: bold; color: #468b4d; font-size: 1.4em;">Tree Loss in Thuringia, Germany</div>
            </div>
        </div>
        
        <!-- Gap between categories -->
        <div style="height: 10px;"></div>

        <!-- SDG15 -->
        <div style="font-size: 1.2em; color: #468b4d; line-height: 1.4;">
            Sustainable Development Goal 15.2 by the United Nations promotes the sustainable management of all forests by halting deforestation, 
            restoring degraded forests, and significantly increasing global afforestation and reforestation.
        </div>

        <!-- Gap between categories -->
        <div style="height: 10px;"></div>
        
        <div style="font-weight: bold; color: #468b4d; font-size: 1.4em;">Can you spot the difference?</div>
        
        <!-- Gap between categories -->
        <div style="height: 10px;"></div>
       
        <!-- Image -->
            <img src="data/BarkBeetleImage2.jpg" alt="HealthyForest" style="height: 16em; width: auto; border-radius: 4px;">
            <img src="data/BarkBeetleImage.jpg" alt="ForestDecline" style="height: 16em; width: auto; border-radius: 4px;">

        <!-- Gap between categories -->
        <div style="height: 10px;"></div>
        
        
        <div style="font-weight: bold; color: #821520; font-size: 1.4em;">Bark Beetle Infestation and its Consequences</div>
        
        <!-- Gap between categories -->
        <div style="height: 10px;"></div>

        <!-- Introductory text -->
        <div style="font-size: 1.2em; color: #821520; line-height: 1.4;">
            Climate change is putting our forests at risk. 
            Next to other hazards, such as wild fires, longer periods of drought weaken spruce trees 
            and allow the bark beetle to spread. In a balanced ecosystem this insect is useful for decomposing dead trees. 
            Once it´s population is out of balance the bark beetle becomes a major driver of tree loss and forest decline.
        </div>

        <!-- Gap between categories -->
        <div style="height: 10px;"></div>
        
        <div style="font-weight: bold; color: #821520; font-size: 1.4em;">Explore the Map!</div>
        
        <!-- Gap between categories -->
        <div style="height: 10px;"></div>

        <div style="font-size: 1.2em; color: #821520; line-height: 1.4;">
            Identify areas affected by bark beetle infestation. Click on the points to see the annual beetle catch counts from monitoring stations in 2023. Orange areas highlight regions of tree cover loss.
        </div>
    `;

    return div;
};

intro.addTo(map);
