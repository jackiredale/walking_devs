module.exports = (sequelize, DataTypes) => {
  const Watchlist = sequelize.define("Watchlist", {});

  Watchlist.associate = (models) => {
    Watchlist.belongsTo(models.User, { foreignKey: "userId" });
    Watchlist.belongsTo(models.Movie, { foreignKey: "movieId" });
  };

  return Watchlist;
};