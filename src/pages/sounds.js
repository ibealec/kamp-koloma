import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

const useAudio = url => {
  const [audio] = React.useState(new Audio(url))
  const [playing, setPlaying] = React.useState(false)

  const toggle = () => setPlaying(!playing)

  React.useEffect(() => {
    playing ? audio.play() : audio.pause()
  }, [playing])

  React.useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false))
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false))
    }
  }, [])

  return [playing, toggle]
}

const SecondPage = () => {
  const [sounds, setSounds] = React.useState([])
  React.useEffect(() => {
    fetch("https://nodeproxymys.herokuapp.com/api/kamp-korals").then(
      async res => {
        const data = await res.json()
        console.log(data)
        setSounds(data)
      }
    )
  }, [])

  const Player = ({ sound }) => {
    const [playing, toggle] = useAudio(sound.audioUrl)
    return (
      <div>
        <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
      </div>
    )
  }

  const Video = ({ sound }) => {
    let youtubeId
    if (sound.audioUrl.includes("youtube")) {
      youtubeId = sound.audioUrl.split("=")[1]
    }
    if (sound.audioUrl.includes("youtu.be")) {
      youtubeId =
        sound.audioUrl.split("/")[sound.audioUrl.split("/").length - 1]
    }
    if (youtubeId.includes("&")) {
      youtubeId = youtubeId.split("&")[0]
    }
    return (
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/
${youtubeId}`}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    )
  }

  return (
    <Layout>
      <Seo title="Page two" />
      <h1>Audio controller</h1>
      <div style={{ paddingBottom: 100 }}>
        {sounds.map(item => {
          return (
            <div>
              <h2>{item.name}</h2>
              {item.audioUrl.includes("youtu") ? (
                <>
                  <Video sound={item} />
                </>
              ) : (
                <Player sound={item} />
              )}
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

export default SecondPage
