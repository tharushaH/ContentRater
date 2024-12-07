const { User, Wishlist, Rating, Contents, MoviesAndShows, Genre, ContentGenre } = require('../models');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        userID: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
    })
});

const ContentType = new GraphQLObjectType({
    name: 'Content',
    fields: () => ({
        contentTypeDBID: { type: new GraphQLNonNull(GraphQLInt) },
        content: { type: new GraphQLNonNull(GraphQLString) }
    }),
});

const MoviesAndShowsType = new GraphQLObjectType({
    name: 'MoviesAndShows',
    fields: () => ({
        moviesAndShowsDBID: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        director: { type: new GraphQLNonNull(GraphQLString) },
        monthReleased: { type: new GraphQLNonNull(GraphQLInt) },
        yearReleased: { type: new GraphQLNonNull(GraphQLInt) },
        contentTypeID: { type: new GraphQLNonNull(GraphQLInt) },
        contentType: { 
            type: ContentType,
            resolve(parent) {
                console.log('Resolving contentType for:', parent.contentTypeID);
                return Contents.findByPk(parent.contentTypeID);
            }
        },
        genres: {
            type: new GraphQLList(GenreType),
            resolve(parent) {
                // Use Sequelize association to fetch genres directly
                return MoviesAndShows.findByPk(parent.moviesAndShowsDBID, {
                    include: {
                        model: Genre,
                        through: { attributes: [] }, // Omit junction table attributes
                    },
                }).then(movie => movie.Genres);
            }
        }
    })
});

const RatingType =  new GraphQLObjectType({
    name: 'Rating',
    fields: () => ({
        rating: { type: new GraphQLNonNull(GraphQLInt) },
        moviesAndShowsID: { type: new GraphQLNonNull(GraphQLInt) },
        userID: { type: new GraphQLNonNull(GraphQLString) },
        user: {
            type: UserType,
            resolve(parent) {
                return User.findByPk(parent.userID);
            }
        },
        movieAndShow : {
            type: MoviesAndShowsType,
            resolve(parent) {
                return MoviesAndShows.findByPk(parent.moviesAndShowsID);
            }
        }
    })
});

const WishlistType = new GraphQLObjectType({
    name: 'Wishlist',
    fields: () => ({
        moviesAndShowsID: { type: new GraphQLNonNull(GraphQLInt) },
        userID: { type: new GraphQLNonNull(GraphQLString) },
        user: {
            type: UserType,
            resolve(parent) {
                return User.findByPk(parent.userID);
            }
        },
        movieAndShow : {
            type: MoviesAndShowsType,
            resolve(parent) {
                return MoviesAndShows.findByPk(parent.moviesAndShowsID);
            }
        }
    })
});

const GenreType = new GraphQLObjectType({
    name: 'Genre',
    fields: () => ({
        genreDBID: { type: new GraphQLNonNull(GraphQLInt) },
        genre: { type: new GraphQLNonNull(GraphQLString) }
    })
});

