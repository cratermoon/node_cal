function quip() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "/", true);
  xmlhttp.onload = function(e) {
    document.getElementById("quip").innerHTML= xmlhttp.responseText;
  }
  xmlhttp.send();
};

function imageLocate(photoid, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/flickr/locate?id="+photoid, true);
  xhr.timeout = 3000;
  xhr.onload = function(e) {
    if(xhr.readyState === 4 && xhr.status === 200) {
      window.flickrimg_geolocation = JSON.parse(xhr.responseText);
      callback();
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

function getNearbyMeasurement() {
  var xhr = new XMLHttpRequest();
  window.flickrimg_measurement = {};
  var measureElt = document.getElementById("scmeasurement");
  measureElt.style.display="none";
  var warningElt = document.getElementById("radiation-warning");
  warningElt.style.display="none";
  var latitude = window.flickrimg_geolocation.latitude;
  var longitude = flickrimg_geolocation.longitude;
  xhr.open("GET", "/sc/measurement?lat="+latitude+"&lon="+longitude, true);
  xhr.timeout = 2000;
  xhr.onload = function(e) {
    if(xhr.readyState === 4 && xhr.status === 200) {
      window.flickrimg_measurement = JSON.parse(xhr.responseText);
      if (window.flickrimg_measurement.value != undefined) {
        var imgElt = document.getElementById("flickr-image");
        imgElt.style.outline = "yellow inset thin";
        if (window.flickrimg_measurement.unit === "cpm" && window.flickrimg_measurement.value > 100) {
          imgElt.style.outline = "red inset thin";
        }
        var measurementDate = new Date(Date.parse(window.flickrimg_measurement.ts)).toDateString();
        var text = window.flickrimg_measurement.value + " "+window.flickrimg_measurement.unit + " on "+measurementDate;
        measureElt.innerText=text;
        measureElt.style.display="inline";
  	    warningElt.style.display="inline";
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


function locateAndTag(photoId) {
  imageLocate(photoId, getNearbyMeasurement);
}

var refreshTimeoutID;

function flickrimg() {
  clearTimeout(refreshTimeoutID);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "/flickr", true);
  xmlhttp.timeout = 2000;
  xmlhttp.onload = function(e) {
  if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
    imgjson = JSON.parse(xmlhttp.responseText);
    imgWebUrl = "https://www.flickr.com/photos/"+imgjson.owner+"/"+imgjson.id;
    // format of this url is https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
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
    imgElt.innerHTML='<a href="'+imgWebUrl+'"><img class="flickr-wrapper" id="flickr-image" src="'+imgurl+'" style="width: '+width+'px; height=auto"></a><figcaption class="flickr-title">'+imgjson.title+'&mdash;'+imgDate+'</figcaption>';
      locateAndTag(imgjson.id);
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
  refreshTimeoutID = setTimeout(flickrimg, 20000);
};
