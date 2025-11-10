

const API = 'https://api.spacexdata.com/v5/launches';

const getData = async () => {
  try {
    const response = await fetch(API);
    const data = await response.json();
    return data; // devuelve array con todos los lanzamientos
  } catch (error) {
    console.log('Fetch Error', error);
  }
};


export default getData;