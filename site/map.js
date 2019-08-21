// Initiate Leaflet map
const cornerTopLeft = L.latLng(48.16, -124.0);
const cornerBottomRight = L.latLng(24.28, -66.44);
const bounds = L.latLngBounds(cornerTopLeft, cornerBottomRight);

const mapOne = L.map("mapOne", {
  zoomControl: false,
  attributionControl: false,
  scrollWheelZoom: false,
  boxZoom: false,
  doubleClickZoom: false,
  scrollWheelZoom: false,
  dragging: false
}).fitBounds(bounds);

const mapTwo = L.map("mapTwo", {
  zoomControl: false,
  attributionControl: false,
  scrollWheelZoom: false,
  boxZoom: false,
  doubleClickZoom: false,
  scrollWheelZoom: false,
  dragging: false
}).fitBounds(bounds);

// L.tileLayer(
//   "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
//   {
//     maxZoom: 18
//   }
// ).addTo(mapOne);

// L.tileLayer(
//   "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
//   {
//     maxZoom: 18
//   }
// ).addTo(mapTwo);

// Set up Carto API
const clientOne = new carto.Client({
  apiKey: "default_public",
  username: "jleland00"
});

const clientTwo = new carto.Client({
  apiKey: "default_public",
  username: "jleland00"
});

// const client = new carto.Client({
//   apiKey: `${process.env.MAP_API_KEY}`,
//   username: `${process.env.MAP_API_KEY}`
// });

// Set intial 2000 aridity map polygons
const source2000 = new carto.source.SQL("SELECT * FROM table_2000_aridity");
const style2000 = new carto.style.CartoCSS(`
    #layer {
      polygon-fill: ramp([column_2000_aridity_zone], (#52c406, #ffd52b, #268455, #ec650a, #73AF48, #e41b04, #666666), ("Dry Subhumid", "Semi-Arid", "Humid", "Arid", null, "Hyperarid"), "=");
    }
  `);
const aridityLayer2000 = new carto.layer.Layer(source2000, style2000);

//
const source2060 = new carto.source.SQL("SELECT * FROM table_2060_aridity");
const style2060 = new carto.style.CartoCSS(`
    #layer {
        polygon-fill: ramp([column_2060_projection], (#ffe600, #ff6701, #42c709, #128125, #87C55F, #e73600, #B3B3B3), ("Semi-Arid", "Arid", "Dry Subhumid", "Humid", null, "Hyperarid"), "=");
    }
  `);
const aridityLayer2060 = new carto.layer.Layer(source2060, style2060);

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
clientOne.addLayer(aridityLayer2000);

// Add outline layer to map
clientOne.addLayer(outlineLayer);

// Add map to page
clientOne.getLeafletLayer().addTo(mapOne);

// Add aridity layer to map
clientTwo.addLayer(aridityLayer2060);

// Add outline layer to map
clientTwo.addLayer(outlineLayer);

// Add map to page
clientTwo.getLeafletLayer().addTo(mapTwo);
