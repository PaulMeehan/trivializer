const path = require("path");
const router = require("express").Router();
const authRoutes = require("./auth");
const apiRoutes = require("./api");

// Auth Routes
router.use('/auth', authRoutes);

// API Routes
router.use("/api", apiRoutes);

module.exports = router;
