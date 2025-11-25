// exports.getDashboard = (req, res) => {
//   res.json({
//     message: "Welcome to Dashboard",
//     user: req.user,
//   });
// };


exports.dashboard = async (req, res) => {
  res.json({
    message: `Hello ${req.user.email}, welcome to your dashboard!`,
    user: req.user,
  });
};
