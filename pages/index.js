//@ts-check

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
const MonacoEditor = dynamic(import('react-monaco-editor'), { ssr: false })

import { Editor } from '@tinymce/tinymce-react'

const Panel = ({ chosenFile, dirtyContent, revision, setRevision }) => {
  const editFile = async (file) => {
    const r = await fetch('/api/edit-file', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(file),
    })
    r //?
    setRevision(revision + 1)
    console.log({ revision })
  }

  return (
    <div
      className={'panel-root'}
      style={{
        width: '100%',
        height: 50,
        position: 'fixed',
        left: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className={'panel-body'}
        style={{
          width: 150,
          paddingTop: 5,
          paddingBottom: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#012544',
        }}
      >
        <button
          onClick={() => {
            console.log({ chosenFile, dirtyContent })
            editFile({
              name: chosenFile.name,
              content: dirtyContent,
              isBody: true, // TODO: Since we have hardcoded to visual editor for now
            })
          }}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default function Index() {
  const [files, setFiles] = useState([])
  const [revision, setRevision] = useState(0)

  // TODO: This hardcoded default bites
  const [selectedFileName, setSelectedFileName] = useState('index.html')
  const [chosenFile, setChosenFile] = useState(null)

  // TODO: Better name, this is just a place holder for unsaved content
  const [dirtyContent, setDirtyContent] = useState('')

  const [selectedEditor, setSelectedEditor] = useState('visual') // or code
  const [previewMode, setPreviewMode] = useState('emulated') // or live

  const fetchFiles = async () => {
    const r = await fetch('/api')
    const data = await r.json()
    setFiles(data.files)

    const chooseFile = data.files.find((file) => file.name === selectedFileName)
    setChosenFile(chooseFile)
  }

  useEffect(() => {
    fetchFiles()
  }, [revision])

  useEffect(() => {
    setDirtyContent(chosenFile?.content)
  }, [chosenFile])

  if (files.length === 0 || !Boolean(chosenFile)) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Panel
        chosenFile={chosenFile}
        dirtyContent={dirtyContent}
        // TODO: Do we even need revision?
        revision={revision}
        setRevision={setRevision}
      />
      <p>Revision: {revision}</p>

      {/* <button
        onClick={() => {
          setSelectedEditor(selectedEditor === 'visual' ? 'code' : 'visual')
        }}
      >
        Editor: {selectedEditor}
      </button> */}

      {/* <button
        onClick={() => {
          setPreviewMode(previewMode === 'emulated' ? 'live' : 'emulated')
        }}
      >
        Preview Mode: {previewMode}
      </button> */}

      {selectedEditor === 'visual' && (
        <Editor
          init={{
            height: 500,
          }}
          value={dirtyContent}
          onEditorChange={(content, editor) => {
            // chosenFile.content = content
            // setFiles([chosenFile])

            setDirtyContent(content)

            // editFile({
            //   name: chosenFile.name,
            //   content,
            //   isBody: true,
            // })
          }}
          initialValue={chosenFile.content}
        ></Editor>
      )}
      <hr />
      {selectedEditor === 'code' && (
        <MonacoEditor
          width={'100%'}
          height={'50vh'}
          language={'html'}
          theme="vs-dark"
          value={dirtyContent}
          onChange={(content) => {
            // chosenFile.content = content
            // setFiles([chosenFile])
            // editFile({
            //   name: chosenFile.name,
            //   content,
            // })
          }}
          editorDidMount={() => {
            //@ts-ignore
            window.MonacoEnvironment.getWorkerUrl = (moduleId, label) => {
              if (label === 'json') return '_next/static/json.worker.js'
              if (label === 'css') return '_next/static/css.worker.js'
              if (label === 'html') return '_next/static/html.worker.js'
              if (label === 'typescript' || label === 'javascript')
                return '_next/static/ts.worker.js'
              return '_next/static/editor.worker.js'
            }
          }}
        />
      )}
      <div>
        Demo:
        {previewMode === 'emulated' && (
          <div dangerouslySetInnerHTML={{ __html: dirtyContent }}></div>
        )}
        {previewMode === 'live' && (
          <iframe
            key={revision}
            src="http://localhost:5000"
            width="100%"
            height="500px"
          ></iframe>
        )}
      </div>
    </div>
  )
}
