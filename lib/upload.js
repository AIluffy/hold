const fs = require('fs')
const request = require('request')
const uploadUrl = 'https://nos.kaolafed.com/upload'

module.exports = function (filename, fix) {
  return new Promise((resolve, reject) => {
    request.post({
      url: uploadUrl,
      formData: {
          file: fs.createReadStream(filename)
      }
    }, (err, res, body) => {
      if(fix) {
        fs.unlinkSync(filename)
      }
      
      if(err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}
