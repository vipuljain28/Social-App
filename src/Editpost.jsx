import { createSignal,onMount, createEffect }
from 'solid-js'
import { supabase }
from './supabaseClient'
import {useParams} from 'solid-app-router'
import Avatar from './Avatar'
import Menu from './menu'
const Editpost = (props) => {
    const [loading, setLoading] = createSignal(true)
    const [title, setTitle] = createSignal(null)
    const [description, setDescription] = createSignal(null)
    const [postid, setPostid] = createSignal(null)
    const [avatar_url, setAvatarUrl] = createSignal(null)
    const [session, setSession] = createSignal(null)
    createEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            getPost();
        })
    })
//    createEffect(() => {
//        props.session
//        getProfile()
//    })

    const getPost = async () => {
        try {
            setLoading(true)
            const user = supabase.auth.user();

            console.log(user);
            let {data, error, status} = await supabase
                    .from('post')
                    .select(`title,description,media`)
                    .eq('id', postid())
                    .single();
            console.log("get data");
            if (!user) {

            }
            if (error && status !== 406) {
                throw error
                
            }

            if (data) {
                setTitle(data.title)
                setDescription(data.description)
               
                setAvatarUrl(data.media)
            }
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
            location.href="/";
        }
    }
onMount(() => {
     const params = useParams();
        setPostid(params.id);
        })
    const updatePost = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const user = supabase.auth.user()

            const updates = {
                
                title: title(),
                description: description(),
                media: avatar_url(),
                
            }

            let {error} = await supabase.from('post').update(updates, {
                returning: 'minimal', // Don't return the value after inserting
            }) .match({ id: postid() })

            if (error) {
                throw error
            }
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
            <>
<Menu />
<div className='container mx-auto p-6'>
    <main className='w-full md:w-3/4 lg:w-2/4 mx-auto py-6 my-6'>
        <div aria-live="polite">
            
    {loading() ? (
            'Saving ...'
            ) : (
            <form onSubmit={updatePost} className="form-widget">
             
                <div>
                    <label htmlFor="username">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title() || ''}
                        onChange={(e) => setTitle(e.target.value)}
                        />
                </div>
                <div>
                    <label htmlFor="username">Description</label>
                    <input
                        id="Description"
                        type="text"
                        value={description() || ''}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                </div>
               

                <Avatar
                    url={avatar_url}
                    size={150}
                    onUpload={(e, url) => {
    setAvatarUrl(url)
            updatePost(e)
    }}
                    />
                <div>
                    <button type="submit" className="button block primary" disabled={loading()}>
                        Update Post
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

export default Editpost
