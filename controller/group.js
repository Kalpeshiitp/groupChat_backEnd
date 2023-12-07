const Group = require("../model/group");

const postCreateGroup = async (req, res, next) => {
  console.log("postCreateGroup req body data:", req.body);

  try {
    const  groupName = req.body.groupName;
    const userId = req.user.id;
    const createdBy= req.user.id
    console.log("userId >>>", userId);
    console.log('req.user.name', req.user.name)
    if (!groupName || !userId||!createdBy) {
      return res
        .status(400)
        .json({ error: "Bad parameters. Something is missing." });
    }

    const newGroup = await Group.create({
      groupName: groupName,
      createdBy:createdBy,
      userId: userId,
    });
    res
      .status(201)
      .json({ success: true, message: "New group has been created", newGroup });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating the new group", success: false });
  }
};

const getGroup = async (req, res, next) => {
  try {
    const groupNames = await Group.findAll();

    if (groupNames) {
      res.status(200).json({
        success: true,
        message: "Got the group names from the database",
        groupNames,
      });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching the group names" });
  }
};

module.exports = {
  postCreateGroup,
  getGroup,
};
