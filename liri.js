// Week 10 Homework - LIRI CLI

require("dotenv").config();
// import API keys
var keys = require("./keys");
// import request npm package
var request = require("request");
// import twitter npm package
var Twitter = require('twitter');
// import node-spotify-api npm package
var Spotify = require("node-spotify-api");
// import FS package
var fs = require("fs");

var userCommand = process.argv[2];
var userSearch = process.argv[3];

// TWITTER FUNCTION //
var getTwitter = function() {
    var client = new Twitter(keys.twitter);
    var params = {screen_name: 'CodyMcCoder', count: 5};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            var data = [];

            for (i=0; i < tweets.length; i++) {
                data.push({
                    created_at: tweets[i].created_at,
                    text: tweets[i].text
                })
            }
            console.log(data);
            outputData(data);
        }
    });
};

// SPOTIFY FUNCTION //
var convertArtistObject = function(artist) {
    return artist.name;
};

var getSpotify = function(userSearch) {
    var spotify = new Spotify(keys.spotify);
    // var nodeArgs = process.argv;
    // for (var i = 3; i < nodeArgs.length; i++) {
    //     userSearch = userSearch + " " + nodeArgs[i];
    // }
    if (userSearch === undefined) {
        userSearch = "Ace of Base The Sign";
    }

    console.log(userSearch);

    spotify.search(
        { type: 'track', query: userSearch, limit: 5},
        function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songs = data.tracks.items;
        var data = [];

        for (var i = 0; i < songs.length; i++) {
            data.push({
                "Artist(s): ": songs[i].artists.map(convertArtistObject),
                "Title: ": songs[i].name,
                "Preview Link: ": songs[i].preview_url,
                "Album: ": songs[i].album.name
            })
            // console.log(i + 1);
            // // Artist(s)
            // console.log("Artist(s): " + songs[i].artists.map(convertArtistObject));
            // // The song's name
            // console.log("Title: " + songs[i].name);
            // // A preview link of the song from Spotify
            // console.log("Preview Link: " + songs[i].preview_url);
            // // The album that the song is from
            // console.log("Album: " + songs[i].album.name);
            // console.log("-----------------------------------");
        }
        console.log(data);
        outputData(data);
    });
}

// OMDB FUNCTION //
var getOmdb = function(userSearch) {
    if (userSearch == undefined) {
        userSearch = "Mr Nobody";
    }

    console.log(userSearch);
    
    var url = "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=278cc78"

    request(url, function(error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            var data = {
                "Title: ": JSON.parse(body).Title,
                "Release Date: ": JSON.parse(body).Released,
                "IMDB Rating: ": JSON.parse(body).imdbRating,
                "Rotten Tomatoes Rating: ": JSON.parse(body).imdbRating,
                "Country Produced: ": JSON.parse(body).Country,
                "Language: ": JSON.parse(body).Language,
                "Plot: ": JSON.parse(body).Plot,
                "Actors: ": JSON.parse(body).Actors
            }
            console.log(data);
            outputData(data);
            // // Title of the movie.
            // console.log("Title: " + JSON.parse(body).Title);
            // // Year the movie came out.
            // console.log("Release Date: " + JSON.parse(body).Released);
            // // IMDB Rating of the movie.
            // console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            // // Rotten Tomatoes Rating of the movie.
            // console.log("Rotten Tomatoes Rating: " + JSON.parse(body).imdbRating);
            // // Country where the movie was produced.
            // console.log("Country Produced: " + JSON.parse(body).Country);
            // // Language of the movie.
            // console.log("Language: " + JSON.parse(body).Language);
            // // Plot of the movie.
            // console.log("Plot: " + JSON.parse(body).Plot);
            // // Actors in the movie.
            // console.log("Actors: " + JSON.parse(body).Actors);
            // console.log("-----------------------------------");
        }
    });
}

// DO WHAT IT SAYS FUNCTION //
var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
    
        var dataArr = data.split(",");
        var userCommand = dataArr[0];
        var userSearch = dataArr[1];
        
        if (userCommand == "movie-this") {
            var userSearch = dataArr[1];
            getOmdb(userSearch);
        }
        else if (userCommand == "spotify-this-song") {
            var userSearch = dataArr[1];
            getSpotify(userSearch);
        }
        else if (userCommand == "my-tweets") {
            getTwitter();
        }
    });
};

// BONUS: Output data to log.txt via append
var outputData = function(data) {
    // Append the JSON data and add a newline character to the end of the log.txt file
    fs.appendFile("log.txt", JSON.stringify(data) + "\n", function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("data appended to log.txt");
    });
  };

var runLiri = function() {
    if (userCommand == "movie-this") {
        getOmdb(userSearch);
    }
    else if (userCommand == "spotify-this-song") {
        getSpotify(userSearch);
    }
    else if (userCommand == "my-tweets") {
        getTwitter();
    }
    else if (userCommand == "do-what-it-says") {
        doWhatItSays();
    }
    else {
        console.log("Sorry, that is not a valid LIRI command. Please enter a prompt from one of the following options:\n1. movie-this\n2. spotify-this-song\n3. my-tweets\n4. do-what-it-says\nYour search should be enclosed in quotes.\n(e.g.: spotify-this-song 'end of the road')");
    }
}

runLiri();
