import getData from '../utils/getData';

const Home = async () => {
  const data = await getData();  
  console.log(data);             

  const launches = data || [];

  const view = `
    <div class="Launches">
      ${
        launches.slice(0, 20).map(launch => `
          <article class="launch-card">
            <a href="#/${launch.id}">
              <img src="${launch.links.patch.small || 'assets/placeholder.png'}" alt="${launch.name}">
              <h2>${launch.name}</h2>
            </a>
          </article>
        `).join('')
      }
    </div>
  `;
  return view;
};

export default Home;
