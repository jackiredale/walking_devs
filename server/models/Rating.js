module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    "Rating",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["userId", "movieId"],
        },
      ],
    }
  );

  Rating.associate = (models) => {
    Rating.belongsTo(models.User, { foreignKey: "userId" });
    Rating.belongsTo(models.Movie, { foreignKey: "movieId" });
  };

  return Rating;
};
