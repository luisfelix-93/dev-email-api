import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
        },
        password: {
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', userSchema);