const express = require("express");

const taskModel = require("../../../Model/TaskModel/taskSchema");

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await taskModel.Task.findByIdAndDelete(id);

    res.json("Task deleted successfully", result);
  } catch (err) {
    console.error(err);
    res.json("Error in deleting task", err);
  }
};
