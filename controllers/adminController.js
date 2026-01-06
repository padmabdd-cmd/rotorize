// ------------------------------
// ADMIN CONTROLLER
// ------------------------------

exports.getLogin = (req, res) => {
  res.render("adminLogin", {
    meta: { title: "Admin Login" }
  });
};

exports.postLogin = (req, res) => {
  const { username, password } = req.body;

  // Hardcoded admin user (you can replace with DB later)
  if (username === "admin" && password === "admin123") {
    req.session.admin = true;
    return res.redirect("/admin/dashboard");
  }

  req.flash("error_msg", "Invalid username or password");
  res.redirect("/admin/login");
};

exports.getDashboard = (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }

  res.render("adminDashboard", {
    meta: { title: "Admin Dashboard" }
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
};
