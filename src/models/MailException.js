import mongoose from "mongoose";

const mailExceptionSchema = new mongoose.Schema({
    methode: {
        type: String
    },
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