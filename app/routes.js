module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    let produce = [
      { name: "Oregano", season: "January" },
      { name: "Tomato", season: "February" },
      { name: "Avocado", season: "March" },
      { name: "Red orange", season: "April" },
      { name: "Grapes", season: "May" },
      { name: "Paper", season: "June" },
      { name: "Broccoli", season: "July" },
      { name: "Orange", season: "August" },
      { name: "apples", season: "september" },
      { name: "cauliflower", season: "october" },
      { name: "banana", season: "october" },
      { name: "pumpkin", season: "november" },
      { name: "tangerines", season: "December" },
    ];
    const d = new Date();
    let month = d.getMonth();
    console.log(month);
    switch (month) {
      case 0:
        month = "January";
      case 1:
        month = "February";
      case 2:
        month = "March";
      case 3:
        month = "April";
      case 4:
        month = "May";
      case 5:
        month = "June";
      case 6:
        month = "July";
      case 7:
        month = "August";
      case 8:
        month = "september";
      case 9:
        month = "october";
        break;
      case 10:
        month = "november";
        break;
      case 11:
        month = "december";
        break;
    }
    console.log(month);
    let inSeasonProduce = produce.filter((el) => el.season === month);
    console.log(inSeasonProduce);
    db.collection("produce")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          produce: result,
          inRightNow: inSeasonProduce,
        });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // message board routes ===============================================================

  app.post("/save", (req, res) => {
    db.collection("produce").save(
      { name: req.body.name, season: req.body.season },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.send({});
      }
    );
  });

  app.put("/messages", (req, res) => {
    db.collection("messages").findOneAndUpdate(
      { name: req.body.name, msg: req.body.msg },
      {
        $set: {
          thumbUp: req.body.thumbUp + 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.delete("/delete", (req, res) => {
    db.collection("produce").findOneAndDelete(
      { name: req.body.name, season: req.body.season },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
