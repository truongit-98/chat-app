import express from "express";
import config from "../config/index.mjs";
import { isAuthenticated,getAllRooms } from "../helper/index.mjs";

const router = express.Router();
router.get('/', isAuthenticated, async (req, res, next) => {
    try {
        const rooms = await getAllRooms();
        res.render('chat', {
            host: config.host,
            rooms: rooms
        }, (err, html) => {
            if (err) {
                next(err);
            }
            res.send(html);
        });
    } catch (err) {
        console.log(err)
    }

})

export default router;