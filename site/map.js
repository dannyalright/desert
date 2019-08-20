// Initiate Leaflet map
const cornerTopLeft = L.latLng(48.16, -124.0);
const cornerBottomRight = L.latLng(24.28, -66.44);
const bounds = L.latLngBounds(cornerTopLeft, cornerBottomRight);
const map = L.map("map", {
  zoomControl: false,
  attributionControl: false,
  scrollWheelZoom: false,
  boxZoom: false,
  doubleClickZoom: false,
  scrollWheelZoom: false,
  dragging: false
}).fitBounds(bounds);

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
  {
    maxZoom: 18
  }
).addTo(map);

// Set up Carto API
const client = new carto.Client({
  apiKey: "default_public",
  username: "jleland00"
});

// const client = new carto.Client({
//   apiKey: `${process.env.MAP_API_KEY}`,
//   username: `${process.env.MAP_API_KEY}`
// });

// Set intial 2000 aridity map polygons
const source = new carto.source.SQL("SELECT * FROM table_2000_aridity");
const style = new carto.style.CartoCSS(`
    #layer {
      polygon-fill: ramp([column_2000_aridity_zone], (#52c406, #ffd52b, #268455, #ec650a, #73AF48, #e41b04, #666666), ("Dry Subhumid", "Semi-Arid", "Humid", "Arid", null, "Hyperarid"), "=");
    }
  `);
const aridityLayer = new carto.layer.Layer(source, style);

// Talk to checkboxes
function set2000() {
  source.setQuery("SELECT * FROM table_2000_aridity");
  style.setContent(`
    #layer {
      polygon-fill: ramp([column_2000_aridity_zone], (#52c406, #ffd52b, #268455, #ec650a, #73AF48, #e41b04, #666666), ("Dry Subhumid", "Semi-Arid", "Humid", "Arid", null, "Hyperarid"), "=");
    }
  `);
}

function set2060() {
  source.setQuery("SELECT * FROM table_2060_aridity");
  style.setContent(`
    #layer {
      polygon-fill: ramp([column_2060_projection], (#52c406, #ffd52b, #268455, #ec650a, #73AF48, #e41b04, #666666), ("Dry Subhumid", "Semi-Arid", "Humid", "Arid", null, "Hyperarid"), "=");
    }
  `);
}

// Set state outlines
const outlineSource = new carto.source.SQL(
  "SELECT * FROM ne_50m_admin_1_states"
);
const outlineStyle = new carto.style.CartoCSS(`
  #layer {
    polygon-fill: #826dba;
    polygon-opacity: 0;
  }
  #layer::outline {
    line-comp-op: soft-light;
    line-width: 2;
    line-color: #FFFFFF;
    line-opacity: 1;
  }
  `);
const outlineLayer = new carto.layer.Layer(outlineSource, outlineStyle);

// Add aridity layer to map
client.addLayer(aridityLayer);

// Add outline layer to map
client.addLayer(outlineLayer);

// Add map to page
client.getLeafletLayer().addTo(map);
