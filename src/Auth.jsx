import { createSignal } from 'solid-js'
import { supabase } from './supabaseClient'

export default function Auth() {
    const [loading, setLoading] = createSignal(false)
    const [signin, setSignin] = createSignal(true)
    const [email, setEmail] = createSignal('')
    const [password, setPassword] = createSignal('')
    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            let error, user, session = "";
            if (signin()) {
                let {error, session, user} = await supabase.auth.signIn({ email: email(), password: password(),options: {
                        redirectTo: '/Profile',
                    }
                });
               
            } else {
                let {error, session, user} = await supabase.auth.signUp({create_user: true, email: email(), password: password()})
            }
            if (user) {
                 alert('Success');
                setSession(supabase.auth.session())
            }
            if (error)
                throw error
           
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }
    const handleCli = () => {



        setSignin(!signin())


    }

    return (
            <div className="row flex flex-center">
                <div className="col-6 form-widget" aria-live="polite">
                    <h1 className="header"> 
            
                        {signin() ? (
                                    'Login'
                                    ) : (
                                    'Signup'
                                    )}
                    </h1>
                    <p className="description"></p>
                    {loading() ? (
                                'Processing...'
                                ) : (
                            <form onSubmit={handleLogin}>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    className="inputField"
                                    type="email"
                                    placeholder="Your email"
                                    value={email()}
                                    onChange={(e) => setEmail(e.target.value)}
                                    />
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    className="inputField"
                                    type="password"
                                    placeholder="Your password"
                                    value={password()}
                                    onChange={(e) => setPassword(e.target.value)}
                                    />
                                <button type="submit" className="button block" aria-live="polite">
                                    {signin() ? (
                                                        'Login'
                                                        ) : (
                                                        'Signup'
                                                        )}
                                </button>
                    
                                <p onClick={handleCli}>Dont have Account  
                                    {signin() ? (
                                                        'Login'
                                                        ) : (
                                                        'Signup'
                                                        )}
                                    ?</p>
                            </form>
                                )}
                </div>
            </div>
            )
}
