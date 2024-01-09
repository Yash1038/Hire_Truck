const jwt = require("jsonwebtoken");
const Freight_Owner = require("../models/freight_owner");
const Truck_Owner = require("../models/truck_owner");

const auth = async (req, res, next) => {
  const recd_token = req.headers.authorization.split(":")[1];
  var token = "",
    user_type = "";

  for (var i = 0; i < recd_token.length - 3; i++) {
    token += recd_token[i];
  }

  for (var i = recd_token.length - 3; i <= recd_token.length - 1; i++) {
    user_type += recd_token[i];
  }

  // try {
  if (token) {
    // console.log(process.env.JWTSECRET);
    const decoded = jwt.verify(token, process.env.JWTSECRET);

    const username = decoded.user;

    req.username = username;

    var user;

    console.log("idh9whsd", username);

    user_type == "123"
      ? (user = await Freight_Owner.findOne({ username: username }))
      : (user = await Truck_Owner.findOne({ username: username }));
    if (user) {
      next();
    } else {
      return res.status(401).json({
        message: "Unauthorized User!",
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized User!",
    });
  }
  // } catch {
  //   return res.status(401).json({
  //     message: "Unauthorized User!",
  //   });
  // }
};

module.exports = auth;
