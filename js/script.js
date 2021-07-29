var app = new Vue({

    el: '#root',

    // DATA SECTION
    data: {

        apiKey: '4b3a13643ab10188ae2a3c87ceb470a0', // Saving TheMovieDb api key

        appHasStarted: false, // Check if the user has started the page or not

        accounts: [ // Array of all accounts containing infos about photo, alt attribute and profile name
            {
                photo: 'matthew.jpg',
                alt: 'matthew-photo',
                name: 'Matthew'
            },
            {
                photo: 'chris.jpg',
                alt: 'chris-photo',
                name: 'Chris'
            },
            {
                photo: 'elizabeth.jpg',
                alt: 'elizabeth-photo',
                name: 'Elizabeth'
            },
            {
                photo: 'dustin.jpg',
                alt: 'dustin-photo',
                name: 'Dustin'
            }
        ],

        userSelected: false, // If the user has been selected or not, you can't proceed until you select a user

        accountPicture: 0, // Indicates the profile picture based on the selected user index

        searchedMovie: '', // The movie searched by the user

        userHasSearched: false, // Checks if the user has searched, if true shows the movies

        movies: [], // The movies shown after user search

        movieIndex: -1, // Represents the selected movie index (used when you want to see more infos about the movie)

        movieGenres: [], // List populated by the genres of the current movie

        movieCast: [], // List populated by the actors of the current movie

        error404: false, // Check if error 404 is detected or not to show the 'more' button

        introIsPlaying: false, // Checks if the boolflix intro is currently playing or not

        genresList: [], // List of all genres, displayed in the top nav-bar select tag

        thisGenre: 'All', // The default option of the select genre list

        trendingHomePage: [], // Array of trending movies to show in the home page

        tvSeriesHomePage: [], // Array of tv series to show in the home page

        moviesHomePage: [] // Array of movies to show in the home page

    },

    // METHODS SECTION
    methods: {
        // Function that starts Boolflix Application
        startBoolflix() {
            let startApp = document.getElementById('video-intro');
            startApp.play();
            setTimeout(() => {
                document.getElementById('intro').remove();
                this.introIsPlaying = false;
            }, 5000);
        },

        // Function that populates the accountPicture index with the selected user index
        userPic(index) {
            this.accountPicture = index;
        },

        // Function that refreshes the page and let's you go back to the home page
        returnToHomePage() {
            location.reload();
        },

        // Function that transforms the average rating from 1 to 10 in a number from 1 to 5 and rounds it up
        // number: a decimal number from 1 to 10
        obtainRating(number) {
            let rating = Math.ceil(number / 2);
            return rating;
        },

        // Function that searches the Movie or the Tv Serie based on the value of search input
        searchMovie() {
            this.movies = []; // Cleaning the array before populating it
            if (this.searchedMovie.length > 0) {
                axios.get('https://api.themoviedb.org/3/search/multi', {
                        params: {
                            api_key: this.apiKey,
                            query: this.searchedMovie,
                        }
                    })
                .then((response) => {
                    const result = response.data.results;
                    result.forEach((element) => { 
                        // Populating the array with only movies and tv series
                        if (element.media_type == 'movie' || element.media_type == 'tv') {
                            if (element.poster_path != null && element.vote_average != 0) {
                                this.movies.push(element);
                            } 
                        } 
                    });
                });

                this.userHasSearched = true;
            }
        },

        // Function that shows more info about the selected movie or tv serie
        // movie: the movie object where we're going to extract the id to get genres and actors
        // index: the index of the selected movie
        showOtherInfos(movie, index) {
            axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
                params: {
                    api_key: this.apiKey,
                    append_to_response: 'genres,credits'
                }
            })
            .then((response) => {
                const genres = response.data.genres;
                const cast = response.data.credits.cast;
                this.movieGenres = genres;
                this.movieIndex = index;

                cast.forEach((element) => {
                    this.movieCast.push(element.name);
                    if (this.movieCast.length > 5) {
                        this.movieCast.length = 5;
                    }
                });

            })
            .catch(err => {
                if (err.response.status == 404) {
                    const changeButton = document.getElementsByClassName('more')
                    for (let i = 0; i < changeButton.length; i++) {
                        const element = changeButton[i];
                        element.innerHTML = 'No \'more\' to display';
                        setTimeout(() => {
                            const element = changeButton[i];
                            element.innerHTML = 'More';
                        }, 500);
                    }
                    
                } 
            })
        },

        // Function that get all genres and populates an array named this.genresList
        // mediatype: A string like 'movie' or 'tv'
        getGrenres(mediaType) {
            axios
            .get(`https://api.themoviedb.org/3/genre/${mediaType}/list?api_key=4b3a13643ab10188ae2a3c87ceb470a0`)
            .then((response) => {
                const genres = response.data.genres;

                genres.forEach((element) => {

                    let genreId = element.id; // Saving the genre id in a variable
                    let found = false; // Flag variable to check the multiple occurrence of an id

                    this.genresList.forEach((elementInner) => {
                        if (elementInner.id == genreId) {
                            found = true;
                        }
                    });

                    if (found == false) {
                        this.genresList.push(element);
                    }

                });
            });
        },


        // Function that resets the searchbar and genre filter when clicking on Home button
        resetPage() {
            this.userHasSearched = false;
            this.searchedMovie = '';
            this.thisGenre = 'All';
        }
    },

    // CREATED SETCION
    created() {

        // Calling genres of movie and tv
        this.getGrenres('movie');
        this.getGrenres('tv');

        // Populating trendingHomePage Section
        axios.get('https://api.themoviedb.org/3/trending/movie/day?api_key=4b3a13643ab10188ae2a3c87ceb470a0').then((response) => {
            const trendingHomePage = response.data.results;
            this.trendingHomePage = trendingHomePage;
            if (this.trendingHomePage.length > 5) {
                this.trendingHomePage.length = 5;
            }
        });

        // Populating Tv Series Section
        axios.get('https://api.themoviedb.org/3/trending/tv/day?api_key=4b3a13643ab10188ae2a3c87ceb470a0').then((response) => {
            const tvSeriesHomePage = response.data.results;
            this.tvSeriesHomePage = tvSeriesHomePage;
            if (this.tvSeriesHomePage.length > 5) {
                this.tvSeriesHomePage.length = 5;
            }
        });

        // Populating Movies Section
        axios.get('https://api.themoviedb.org/3/trending/movie/week?api_key=4b3a13643ab10188ae2a3c87ceb470a0').then((response) => {
            const moviesHomePage = response.data.results;
            this.moviesHomePage = moviesHomePage;
            if (this.moviesHomePage.length > 5) {
                this.moviesHomePage.length = 5;
            }
        });

    }
});