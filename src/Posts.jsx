import {createResource, For, ErrorBoundary, onMount, createEffect, createSignal, onCleanup }
from 'solid-js'
import { RealtimeSubscription }
from '@supabase/supabase-js'
import { createStore, produce }
from 'solid-js/store'
import { supabase }
from './supabaseClient'


import Imssrc from './Imssrc'
import Menu from './menu'
        const [loading, setLoading] = createSignal(true)

        const deletePost = async (id) => {
console.log(id);
        const user = supabase.auth.user();
        const {data, error} = await supabase.from('post').delete().match({'id': id});
        if (error) {
console.error(error)
        }

}
const Posts = () => {

const [posts, setPosts] = createStore([])


        let subscription = RealtimeSubscription | null
        const [userid, setUserid] = createSignal(null)

        const [session, setSession] = createSignal(null)


        const getPosts = async () => {
try {
setLoading(true);
        const user = supabase.auth.user();
        console.log(user);
        let {data, error, status} = await supabase
        .from('post')
        .select('*,profiles!inner(first_name,last_name)')
        console.log(data);
        if (!user) {

}
if (error && status !== 406) {
throw error
}
return data
} catch (error) {
alert(error.message)
} finally {
setLoading(false)
}



}
const [data, {mutate, refetch}] = createResource(getPosts);
        createEffect(() => {
        setSession(supabase.auth.session())

                supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                        getPosts();
                })
        })
        createEffect(() => {
        const returnedValue = data()
                if (returnedValue) {
        setPosts(returnedValue)
        }
        })
        onMount(() => {
        const user = supabase.auth.user();
                setUserid(user.id);
                subscription = supabase
                .from('post')
                .on('*', (payload) => {
                switch (payload.eventType) {
                case 'INSERT':
                        setPosts((prev) => [...prev, payload.new])
                        break
                        case 'UPDATE':
                        setPosts((item) => item.id === payload.new.id, payload.new)
                        break
                        case 'DELETE':
                        setPosts((prev) => prev.filter((item) => item.id != payload.old.id))
                        break
                }
                })
                .subscribe()
        })
        onCleanup(() => {
        subscription?.unsubscribe()
        }
        )
        function dateFormat(inputDate, format) {
        //parse the input date
        const date = new Date(inputDate);
                //extract the parts of the date
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                //replace the month
                format = format.replace("MM", month.toString().padStart(2, "0"));
                //replace the year
                if (format.indexOf("yyyy") > - 1) {
        format = format.replace("yyyy", year.toString());
        } else if (format.indexOf("yy") > - 1) {
        format = format.replace("yy", year.toString().substr(2, 2));
        }

        //replace the day
        format = format.replace("dd", day.toString().padStart(2, "0"));
                return format;
        }






return (
        <>
<Menu supabase="{supabase}" />
<div className='container mx-auto p-5'>
    <main className='w-full md:w-3/4 lg:w-2/4 mx-auto py-6 my-6 mt-5 mb-5'>



        {loading() ? (
        'Loading ...'
        ) : (
        <ErrorBoundary
            fallback={
        <div class="text-white bg-red-500">
            Something went terribly wrong <br/>
            </div>
            }
            >
            <For each={posts}>
                {(item) =>
        <div class="card mb-2 mt-2 w-50 m-auto " style={{"--custom-spacing":"0px"}}>

                    <Imssrc url={item.media} classname="card-img-top" width='100%' height='auto'/>
                    <div className="card-body text-black">
                        <h5 className="card-title text-black">{item.title}</h5>
                        <p className="card-subtitle text-black">{item.description}</p>
                        <p className="text-right text-small initialism text-muted">{dateFormat(item.created_at, "dd/MM/yyyy")}</p>
                    </div>

                    {(item.userid != userid()) ? (
        <></>
                    ) : (
                    <div class="card-footer d-flex align-content-between flex-row justify-content-evenly">
                        <a type="button" class=" btn btn-warning " href={`/edit-post/`+ item.id}> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg></a>
                        <button type="button" class="btn btn-danger " onClick={(e) => deletePost(item.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                            </svg>
                        </button>
                    </div>
                    )}
                </div>}
            </For>
        </ErrorBoundary>
        )}



    </main>
</div>
        </>
        )
}




export default Posts;
