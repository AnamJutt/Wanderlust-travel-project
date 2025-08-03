// Replace with your real API key
const myAPIKey = "<%= process.env.GEOAPIFY_KEY %>"; // Your real key

const map = L.map('map').setView([20, 0], 2);

L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${myAPIKey}`, {
    attribution: 'Powered by Geoapify | © OpenMapTiles © OpenStreetMap contributors',
    maxZoom: 20
}).addTo(map);


// Add Geoapify search control
// const searchControl = new L.Control.GeoapifyAddressSearch(myAPIKey, {
//     position: 'topright',
//     placeholder: 'Search for a location',
//     resultCallback: (result) => {
//         if (result && result.geometry) {
//             const lat = result.geometry.coordinates[1];
//             const lon = result.geometry.coordinates[0];
//             map.setView([lat, lon], 13);

//             // Add marker
//             L.marker([lat, lon]).addTo(map)
//                 .bindPopup(result.properties.formatted)
//                 .openPopup();
//         }
//     }
// });

// map.addControl(searchControl);
