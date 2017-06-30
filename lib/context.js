module.exports = (slapp, meta) => {
  return function contextMiddleware (req, res, next) {
    if (!req.slapp) {
      return res.send('Missing req.slapp')
    }
    req.slapp.meta = Object.assign(req.slapp.meta || {}, meta)
    next()
  }
}