// import css from 'styled-jsx/css'

export default function Preview({ previewMode, chosenFile, dirtyContent }) {
  if (previewMode === 'emulated') {
    return (
      <>
        <div
          className={'preview-container'}
          dangerouslySetInnerHTML={{ __html: dirtyContent }}
        ></div>
        <style dangerouslySetInnerHTML={{ __html: chosenFile.styles }}></style>
        <style jsx>{`
          .preview-container {
            padding-left: 20px;
            padding-right: 20px;
          }
        `}</style>
      </>
    )
  } else if (previewMode === 'live') {
    // TODO: Maybe implement direct iframe view?
    return null
  }
  return null
}
