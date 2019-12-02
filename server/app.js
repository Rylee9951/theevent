const createError = require("http-errors")
const express = require("express")
const fileUpload = require("express-fileupload")
const imageUploadRouter = require("./routes/upload")
const aws = require("aws-sdk")
const config = require("./config")
const md5 = require("md5")
const S3_BUCKET = process.env.S3_BUCKET
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload())

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  region: config.AWS_REGION
})

app.get("/images", (req, res, next) => {
  aws.config.update({
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    region: config.AWS_REGION
  })
  const s3 = new aws.S3()
  var bucketParams = {
    Bucket: S3_BUCKET
  }
  s3.listObjects(bucketParams, function(err, data) {
    if (err) {
      console.log("Error", err)
    } else {
      console.log("Success", data)
      res.json(data.Contents)
    }
  })
})

app.post("/upload", (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log([...Object.keys(req)])
    res.status(400).json({ message: "No files were uploaded." })
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

// app.use("/api/v1", imageUploadRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}
  console.log(err)
  // render the error page
  res.status(err.status || 500)
  res.json({
    status: err.status,
    error: err
  })
})

app.listen(8080, () => {
  console.log("Listening on port 8080")
})
