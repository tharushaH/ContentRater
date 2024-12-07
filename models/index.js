const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/contentRaterDB.sqlite'
});

const User = sequelize.define('User', {
    userID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

const Rating = sequelize.define('Rating', {
    moviesAndShowsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

const Contents = sequelize.define('Contents', {
    contentTypeDBID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

const MoviesAndShows = sequelize.define('MoviesAndShows', {
    moviesAndShowsDBID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    director: {
        type: DataTypes.STRING,
        allowNull: false
    },
    yearReleased: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    monthReleased: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    contentTypeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Contents,
            key: 'contentTypeDBID'
        }
    }
}, {
    timestamps: false
});

const Genre = sequelize.define('Genre', {
    genreDBID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true // Disable pluralization
});

const Wishlist = sequelize.define('Wishlist', {
    moviesAndShowsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MoviesAndShows,
            key: 'moviesAndShowsDBID'
        }
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
            model: User,
            key: 'userID'
        }
    }
}, {
    timestamps: false
});

const ContentGenre = sequelize.define('ContentGenres', {
    contentGenreID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    moviesAndShowsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'MoviesAndShows',
            key: 'moviesAndShowsDBID'
        }
    },
    genreDBID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Genre',
            key: 'genreDBID'
        }
    }
}, {
    timestamps: false,
});

// Define associations
MoviesAndShows.belongsToMany(Genre, { through: ContentGenre, foreignKey: 'moviesAndShowsID' });
Genre.belongsToMany(MoviesAndShows, { through: ContentGenre, foreignKey: 'genreDBID' });

module.exports = { sequelize, User, Wishlist, Rating, Contents, MoviesAndShows, Genre, ContentGenre };