
const Layout = ({ children, showSignOut }) => {
    
    return (
            <div className='container mx-auto p-6'>
                <header className='flex justify-between items-center'>
                    <h1 className='text-2xl font-light'>
                        Supabase+Solid Social 
                    </h1>
            
                    {showSignOut && (
                                    <Form action='/sign-out' method='post'>
                            <a href="/" className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 mx-4 rounded focus:outline-none focus:shadow-outline mt-3'>Home</a>
                                        <button
                                            type='submit'
                                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3'
                                            aria-live='polite'
                                            disabled={transition.state !== 'idle'}
                                            >
                                           Sign Up
                                        </button>
                                        <a href="/add-post" className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-4 rounded focus:outline-none focus:shadow-outline mt-3'>Add Post</a>

                                    </Form>

                                        )}
                </header>
                <main className='w-full md:w-3/4 lg:w-2/4 mx-auto py-6 my-6'>{children}</main>
            </div>
            );
};

export default Layout;

