const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new mongoose.Schema({
  name_of_restaurant: { type: String, required: true },
  menu: [
    {
      cat_name: { type: String, required: true },
      items: [
        {
          item_name: { type: String, required: true },
          price: { type: Number, required: true },
          image: { type: String }
        }
      ]
    }
  ]
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;