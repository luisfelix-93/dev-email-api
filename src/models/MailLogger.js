import mongoose from "mongoose";

const mailLoggerSchema = new mongoose.Schema({
    to: {},
    from: {},
    message: {},
    replyTo: {}
}, 
{
    timestamps: true
}
)

export default mongoose.model('MailLogger',mailLoggerSchema);