const express = require("express");
const taskModel = require("../../../Model/TaskModel/taskSchema");

exports.postTask = async (req, res) => {
  try {
    const taskData = await taskModel.Task.create(req.body);
    console.log(req.body);
    res.json(taskData);
  } catch (err) {
    console.error(err);
    res.json("Error in creating task", err);
  }
};
