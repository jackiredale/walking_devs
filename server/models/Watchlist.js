module.exports = (sequelize, DataTypes) => {
  const Watchlist = sequelize.define("Watchlist", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tmdbId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

  Watchlist.associate = (models) => {
    Watchlist.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Watchlist;
};