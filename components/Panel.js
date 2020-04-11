import { useState } from 'react'

export default function Panel({
  chosenFile,
  dirtyContent,
  revision,
  setRevision,
}) {
  const [saving, setSaving] = useState(false)

  const editFile = async (file) => {
    const r = await fetch('/api/edit-file', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(file),
    })
    // r //?
    setRevision(revision + 1)
    setTimeout(() => {
      setSaving(false)
    }, 500)
    console.log({ revision })
  }

  return (
    <div
      className={'panel-root'}
      style={{
        zIndex: 1000,
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
          style={{ width: '100px' }}
          disabled={saving}
          onClick={() => {
            setSaving(true)
            editFile({
              name: chosenFile.name,
              content: dirtyContent,
              isBody: true, // TODO: Since we have hardcoded to visual editor for now
            })
          }}
        >
          {saving ? 'Saving ...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
