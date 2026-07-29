module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define("Movie", {
    tmdbId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    posterPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Movie.associate = (models) => {
    Movie.hasMany(models.Rating, { foreignKey: "movieId", onDelete: "CASCADE" });
  };

  return Movie;
};
