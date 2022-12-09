import { Link } from 'react-router-dom'

const Public= ()=> {

    const content= (
        <section className= 'public'>
            <header>
                <h1>Welcome to <span className= 'nowrap'>TechNotes</span>! </h1>
            </header>
            
            <main className= 'public__main'>
                <p>
                    Located in the beautiful town of Kaffrine, TechNotes provides
                    qualified staff ready to meet your tech repairs!
                </p>

                <address className= 'public__addr'>
                    TechNotes <br />
                    721, Ndjigui, Kaffrine <br />
                    Kaffrine, Senegal <br />
                    <a href="tel:+221781246793">78 124 67 93</a>
                </address>
                <br />
                
                <p>Owner: Serigne Saliou WADE</p>                
            </main>

            <footer>
                <Link to= {'/login'}>Employee login</Link>
            </footer>
        </section>
    )

    return content
}

export default Public