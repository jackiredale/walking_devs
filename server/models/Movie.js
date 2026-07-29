Movie.associate = (models) => {
  Movie.hasMany(models.Rating, { foreignKey: "movieId" });
  Movie.hasMany(models.Watchlist, { foreignKey: "movieId" });
};

User.associate = (models) => {
  User.hasMany(models.Rating, { foreignKey: "userId" });
  User.hasMany(models.Watchlist, { foreignKey: "userId" });
};