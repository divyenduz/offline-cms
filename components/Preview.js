export default function Preview({ previewMode, dirtyContent }) {
  if (previewMode === 'emulated') {
    return (
      <>
        <div
          className={'preview-container'}
          dangerouslySetInnerHTML={{ __html: dirtyContent }}
        ></div>
        <style jsx>
          {`
            .preview-container {
              width: 100%;

              /* body */
              padding-left: 50px;
              padding-right: 50px;
              margin: 0;
              /* html */
              cursor: default;
              font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu,
                Cantarell, Noto Sans, sans-serif, Apple Color Emoji,
                Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
              line-height: 1.15;
              -moz-tab-size: 4;
              -o-tab-size: 4;
              tab-size: 4;
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
              word-break: break-word;
            }
          `}
        </style>
      </>
    )
  } else if (previewMode === 'live') {
    // TODO: Maybe implement direct iframe view?
    return null
  }
  return null
}
