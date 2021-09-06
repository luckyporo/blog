import { useEffect, useState } from 'react'
import { useAudio, useThrottle } from 'react-use'
import Image from './Image'

type Props = {
  songUrl: string
  imgUrl: string
  name: string
  artist: string
  album: string
  autoPlay?: boolean
}

const MusicCard = (props: Props) => {
  // eslint-disable-next-line jsx-a11y/media-has-caption
  const [audio, state, controls] = useAudio(<audio src={props.songUrl} autoPlay={props.autoPlay} />)
  const [time, setTime] = useState('0:00')
  const [end, setEnd] = useState('0:00')
  const [process, setProcess] = useState('0')

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60)
    const sec = Math.floor(time % 60)
    return min + ':' + (sec < 10 ? '0' + sec : sec)
  }

  useThrottle(() => {
    setTime(formatTime(state.time))
    if (state.buffered[0]?.end) {
      if (end === '0:00') setEnd(formatTime(state.buffered[0].end))
      setProcess(`${(state.time / state.buffered[0].end) * 100}%`)
    }
  }, 1000)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => controls.volume(0.1), [])

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div>{audio}</div>
      <div className="flex-shrink-0">
        <Image
          className="h-28 w-28"
          src={props.imgUrl}
          width={112}
          height={112}
          alt="Cover Image"
        />
      </div>
      <div className="flex-auto divide-y divide-gray-200 divide-solid overflow-hidden">
        <div>
          <div className="h-8 text-base font-medium text-black">
            <p className="overflow-hidden whitespace-nowrap overflow-ellipsis">{props.name}</p>
          </div>
          <div className="h-6 text-xs text-gray-600">
            {props.artist} - {props.album}
          </div>
        </div>
        <div className="pt-2 flex flex-row items-center">
          <div className="flex-grow-0 w-6 h-6 ml-1 mr-1">
            {state.paused ? (
              <button onClick={() => controls.play()}>
                <svg
                  className="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2337"
                  width="24"
                  height="24"
                >
                  <path
                    d="M512 113c220 0 399 179 399 399S732 911 512 911 113 732 113 512s179-399 399-399m0-42C268.4 71 71 268.4 71 512s197.4 441 441 441 441-197.4 441-441S755.6 71 512 71z"
                    p-id="2338"
                    fill="#828282"
                  ></path>
                  <path
                    d="M440.3 697.6c-29.9 0-54.3-24.3-54.3-54.3V380.6c0-29.9 24.4-54.3 54.3-54.3 9.4 0 18.7 2.5 27 7.3L694.9 465c17 9.8 27.1 27.4 27.1 47s-10.1 37.2-27.1 47L467.4 690.3c-8.4 4.8-17.7 7.3-27.1 7.3z m0-329.2c-5.9 0-12.3 4.7-12.3 12.3v262.7c0 10.3 10.9 14.9 18.4 10.6l227.5-131.4c5.5-3.2 6.1-8.4 6.1-10.6s-0.6-7.4-6.1-10.6L446.4 370c-2-1.1-4-1.6-6.1-1.6z"
                    p-id="2339"
                    fill="#828282"
                  ></path>
                </svg>
              </button>
            ) : (
              <button onClick={() => controls.pause()}>
                <svg
                  className="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="786"
                  width="24"
                  height="24"
                >
                  <path
                    d="M425.1 648.5c-11.6 0-21-9.5-21-21v-231c0-11.6 9.4-21 21-21 11.5 0 21 9.4 21 21v231c0 11.5-9.4 21-21 21z m168 0c-11.6 0-21-9.5-21-21v-231c0-11.6 9.4-21 21-21 11.5 0 21 9.4 21 21v231c0 11.5-9.4 21-21 21z"
                    p-id="787"
                    fill="#828282"
                  ></path>
                  <path
                    d="M512 113c220 0 399 179 399 399S732 911 512 911 113 732 113 512s179-399 399-399m0-42C268.4 71 71 268.4 71 512s197.4 441 441 441 441-197.4 441-441S755.6 71 512 71z"
                    p-id="788"
                    fill="#828282"
                  ></path>
                </svg>
              </button>
            )}
          </div>
          <div className="flex-auto flex flex-row items-center">
            <span className="flex-grow-0 text-xs hidden md:block w-7">{time}</span>
            <div
              className="flex-auto opacity-70 bg-gray-400 cursor-pointer relative h-1 ml-2 mr-2 rounded"
              data-direction="horizontal"
            >
              <div
                className="rounded absolute pointer-events-none bg-primary-600 h-1"
                style={{ width: process }}
              >
                {/* <div
                  className="h-2 w-2 rounded-full bg-primary-600 pointer-events-auto shadow-sm"
                  data-method="rewind"
                ></div> */}
              </div>
            </div>
            {end !== '0:00' && (
              <span className="flex-grow-0 text-xs hidden md:block w-7">{end}</span>
            )}
          </div>
          <div className="flex-grow-0 w-6 h-6 ml-1 mr-1 relative">
            <div className="cursor-pointer outline-none focus:outline-none"></div>
            {/* <div className="absolute w-4 h-20 opacity-70 bg-black rounded left-0.5 bottom-7 flex-col items-center z-10 outline-none hidden">
              <div
                className="flex items-center mb-2 mt-2 w-1 opacity-70 bg-gray-400 cursor-pointer relative ml-3 mr-3 rounded h-full"
                data-direction="vertical"
              >
                <div className="relative bottom-0 h-full w-1.5 ">
                  <div
                    className="absolute -left-0.5 h-2 w-2 rounded-full bg-primary-600 pointer-events-auto shadow-sm"
                    data-method="changeVolume"
                  ></div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MusicCard
