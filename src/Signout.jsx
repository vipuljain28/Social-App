import { createSignal, createEffect }
from 'solid-js'
import { supabase }
from './supabaseClient'


const Signout = (props) => {

const [session, setSession] = createSignal(null)
        createEffect(() => {
        setSession(supabase.auth.session())

                supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                       
                })
                supabase.auth.signOut()
                location.href="/"
        })
//    createEffect(() => {
//        props.session
//        getProfile()
//    })


        return (
                <>


</>
                )
        }

export default Signout
