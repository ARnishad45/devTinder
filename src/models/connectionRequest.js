const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
    },
},
{
    timestamps: true, 
}
);

connectionRequestSchema.index({fromUserId: 1, toUserId: 1}); //compound index for making query very fast

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    //check for user(before saving) can't send request to itself
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send request to yourself!");
    }
    next();
})

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest", connectionRequestSchema
)

module.exports = ConnectionRequestModel;