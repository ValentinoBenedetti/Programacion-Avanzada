

const API_KEY = 'H34PGip1gUHR5Uzn7j9B5hUP30a4qELj'

const peticion = fetch(`https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}`)

peticion.then(resp => resp.json() )
       .then(({ data }) => {
         const { url } = data.images.original;

         const img = document.createElement('img');
         img.src = url
         document.body.append(img)
         
           console.log(url);
       })
         .catch(console.warn)

    // esto se conoce como promesas en cadena