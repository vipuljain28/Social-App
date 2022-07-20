import './index.css'
import { createSignal, createEffect, lazy } from 'solid-js'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Account from './Account'
import Posts from './Posts'
import Signout from './Signout'

import Addpost from './Addpost'
import Editpost from './Editpost'
import { Router, useRoutes, Link } from "solid-app-router";
const login = [
    {
        path: "/",
        component: Auth,

    }


];
const afterlogin = [
    {
        path: "/profile",
        component: Account,

    },
    {
        path: "/",
        component: Posts,

    },
     {
        path: "/add-post",
        component: Addpost,

    },
    {
        path: "/edit-post/:id",
        component: Editpost,

    },
    {
        path: "/sign-out",
        component: Signout,

    },
     
];
export default () => {
    const [session, setSession] = createSignal(null)
    const Logged = useRoutes(afterlogin);
    const Beforelogg = useRoutes(login);
    createEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    })



    return (
            <div class="bg-white text-black mt-60" style={{ "--custom-theme": "light","--custom-color": "black"}}>
                {!session() ? <Beforelogg /> : <Logged key={session().user.id} session={session()} />}
            </div>

            )
}