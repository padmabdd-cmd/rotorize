const express = require("express");
const router = express.Router();
const controllerContact = require("../controllers/controllerContact");

router.get("/", (req, res) => {
  res.render("contact", {
    meta: { title: "Contact Us | Rotorize Aviation" }
  });
});

router.post("/submit", controllerContact.handleContactSubmit);

router.get("/admin/messages", controllerContact.renderAdminContact);

router.post("/admin/reply/:id", controllerContact.replyToContact);

module.exports = router;
