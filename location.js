function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayForecast, showError, {
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

async function displayForecast(position){
  const openMeteoData = await getOpenMeteoData(position);

  create_chart(openMeteoData);

}

async function getOpenMeteoData(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Build the API URL (example with temperature and wind speed)
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=shortwave_radiation&forecast_days=3`;

  // Make the HTTP GET request
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json(); // Parse response as JSON
  console.log('API response:', data); // Work with the JSON data
  const dates = data.hourly.time;
  const radiationValues = data.hourly.shortwave_radiation;

  console.log('Combined Data:', radiationValues); 
  const dataset = {x: dates, y:radiationValues};
  return dataset;

}

function create_chart(dataset1){

  const dates = dataset1.x;
  const radiationValues = dataset1.y;

  const now = new Date();
  const hours = [];
  const colors = [];

  dates.forEach((d, index) => {
    date = new Date(d);
    if(date.getDate() === now.getDate() && date.getHours() === now.getHours()){
      colors.push('#0096FF');
      hours.push('now');
    } else {
      colors.push('#9BD0F5');
      hours.push(date.getHours()); 
    }
  });

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
}

