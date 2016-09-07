function quip() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "/qotd", true);
  xmlhttp.onload = function(e) {
    document.getElementById("quip").innerHTML= xmlhttp.responseText;
  }
  xmlhttp.send();
};

function imageLocate(photoid) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/qotd/flickr/locate?id="+photoid, true);
  xhr.timeout = 2000;
  xhr.onload = function(e) {
    if(xhr.readyState === 4 && xhr.status === 200) {
      window.flickrimg_geolocation = JSON.parse(xhr.responseText);
      getNearbyMeasurement(window.flickrimg_geolocation.latitude, flickrimg_geolocation.longitude);
    }
  }
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.ontimeout = function (e) {
    console.error("timed out: "+xhr.statusText);
  };
  xhr.send(null);
}

function getNearbyMeasurement(latitude, longitude) {
  var xhr = new XMLHttpRequest();
  window.flickrimg_measurement = {};
  var measureElt = document.getElementById("scmeasurement");
  measureElt.style.display="none";
  xhr.open("GET", "/qotd/sc/measurement?lat="+latitude+"&lon="+longitude, true);
  xhr.timeout = 2000;
  xhr.onload = function(e) {
    if(xhr.readyState === 4 && xhr.status === 200) {
      window.flickrimg_measurement = JSON.parse(xhr.responseText);
      if (window.flickrimg_measurement.value != undefined) {
        var text = window.flickrimg_measurement.value + " "+window.flickrimg_measurement.unit
        measureElt.innerText=text;
        measureElt.style.display="inline";
        console.log(window.flickrimg_measurement);
      }
    }
  }
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.ontimeout = function (e) {
    console.error("timed out: "+xhr.statusText);
  };
  xhr.send(null);
}

function flickrimg() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "/qotd/flickr", true);
  xmlhttp.timeout = 2000;
  xmlhttp.onload = function(e) {
  if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
    imgjson = JSON.parse(xmlhttp.responseText);
    imgWebUrl = "https://www.flickr.com/photos/"+imgjson.owner+"/"+imgjson.id;
    //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
    var imgElt = document.getElementById("image");
    var width = imgElt.offsetWidth
    var imgUrlExt = ""; // defaults to the medium, 500 on longest side
    switch(true) {
      case width < 480:
      imgUrlExt = "_n";
      break;
      case width < 800:
      imgUrlExt = "_z";
      break;
      case width < 1600:
      imgUrlExt = "_b";
      break;
    }
    var imgDate = new Date(Date.parse(imgjson.datetaken)).toDateString();
    imgurl = "https://farm"+imgjson.farm+".staticflickr.com/"+imgjson.server+"/"+imgjson.id+"_"+imgjson.secret+imgUrlExt+".jpg"
    imgElt.innerHTML='<figure><a href="'+imgWebUrl+'"><img class="flickr-wrapper u-max-full-width" src="'+imgurl+'" style="width: '+width+'px; height=auto"></a><figcaption class="flickr-title">'+imgjson.title+'&mdash;'+imgDate+'</figcaption></figure>';
      imageLocate(imgjson.id);
    } else {
      console.error(xmlhttp.statusText);
    }
  };
  xmlhttp.onerror = function (e) {
    console.error(xmlhttp.statusText);
  };
  xmlhttp.ontimeout = function (e) {
    console.error(xmlhttp.statusText);
  };
  xmlhttp.send(null);
  setTimeout(flickrimg, 20000);
};