const ContentGenreType = new GraphQLObjectType({
    name: 'ContentGenre',
    fields: () => ({
        contentGenreID: { type: new GraphQLNonNull(GraphQLInt) },
        moviesAndShowsID: { type: new GraphQLNonNull(GraphQLInt) },
        genreID: { type: new GraphQLNonNull(GraphQLInt) },
        genre: {
            type: GenreType,
            resolve(parent) {
                return Genre.findByPk(parent.genreID);
            }
        },
        movieAndShow : {
            type: MoviesAndShowsType,
            resolve(parent) {
                return MoviesAndShows.findByPk(parent.moviesAndShowsID);
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { userID: { type: GraphQLString } },
            resolve(parent, args) {
                return User.findByPk(args.userID);
            }
        },
        allUsers: {
            type: new GraphQLList(UserType),
            resolve() {
                return User.findAll();
            }
        },
        moviesAndShows: {
            type: MoviesAndShowsType,
            args: { moviesAndShowsID: { type: GraphQLInt } },
            resolve(parent, args) {
                return MoviesAndShows.findByPk(args.moviesAndShowsID);
            }
        },
        allMoviesAndShows: {
            type: new GraphQLList(MoviesAndShowsType),
            resolve() {
                return MoviesAndShows.findAll();
            }
        },
        rating: {
            type: RatingType,
            args: { moviesAndShowsID: { type: GraphQLInt }, userID: { type: GraphQLInt } },
            resolve(parent, args) {
                return Rating.findOne({
                    where: {
                        moviesAndShowsID: args.moviesAndShowsID,
                        userID: args.userID
                    }
                });
            }
        },
        ratingsByUsers : {
            type: new GraphQLList(RatingType),
            args: { userID: { type: GraphQLInt } },
            resolve(parent, args) {
                return Rating.findAll({
                    where: {
                        userID: args.userID
                    }
                });
            }
        },
        ratingsByMovies : {
            type: new GraphQLList(RatingType),
            args: { moviesAndShowsID: { type: GraphQLInt } },
            resolve(parent, args) {
                return Rating.findAll({
                    where: {
                        moviesAndShowsID: args.moviesAndShowsID
                    }
                });
            }
        },
        wishListByUsers : {
            type: new GraphQLList(WishlistType),
            args: { userID: { type: GraphQLInt } },
            resolve(parent, args) {
                return Wishlist.findAll({
                    where: {
                        userID: args.userID
                    }
                });
            }
        },
        contentByGenre : {
            type: new GraphQLList(ContentGenreType),
            args: { genreID: { type: GraphQLInt } },
            resolve(parent, args) {
                return ContentGenre.findAll({
                    where: {
                        genreID: args.genreID
                    }
                });
            }
        },
        genresByContent : {
            type: new GraphQLList(ContentGenreType),
            args: { moviesAndShowsID: { type: GraphQLInt } },
            resolve(parent, args) {
                return ContentGenre.findAll({
                    where: {
                        moviesAndShowsID: args.moviesAndShowsID
                    }
                });
            }
        },
        allGenres: {
            type: new GraphQLList(GenreType),
            resolve() {
                return Genre.findAll();
            }
        },
    }
});



const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addContentToWishlist: {
            type: WishlistType,
            args: {
                userID: { type: new GraphQLNonNull(GraphQLInt) },
                moviesAndShowsID: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                return Wishlist.create({
                    userID: args.userID,
                    moviesAndShowsID: args.moviesAndShowsID
                });
            }
        },
        addRating: {
            type: RatingType,
            args: {
                userID: { type: new GraphQLNonNull(GraphQLInt) },
                moviesAndShowsID: { type: new GraphQLNonNull(GraphQLInt) },
                rating: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                return Rating.create({
                    userID: args.userID,
                    moviesAndShowsID: args.moviesAndShowsID,
                    rating: args.rating
                });
            }
        },
        removeRating: {
            type: RatingType,
            args: {
                userID: { type: new GraphQLNonNull(GraphQLInt) },
                moviesAndShowsID: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                return Rating.destroy({
                    where: {
                        userID: args.userID,
                        moviesAndShowsID: args.moviesAndShowsID
                    }
                });
            }
        },
        removeWishlistContent: {
            type: WishlistType,
            args: {
                userID: { type: new GraphQLNonNull(GraphQLInt) },
                moviesAndShowsID: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                return Wishlist.destroy({
                    where: {
                        userID: args.userID,
                        moviesAndShowsID: args.moviesAndShowsID
                    }
                });
            }
        },
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return User.create({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    username: args.username,
                    password: args.password
                });
            }
        },
        addContent: {
            type: ContentType,
            args: {
                content: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return Contents.create({
                    content: args.content
                });
            }
        },
        addGenreToContent: {
            type: ContentGenreType,
            args: {
                moviesAndShowsID: { type: new GraphQLNonNull(GraphQLInt) },
                genreID: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                return ContentGenre.create({
                    moviesAndShowsID: args.moviesAndShowsID,
                    genreID: args.genreID
                });
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});