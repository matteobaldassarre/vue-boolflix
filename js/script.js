var app = new Vue({

    el: '#root',
    data: {
        searchedMovie: '',
        movies: [],
    },
    methods: {
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
                            api_key: '4b3a13643ab10188ae2a3c87ceb470a0',
                            query: this.searchedMovie,
                        }
                    })
                .then((response) => {
                    const result = response.data.results;
                    result.forEach((element) => { 
                        // Populating the array with only movies and tv series
                        if (element.media_type == 'movie' || element.media_type == 'tv') {
                            this.movies.push(element);
                        } 
                    });
                });
            }
        }
    }

});