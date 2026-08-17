module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define(
    "Movie",
    {
      tmdbId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      categories: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      director: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      runtime: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      releaseYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      averageRating: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: true,
      },
      posterUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "movies",
      timestamps: false,
    }
  );

  Movie.associate = (models) => {
    if (models.Rating) {
      Movie.hasMany(models.Rating, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
      });
    }

    // if (models.Watchlist) {
    //   Movie.hasMany(models.Watchlist, {
    //     foreignKey: "movieId",
    //     onDelete: "CASCADE",
    //   });
    // }
  };

  return Movie;
};
