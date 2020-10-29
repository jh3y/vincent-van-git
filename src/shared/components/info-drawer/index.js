import React, { Fragment } from 'react'
import Information from '../../assets/icons/information-outline.svg'

import Drawer from '../drawer'
const InfoDrawer = ({ footer: Footer }) => {
  return (
    <Drawer title="Instructions" icon={Information} left={false}>
      <Fragment>
        <section>
          <ul>
            <li>
              Set the Github username, repository, and branch in settings.
            </li>
            <li>Left pointer to draw, right pointer to erase.</li>
            <li>Ensure the repository is an empty repository.</li>
            <li>
              Don't run if you already have a drawing on your graph. This will
              trigger a huge amount of commits.
            </li>
          </ul>
        </section>
        {Footer && <Footer/>}
      </Fragment>
    </Drawer>
  )
}

export default InfoDrawer
// const SettingsDrawer = (props) => {
//   const { play: clickPlay } = useSound(
//     'https://assets.codepen.io/605876/click.mp3'
//   )
//   const drawerRef = useRef(null)
//   const [open, setOpen] = useState(false)

//   const toggleMenu = () => {
//     if (!props.muted) clickPlay()
//     setOpen(!open)
//   }

//   useEffect(() => {
//     document.documentElement.style.setProperty('--info', open ? 1 : 0)
//     const handleClick = ({ target }) => {
//       if (drawerRef.current !== target && !drawerRef.current.contains(target)) {
//         setOpen(false)
//       }
//     }
//     if (open) {
//       document.addEventListener('click', handleClick)
//     } else {
//       document.removeEventListener('click', handleClick)
//     }
//     return () => {
//       document.removeEventListener('click', handleClick)
//     }
//   }, [open])

//   return (
//     <div className="sliding-drawer sliding-drawer--info" ref={drawerRef}>
//       <button
//         title={`${open ? 'Close' : 'Open'} info`}
//         className="sliding-drawer__toggle sliding-drawer__toggle--info icon-button"
//         onClick={toggleMenu}>
//         <Information />
//       </button>
//       <article className="sliding-drawer__content">
//         <h2 className="sliding-drawer__title">Instructions</h2>
//         <section>
//           <ul>
//             <li>
//               Set the Github username, repository, and branch in settings.
//             </li>
//             <li>Left pointer to draw, right pointer to erase.</li>
//             <li>Ensure the repository is an empty repository.</li>
//             <li>
//               Don't run if you already have a drawing on your graph. This will
//               trigger a huge amount of commits.
//             </li>
//           </ul>
//         </section>
//         <footer>
//           <a
//             href="https://twitter.com/jh3yy"
//             onClick={(e) => {
//               e.preventDefault()
//               shell.openExternal('https://twitter.com/jh3yy')
//             }}
//             target="_blank"
//             rel="noopener noreferrer">
//             jh3y
//           </a>{' '}
//           &copy; 2020 MIT
//         </footer>
//       </article>
//     </div>
//   )
// }

// export default SettingsDrawer
