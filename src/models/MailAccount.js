import mongoose from "mongoose";

const mailAccountSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        host_smtp: {
            type: String,
            required: true
        },
        port_smtp: {},
        host_imap:{
            type: String,
            required: true
        },
        port_imap:{},
        userId:{
            type: String,
            required: true
        },
        isOauth:{
            type: Boolean
        },
        clientId:{
            type: String
        },
        clientSecret:{
            type: String
        },
        clientTenant:{
            type: String
        },
        refreshToken:{
            type: String
        },
        accessToken: {
            type: String
        },
        accessUrl: {
            type: String
        }
    }
)

export default mongoose.model('MailAccount', mailAccountSchema);