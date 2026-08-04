module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define("Movie", {
    tmdbId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    director: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    runtime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    posterPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tagline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subgenre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Movie.associate = (models) => {
    Movie.hasMany(models.Rating, { foreignKey: "movieId" });
    Movie.hasMany(models.Watchlist, { foreignKey: "movieId" });
  };

  return Movie;
};