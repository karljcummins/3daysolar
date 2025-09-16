function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(currentHourlyForecast, showError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  } else {
    document.getElementById("location-output").innerHTML = "Geolocation is not supported by this browser.";
  }
}


function showError(error) {
  let message = "";
  switch(error.code) {
    case error.PERMISSION_DENIED:
      message = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      message = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      message = "An unknown error occurred.";
      break;
  }
  document.getElementById("location-output").innerHTML = message;
}

function currentHourlyForecast(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const max_rating = 100;
  const max_annual_reading = 860;
  const rating_adjustment_factor = max_rating / 860;

  // Build the API URL (example with temperature and wind speed)
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=shortwave_radiation&forecast_days=3`;

  // Make the HTTP GET request
  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse response as JSON
  })
  .then(data => {
    console.log('API response:', data); // Work with the JSON data
    const dates = data.hourly.time;
    const hours = dates.map(dt => new Date(dt).getHours());
    const radiationValues = data.hourly.shortwave_radiation;
    const now = new Date();
    const colors = [];

    dates.forEach((d, index) => {
      date = new Date(d);
      if(date.getDate() === now.getDate() && date.getHours() === now.getHours()){
        colors.push('#3B3035');
      } else {
        colors.push('#9BD0F5');
      }
    });

    console.log('Combined Data:', radiationValues); 

    new Chart("forecast_chart", {
      type: "bar",
      data: {
        datasets: [{
          label: 'Forecast GHI (W/m2)',
          data: radiationValues,
          backgroundColor: colors
        }],
        labels:hours
      },
      options: {
        legend: {
          display: true,
        },
      }
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}

