const express = require("express");
const taskModel = require("../../../Model/TaskModel/taskSchema");

exports.getTask = async (req, res) => {
  try {
    const tasks = await taskModel.Task.find();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.json("Error in getting task", err);
  }
};
