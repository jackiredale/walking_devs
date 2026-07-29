const { sequelize, User, Movie, Watchlist, Rating } = require("../models");
const users = require("./users.json");
const movies = require("./movies.json");
const watchlist = require("./watchlist.json");
const ratings = require("./ratings.json");

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    if (users.length) {
      await User.bulkCreate(users, { individualHooks: true });
    }

    if (movies.length) {
      await Movie.bulkCreate(movies);
    }

    if (watchlist.length) {
      await Watchlist.bulkCreate(watchlist);
    }

    if (ratings.length) {
      await Rating.bulkCreate(ratings);
    }

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedDatabase();
