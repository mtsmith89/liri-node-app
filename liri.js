require("dotenv").config();

var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var omdbAPIKEY = Object.values(keys.omdb);
var liriArg = process.argv[2];
var count = 1;

switch (liriArg) {
  case "my-tweets":
    myTweets(process.argv[3]);
    break;
  case "spotify-this-song":
    spotifyThisSong(process.argv[3]);
    break;
  case "movie-this":
    movieThis(process.argv[3]);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log(
      "\r\n" +
        "Use one of the following commands after 'node liri.js' : " +
        "\r\n" +
        "1. my-tweets 'any twitter name' " +
        "\r\n" +
        "2. spotify-this-song 'any song name' " +
        "\r\n" +
        "3. movie-this 'any movie name' " +
        "\r\n" +
        "4. do-what-it-says." +
        "\r\n"
    );
}

function movieThis(movie) {
  if (!movie) {
    movie = "mr nobody";
  }
  request(
    "http://www.omdbapi.com/?t=" +
      movie +
      "&y=&plot=short&r=json&tomatoes=true&apikey=" + omdbAPIKEY,
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var movieObject = JSON.parse(body);
        var movieResults =
        "\n" + "Results:" + "\n\n" +
        "Title: " +
          JSON.parse(body).Title +
          "\n" +
          "Year: " +
          JSON.parse(body).Year +
          "\n" +
          "Imdb Rating: " +
          JSON.parse(body).imdbRating +
          "\n" +
          "Country: " +
          JSON.parse(body).Country +
          "\n" +
          "Language: " +
          JSON.parse(body).Language +
          "\n" +
          "Plot: " +
          JSON.parse(body).Plot +
          "\n" +
          "Actors: " +
          JSON.parse(body).Actors +
          "\n" +
          "Rotten Tomatoes Rating: " +
          JSON.parse(body).tomatoRating +
          "\n" +
          "Rotten Tomatoes URL: " +
          JSON.parse(body).tomatoURL +
          "\n";
        console.log(movieResults);
        log(movieResults); 
      } else {
        console.log("Error :" + error);
        return;
      }
    }
  );
}
function myTweets(twitterUsername) {
  if (!twitterUsername) {
    twitterUsername = "Smith2Travis";
  }
  params = { screen_name: twitterUsername };
  client.get("statuses/user_timeline/", params, function(
    error,
    data,
    response
  ) {
    if (!error) {
      for (var i = 0; i < data.length; i++) {
        var twitterResults =
          "@" +
          data[i].user.screen_name +
          ": " +
          data[i].text +
          "\r\n" +
          data[i].created_at +
          "\r\n" +
          "------------------------------ " +
          count +
          " ------------------------------" +
          "\r\n";
        console.log(twitterResults);
        count++;
        log(twitterResults);
      }
    } else {
      console.log("Error :" + error);
      return;
    }
    count=1;
  });
}

function spotifyThisSong(songName) {
    if(!songName){
        songName = "The sign";
    }
    spotify.search({ type: "track", query: songName }, function(err, data) {
        if(!err){
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                    "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                    "Song: " + songInfo[i].name + "\r\n" +
                    "Preview Url: " + songInfo[i].preview_url + "\r\n" + 
                    "Album the song is from: " + songInfo[i].album.name + "\r\n" +
                    "------------------------------ " + count + " ------------------------------" + "\r\n";
                    console.log(spotifyResults);
                    count++;
                    log(spotifyResults);
                }
            }
        }	else {
            console.log("Error :"+ err);
            return;
        }
        count=1;
    });
};

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (!error) {
      doWhatItSaysResults = data.split(",");
      spotifyThisSong(doWhatItSaysResults[1]);
    } else {
      console.log("Error occurred" + error);
    }
  });
}

function log(logResults) {
  fs.appendFile("log.txt", logResults, error => {
    if (error) {
      throw error;
    }
  });
}
