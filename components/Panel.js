import { useState } from 'react'

export default function Panel({
  chosenFile,
  setChosenFile,
  setSelectedFileName,
  dirtyContent,
  revision,
  setRevision,
}) {
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const editFile = async (file) => {
    setSaving(true)
    const r = await fetch('/api/edit-file', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(file),
    })
    setRevision(revision + 1)
    setTimeout(() => {
      setSaving(false)
    }, 500)
    console.log({ r, revision })
  }

  /*
   * Delete is done via POST because file doesn't have an ID and its identifier is
   * its name and it might need special URL handling. POST is easier.
   */
  const deleteFile = async (file) => {
    const c = confirm('Are you sure that you want to delete this file?')
    if (!c) return
    setDeleting(true)
    const r = await fetch(`/api/delete-file`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(file),
    })
    setChosenFile(null)
    setSelectedFileName(null)
    setRevision(revision + 1)
    setTimeout(() => {
      setDeleting(false)
    }, 500)
    console.log({ r, revision })
  }

  return (
    <div className={'panel-root'}>
      <div className={'panel-body'}>
        <button
          className={'btn green'}
          disabled={saving || deleting}
          onClick={() => {
            editFile({
              name: chosenFile.name,
              content: dirtyContent,
            })
          }}
        >
          {saving ? 'Saving ...' : 'Save'}
        </button>
        <div style={{ width: 20 }}></div>
        <button
          className={'btn red'}
          disabled={saving || deleting}
          onClick={() => {
            deleteFile({ name: chosenFile.name })
          }}
        >
          {deleting ? 'Deleting ...' : 'Delete'}
        </button>
      </div>
      <style jsx>{`
        .panel-root {
          z-index: 1000;
          width: 100%;
          height: 50px;
          position: fixed;
          left: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .panel-body {
          width: 300px;
          height: 50px;
          padding-top: 5px;
          padding-bottom: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #012544;
        }

        .btn {
          width: 120px;
          height: 30px;
          background-color: black;
          border-radius: 4px;
          border: 1px solid black;
          display: inline-block;
          cursor: pointer;
          color: #ffffff;
          font-family: Arial;
          font-size: 15px;
          padding: 6px 15px;
          text-decoration: none;
          text-shadow: 0px 1px 0px #b23e35;
        }
        .btn:hover {
          background-color: black;
        }
        .btn:active {
          position: relative;
          top: 1px;
        }

        .btn.red {
          background-color: #e4685d;
        }

        .btn.red:hover {
          background-color: #eb675e;
        }

        .btn.green {
          background-color: #44c767;
        }

        .btn.green:hover {
          background-color: #5cbf2a;
        }
      `}</style>
    </div>
  )
}
