import "mapbox-gl/dist/mapbox-gl.css";
import * as React from "react";
import "./renderMap.css";
import mapboxgl from "mapbox-gl";
import { Navigate, useNavigate } from "react-router-dom";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2NobGVjaHRlciIsImEiOiJjbGdqYmV0enAwMHp1M2RxcW41cHlzaGgwIn0.ZOqUOagi52sjIg3_bLSYdQ";

export default function RenderMap(props) {
  const queryString = window.location.search;
  const urlSearchParams = new URLSearchParams(queryString);
  const addresses = urlSearchParams.getAll("addresses");
  console.log(addresses);
  const navigate = useNavigate();

  if (addresses.length == 2) {
    var address1 = addresses[0];
    var address2 = addresses[1];
  }

  const [to, setTo] = React.useState(null);
  const [from, setFrom] = React.useState(null);
  const [distance, setDistance] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  async function get_val() {
    const res = await fetch(`https://geocode.maps.co/search?q={${address1}}`, {
      method: "GET",
    });
    const resp = await res.json();

    const toPoint = [resp[0].lon, resp[0].lat];
    setTo(toPoint);

    const res2 = await fetch(`https://geocode.maps.co/search?q={${address2}}`, {
      method: "GET",
    });

    const resp2 = await res2.json();
    const fromPoint = [resp2[0].lon, resp2[0].lat];
    setFrom(fromPoint);

    const res3 = await fetch(
      `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${resp[0].lat},${resp[0].lon}&destinations=${resp2[0].lat},${resp2[0].lon}&travelMode=driving&key=Ai1TzwjShWGCR98HfRW_6gRDbEJfescVr3DBRwpRkmsnHm0ZiJYgDbnSyqsUGKe_`,
      {
        method: "GET",
      }
    );
    const resp3 = await res3.json();
    console.log(
      "dist",
      resp3.resourceSets[0].resources[0].results[0].travelDistance
    );
    setDistance(resp3.resourceSets[0].resources[0].results[0].travelDistance);

    setLoading(true);

    console.log("exit");
    console.log(toPoint, fromPoint, distance);
  }

  React.useEffect(() => {
    if (addresses.length < 2) {
      console.log("entry");
      navigate("/quoterequests");
    }
    get_val();
  }, []);

  React.useEffect(() => {
    var map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/mapbox/streets-v11",
      center: [79.384, 21.101],
      zoom: 5,
    });

    map.on("load", () => {
      if (to && from) {
        var greenMarker = new mapboxgl.Marker({ color: "red" })
          .setLngLat(to)
          .addTo(map);

        var purpleMarker = new mapboxgl.Marker({ color: "green" })
          .setLngLat(from)
          .addTo(map);
      }
    });

    console.log("dist", distance);

    if (distance !== null) {
      var value = document.getElementById("map-overlay");
      value.innerHTML = "Distance: " + distance.toFixed([2]) + " kms";
    }
  }, [loading]);

  return (
    <div id="map-container">
      <div id="map"></div>
      <div id="map-overlay">Distance: </div>
    </div>
  );
}
