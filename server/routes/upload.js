const express = require("express")
const router = express.Router()
const aws = require("aws-sdk")
const config = require("../config")
const md5 = require("md5")
const S3_BUCKET = process.env.S3_BUCKET

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  region: config.AWS_REGION
})

router.post("/upload", (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log([...Object.keys(req)])
    res.status(400).send("No files were uploaded.")
    return
  }
  const file = req.files.photo

  const s3 = new aws.S3()

  // rename a file
  const renameImage = file =>
    md5(Date.now()) +
    "." +
    file.name
      .replace(/ /g, "-")
      .split(".")
      .pop()

  s3.createBucket(() => {
    var params = {
      Bucket: S3_BUCKET,
      Key: renameImage(file),
      Body: file.data
    }
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err.message)
        res.status(422).send(err)
      }
      // return the S3's path to the image
      res.json(data.Location)
    })
  })
})

module.exports = router
