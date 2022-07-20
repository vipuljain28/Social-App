import { createEffect, createSignal } from 'solid-js'

import { supabase } from './supabaseClient'

export default (props) => {
  const [avatarUrl, setAvatarUrl] = createSignal(null)
  const [uploading, setUploading] = createSignal(false)

  createEffect(() => {
    if (props.url()) downloadImage(props.url())
  })

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      props.onUpload(event, filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ width: props.size }} aria-live="polite">
      <img
        src={avatarUrl() ? avatarUrl() : `https://place-hold.it/${props.size}x${props.size}`}
        alt={avatarUrl() ? 'Avatar' : 'No image'}
        className="avatar image "
        style={{ "margin-right":"30px","height": props.size, "width": props.size, "max-height": '150px',"max-width": '150px' }}
      />
      {uploading() ? (
        'Uploading...'
      ) : (
        <>
          <label className="btn btn-primary btn-sm" htmlFor="single">
            Upload an avatar
          </label>
          <span style="display:none">
            <input
              type="file"
              id="single"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading()}
            />
          </span>
        </>
      )}
    </div>
  )
}
