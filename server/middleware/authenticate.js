
var authorize = (req, res, next) => {
  let email = req.header('email')
  let secret = req.header('secret')
  console.log('autenticando')
  //console.log(`email: ${email}, secret: ${secret}`)
  if(email === 'xxx@xxx.com' &&
  		secret === '123456') {
  	console.log(`Autorizado`)
  	next()
  } else {
  	console.log(`No autorizado`)
    res.status(401).send()
  }
}

module.exports = {authorize}