// TODO: Explore other editors https://github.com/JefMari/awesome-wysiwyg#for-react
// TODO: Fix missing content issue https://ckeditor.com/docs/ckeditor5/latest/builds/guides/faq.html
import React, { useState, useEffect, useRef } from 'react'

export default function Editor({
  selectedEditor,
  dirtyContent,
  setDirtyContent,
}) {
  const editorRef = useRef()
  const [editorLoaded, setEditorLoaded] = useState(false)

  //@ts-ignore
  const { CKEditor, ClassicEditor } = editorRef.current || {}

  // TODO: Replace this useEffect with a custom hook https://gist.github.com/arcdev1/aba0fcea9f618de42ca399e3266f42aa
  useEffect(() => {
    //@ts-ignore
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react'),
      // ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
      // ClassicEditor: require('@ckeditor/ckeditor5-build-inline'),
      // ClassicEditor: require('@ckeditor/ckeditor5-build-balloon'),
      ClassicEditor: require('@ckeditor/ckeditor5-build-balloon-block'),
      // ClassicEditor: require('@ckeditor/ckeditor5-build-decoupled-document'),
    }
    setEditorLoaded(true)
  }, [])

  if (!editorLoaded) {
    return <p>Loading editor...</p>
  }

  if (selectedEditor === 'visual') {
    return (
      <div width="100%" height="100vh">
        <CKEditor
          editor={ClassicEditor}
          data={dirtyContent}
          config={{
            heading: {
              options: [
                ...[1, 2, 3, 4, 5, 6].map((n) => {
                  return {
                    model: `heading${n}`,
                    view: `h${n}`,
                    title: `Heading ${n}`,
                    class: `ck-heading_heading${n}`,
                  }
                }),
              ],
            },
          }}
          onChange={(event, editor) => {
            const data = editor.getData()
            setDirtyContent(data)
          }}
        />
      </div>
    )
  } else if (selectedEditor === 'code') {
    // Maybe implement code editor?
    return null
  }

  return null
}
