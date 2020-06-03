import passport from "passport";
import LocalStrategy from "passport-local";
import FacebookStrategy from "passport-facebook";
import GoogleStrategy from "passport-google-oauth20";
import { User, Room, Conversation } from "../db/index.mjs";
import config from "../config/index.mjs";

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//local
passport.use(
  new LocalStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (username, password, done) {
      User.findOne({ "local.email": username }, async function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const result = await user.validPassword(password);
        if (!result) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    }
  )
);

//facebook
passport.use(
  new FacebookStrategy(config.fb, async function (
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    try {
      const user = await User.findOrCreate("facebook", profile, accessToken);
      done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

//google
passport.use(
  new GoogleStrategy(config.google, async function (
    accessToken,
    refreshToken,
    profile,
    cb
  ) {
    try {
      const user = await User.findOrCreate("google", profile, accessToken);
      cb(null, user);
    } catch (err) {
      cb(err, null);
    }
  })
);

// method

// User

export const findUserLocalByEmail = async (email)=>{
  try{
    return await User.findOne({"local.email": email}).exec();
  } catch(err){
    console.log("Mongoo Error: " + err);
    return null;
  } 
}

export const createNewUserLocal = async (data) => {
  try {
    let newUser = new User();
    newUser.local.fullName = data.fullname;
    newUser.local.emai = data.email;
    newUser.local.passWord = data.password;
    newUser.local.birthDay = new Date(data.birthday);
    return await newUser.save();
  } catch(err){
    console.log("Mongoo Error: " + err);
    return null;
  }
}; 

// Room
export const getAllRooms = async () => {
  try {
    const rooms = await Room.find({})
      .populate({
        path: "conversations",
        populate: {
          path: "member",
        },
        opitons: {
          sort: { dateCreated: "desc" },
        },
        perDocumentLimit: 1,
      })
      .sort({ dateCreated: "desc" });
    return rooms;
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return [];
  }
};
export const searchRoomByName = async (name) => {
  try {
    const rooms = await Room.find({ name: { $regex: name, $options: "i" } })
      .populate({
        path: "conversations",
        populate: {
          path: "member",
        },
        opitons: {
          sort: { dateCreated: "desc" },
        },
        perDocumentLimit: 1,
      })
      .sort({ dateCreated: "desc" });
    return rooms;
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return [];
  }
};

export const createNewRoom = async (name) => {
  try {
    let newRoom = new Room();
    newRoom.name = name;
    newRoom.dateCreated = new Date();
    newRoom.conversations = [];
    return await newRoom.save();
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return null;
  }
};

export const getConversationsByRoomId = async (roomID) => {
  try {
    return await Conversation.find({ room: roomID })
      .populate("member")
      .sort({ dateCreated: "asc" });
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return [];
  }
};

export const findConversationLatest = async () => {
  try {
    const conv = await Conversation.find({})
      .sort({ dateCreated: "desc" })
      .limit(1);
    return conv;
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return [];
  }
};

export const createNewConversation = async (data) => {
  try {
    let newConv = new Conversation();
    newConv.content = data.mess;
    newConv.dateCreated = new Date();
    newConv.room = data.roomId;
    newConv.member = data.userId;
    return await newConv.save();
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return null;
  }
};

export const findUserByID = async (id) => {
  try {
    return await User.findById(id).exec();
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return null;
  }
};

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};
export const isUnauthenticated = (req, res, next) => {
  if (req.isUnauthenticated()) {
    next();
  } else {
    res.redirect("/chat");
  }
};
