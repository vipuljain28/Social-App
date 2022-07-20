import { createSignal, createEffect ,onMount}
from 'solid-js'
import { supabase }
from './supabaseClient'
import Menu from './menu'
import Avatar from './Avatar'
const Addpost = (props) => {
    const [loading, setLoading] = createSignal(false)
    const [title, setTitle] = createSignal(null)
    const [description, setDescription] = createSignal(null)
    const [media, setMedia] = createSignal(null)
    const [userid, setUserid] = createSignal(null)

    const [session, setSession] = createSignal(null)
    createEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            getProfile();
        })
    })
//    createEffect(() => {
//        props.session
//        getProfile()
//    })

    const getProfile = async () => {
//        const user = supabase.auth.user();
//        setUserid(user.id);
//        console.log(user);
    }

    const savePost = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
           

            const updates = {

                title: title(),
                description: description(),
                media: media(),
                userid: userid()

            }

            let {error} = await supabase.from('post').insert(updates)

            if (error) {
                throw error
            }
            
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
            location.href="/"
        }
    }
 onMount(() => {
            const user = supabase.auth.user();
                        setUserid(user.id);
                    });
    return (
            <>
<Menu />
<div className='container mx-auto p-6'>

    <main className='w-full md:w-3/4 lg:w-2/4 mx-auto py-6 my-6'>
        <div aria-live="polite">



            
    {loading() ? (
            'Saving ...'
            ) : (
            <form onSubmit={savePost} className="form-widget">

                <div>
                    <label htmlFor="Title">Title</label>
                    <input
                        id="firstname"
                        type="text"
                        value={title() || ''}
                        onChange={(e) => setTitle(e.target.value)}
                        />
                </div>
                <div>
                    <label htmlFor="username">Description</label>
                    <input
                        id="description"
                        type="text"
                        value={description() || ''}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                </div>


                <Avatar
                    url={media}
                    size={150}
                    onUpload={(e, url) => {
    setMedia(url)

    }}
                    />
                <div>
                    <button type="submit" className="btn btn-success btn-lg" disabled={loading()}>
                        Save Post
                    </button>
                </div>
            </form>
            )}
    




        </div>
    </main>
</div>
</ >
    )
}

export default Addpost
