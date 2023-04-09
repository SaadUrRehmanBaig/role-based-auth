const jwt = require('jsonwebtoken')
const db = require('../model/index')
const config = require("../config/auth.config")
const User = db.user
const role = db.role

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
}

isAdmin = (req, res, next) => {
    User.findById(req.userId)
        .then((user) => {
            return role.find({ _id: { $in: user.roles } });
        })
        .then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }
            res.status(403).send({ message: "Require Admin Role!" });
        })
        .catch((err) => {
            res.status(500).send({ message: err });
        });

}

isModerator = (req, res, next) => {
    User.findById(req.userId).then(user => {
        role.find({
            _id: { $in: user.roles }
        }).then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return;
                }
            }

            res.status(403).send({ message: "Require Moderator Role!" });
            return;
        })
            .catch(err => {
                res.status(500).send({ message: err });
                return;
            })
    })
        .catch(err => {
            res.status(500).send({ message: err });
            return;
        });

};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};
module.exports = authJwt;