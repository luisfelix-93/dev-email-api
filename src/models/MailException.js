import mongoose from "mongoose";

const mailExceptionSchema = new mongoose.Schema({
    message: {
        type: String
    },
    statusCode: {}
}, 
{
    timestamps: true
}
)

export default mongoose.model('MailException',mailExceptionSchema);