let lat, lon, weatherInfo;
const button = document.querySelector("button");
const one = document.querySelector(".one");
const two = document.querySelector(".two");
const file = document.querySelector("#file");

file.addEventListener("change", function (e) {
  submitImg(e);
});

button.addEventListener("click", async (event) => {
  const mood = document.getElementById("mood").value;
  const timestamp = Date.now();

  const data = { lat, lon, mood, timestamp, fileSource };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch("/api", options);
  const json = await response.json();
  console.log(json);

  const root = document.createElement("div");
  root.classList.add("wrapper");
  const moodDiv = document.createElement("div");
  moodDiv.textContent = `mood: ${data.mood}`;
  const geo = document.createElement("div");
  geo.textContent = `location: ${data.lat}º, ${data.lon}º`;
  const date = document.createElement("div");
  const dateString = new Date(data.timestamp).toLocaleString();
  date.textContent = dateString;
  const image = document.createElement("img");
  image.style = `width:500px; object-fit:contain;`;
  image.src = fileSource;

  root.append(mood, geo, date, image);
  two.append(root);
});

if ("geolocation" in navigator) {
  console.log("geolocation available");
  navigator.geolocation.getCurrentPosition(async (position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    document.getElementById("lat").textContent = lat;
    document.getElementById("lon").textContent = lon;
    try {
      // const sendGeo = await fetch(`/weather`);
      const sendGeo = await fetch(`/weather/lat/${lat}/lon/${lon}`);
      const response = await sendGeo.json();
      weatherInfo = response;

      //displaying weather info
      const weatherHTML = document.createElement("p");
      weatherHTML.innerHTML = `Papucho, vos estás en ${weatherInfo.location.country}, más específicamente en la ciudad de ${weatherInfo.location.name}.
      El clima está así mirá </p><img src="${weatherInfo.current.weather_icons[0]}" style="width:100px;"><p>. Nececsitas mas info?? `;
      one.append(weatherHTML);
      console.log(response);
    } catch (error) {
      console.error("hubo un ERROR" + error);
    }
  });
} else {
  console.log("geolocation not available");
}

async function getData() {
  const response = await fetch("/api");
  const data = await response.json();
  console.log(data);

  for (const item in data) {
    const root = document.createElement("div");
    root.classList.add("wrapper");
    const mood = document.createElement("div");
    mood.textContent = `mood: ${data[item].mood}`;
    const geo = document.createElement("div");
    geo.textContent = `location: ${data[item].lat}º, ${data[item].lon}º`;
    const date = document.createElement("div");
    const dateString = new Date(data[item].timestamp).toLocaleString();
    date.textContent = dateString;
    const image = document.createElement("img");
    image.style = `width:500px; object-fit:contain;`;
    image.src = data[item].fileSource;

    root.append(mood, geo, date, image);
    two.append(root);
  }
}

getData();

// P5
let fileSource;
let blob;
let blobURL;
function submitImg(e) {
  e.preventDefault();
  let file = e.target;
  if (!file.value.length) return;
  let reader = new FileReader();
  console.log(e, reader);
  reader.onloadend = async (ev) => {
    document.querySelector(".cargando").classList.add("tachado");
    console.log(ev, reader);
    const img = new Image();
    img.classList.add("mini");
    fileSource = reader.result;

    img.src = fileSource;
    one.append(img);
  };
  reader.onprogress = () => {
    const div = document.createElement("div");
    div.classList.add("cargando");
    div.innerHTML = "<p> CARGANDO PAPU </p>";
    one.appendChild(div);
  };

  reader.readAsDataURL(file.files[0]);
}

function setup() {
  noCanvas();
}
