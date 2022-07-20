import { createSignal, createEffect }
from 'solid-js'
import { supabase }
from './supabaseClient'

import Avatar from './Avatar'
import Menu from './menu'
const Account = (props) => {
    const [loading, setLoading] = createSignal(true)
    const [username, setUsername] = createSignal(null)
    const [firstname, setFirstname] = createSignal(null)
    const [lastname, setLastname] = createSignal(null)
    const [phonenumber, setPhonenumber] = createSignal(null)
    const [website, setWebsite] = createSignal(null)
    const [avatar_url, setAvatarUrl] = createSignal(null)
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
        try {
            setLoading(true)
            const user = supabase.auth.user();

            console.log(user);
            let {data, error, status} = await supabase
                    .from('profiles')
                    .select(`first_name,last_name,phone_number, avatar_url`)
                    .eq('id', user.id)
                    .single();
            console.log("get data");
            if (!user) {

            }
            if (error && status !== 406) {
                throw error
//                location.href="/";
            }

            if (data) {
                setFirstname(data.first_name)
                setLastname(data.last_name)
                setPhonenumber(data.phone_number)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const user = supabase.auth.user()

            const updates = {
                id: user.id,
                username: username(),
                first_name: firstname(),
                last_name: lastname(),
                phone_number: phonenumber(),
                website: website(),
                avatar_url: avatar_url(),
                updated_at: new Date(),
            }

            let {error} = await supabase.from('profiles').upsert(updates, {
                returning: 'minimal', // Don't return the value after inserting
            })

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
            <form onSubmit={updateProfile} className="form-widget">
                <div>Email: {session().user.email}</div>
                <div>
                    <label htmlFor="username">First Name</label>
                    <input
                        id="firstname"
                        type="text"
                        value={firstname() || ''}
                        onChange={(e) => setFirstname(e.target.value)}
                        />
                </div>
                <div>
                    <label htmlFor="username">last Name</label>
                    <input
                        id="lastname"
                        type="text"
                        value={lastname() || ''}
                        onChange={(e) => setLastname(e.target.value)}
                        />
                </div>
                <div>
                    <label htmlFor="username">Phone Number</label>
                    <input
                        id="lastname"
                        type="text"
                        value={phonenumber() || ''}
                        onChange={(e) => setPhonenumber(e.target.value)}
                        />
                </div>

                <Avatar
                    url={avatar_url}
                    size={150}
                    onUpload={(e, url) => {
    setAvatarUrl(url)
            updateProfile(e)
    }}
                    />
                <div>
                    <button type="submit" className="button block primary" disabled={loading()}>
                        Update profile
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

export default Account
