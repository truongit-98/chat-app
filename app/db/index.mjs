import config from '../config/index.mjs';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;
const saltRounds = 10;
try {
    mongoose.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (error) {
    console.log(error);
}
mongoose.connection.on('error', err => {
    console.log(`MongoDB error: ${err}`);
});
mongoose.set('useCreateIndex', true);


const userSchema = new mongoose.Schema({
    local: {
        fullName: String,
        email: String,
        passWord: String,
        birthDay: Date,
        conversations: [{
            type: Schema.Types.ObjectId,
            ref: 'Conversation'
        }]
    },
    facebook: {
        profileId: String,
        token: String,
        displayName: String,
        email: String,
        profilePic: String,
        conversations: [{
            type: Schema.Types.ObjectId,
            ref: 'Conversation'
        }]
    },
    google: {
        profileId: String,
        token: String,
        displayName: String,
        email: String,
        conversations: [{
            type: Schema.Types.ObjectId,
            ref: 'Conversation'
        }]
    }
});

userSchema.pre('save', async function () {
    try {
        if (this.local.passWord) {
            const hash = await this.hashPassword(this.local.passWord, saltRounds);
            if (hash) {
                this.local.passWord = hash;
            }
        }
    } catch (err) {
        console.log(err);
    }

});

userSchema.methods.hashPassword = async (password, saltRounds) => {
    return await bcrypt.hash(password, saltRounds);
}

userSchema.methods.validPassword = async function (password) {
    return await bcrypt.compare(password, this.local.passWord);
}
userSchema.statics.findOrCreate = async (type, profile, token) => {
    var user;
    switch (type) {
        case 'facebook':
            user = await User.findOne({ "facebook.profileId": profile.id });
            if (!user) {
                let newUser = new User();
                newUser.facebook.profileId = profile.id;
                newUser.facebook.displayName = profile.displayName;
                newUser.facebook.token = token;
                newUser.facebook.email = profile.email ?? '';
                newUser.facebook.profilePic = profile.photos[0].value ?? '';
                return await newUser.save();
            }
            return user;
        case 'google':
            user = await User.findOne({ "google.profileId": profile.id });
            if (!user) {
                let newUser = new User();
                newUser.google.profileId = profile.id;
                newUser.google.displayName = profile.displayName;
                newUser.google.token = token;
                newUser.google.email = profile.emails[0].value ?? '';
                return await newUser.save();
            }
            return user;

    }
}


export const User = mongoose.model('User', userSchema, 'chatusers');

//Conversation
const conversationSchema = new mongoose.Schema({
    content: String,
    dateCreated: Date,
    member: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    }

})

conversationSchema.pre('save', async function () {
    try {
        const user = await User.findById(this.member);
        const room = await Room.findById(this.room);
        if (user) {
            if (user.local.email) {
                user.local.conversations.push(this._id);
                await user.save();
            }
            if (user.facebook.profileId) {
                user.facebook.conversations.push(this._id);
                await user.save();
            }
            if (user.google.profileId) {
                user.google.conversations.push(this._id);
                await user.save();
            }
        }
        if (room) {
            room.conversations.push(this._id);
            await room.save();
        }
    } catch (err) {
        console.log(err);
    }

});

export const Conversation = mongoose.model('Conversation', conversationSchema, 'chatConversations');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    dateCreated: Date,
    conversations: [{
        type: Schema.Types.ObjectId,
        ref: 'Conversation'
    }]
})
export const Room = mongoose.model('Room', roomSchema, 'chatRooms');


export default mongoose;