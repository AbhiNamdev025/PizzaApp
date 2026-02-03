const mongoose = require("mongoose");
require("dotenv").config();

const {
  Product,
} = require("./Backend Management/Model/ProductModel/productSchema");

const pizzas = [
  {
    name: "Margherita Classic",
    price: "299",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
    description:
      "Fresh mozzarella, tomato sauce, fresh basil, and extra virgin olive oil on a crispy thin crust.",
    isPremium: false,
  },
  {
    name: "Pepperoni Supreme",
    price: "399",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
    description:
      "Loaded with spicy pepperoni, mozzarella cheese, and our signature tomato sauce.",
    isPremium: false,
  },
  {
    name: "BBQ Chicken",
    price: "449",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
    description:
      "Grilled chicken, smoky BBQ sauce, red onions, cilantro, and melted cheese blend.",
    isPremium: true,
  },
  {
    name: "Veggie Delight",
    price: "349",
    image: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=500",
    description:
      "Bell peppers, mushrooms, olives, onions, tomatoes, and fresh mozzarella.",
    isPremium: false,
  },
  {
    name: "Cheese Burst",
    price: "379",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    description:
      "Extra cheese stuffed crust with triple cheese topping - mozzarella, cheddar, and parmesan.",
    isPremium: true,
  },
  {
    name: "Paneer Tikka",
    price: "429",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500",
    description:
      "Spiced paneer cubes, bell peppers, onions with tikka masala sauce and cheese.",
    isPremium: true,
  },
  {
    name: "Farmhouse",
    price: "399",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500",
    description:
      "Capsicum, onions, tomatoes, mushrooms, and golden corn with herbs and cheese.",
    isPremium: false,
  },
  {
    name: "Mexican Wave",
    price: "449",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500",
    description:
      "Spicy jalapeños, kidney beans, onions, capsicum with Mexican seasoning and hot sauce.",
    isPremium: false,
  },
  {
    name: "Double Cheese Margherita",
    price: "349",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500",
    description:
      "Classic margherita loaded with double the cheese for extra indulgence.",
    isPremium: false,
  },
  {
    name: "Chicken Tandoori",
    price: "479",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500",
    description:
      "Tandoori spiced chicken, mint mayo, onions, and mixed peppers with cheese.",
    isPremium: true,
  },
  {
    name: "Mushroom Mania",
    price: "369",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500",
    description:
      "Assorted mushrooms with garlic butter sauce, herbs, and creamy cheese.",
    isPremium: false,
  },
  {
    name: "Meat Feast",
    price: "549",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500",
    description:
      "Pepperoni, Italian sausage, grilled chicken, bacon bits with extra cheese.",
    isPremium: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MongoURL);

    await Product.deleteMany({});

    await Product.insertMany(pizzas);

    const premiumCount = pizzas.filter((p) => p.isPremium).length;

    pizzas.forEach((pizza, index) => {
      const premium = pizza.isPremium ? " ⭐" : "";
    });

    mongoose.connection.close();
  } catch (error) {
    process.exit(1);
  }
};

seedDatabase();
