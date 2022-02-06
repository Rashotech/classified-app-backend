require('./config/database');
var faker = require('@faker-js/faker');
const { categories } = require('./dummy_/categories');
const { users } = require('./dummy_/users');
const { states } = require('./dummy_/state');
const mongoose = require('mongoose');
const Category = require('./models/category.model');
const User = require('./models/user.model');
const Ads = require('./models/ads.model');

const seedDB = async () => {
    // await mongoose.connection.dropDatabase();
    await User.insertMany(users);
    await Category.insertMany(categories);
    await addListings();
};

const addListings = async () => {
    const state = Object.keys(states);
    for(let i=0; i<20; i++) {
        const categoryId = await Category.aggregate([{$sample: { size: 1 }}]);
        const userId = await User.aggregate([{$sample: { size: 1 }}]);
        await Ads.create({
            postedBy: (userId[0]._id).toString(),
            category: (categoryId[0]._id).toString(),
            title: faker.commerce.productName(),
            description: faker.helpers.createCard().posts[0].paragraph,
            price: faker.datatype.number({ min: 1000, max: 20000 }),
            condition: faker.helpers.randomize(["used", "brand_new"]),
            exchange: faker.datatype.boolean(),
            negotiable: faker.datatype.boolean(),
            region: faker.helpers.randomize(state),
            lga: faker.helpers.randomize(states[faker.helpers.randomize(state)]),
            images: Array(5).fill(
                {
                    originalUrl: faker.image.imageUrl(),
                    thumbnailUrl: faker.image.imageUrl(100, 67)
                }
            )  
        });
    }
};



seedDB().then(async () => {
    console.log('Data seeded Successfully');
    mongoose.connection.close();
    process.exit();
}).catch((error) => {
    console.log('Seeding Failed', error);
    process.exit();
});
