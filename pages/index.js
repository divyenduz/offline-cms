//@ts-check
import React, { useState, useEffect } from 'react'
import Panel from '../components/Panel'
import Preview from '../components/Preview'
import Editor from '../components/Editor'
import Select from 'react-select'

export default function Index() {
  const [files, setFiles] = useState([])
  const [revision, setRevision] = useState(0)

  // TODO: This hardcoded default bites
  const [selectedFileName, setSelectedFileName] = useState('index.html')
  const [chosenFile, setChosenFile] = useState(null)

  const [dirtyContent, setDirtyContent] = useState('')

  const [selectedEditor, setSelectedEditor] = useState('visual') // or code
  const [previewMode, setPreviewMode] = useState('emulated') // or live

  const fetchFiles = async () => {
    const r = await fetch('/api')
    const data = await r.json()
    setFiles(data.files)

    // TODO: Handle case when there are 0 html files
    const chosenFile = data.files[0]
    setSelectedFileName(chosenFile.name)
    setChosenFile(chosenFile)
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

      {Boolean(files) && Boolean(selectedFileName) && (
        <Select
          options={files.map((file) => {
            return {
              value: file.name,
              label: file.name,
            }
          })}
          defaultValue={{
            value: selectedFileName,
            label: selectedFileName,
          }}
          onChange={(item) => {
            //@ts-ignore
            console.log(`ZEBRA`, item.value)
            //@ts-ignore
            setSelectedFileName(item.value)
            //@ts-ignore
            const file = files.find((f) => f.name === item.value)
            setChosenFile(file)
          }}
        />
      )}

      <div className={'workspace-root'}>
        <Editor
          selectedEditor={selectedEditor}
          dirtyContent={dirtyContent}
          setDirtyContent={setDirtyContent}
        />

        <div style={{ borderRight: '1px solid #ccc' }}></div>

        <Preview previewMode={previewMode} dirtyContent={dirtyContent} />
      </div>
      <style jsx>{`
        .workspace-root {
          display: flex;
        }
      `}</style>
    </div>
  )
}
