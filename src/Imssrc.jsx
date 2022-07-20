import { createEffect, createSignal } from 'solid-js'

import { supabase } from './supabaseClient'

export default (props) => {
  const [avatarUrl, setAvatarUrl] = createSignal(null)
  const [uploading, setUploading] = createSignal(false)

  createEffect(() => {
      console.log(props.url);
    if (props.url) downloadImage(props.url)
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

  

  return (
    <div style={{ width: props.width }} aria-live="polite">
      <img
        src={avatarUrl() ? avatarUrl() : `https://place-hold.it/150x150`}
        alt={avatarUrl() ? 'Avatar' : 'No image'}
        className={`avatar image `+ props.classname}
        style={{ "height": props.height, "width": props.width,"max-height":"300px",  "object-fit": "contain" }}
      />
      
    </div>
  )
}
