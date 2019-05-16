require("dotenv").config();
let keys = require("./keys.js");
let fs = require("fs");

var Spotify = require("node-spotify-api")
let bandsintown = require('bandsintown')("codingbootcamp");
let request = require('request')
//var querryURL = "http://www.omdbapi.com/?t=The+Big+Lebowski&y=1998+&y=&plot=short&apikey=trilogy"
let input = process.argv;
let userAction = input[2];
let userCommand = input[3];
var spotify = new Spotify(keys.spotify);


switch (userAction) {

  case "spotify-this-song":
    spotifyThis();
    break;

  case "movie-this":
    movie();
    break;

  case "concert-this":
    bands();
    break;

  case "do-what-it-says":
    getRandom();
    break;



};
//spotify NPM Search returning object?
function spotifyThis() {


  spotify.search({
    type: 'track',
    query: userCommand,
    limit: 1
  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    var songs = data.tracks.items;
    console.log("-----------------------------------"); 
            for (var i = 0; i < songs.length; i++) {
                
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
    

  });

};

function movie(userCommand) {

  var queryUrl = "http://www.omdbapi.com/?t=" + userCommand + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function (error, response, body) {
    if (!userCommand) {
      userCommand = 'Mr Nobody';
    }
    if (!error && response.statusCode === 200) {

      console.log("-----------------------------------"); 
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("-----------------------------------");  
    }
  });
};


function bands() {
  var queryURL = "https://rest.bandsintown.com/artists/" + userCommand + "/events?app_id=codingbootcamp"
  request(queryURL, function (error, response, body) {
    //If no error and response is a success
    if (!error && response.statusCode === 200) {
      //Parse the json response
      var data = JSON.parse(body);
      //Loop through array
      console.log("-----------------------------------"); 
      for (var i = 0; i < data.length; i++) {
        //Get venue name
        console.log("Venue: " + data[i].venue.name);
        //Append data to log.txt
        fs.appendFileSync("log.txt", "Venue: " + data[i].venue.name + "\n", function (error) {
          if (error) {
            console.log(error);
          };
        });
        //Get venue location
        //If statement for concerts without a region
        if (data[i].venue.region == "") {
          console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);
          //Append data to log.txt
          fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.country + "\n", function (error) {
            if (error) {
              console.log(error);
            };
          });
        } else {
          console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);
          //Append data to log.txt
          fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country + "\n", function (error) {
            if (error) {
              console.log(error);
            };
           
          });
         
        }

        
      }
      console.log("-----------------------------------");    
    }
  });

};

function getRandom() {


  fs.readFile('random.txt', "utf8", function (error, data) {

    if (error) {
      return display(error);
    }


    var dataArr = data.split(",");

    if (dataArr[0] === "spotify-this-song") {
      
      var songcheck = dataArr[1].trim().slice(1, -1);
      spotifyThisText();
    }

    function spotifyThisText() {


      spotify.search({
        type: 'track',
        query: songcheck,
        limit: 1
      }, function (err, response) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var songs = response.tracks.items;
    console.log("-----------------------------------"); 
            for (var i = 0; i < songs.length; i++) {
                
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
          

        
      });

    };
  });

};



//   bandsintown
//.getArtistEventList('Skrillex')
//.then(function(events) {
// return array of events
//});

// console.log(data); 
// });


//   omdb.search('saw', function(err, movies) {
//     if(err) {
//         return console.error(err);
//     }

//     if(movies.length < 1) {
//         return console.log('No movies were found!');
//     }

//     movies.forEach(function(movie) {
//         console.log('%s (%d)', movie.title, movie.year);
//     });

// Saw (2004)
// Saw II (2005)
// Saw III (2006)
// Saw IV (2007)
// ...
// });








//require("dotenv").config();