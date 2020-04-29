//@ts-check
import React, { useState, useEffect } from 'react'
import Panel from '../components/Panel'
import Preview from '../components/Preview'
import Editor from '../components/Editor'
import Select from 'react-select'

export default function Index() {
  const [empty, setEmpty] = useState(false)
  const [files, setFiles] = useState([])
  const [revision, setRevision] = useState(0)

  // TODO: This hardcoded default bites
  const [selectedFileName, setSelectedFileName] = useState(null)
  const [chosenFile, setChosenFile] = useState(null)

  const [dirtyContent, setDirtyContent] = useState('')

  const [selectedEditor, setSelectedEditor] = useState('visual') // or code
  const [previewMode, setPreviewMode] = useState('emulated') // or live

  const fetchFiles = async () => {
    const r = await fetch('/api')
    const data = await r.json()
    setFiles(data.files)

    if (selectedFileName) {
      const chosenFile = data.files.find((f) => f.name === selectedFileName)
      if (chosenFile) {
        setSelectedFileName(chosenFile.name)
        setChosenFile(chosenFile)
      } else {
        console.log(
          `Error: unable to find the selected file ${selectedFileName}`,
        )
      }
      return
    }

    // TODO: Handle case when there are 0 html files
    const chosenFile = data.files[0]
    if (chosenFile) {
      setSelectedFileName(chosenFile.name)
      setChosenFile(chosenFile)
    } else {
      setEmpty(true)
      console.log(`Error: unable to find any HTML files in the given folder`)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [revision])

  useEffect(() => {
    if (chosenFile && chosenFile.content) {
      setDirtyContent(chosenFile.content)
    }
  }, [chosenFile])

  if (empty) {
    return <div>No HTML files found</div>
  }

  if (files.length === 0 || !Boolean(chosenFile)) {
    return <div>Loading...</div>
  }

  return (
    <div
      onClick={(e) => {
        //@ts-ignore
        if (e.target && e.target.tagName.toLowerCase() !== 'a') {
          return
        }

        //@ts-ignore
        let parentNode = e.target.parentNode
        let iter = 0
        while (parentNode.tagName.toLowerCase() !== 'body') {
          iter += 1
          parentNode = parentNode.parentNode
          if (parentNode.classList.contains('ck')) {
            return
          }
          if (iter >= 10) {
            console.log('circuit breaker: parent finding')
            break
          }
        }

        e.preventDefault()
        e.stopPropagation()

        //@ts-ignore
        const href = e.target.href
          .replace('http://localhost:1338/', '')
          .replace(/%20/g, ' ')
        console.log({ href })
        const isUrlAbsolute = (url) =>
          url.indexOf('//') === 0
            ? true
            : url.indexOf('://') === -1
            ? false
            : url.indexOf('.') === -1
            ? false
            : url.indexOf('/') === -1
            ? false
            : url.indexOf(':') > url.indexOf('/')
            ? false
            : url.indexOf('://') < url.indexOf('.')
            ? true
            : false

        const isRelativeUrl = !isUrlAbsolute(href)
        if (isRelativeUrl) {
          //@ts-ignore
          setSelectedFileName(href)
          //@ts-ignore
          const file = files.find((f) => f.name === href)
          setChosenFile(file)
        }
      }}
    >
      <Panel
        chosenFile={chosenFile}
        setChosenFile={setChosenFile}
        setSelectedFileName={setSelectedFileName}
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
          value={{
            value: selectedFileName,
            label: selectedFileName,
          }}
          onChange={(item) => {
            //@ts-ignore
            setSelectedFileName(item.value)
            //@ts-ignore
            const file = files.find((f) => f.name === item.value)
            setChosenFile(file)
          }}
        />
      )}

      <div className={'workspace-root'}>
        <div
          style={{
            width: '50%',
          }}
        >
          <Editor
            selectedEditor={selectedEditor}
            dirtyContent={dirtyContent}
            setDirtyContent={setDirtyContent}
          />
        </div>

        <div style={{ borderRight: '1px solid #ccc' }}></div>

        <div
          style={{
            width: '50%',
          }}
        >
          <Preview
            previewMode={previewMode}
            chosenFile={chosenFile}
            dirtyContent={dirtyContent}
          />
        </div>
      </div>
      <style jsx>{`
        .workspace-root {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          justify-content: space-between;
        }
      `}</style>
    </div>
  )
}
