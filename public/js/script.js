(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })

    async function geocodeLocation(query) {
      if (!query) return null;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        return null;
      }
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name
      };
    }

    function initShowMap() {
      const mapElement = document.getElementById('show-map');
      if (!mapElement || typeof L === 'undefined') return;

      const query = mapElement.dataset.location;
      geocodeLocation(query).then(coords => {
        if (!coords) return;
        const map = L.map(mapElement).setView([coords.lat, coords.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.marker([coords.lat, coords.lng]).addTo(map)
          .bindPopup(coords.displayName || query)
          .openPopup();
      }).catch(() => {
        // fail silently if geocoding fails
      });
    }

    function initLocationPreview() {
      if (typeof L === 'undefined') return;

      const locationInput = document.getElementById('listing-location-input');
      const countryInput = document.querySelector('input[name="listing[country]"]');
      const mapElement = document.getElementById('location-map');
      const coordsElement = document.getElementById('location-coords');

      if (!locationInput || !countryInput || !mapElement) return;

      let map;
      let marker;

      async function updatePreview() {
        const queryParts = [];
        if (locationInput.value) queryParts.push(locationInput.value);
        if (countryInput.value) queryParts.push(countryInput.value);
        const query = queryParts.join(', ');
        if (!query) return;

        const coords = await geocodeLocation(query);
        if (!coords) {
          if (coordsElement) {
            coordsElement.textContent = 'Could not find coordinates for this location.';
          }
          return;
        }

        if (!map) {
          map = L.map(mapElement).setView([coords.lat, coords.lng], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
        } else {
          map.setView([coords.lat, coords.lng], 13);
        }

        if (marker) {
          marker.setLatLng([coords.lat, coords.lng]);
        } else {
          marker = L.marker([coords.lat, coords.lng]).addTo(map);
        }

        if (coordsElement) {
          coordsElement.textContent = `Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)}`;
        }
      }

      locationInput.addEventListener('change', updatePreview);
      countryInput.addEventListener('change', updatePreview);

      // Initialize preview with existing value (edit form)
      updatePreview();
    }

    window.addEventListener('DOMContentLoaded', () => {
      initShowMap();
      initLocationPreview();
    });
  })()