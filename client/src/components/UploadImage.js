import React, { useState } from "react"
import { useEvent } from "../hooks"
import ViewImages from "./ViewImages"
import "../styles/upload.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileUpload } from "@fortawesome/free-solid-svg-icons"

const UploadImage = props => {
  const { add } = useEvent()
  const [image, setImage] = useState(null)
  const [label, setLabel] = useState("Choose a file")

  function submitFile(e) {
    e.preventDefault()
    const data = new FormData()

    data.append("photo", image)
    for (var key of data.entries()) {
      console.log(key[0] + ", " + key[1])
    }
    // add(data)
    setImage(null)
    setLabel("Choose a file")
  }

  return (
    <div>
      <form id="formContainer" onSubmit={submitFile}>
        <h1>Add Your Images</h1>

        <input
          id="file"
          className="inputFile"
          name="image"
          type="file"
          onChange={e => {
            setImage(e.target.files[0], setLabel(e.target.files[0].name))
          }}
        />
        <label htmlFor="file">
          <FontAwesomeIcon icon={faFileUpload} /> {label}
        </label>
        <button type="submit">Add Image</button>
      </form>
      <ViewImages />
    </div>
  )
}

export default UploadImage
