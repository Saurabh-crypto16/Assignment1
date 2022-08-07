const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Ticket = mongoose.model("Ticket");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const morgan = require("morgan");


// To signup a new user and return bearers token
router.post("/users/new", async (req, res) => {
  const { username, role } = req.body;
  
  //if username or role not provided then error message
  if (!username || !role) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }
  
  //get user from database
  await User.findOne({ username: username }).then((savedUser) => {
    //user already exists
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User with given username already exists" });
    }
    //if user does not exists then create new user
    const user = new User({
      username: username,
      role: role,
    });
    //save new user to database
    user
      .save()
      .then((user) => {
        // create jwt token and send in response
        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        res.json({ token });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

// add new ticket
router.post("/tickets/new", requireLogin, async (req, res) => {
  const { title, description, status, priority, assignedTo } = req.body;
  //create ticket object
  const data = new Ticket({
    _id: uuid.v4(),
    title,
    description,
    status,
    priority,
    assignedTo
  });
  //save ticket to database
  await data
    .save()
    .then((result) => {
      res.json({ details: result._id });
    })
    .catch((err) => {
      console.log(err);
    });
});

//show all tickets
router.get("/tickets/all", requireLogin, async (req, res) => {
  //fetch all tickets from database
  await Ticket.find()
    .populate(
      "detailOf",
      "_id title description status priority assignedTo createdAt"
    )
    .then((details) => {
      //return as response
      res.json({ details });
    })
    .catch((err) => {
      console.log(err);
    });
});

//show query tickets
router.get("/tickets/", requireLogin, async (req, res) => {
  //fetching the query passes
  const status = req.query.status;
  const title = req.query.title;
  const priority = req.query.priority;

  if (status) {
    //if status is passed in query
    await Ticket.find({ status: status })
      .populate(
        "detailOf",
        "_id title description status priority assignedTo createdAt"
      )
      .then((details) => {
        res.json({ details });
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (title) {
    //if title is passed in query
    await Ticket.find({ title: title })
      .populate(
        "detailOf",
        "_id title description status priority assignedTo createdAt"
      )
      .then((details) => {
        res.json({ details });
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (priority) {
    //if priority is passed in query
    await Ticket.find({ priority: priority })
      .populate(
        "detailOf",
        "_id title description status priority assignedTo createdAt"
      )
      .then((details) => {
        res.json({ details });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    //no query passed
    res.json({ status: error });
  }
});

//delete ticket
router.post("/tickets/delete", requireLogin, async (req, res) => {
  const { ticketId } = req.body;
  if (req.user.role == "admin") {
    //if user is admin then only allow delete
    await Ticket.findByIdAndDelete(ticketId)
      .then((result) => {
        res.json({ deletedTicket: ticketId });
      })
      .catch((err) => {
        console.log(err);
      });
  } 
  else {
    res.json({ error: "Only admin can delete a ticket" });
  }
});

//close ticket
router.post("/tickets/markAsClosed", requireLogin, async (req, res) => {
  const { ticketId } = req.body;
  
  //fetching the required ticket
  const ticket = await Ticket.findById(ticketId)
  .catch((err) => {
    console.log(err);
  });
  
  //if the specified ticket id exists
  if (ticket) {
    //if user is admin or ticket is assigned to that user
    if (req.user.role === "admin" || ticket.assignedTo == req.user.username) {
      //fetch add tickets assigned to current user and having status = "open"
      await Ticket.find({ assignedTo: req.user.username, status: "open" })
        .populate(
          "detailOf",
          "_id title description status priority assignedTo createdAt"
        )
        .then((details) => {
          //check high or medium priority exists if so then can't close ticket 
          if (ticket.priority == "low") {
            let arr = [];
            details.forEach((detail) => {
              if(detail.priority != "low"){
                arr.push(detail);
                // console.log(detail);
              }
            });
            if(arr.length > 0){
              res.json({ error: "You cannot close this ticket" ,higherPriority : arr });
            }
            else{
              Ticket.findByIdAndUpdate(ticketId, { status: "close" })
              .catch((err) => {
                console.log(err);
              });
            }
          }
          //check high priority exists if so then can't close ticket
          else if (ticket.priority == "medium") {
            let arr = [];
            details.forEach((detail) => {
              if(detail.priority == "high"){
                arr.push(detail);
                // console.log(detail);
              }
            });
            if(arr.length > 0){
              res.json({ error: "You cannot close this ticket", higherPriority: arr });
            }
            else{
              Ticket.findByIdAndUpdate(ticketId, { status: "close" })
              .catch((err) => {
                console.log(err);
              });
            }
          } else {
            Ticket.findByIdAndUpdate(ticketId, { status: "close" })
              .then((result) => {
                res.json({ closedTicket: ticketId });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    // } else {
    //   res.json({ error: "Only admin or assigned user can update a ticket" });
    // }
  } 
  else {
    res.json({ error: "Ticket does not exist" });
  }
}
});

module.exports = router;
