import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './vincent.styl'

const {
  to,
  set,
  timeline,
  utils: { random },
} = gsap

const TIMING = {
  DOWN: 0.2,
  UP: 0.5,
}
const EYE_MOVEMENT = 3

const Vincent = () => {
  const vincentRef = useRef(null)
  const blocksRef = useRef(null)
  const eyesRef = useRef(null)
  const laptopRef = useRef(null)

  const RESET = () => {
    set('.vvg', { display: 'block' })
    set('.vvg__eyebrows', { display: 'none' })
    set(['.vvg__eyes', '.vvg__ear', '.vvg__eyes-group', '.vvg__code-block'], {
      transformOrigin: '50% 50%',
    })
    set('.vvg__head-group', { transformOrigin: '50% 60%' })
    set('.vvg__bulb-dashes', {
      transformOrigin: '50% 50%',
      scale: 0,
      opacity: 1,
    })
    set('.vvg__bulb', { display: 'none' })
    set('.vvg__code-block', { scale: 0 })
    set('.vvg__code-block', {
      '--block-color': () => `var(--owl-${Math.floor(random(1, 6))})`,
      rotation: () => random(-45, 45),
    })
  }

  const LAPTOP_ROCK = (paused = true) =>
    timeline({
      paused,
    })
      .to('.vvg__laptop', {
        repeatRefresh: true,
        repeat: -1,
        yoyo: true,
        duration: 0.1,
        xPercent: () => random(-4, 4),
        yPercent: () => random(-4, -1),
      })
      .to('.vvg__head-group', {
        repeat: -1,
        yoyo: true,
        duration: 0.1,
        yPercent: '+=1',
      })

  const EYE_ROCK = (paused = true) =>
    timeline({
      repeat: -1,
      paused,
    })
      .to('.vvg__eyes-group', { xPercent: EYE_MOVEMENT })
      .to('.vvg__eyes-group', { xPercent: -EYE_MOVEMENT })

  const FIRE_BLOCKS = (paused = true) => {
    const FIRE_TL = timeline({
      paused,
    })
    const BLOCKS = document.querySelectorAll('.vvg__code-block')
    for (const BLOCK of BLOCKS) {
      const BLOCK_TL = timeline({
        repeatRefresh: true,
        repeat: -1,
      })
        .set(BLOCK, { scale: 0, xPercent: 0, yPercent: 0 })
        .to(
          BLOCK,
          {
            duration: () => random(0.25, 2),
            scale: () => random(0.5, 2),
            xPercent: () =>
              BLOCK.classList.contains('vvg__code-block--left')
                ? random(-300, -100)
                : random(100, 300),
            yPercent: () => random(-1000, -200),
          },
          0
        )
      FIRE_TL.add(BLOCK_TL, 0)
    }
    return FIRE_TL
  }
  useEffect(() => {
    if (vincentRef.current) {
      // // Reset everything
      RESET()
      // Set up the firing block
      blocksRef.current = FIRE_BLOCKS(false)
      // Create eye rocking timeline
      eyesRef.current = EYE_ROCK(false)
      // Create laptop rocking timeline
      laptopRef.current = LAPTOP_ROCK(false)
      // CODE()
    }
  }, [])

  return (
    <svg
      className="vvg"
      ref={vincentRef}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 104.211 178.897">
      <defs>
        <clipPath id="b">
          <path
            d="M242.822 893.869c0 61.251-36.059 106.284-94.208 106.284-54.326 0-91.436-45.033-91.436-106.284 0-61.252 37.668-85.951 90.973-85.951 53.306 0 94.67 24.699 94.67 85.95z"
            fill="red"
          />
        </clipPath>
        <clipPath id="d">
          <ellipse ry="23.111" rx="23.762" cy="827.682" cx="68.304" />
        </clipPath>
        <clipPath id="e">
          <ellipse
            transform="scale(-1 1)"
            cx="-231.243"
            cy="827.682"
            rx="23.762"
            ry="23.111"
            fill="#803300"
          />
        </clipPath>
        <g id="a">
          <rect
            width="159.025"
            height="12.562"
            x="182.011"
            y="79.443"
            ry="0"
            fill="#fa4d32"
          />
          <rect
            ry="0"
            y="92.004"
            x="182.011"
            height="12.562"
            width="159.025"
            fill="#fdb020"
          />
          <rect
            width="159.025"
            height="12.562"
            x="182.011"
            y="104.566"
            ry="0"
            fill="#fdf133"
          />
          <rect
            ry="0"
            y="117.128"
            x="182.011"
            height="12.562"
            width="159.025"
            fill="#1ce590"
          />
          <rect
            width="159.025"
            height="12.562"
            x="182.011"
            y="129.689"
            ry="0"
            fill="#13a1e3"
          />
          <rect
            ry="0"
            y="142.251"
            x="182.011"
            height="12.562"
            width="159.025"
            fill="#7e2ae4"
          />
          <rect
            width="159.025"
            height="12.562"
            x="182.011"
            y="154.813"
            ry="0"
            fill="#9e4ea5"
          />
        </g>
        <g id="c">
          <use
            height="100%"
            width="100%"
            xlinkHref="#a"
            transform="rotate(-45 965.632 1098.357) scale(2 3)"
          />
          <use
            height="100%"
            width="100%"
            xlinkHref="#a"
            transform="rotate(-45 1282.497 967.107) scale(2 3)"
          />
        </g>
      </defs>
      <g transform="translate(67.874 -9.03)">
        <g className="vvg__body">
          <ellipse
            className="vvg__shirt vvg__shirt--shade vvg-stroke"
            transform="translate(3.085 -12.7)"
            cx="-18.854"
            cy="148.83"
            rx="37.558"
            ry="34.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="vvg__shirt"
            d="M-19.325 101.965a37.558 34.35 0 00-34.001 34.165 37.558 34.35 0 0033.706 34.165 37.558 34.35 0 0034-34.165 37.558 34.35 0 00-33.705-34.165z"
          />
          <circle
            className="vvg__neck vvg-skin vvg-stroke"
            transform="translate(3.085 -12.7)"
            cx="-18.854"
            cy="112.584"
            r="13.363"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse
            className="vvg__body-outline vvg-stroke"
            transform="translate(3.085 -12.7)"
            ry="34.35"
            rx="37.558"
            cy="148.83"
            cx="-18.854"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g className="vvg__head-group">
          <g className="vvg__head">
            <circle
              className="vvg-skin vvg__ear vvg-stroke"
              r="8.553"
              cy="73.563"
              cx="-59.067"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(.406)"
            />
            <g className="vvg__face">
              <circle
                className="vvg-skin--shade"
                cx="-15.769"
                cy="63.674"
                r="44.099"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="vvg-skin"
                d="M-21.87 20.047a44.1 44.1 0 00-37.998 43.627A44.1 44.1 0 00-21.84 107.3a44.1 44.1 0 0038-43.626 44.1 44.1 0 00-38.03-43.627z"
                fill="#f4e3d7"
              />
            </g>
            <g className="vvg__beard">
              <path
                className="vvg-hair"
                d="M-54.193 42.078a44.1 44.1 0 00-5.675 21.596 44.1 44.1 0 0044.099 44.1 44.1 44.1 0 0044.1-44.1 44.1 44.1 0 00-5.67-21.523c5.746 41.309-17.27 46.421-38.43 46.421-21.174 0-45.005-4.052-38.424-46.494z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="vvg-hair--light"
                d="M-54.193 42.078a44.1 44.1 0 00-5.675 21.596 44.1 44.1 0 0019.076 36.252 43.902 43.902 0 0020.79 5.201c24.355 0 44.1-19.744 44.1-44.1a44.09 44.09 0 00-.544-6.775c-.075 30.245-20.437 34.32-39.323 34.32-21.174 0-45.005-4.052-38.424-46.494z"
              />
              <path
                className="vvg-stroke vvg__beard-outline"
                d="M-54.193 42.078a44.1 44.1 0 00-5.675 21.596 44.1 44.1 0 0044.099 44.1 44.1 44.1 0 0044.1-44.1 44.1 44.1 0 00-5.67-21.523c5.746 41.309-17.27 46.421-38.43 46.421-21.174 0-45.005-4.052-38.424-46.494z"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <g className="vvg__moustache">
              <path
                className="vvg-hair"
                d="M4.78 89.546A20.548 12.028 0 00-5.496 79.13a20.548 12.028 0 00-20.548 0 20.548 12.028 0 00-10.274 10.416h20.548z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="vvg-hair--light"
                d="M-17.866 77.593a20.548 12.028 0 00-8.177 1.537 20.548 12.028 0 00-10.274 10.416H.546A20.548 12.028 0 00-9.728 79.13a20.548 12.028 0 00-8.138-1.537z"
              />
              <path
                className="vvg__moustache-outline vvg-stroke"
                d="M4.78 89.546A20.548 12.028 0 00-5.496 79.13a20.548 12.028 0 00-20.548 0 20.548 12.028 0 00-10.274 10.416h20.548z"
                fill="none"
                strokeWidth="1.654"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <g className="vvg__eyes-group">
              <g
                className="vvg-stroke vvg__eyes"
                transform="translate(.487)"
                strokeWidth="1.296"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle r="1.998" cy="64.681" cx="-33.494" />
                <circle cx=".983" cy="64.681" r="1.998" />
              </g>
            </g>
            <rect
              className="vvg__hair vvg-hair"
              width="57.452"
              height="26.269"
              x="-44.495"
              y="22.4"
              ry="4.438"
            />
            <g className="vvg__cheeks" transform="translate(-.468)">
              <circle r="3.875" cy="73.162" cx="-39.021" />
              <circle cx="8.419" cy="73.162" r="3.875" />
            </g>
            <g
              className="vvg__eyebrows vvg-stroke"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M-40.713 61.55a6.123 6.123 0 018.486-5.699" />
              <path d="M9.176 61.55a6.123 6.123 0 00-8.487-5.7" />
            </g>
          </g>
          <g className="vvg__cap">
            <rect
              className="vvg-stroke vvg__cap-strap"
              width="43.566"
              height="7.408"
              x="-37.953"
              y="42.542"
              ry="3.704"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              className="vvg-stroke vvg__cap-strap"
              ry="3.704"
              y="42.542"
              x="-22.798"
              height="7.408"
              width="28.411"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <ellipse
              className=" vvg-stroke vvg__cap-button"
              cx="-15.769"
              cy="10.626"
              rx="2.847"
              ry="1.157"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              className="vvg__cap-notch"
              cx="-17.198"
              cy="46.246"
              r=".945"
            />
            <circle
              className="vvg__cap-notch"
              r=".945"
              cy="46.246"
              cx="-5.67"
            />
            <circle
              className="vvg__cap-notch"
              cx="-11.339"
              cy="46.246"
              r=".945"
            />
            <path
              className="vvg__cap-body vvg-stroke"
              d="M-14.755 11.393a42.956 38.567 0 00-22.492 5.157 42.956 38.567 0 00-21.478 33.4h26.174v-2.467c2.27-12.737 2.466-12.32 16.782-12.32 14.316 0 14.577-.028 15.98 12.32v2.467h26.976A42.956 38.567 0 005.71 16.55a42.956 38.567 0 00-20.464-5.157z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <g
          className="vvg__bulb"
          transform="translate(-39.365 -11.864)"
          strokeLinecap="round">
          <path
            className="vvg__bulb-dashes"
            d="M10.794 5.982a22.935 22.935 0 1125.335.178"
            fill="none"
            strokeLinejoin="round"
            strokeDasharray="1.79340955,21.52091451"
          />
          <path
            className="vvg-stroke vvg__bulb-screw"
            d="M28.612-1.718a12.851 12.851 0 01-5.016 1.034 12.851 12.851 0 01-5.016-1.02v5.43a3.75 3.75 0 003.759 3.758h2.514a3.75 3.75 0 003.759-3.758z"
            strokeLinejoin="round"
          />
          <path
            className="vvg-stroke vvg__bulb-screw"
            d="M28.612-1.718a12.851 12.851 0 01-5.016 1.034 12.851 12.851 0 01-5.016-1.02V1.08a3.75 3.75 0 003.759 3.758h2.514a3.75 3.75 0 003.759-3.758z"
            strokeLinejoin="round"
          />
          <path
            className="vvg-stroke vvg__bulb-filament"
            d="M21.394-1.034v-9.22"
          />
          <path
            className="vvg-stroke vvg__bulb-screw"
            d="M28.612-1.718a12.851 12.851 0 01-5.016 1.034 12.851 12.851 0 01-5.016-1.02v.138a3.75 3.75 0 003.759 3.758h2.514a3.75 3.75 0 003.759-3.758z"
            strokeLinejoin="round"
          />
          <path
            className="vvg-stroke vvg__bulb-filament"
            d="M25.627-1.034v-9.22"
          />
          <circle
            className="vvg__bulb-bulb vvg-stroke"
            r="12.851"
            cy="-13.535"
            cx="23.596"
            strokeLinejoin="round"
          />
        </g>
        <g className="vvg__laptop" transform="translate(3.085 -12.7)">
          <path
            className="vvg__laptop-shell"
            d="M-65.538 131.734h93.37c1.564 0 2.94 1.263 2.822 2.822l-4.762 62.586c-.119 1.56-1.259 2.822-2.822 2.822h-83.317c-1.563 0-2.69-1.264-2.822-2.822l-5.291-62.586c-.132-1.558 1.258-2.822 2.822-2.822z"
            strokeWidth="1.058"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="vvg__laptop-shell vvg__laptop-shell--main"
            d="M-60.888 134.865c-1.622 0-3.065 1.285-2.929 2.87l5.37 62.23H23.07c1.564 0 2.704-1.264 2.822-2.823l4.74-62.277z"
          />
          <g transform="rotate(14.036 -546.221 140.257) scale(.0556)">
            <g clipPath="url(#b)">
              <use height="100%" width="100%" xlinkHref="#c" />
            </g>
            <g clipPath="url(#d)">
              <use height="100%" width="100%" xlinkHref="#c" />
            </g>
            <g clipPath="url(#e)">
              <use height="100%" width="100%" xlinkHref="#c" />
            </g>
            <path
              d="M211.925 958.105c0 19.907-28.6 38.819-63.311 38.819s-60.54-18.912-60.54-38.82c0-19.907 26.29-33.273 61.002-33.273 34.71 0 62.85 13.366 62.85 33.274z"
              fill="#e9c6af"
            />
            <path d="M181.194 931.763c0 7.657-19.04 24.493-30.27 24.493s-32.118-16.836-32.118-24.493 20.24-12.477 31.47-12.477 30.918 4.82 30.918 12.477z" />
            <path
              d="M84.784 826.317a16.549 16.095 0 00-16.48-14.731 16.549 16.095 0 00-16.548 16.095 16.549 16.095 0 0016.548 16.096 16.549 16.095 0 001.132-.039c.815-1.337 1.582-2.727 2.471-3.983a65.703 65.703 0 015.055-6.283 65.597 65.597 0 015.713-5.548c.668-.576 1.417-1.058 2.109-1.607z"
              fill="#e9c6af"
            />
            <path
              d="M214.764 826.317a16.549 16.095 0 0116.48-14.731 16.549 16.095 0 0116.548 16.095 16.549 16.095 0 01-16.549 16.096 16.549 16.095 0 01-1.131-.039c-.816-1.337-1.582-2.727-2.472-3.983a65.703 65.703 0 00-5.055-6.283 65.597 65.597 0 00-5.712-5.548c-.67-.576-1.418-1.058-2.11-1.607z"
              fill="#e9c6af"
            />
            <path
              d="M147.731 815.358c-13.396 0-26.022 1.079-37.671 3.334v11.353c11.649-2.255 24.275-3.334 37.671-3.334 15.104 0 29.459 1.373 42.667 4.256v-11.355c-13.208-2.883-27.564-4.254-42.667-4.254z"
              fill="red"
            />
            <path
              d="M165.195 816.013a15.875 7.813 0 014.43 5.412 15.875 7.813 0 01-5.414 5.863c9.116.653 17.878 1.866 26.186 3.68v-11.356c-8.007-1.748-16.44-2.931-25.202-3.6z"
              fill="#e50000"
            />
            <path
              d="M148.06 789.038c-43.49 0-75.872 19.481-83.284 63.857 12.322-10.516 27.906-18.695 45.285-22.652 0 0-2.446-12.499 10.25-16.029 14.513-4.035 18.403-3.943 27.749-4 10.2-.061 15.075-.07 30.338 4 14.187 3.784 12 17.113 12 17.113 17.218 4.421 31.846 10.722 44.264 21.568-7.277-46.03-42.375-63.857-86.602-63.857z"
              fill="#1a1a1a"
            />
            <circle
              r="11.185"
              cy="894.081"
              cx="97.242"
              fill="#faa"
              fillOpacity=".577"
            />
            <circle
              r="11.185"
              cx="201.851"
              cy="894.081"
              fill="#faa"
              fillOpacity=".577"
            />
            <path
              d="M96.601 864.041a21.271 21.271 0 01-6.78 15.572 21.271 21.271 0 01-16.02 5.644"
              fill="none"
              stroke="#e9afaf"
              strokeWidth="2.983"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M203.53 864.041a21.271 21.271 0 006.78 15.572 21.271 21.271 0 0016.02 5.644"
              fill="none"
              stroke="#e9afaf"
              strokeWidth="2.983"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M77.29 854.608c-6.508-.07-13.363.182-22.8 2.131l-14.318 2.769 2.308 15.038c2.094.293 4.984 1.016 6.352 2.848 3.528 4.722 1.202 9.286 2.003 17.625 2.67 27.781 11.92 33.596 26.247 35.267 7.502.875 22.816 2.282 33.28-1.433 9.456-3.357 18.223-9.868 24.158-17.96 6.274-8.553 6.948-18.235 10.843-25.726 2.76-5.308 7.7-4.176 9.258 0 2.951 7.91 4.379 17.173 10.653 25.726 5.935 8.092 14.702 14.603 24.159 17.96 10.463 3.715 25.777 2.308 33.279 1.433 14.326-1.671 23.578-7.486 26.249-35.267.801-8.339-1.525-12.903 2.003-17.625 1.414-1.893 4.463-2.611 6.567-2.885l2.297-14.962-14.522-2.808c-15.1-3.12-23.591-1.89-34.623-1.957-4.093-.025-8.777.115-13.136.573-8.125.855-16.176 2.382-24.174 4.05-7.988 1.665-14.94 6.1-23.098 5.942-7.869-.153-15.615-4.977-23.313-6.616-8.132-1.732-14.824-3.106-24.713-3.376-4.794-.13-9.043-.598-13.136-.573-4.137.026-7.918-.132-11.823-.174z" />
            <path
              d="M85.28 860.471c-10.088.168-24.807.706-28.48 12.251-3.277 15.249-3.122 32.76 5.735 45.627 7.396 10.745 23.365 8.637 35.258 8.22 18.899-.663 35.138-15.383 40.158-33.389 1.93-7.753 4.168-13.928.696-19.382-5.946-9.34-20.099-11.778-30.58-12.967a443.553 443.553 0 00-22.787-.36z"
              fill="#333"
            />
            <path
              d="M56.04 864.299a4.079 1.692 0 01-4.058 1.692 4.079 1.692 0 01-4.1-1.675 4.079 1.692 0 014.017-1.71 4.079 1.692 0 014.14 1.658"
              fill="#b3b3b3"
            />
            <path
              d="M214.515 860.471c10.088.168 24.807.706 28.481 12.251 3.276 15.249 3.12 32.76-5.736 45.627-7.396 10.745-23.365 8.637-35.257 8.22-18.9-.663-35.139-15.383-40.16-33.389-1.928-7.753-4.167-13.928-.695-19.382 5.946-9.34 20.1-11.778 30.58-12.967a443.553 443.553 0 0122.787-.36z"
              fill="#333"
            />
            <path
              d="M243.755 864.299a4.079 1.692 0 004.058 1.692 4.079 1.692 0 004.1-1.675 4.079 1.692 0 00-4.017-1.71 4.079 1.692 0 00-4.14 1.658"
              fill="#b3b3b3"
            />
            <path
              d="M100.812 860.598l-19.186 66.305c5.85.159 11.675-.045 16.894-.378l18.586-64.222c-5.549-1.363-11.032-1.57-16.294-1.705z"
              fill="#fff"
            />
            <path
              d="M89.154 860.456c-1.292.002-2.586 0-3.875.014-1.081.018-2.235.05-3.403.09l-17.662 59.853c1.729 1.827 3.77 3.172 6.025 4.148z"
              fill="#fff"
            />
          </g>
          <path
            className="vvg__laptop-shell vvg__laptop-shell--shade"
            d="M21.505 131.734a90.813 70.516 29.586 01-1.449 15.21 90.813 70.516 29.586 01-83.63 44.235l.505 5.963c.132 1.558 1.26 2.823 2.823 2.823h83.315c1.564 0 2.704-1.264 2.822-2.823l4.763-62.586c.119-1.559-1.259-2.822-2.822-2.822z"
          />
          <path
            className="vvg-stroke"
            d="M-65.538 131.734h93.37c1.564 0 2.94 1.263 2.822 2.822l-4.762 62.586c-.119 1.56-1.259 2.822-2.822 2.822h-83.317c-1.563 0-2.69-1.264-2.822-2.822l-5.291-62.586c-.132-1.558 1.258-2.822 2.822-2.822z"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            className="vvg__laptop-badge"
            r="5.859"
            cy="165.849"
            cx="-18.854"
          />
        </g>
      </g>
      <g className="codepen"></g>
      <g className="vvg__code-block vvg__code-block--left">
        <path
          d="M5.358 99.059v-1.514l4.868-2.106v1.44l-2.92 1.185q-.16.063-.318.095-.17.032-.318.042-.169.022-.328.022v.105q.16.011.328.032.149.021.318.053.17.032.317.106l4.287 1.873 2.709-7.387h1.64l-.688 1.863 5.98 2.677v1.514l-4.868 2.106v-1.44l2.92-1.185q.16-.063.318-.095.17-.032.317-.053.17-.01.328-.01v-.106q-.169-.011-.338-.032-.148-.021-.318-.053-.158-.042-.307-.106l-4.487-1.99-2.508 6.858h-1.64l.497-1.333z"
          strokeWidth=".265"
        />
      </g>
      <g className="vvg__code-block vvg__code-block--left">
        <path
          d="M5.358 99.059v-1.514l4.868-2.106v1.44l-2.92 1.185q-.16.063-.318.095-.17.032-.318.042-.169.022-.328.022v.105q.16.011.328.032.149.021.318.053.17.032.317.106l4.287 1.873 2.709-7.387h1.64l-.688 1.863 5.98 2.677v1.514l-4.868 2.106v-1.44l2.92-1.185q.16-.063.318-.095.17-.032.317-.053.17-.01.328-.01v-.106q-.169-.011-.338-.032-.148-.021-.318-.053-.158-.042-.307-.106l-4.487-1.99-2.508 6.858h-1.64l.497-1.333z"
          strokeWidth=".265"
        />
      </g>
      <g className="vvg__code-block vvg__code-block--left">
        <path
          d="M5.358 99.059v-1.514l4.868-2.106v1.44l-2.92 1.185q-.16.063-.318.095-.17.032-.318.042-.169.022-.328.022v.105q.16.011.328.032.149.021.318.053.17.032.317.106l4.287 1.873 2.709-7.387h1.64l-.688 1.863 5.98 2.677v1.514l-4.868 2.106v-1.44l2.92-1.185q.16-.063.318-.095.17-.032.317-.053.17-.01.328-.01v-.106q-.169-.011-.338-.032-.148-.021-.318-.053-.158-.042-.307-.106l-4.487-1.99-2.508 6.858h-1.64l.497-1.333z"
          strokeWidth=".265"
        />
      </g>
      <g className="vvg__code-block vvg__code-block--left">
        <path
          d="M5.358 99.059v-1.514l4.868-2.106v1.44l-2.92 1.185q-.16.063-.318.095-.17.032-.318.042-.169.022-.328.022v.105q.16.011.328.032.149.021.318.053.17.032.317.106l4.287 1.873 2.709-7.387h1.64l-.688 1.863 5.98 2.677v1.514l-4.868 2.106v-1.44l2.92-1.185q.16-.063.318-.095.17-.032.317-.053.17-.01.328-.01v-.106q-.169-.011-.338-.032-.148-.021-.318-.053-.158-.042-.307-.106l-4.487-1.99-2.508 6.858h-1.64l.497-1.333z"
          strokeWidth=".265"
        />
      </g>
      <g className="vvg__code-block vvg__code-block--left">
        <path
          d="M5.358 99.059v-1.514l4.868-2.106v1.44l-2.92 1.185q-.16.063-.318.095-.17.032-.318.042-.169.022-.328.022v.105q.16.011.328.032.149.021.318.053.17.032.317.106l4.287 1.873 2.709-7.387h1.64l-.688 1.863 5.98 2.677v1.514l-4.868 2.106v-1.44l2.92-1.185q.16-.063.318-.095.17-.032.317-.053.17-.01.328-.01v-.106q-.169-.011-.338-.032-.148-.021-.318-.053-.158-.042-.307-.106l-4.487-1.99-2.508 6.858h-1.64l.497-1.333z"
          strokeWidth=".265"
        />
      </g>
      <g className="vvg__code-block vvg__code-block--right">
        <path
          d="M84.356 99.059v-1.514l4.868-2.106v1.44l-2.92 1.185q-.16.063-.318.095-.17.032-.318.042-.169.022-.328.022v.105q.16.011.328.032.149.021.318.053.17.032.317.106l4.287 1.873 2.709-7.387h1.64l-.688 1.863 5.98 2.677v1.514l-4.868 2.106v-1.44l2.92-1.185q.16-.063.318-.095.17-.032.317-.053.17-.01.328-.01v-.106q-.169-.011-.338-.032-.148-.021-.318-.053-.158-.042-.307-.106l-4.487-1.99-2.508 6.858h-1.64l.497-1.333z"
          strokeWidth=".265"
        />
      </g>
      <g className="vvg__code-block vvg__code-block--right">
        <path
          d="M84.356 99.059v-1.514l4.868-2.106v1.44l-2.92 1.185q-.16.063-.318.095-.17.032-.318.042-.169.022-.328.022v.105q.16.011.328.032.149.021.318.053.17.032.317.106l4.287 1.873 2.709-7.387h1.64l-.688 1.863 5.98 2.677v1.514l-4.868 2.106v-1.44l2.92-1.185q.16-.063.318-.095.17-.032.317-.053.17-.01.328-.01v-.106q-.169-.011-.338-.032-.148-.021-.318-.053-.158-.042-.307-.106l-4.487-1.99-2.508 6.858h-1.64l.497-1.333z"
          strokeWidth=".265"
        />
      </g>
      <g className="vvg__code-block vvg__code-block--right">
        <path
          d="M84.356 99.059v-1.514l4.868-2.106v1.44l-2.92 1.185q-.16.063-.318.095-.17.032-.318.042-.169.022-.328.022v.105q.16.011.328.032.149.021.318.053.17.032.317.106l4.287 1.873 2.709-7.387h1.64l-.688 1.863 5.98 2.677v1.514l-4.868 2.106v-1.44l2.92-1.185q.16-.063.318-.095.17-.032.317-.053.17-.01.328-.01v-.106q-.169-.011-.338-.032-.148-.021-.318-.053-.158-.042-.307-.106l-4.487-1.99-2.508 6.858h-1.64l.497-1.333z"
          strokeWidth=".265"
        />
      </g>
      <g className="vvg__code-block vvg__code-block--right">
        <path
          d="M84.356 99.059v-1.514l4.868-2.106v1.44l-2.92 1.185q-.16.063-.318.095-.17.032-.318.042-.169.022-.328.022v.105q.16.011.328.032.149.021.318.053.17.032.317.106l4.287 1.873 2.709-7.387h1.64l-.688 1.863 5.98 2.677v1.514l-4.868 2.106v-1.44l2.92-1.185q.16-.063.318-.095.17-.032.317-.053.17-.01.328-.01v-.106q-.169-.011-.338-.032-.148-.021-.318-.053-.158-.042-.307-.106l-4.487-1.99-2.508 6.858h-1.64l.497-1.333z"
          strokeWidth=".265"
        />
      </g>
      <g className="vvg__code-block vvg__code-block--right">
        <path
          d="M84.356 99.059v-1.514l4.868-2.106v1.44l-2.92 1.185q-.16.063-.318.095-.17.032-.318.042-.169.022-.328.022v.105q.16.011.328.032.149.021.318.053.17.032.317.106l4.287 1.873 2.709-7.387h1.64l-.688 1.863 5.98 2.677v1.514l-4.868 2.106v-1.44l2.92-1.185q.16-.063.318-.095.17-.032.317-.053.17-.01.328-.01v-.106q-.169-.011-.338-.032-.148-.021-.318-.053-.158-.042-.307-.106l-4.487-1.99-2.508 6.858h-1.64l.497-1.333z"
          strokeWidth=".265"
        />
      </g>
    </svg>
  )
}

export default Vincent
