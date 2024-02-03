const config = require("../config/auth.config");
const db = require("../models");
const AccountModel = db.AccountModel;
const RoleModel = db.RoleModel;

require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    const user = await AccountModel.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    // Role not working yet
    if (req.body.roles) {
        RoleModel.find(
            {
                name: { $in: req.body.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.roles = roles.map((role) => role._id);
                user.save((err) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({ message: "User was registered successfully!" });
                });
            }
        );
    } else {
        const userRole = RoleModel.findOne({ name: "user" });
        AccountModel.findByIdAndUpdate(user._id, {
            role: userRole,
        })
        res.set('Access-Control-Expose-Headers', 'Set-Cookie');
        res.send({ message: "User was registered successfully!" });
    }
};

exports.signin = async (req, res) => {
    const account = await AccountModel.findOne({
        username: req.body.username,
    }).populate("password");


    if (!account) {
        return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        account.password
    );

    if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ accountId: account.id },
        process.env.TOKEN_SECRET,
        {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
        });

    let authorities = [];

    // for (let i = 0; i < account.roles.length; i++) {
    //     authorities.push("ROLE_" + account.roles[i].name.toUpperCase());
    // }

    res.status(200).send({
        id: account._id,
        username: account.username,
        roles: authorities,
        token,
    });
};

exports.signout = async (req, res) => {
    try {
        req.session = null;
        return res.status(200).send({ message: "You've been signed out!" });
    } catch (err) {
        this.next(err);
    }
};
