import React, { useEffect } from "react"

import { useEvent } from "../hooks"

const ViewImages = props => {
  const { images } = useEvent()
  const url = "https://theevent-photos.s3.amazonaws.com/"
  return (
    <div>
      <h1>Your Gallery</h1>
      {images.map((item, i) => (
        <img key={"eventImage-" + i} src={`${url}${item.Key}`} />
      ))}
    </div>
  )
}

export default ViewImages
