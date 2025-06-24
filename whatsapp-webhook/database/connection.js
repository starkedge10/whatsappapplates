import mongoose from 'mongoose';

async function connect(url) {
    if (!url) {
        throw new Error("MongoDB connection string URL is required");
    }
    mongoose.set('strictQuery', true);

    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        tlsAllowInvalidCertificates: false,
    });
    console.log("Database connected");
}

export default connect;
