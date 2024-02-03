const db = require("./../models");

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send({ message: "User Content." });
};

exports.getAccount = async (req, res) => {
    const account = await db.AccountModel.findById(req.accountId);
    if(account) {
        res.status(200).send({ account });
    } else {
        res.status(400).send();
    }
};

exports.getAccounts = async (req, res) => {
    const accounts = await db.AccountModel.find({});
    if(accounts) {
        res.status(200).send({ accounts });
    } else {
        res.status(400).send();
    }

};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};