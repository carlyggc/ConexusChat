import db from "../config/db.js";

export const createChannel = (req, res) => {
    db.run(
        "INSERT INTO channels(name, created_by) VALUES(?,?)",
        [req.body.name, req.user.id],
        function () {
            res.json({ id: this.lastID, name: req.body.name });
        }
    );
};

export const getChannels = (req, res) => {
    db.all("SELECT * FROM channels", [], (err, rows) => {
        res.json(rows);
    });
};
