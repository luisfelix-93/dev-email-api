import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        user: {
        },
        password: {
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', userSchema);