import * as React from "react"
import { useDropzone } from "react-dropzone"
import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = () => {
  const [status, setStatus] = React.useState("")
  const [audioUrl, setAudioUrl] = React.useState("")

  const onDrop = React.useCallback(acceptedFiles => {
    // Do something with the files
    console.log("A", acceptedFiles)
    setStatus("Uploading...")
    const data = new FormData()
    data.append("file", acceptedFiles[0])
    data.append("upload_preset", "pqsibowt")
    data.append("cloud_name", "myyouthsports")
    fetch("https://api.cloudinary.com/v1_1/myyouthsports/video/upload", {
      method: "post",
      body: data,
    })
      .then(async res => {
        setStatus("File selected")
        const file = await res.json()[0]

        const url = file.url
        console.log("urllll", file.url)
        setAudioUrl(url)
      })
      .catch(() => {
        setStatus("Shit, it failed! Oh well")
      })
  }, [])

  const [name, setName] = React.useState("")

  const onClickSend = function () {
    const body = JSON.stringify({ name: name, audioUrl: audioUrl })

    setStatus("Sending...")
    fetch("https://nodeproxymys.herokuapp.com/api/kamp-korals", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then(async res => {
        setStatus("It worked! Upload successful")
      })
      .catch(() => {
        setStatus("Shit, it failed! Oh well")
      })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Layout>
      <Seo title="Home" />
      <h1>Hi people</h1>
      <p>This is where you upload audio for Kamp Koloma</p>
      <p>Please make sure the file is an audio file</p>
      <input
        placeholder="name"
        onChange={e => {
          setName(e.target.value)
        }}
      />
      <br />
      <br />
      <input
        placeholder="URL (optional)"
        onChange={e => {
          setAudioUrl(e.target.value)
        }}
      />
      <br />
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            <br />
            <span style={{ borderStyle: "dashed", borderWidth: 2 }}>
              Drag 'n' drop some files here
            </span>
            <br /> <br /> or <button>click to select files</button>
            <br />
            <br />
            <p style={{ color: "green" }}>{status}</p>
          </p>
        )}
      </div>
      <button onClick={onClickSend}>UPLOAD</button>
      {/* <p>
      <Link to="/page-2/">Go to page 2</Link> <br />
      <Link to="/using-typescript/">Go to "Using TypeScript"</Link> <br />
      <Link to="/using-ssr">Go to "Using SSR"</Link> <br />
      <Link to="/using-dsg">Go to "Using DSG"</Link>
    </p> */}
    </Layout>
  )
}

export default IndexPage
